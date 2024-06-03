// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRwLDX6FP-CQAidQZu5ykLRJmgSDq8mEQ",
  authDomain: "fir-46d80.firebaseapp.com",
  databaseURL: "https://fir-46d80-default-rtdb.firebaseio.com",
  projectId: "fir-46d80",
  storageBucket: "fir-46d80.appspot.com",
  messagingSenderId: "372669767441",
  appId: "1:372669767441:web:02df87e7cc966aba3076b0",
  measurementId: "G-GVV5519MXZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);