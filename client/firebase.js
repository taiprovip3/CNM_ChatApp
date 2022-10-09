import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB-5EYam_GADZuEzA4O8P3QDNi0q1X4wYk",
  authDomain: "chatapp-5c28e.firebaseapp.com",
  projectId: "chatapp-5c28e",
  storageBucket: "chatapp-5c28e.appspot.com",
  messagingSenderId: "779888193931",
  appId: "1:779888193931:web:d6633dadfbf226cd0bff8e"
};

initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore();