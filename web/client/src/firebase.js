import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    // messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    // appId: process.env.REACT_APP_FIREBASE_APP_ID,
    apiKey: "AIzaSyAcgx72HvwilTbWzhcQA898zr2gzRNsuvQ",
    authDomain: "ultimatechat-4f632.firebaseapp.com",
    projectId: "ultimatechat-4f632",
    storageBucket: "ultimatechat-4f632.appspot.com",
    messagingSenderId: "349979181533",
    appId: "1:349979181533:web:4d9c42be25b289542a3634"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getFirestore(app);
export const storage = getStorage(app);