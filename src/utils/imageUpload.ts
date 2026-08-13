/**
 * Mengompres & mengecilkan foto sebelum disimpan sebagai base64 di Firestore.
 *
 * Kenapa perlu ini: beberapa foto (logo, banner, galeri, foto santri/kegiatan)
 * disimpan bersama data lain di DALAM SATU dokumen Firestore, dan Firestore
 * membatasi ukuran satu dokumen maksimal ~1MB. Foto asli dari HP/kamera
 * biasanya 2-10MB, jadi harus dikecilkan dulu (resize + kompresi JPEG)
 * supaya muat dan tidak bikin gagal simpan ke database.
 */

export interface CompressOptions {
  /** Sisi terpanjang gambar hasil akhir, dalam pixel. */
  maxDimension: number;
  /** Target ukuran maksimal hasil akhir (base64), dalam KB. */
  maxSizeKB: number;
}

const readFileAsDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Gagal membaca file.'));
    reader.readAsDataURL(file);
  });

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Gagal memuat gambar. Pastikan file adalah gambar yang valid.'));
    img.src = src;
  });

/**
 * Menerima File gambar, mengembalikan string base64 (data URL) yang sudah
 * di-resize & dikompresi supaya muat di bawah target ukuran.
 */
export async function compressImageFile(file: File, options: CompressOptions): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('File yang dipilih bukan gambar. Pilih file JPG, PNG, atau WEBP.');
  }

  const originalDataUrl = await readFileAsDataURL(file);
  const img = await loadImage(originalDataUrl);

  const scale = Math.min(1, options.maxDimension / Math.max(img.width, img.height));
  const targetWidth = Math.max(1, Math.round(img.width * scale));
  const targetHeight = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Browser tidak mendukung pemrosesan gambar.');
  }
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const targetBytes = options.maxSizeKB * 1024;
  let quality = 0.82;
  let result = canvas.toDataURL('image/jpeg', quality);

  // Turunkan kualitas bertahap sampai muat di target ukuran, atau mentok di batas bawah.
  while (result.length > targetBytes && quality > 0.35) {
    quality -= 0.1;
    result = canvas.toDataURL('image/jpeg', quality);
  }

  if (result.length > targetBytes) {
    throw new Error(
      `Foto masih terlalu besar setelah dikompresi maksimal (~${Math.round(result.length / 1024)}KB). Coba pakai foto lain yang lebih sederhana/kecil.`
    );
  }

  return result;
}
