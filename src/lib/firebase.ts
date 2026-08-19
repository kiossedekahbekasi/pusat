import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
// Catatan: upload video sekarang lewat Cloudinary (lihat src/utils/videoUpload.ts),
// bukan lagi Firebase Storage — supaya tidak perlu upgrade project ke plan Blaze.

// PENTING: aturan Firestore (firestore.rules) mensyaratkan pengguna harus
// "signed in" untuk bisa MENULIS data (termasuk menyimpan pesanan baru).
// Admin login dengan email/password, tapi PEMBELI biasa di halaman toko tidak
// pernah login — akibatnya pesanan mereka gagal tersimpan ke database (hanya
// tersimpan di HP/browser mereka sendiri) dan tidak pernah muncul di Panel Admin.
// Supaya pembeli tetap bisa "menulis" pesanan tanpa perlu daftar/login manual,
// setiap pengunjung otomatis di-sign-in secara ANONIM begitu situs dibuka.
// SYARAT: provider "Anonymous" harus diaktifkan di Firebase Console →
// Authentication → Sign-in method. Kalau belum aktif, panggilan ini akan gagal
// diam-diam dan pesanan pembeli tetap tidak akan tersimpan ke cloud.
if (typeof window !== 'undefined') {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      signInAnonymously(auth).catch((err) => {
        console.warn('Gagal sign-in anonim (aktifkan provider "Anonymous" di Firebase Console → Authentication):', err);
      });
    }
  });
}
