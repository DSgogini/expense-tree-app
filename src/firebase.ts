import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBxxwobPwBF4tKwPpSPq_l2uy787fN7VJE",
  authDomain: "moneyplant-88f7d.firebaseapp.com",
  databaseURL: "https://moneyplant-88f7d.firebaseio.com",
  projectId: "moneyplant-88f7d",
  storageBucket: "moneyplant-88f7d.firebasestorage.app",
  messagingSenderId: "623898566949",
  appId: "1:623898566949:web:6391e3aaff64fc5edf7acc",
  measurementId: "G-NXXRDFWMCY",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

const signInWithGoogle = async (): Promise<User> => {
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

const signOutFirebase = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

export { auth, db, signInWithGoogle, signOutFirebase, type User };

