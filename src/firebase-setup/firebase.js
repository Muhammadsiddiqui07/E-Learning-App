import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, deleteUser } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, getDocs, deleteDoc, addDoc, query, where, getDocFromCache } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyApNu8sxriy-I7XYEmBmIi159dP2wcxHXs",
  authDomain: "e-learning-529e3.firebaseapp.com",
  projectId: "e-learning-529e3",
  storageBucket: "e-learning-529e3.appspot.com",
  messagingSenderId: "190515335906",
  appId: "1:190515335906:web:06058fb868cda4779884bb"
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