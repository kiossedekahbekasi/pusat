import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
// Dipakai untuk menyimpan file video (video terlalu besar untuk disimpan sebagai
// base64 di Firestore/localStorage seperti foto — lihat src/utils/videoUpload.ts).
export const storage = getStorage(app);
