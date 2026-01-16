// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKjXEInZtuQMxZCRNpI-1GNwEji17Et1E",
  authDomain: "lecturenotes-app.firebaseapp.com",
  projectId: "lecturenotes-app",
  storageBucket: "lecturenotes-app.firebasestorage.app",
  messagingSenderId: "147240622326",
  appId: "1:147240622326:web:219cba7ec8c25236e6f4d7",
  measurementId: "G-VMGK2FX1NK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;