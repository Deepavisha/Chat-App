// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "<YOUR API KEY>",
  authDomain: "<YOUR AUTHDOMAIN>",
  projectId: "<YOUR PROJECT ID>",
  storageBucket: "<YOUR STORAGEBUCKET>",
  messagingSenderId: "<YOUR MESSAGING SENDER ID>",
  appId: "<YOUR API ID>",
  measurementId: "<YOUR MEASUREMENT ID>",
  databaseURL: "<YOUR DATABASE URL>"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
