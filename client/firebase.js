import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB-5EYam_GADZuEzA4O8P3QDNi0q1X4wYk",
  authDomain: "chatapp-5c28e.firebaseapp.com",
  projectId: "chatapp-5c28e",
  storageBucket: "chatapp-5c28e.appspot.com",
  messagingSenderId: "779888193931",
  appId: "1:779888193931:web:d6633dadfbf226cd0bff8e"
};
const app = initializeApp(firebaseConfig);
export default app;