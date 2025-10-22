import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBVqyqxok3_SfQgWq-BjsADKyCH9vHzl28",
  authDomain: "e-commerce-6e648.firebaseapp.com",
  projectId: "e-commerce-6e648",
  storageBucket: "e-commerce-6e648.appspot.com",
  messagingSenderId: "309285463565",
  appId: "1:309285463565:web:24434d35b284ffa4165744"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
