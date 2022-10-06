import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyDBi-wiXdEgOCTtcXO7w3K6G_bvTrhulng",
  authDomain: "ultimatecloud-c4d19.firebaseapp.com",
  projectId: "ultimatecloud-c4d19",
  storageBucket: "ultimatecloud-c4d19.appspot.com",
  messagingSenderId: "482916212450",
  appId: "1:482916212450:web:47fee21680456e6ed588bb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;