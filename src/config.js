import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyDXbXfsNSu75nPgEHSUyvdWzujaZ8wFHx0",
  authDomain: "resultado-academico.firebaseapp.com",
  projectId: "resultado-academico",
  storageBucket: "resultado-academico.firebasestorage.app",
  messagingSenderId: "280410241595",
  appId: "1:280410241595:web:901f370cbeec7df4277a1e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app