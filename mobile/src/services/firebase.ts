import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyArcO-L8-By-LATAlIEUsMuAuP12Zt1vVI",
  authDomain: "permutapp-pro.firebaseapp.com",
  projectId: "permutapp-pro",
  storageBucket: "permutapp-pro.firebasestorage.app",
  messagingSenderId: "163709364417",
  appId: "1:163709364417:web:71b647a3f6c622be390c40"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
