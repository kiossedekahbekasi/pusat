/**
 * Konfigurasi Cloudinary untuk upload video (menggantikan Firebase Storage).
 *
 * CARA MENGISI NILAI DI BAWAH INI:
 * 1. Daftar gratis di https://cloudinary.com (tidak perlu kartu kredit).
 * 2. Setelah login, di Dashboard akan terlihat "Cloud name" — salin ke CLOUDINARY_CLOUD_NAME.
 * 3. Buka Settings (ikon gerigi) → tab "Upload" → scroll ke "Upload presets" → klik "Add upload preset".
 *    - Ubah "Signing Mode" dari "Signed" menjadi "Unsigned" (WAJIB, supaya bisa upload
 *      langsung dari browser tanpa server/API secret).
 *    - Simpan, lalu salin nama preset-nya ke CLOUDINARY_UPLOAD_PRESET di bawah.
 * 4. (Opsional tapi disarankan) Di preset yang sama, set "Folder" ke misalnya "hero-videos"
 *    supaya video hero banner terpisah rapi dari file lain, dan set batas ukuran file
 *    kalau mau membatasi lebih ketat dari 40MB yang sudah dicek di kode.
 */

export const CLOUDINARY_CLOUD_NAME = 'p8n2cnll';
export const CLOUDINARY_UPLOAD_PRESET = 'hero_video_upload';
