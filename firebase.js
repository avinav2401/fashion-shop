import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut 
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC3PibIJKSG6qIUqN3c90zXvv0gy1Fdz10",
  authDomain: "hostel-zone.firebaseapp.com",
  projectId: "hostel-zone",
  storageBucket: "hostel-zone.appspot.com",
  messagingSenderId: "86399762110",
  appId: "1:86399762110:web:95a0f8b35bf14c042e68ef",
  measurementId: "G-5WKDWLYSQF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  db,
  doc,
  setDoc,
  getDoc
};