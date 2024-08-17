import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, deleteUser } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, getDocs, deleteDoc, addDoc, query, where, getDocFromCache } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAjwlA5au9qwjsE2Qw-NBZhqKYo4O-SLik",
  authDomain: "password-generator-f98e6.firebaseapp.com",
  projectId: "password-generator-f98e6",
  storageBucket: "password-generator-f98e6.appspot.com",
  messagingSenderId: "314595302531",
  appId: "1:314595302531:web:0a1b997e459be0af478fb6",
  measurementId: "G-RXX0K71PX4"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage();




export {
  app, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser,
  GoogleAuthProvider, signInWithPopup, onAuthStateChanged,
  db, doc, setDoc, getDoc, updateDoc, collection, getDocs, deleteDoc, addDoc, query, where, getDocFromCache,
  storage, ref, uploadBytesResumable, getDownloadURL
}