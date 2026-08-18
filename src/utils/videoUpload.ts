/**
 * Unggah file video ke Firebase Storage.
 *
 * Video TIDAK disimpan sebagai base64 seperti foto (lihat imageUpload.ts), karena:
 * - Firestore membatasi satu dokumen maksimal ~1MB — video beberapa detik saja
 *   sudah pasti melebihi itu.
 * - localStorage juga hanya punya kuota sekitar 5-10MB per browser.
 * Jadi video diunggah ke Firebase Storage, dan yang disimpan di database hanya
 * berupa URL link ke video tersebut (string kecil, aman untuk Firestore/localStorage).
 */

import { getDownloadURL, ref, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { storage } from '../lib/firebase';

export interface UploadVideoOptions {
  /** Ukuran maksimal file, dalam MB. Default 40MB. */
  maxSizeMB?: number;
  /** Folder tujuan di Storage, mis. "hero-videos". */
  folder?: string;
  /** Dipanggil berkala dengan progres unggahan (0-100). */
  onProgress?: (percent: number) => void;
}

export async function uploadVideoFile(file: File, options: UploadVideoOptions = {}): Promise<string> {
  const { maxSizeMB = 40, folder = 'hero-videos', onProgress } = options;

  if (!file.type.startsWith('video/')) {
    throw new Error('File yang dipilih bukan video. Pilih file MP4, WEBM, atau MOV.');
  }

  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(
      `Ukuran video terlalu besar (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maksimal ${maxSizeMB}MB — kompres videonya dulu atau gunakan video yang lebih pendek.`
    );
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  const path = `${folder}/${Date.now()}_${safeName}`;
  const storageRef = ref(storage, path);

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file, { contentType: file.type });

    task.on(
      'state_changed',
      (snapshot) => {
        if (onProgress) {
          const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          onProgress(percent);
        }
      },
      (err: any) => {
        const code = String(err?.code || '');
        let message = 'Gagal mengunggah video. Coba lagi beberapa saat.';
        if (code.includes('unauthorized') || code.includes('permission')) {
          message = 'Gagal mengunggah video: izin ditolak. Pastikan Anda sudah login sebagai admin dan Storage Rules sudah dikonfigurasi.';
        } else if (code.includes('canceled')) {
          message = 'Unggah video dibatalkan.';
        } else if (code.includes('quota-exceeded')) {
          message = 'Gagal mengunggah video: kuota penyimpanan cloud sudah penuh.';
        }
        reject(new Error(message));
      },
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        } catch (err) {
          reject(new Error('Video berhasil diunggah tapi gagal mengambil link-nya. Coba lagi.'));
        }
      }
    );
  });
}

/** Hapus video lama dari Storage saat diganti/dihapus, supaya tidak menumpuk file tak terpakai. */
export async function deleteVideoByUrl(url: string): Promise<void> {
  try {
    if (!url || !url.includes('firebasestorage')) return;
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch (err) {
    // Bukan masalah besar kalau gagal hapus — file lama, biarkan saja.
    console.warn('Gagal menghapus video lama dari Storage:', err);
  }
}
