import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBkkFF0XhNZeWuDmOfEhsgdfX1VBG7WTas",
  authDomain: "demo-property-manager.firebaseapp.com",
  projectId: "demo-property-manager",
  storageBucket: "demo-property-manager.appspot.com",
  messagingSenderId: "581326886241",
  appId: "1:581326886241:web:c08eb53cbb275347ccaaae"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);