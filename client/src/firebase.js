// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyC2gDpNW4NtSgNzOw0D0rbErECwg_4Q19c",
  authDomain: "geomancy-edu.firebaseapp.com",
  projectId: "geomancy-edu",
  storageBucket: "geomancy-edu.appspot.com",
  messagingSenderId: "682315171119",
  appId: "1:682315171119:web:beab43f618462489cd4dda",
  measurementId: "G-TQCYY5ZDVX"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);


