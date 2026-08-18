import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
// Catatan: upload video sekarang lewat Cloudinary (lihat src/utils/videoUpload.ts),
// bukan lagi Firebase Storage — supaya tidak perlu upgrade project ke plan Blaze.
