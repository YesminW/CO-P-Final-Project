// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBwXV6aKVT2tdTOByHapU3SVtCTvPcjuq8",
  authDomain: "chat-d8806.firebaseapp.com",
  projectId: "chat-d8806",
  storageBucket: "chat-d8806.appspot.com",
  messagingSenderId: "187622434492",
  appId: "1:187622434492:web:ed405a7bbdcac35e0512b9",
  measurementId: "G-C8Q0DSHD58",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
