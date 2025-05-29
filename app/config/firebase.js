import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBTf6rzbeUrmdk5fOv0OpolYy2tUACXeSg",
  authDomain: "nus-uniwash.firebaseapp.com",
  projectId: "nus-uniwash",
  storageBucket: "nus-uniwash.appspot.com",
  messagingSenderId: "279355527352",
  appId: "1:279355527352:web:5f19a67fbc71aa436a17bd",
  measurementId: "G-PGNY7XGDKPJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
