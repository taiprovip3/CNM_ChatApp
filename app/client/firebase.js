import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // apiKey: "AIzaSyB-5EYam_GADZuEzA4O8P3QDNi0q1X4wYk",
  // authDomain: "chatapp-5c28e.firebaseapp.com",
  // projectId: "chatapp-5c28e",
  // storageBucket: "chatapp-5c28e.appspot.com",
  // messagingSenderId: "779888193931",
  // appId: "1:779888193931:web:d6633dadfbf226cd0bff8e"
  apiKey: "AIzaSyAcgx72HvwilTbWzhcQA898zr2gzRNsuvQ",
  authDomain: "ultimatechat-4f632.firebaseapp.com",
  projectId: "ultimatechat-4f632",
  storageBucket: "ultimatechat-4f632.appspot.com",
  messagingSenderId: "349979181533",
  appId: "1:349979181533:web:4d9c42be25b289542a3634"
};

initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore();