// 配置 Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCFHwigwAMZ-JNy_N6jk47JOkikc8t9fhA",
  authDomain: "nihongoproject-ba49a.firebaseapp.com",
  projectId: "nihongoproject-ba49a",
  storageBucket: "nihongoproject-ba49a.appspot.com",
  messagingSenderId: "610247412747",
  appId: "1:610247412747:web:6985d1956bd90c7c1d4b0e",
  measurementId: "G-6LRWKJD1DH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };