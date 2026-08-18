/**
 * Unggah file video ke Cloudinary.
 *
 * Video TIDAK disimpan sebagai base64 seperti foto (lihat imageUpload.ts), karena:
 * - Firestore membatasi satu dokumen maksimal ~1MB — video beberapa detik saja
 *   sudah pasti melebihi itu.
 * - localStorage juga hanya punya kuota sekitar 5-10MB per browser.
 * Jadi video diunggah ke Cloudinary (layanan penyimpanan media), dan yang disimpan
 * di database hanya berupa URL link ke video tersebut (string kecil, aman untuk
 * Firestore/localStorage).
 *
 * Sebelumnya pakai Firebase Storage, tapi itu butuh upgrade project ke plan Blaze
 * (perlu kartu kredit). Cloudinary dipakai sebagai gantinya karena free tier-nya
 * tidak perlu kartu kredit sama sekali. Lihat src/lib/cloudinary.ts untuk cara setup.
 */

import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../lib/cloudinary';

export interface UploadVideoOptions {
  /** Ukuran maksimal file, dalam MB. Default 40MB. */
  maxSizeMB?: number;
  /** Folder tujuan di Cloudinary, mis. "hero-videos". Diabaikan kalau upload preset sudah punya folder sendiri. */
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

  if (CLOUDINARY_CLOUD_NAME === 'ISI_CLOUD_NAME_ANDA' || CLOUDINARY_UPLOAD_PRESET === 'ISI_UPLOAD_PRESET_ANDA') {
    throw new Error(
      'Cloudinary belum dikonfigurasi. Isi CLOUDINARY_CLOUD_NAME dan CLOUDINARY_UPLOAD_PRESET di src/lib/cloudinary.ts terlebih dahulu.'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  if (folder) formData.append('folder', folder);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`);

    xhr.upload.onprogress = (event) => {
      if (onProgress && event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      try {
        const response = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && response.secure_url) {
          resolve(response.secure_url as string);
        } else {
          const cloudinaryMessage = response?.error?.message || '';
          let message = 'Gagal mengunggah video. Coba lagi beberapa saat.';
          if (cloudinaryMessage.toLowerCase().includes('preset')) {
            message = 'Gagal mengunggah video: upload preset Cloudinary belum diatur ke "Unsigned". Cek pengaturan di dashboard Cloudinary.';
          } else if (cloudinaryMessage.toLowerCase().includes('file size') || cloudinaryMessage.toLowerCase().includes('too large')) {
            message = 'Gagal mengunggah video: ukuran file melebihi batas yang diizinkan akun Cloudinary Anda.';
          } else if (cloudinaryMessage) {
            message = `Gagal mengunggah video: ${cloudinaryMessage}`;
          }
          reject(new Error(message));
        }
      } catch {
        reject(new Error('Video mungkin berhasil diunggah tapi responsnya tidak bisa dibaca. Coba lagi.'));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Gagal mengunggah video: koneksi bermasalah. Periksa internet Anda dan coba lagi.'));
    };

    xhr.send(formData);
  });
}

/**
 * Hapus video lama dari Cloudinary saat diganti/dihapus.
 *
 * CATATAN: Cloudinary tidak mengizinkan penghapusan file lewat unsigned upload
 * (butuh API secret yang tidak aman disimpan di kode frontend). Jadi fungsi ini
 * sengaja tidak melakukan apa-apa selain mencatat peringatan — file lama akan
 * tetap tersimpan di akun Cloudinary Anda (tidak masalah untuk kuota gratis
 * skala kios kecil, tapi kalau ingin membersihkan otomatis, ini perlu endpoint
 * server kecil yang menyimpan API secret dengan aman).
 */
export async function deleteVideoByUrl(url: string): Promise<void> {
  if (!url || !url.includes('cloudinary')) return;
  console.warn('Video lama di Cloudinary tidak dihapus otomatis (perlu server terpisah untuk itu). Anda bisa menghapusnya manual lewat dashboard Cloudinary jika perlu.');
}
