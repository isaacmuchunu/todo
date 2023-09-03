// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import the auth module

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDbULFKblBx8MMvF-6xbAzSPRQXhfUEbM",
  authDomain: "todo-react-tailwindcss.firebaseapp.com",
  projectId: "todo-react-tailwindcss",
  storageBucket: "todo-react-tailwindcss.appspot.com",
  messagingSenderId: "1035719944900",
  appId: "1:1035719944900:web:8e1e7c2d94cab6d7e5b791",
  measurementId: "G-844MHGCLYJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
