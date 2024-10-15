// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCujlacKylY_iheLrVG76fSUbO6Xfr1B30",
  authDomain: "fir-a18a9.firebaseapp.com",
  projectId: "fir-a18a9",
  storageBucket: "fir-a18a9.appspot.com",
  messagingSenderId: "638128600189",
  appId: "1:638128600189:web:6a39223b299193c8deed14",
  measurementId: "YG-EMHR0ZZ2HW",
  databaseURL: "https://fir-a18a9-default-rtdb.asia-southeast1.firebasedatabase.app/"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
