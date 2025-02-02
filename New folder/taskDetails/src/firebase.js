import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXkTKNDPnb7A5pXMvigxo4YgLNyEaUln8",
  authDomain: "react-project-f71d3.firebaseapp.com",
  projectId: "react-project-f71d3",
  storageBucket: "react-project-f71d3.firebasestorage.app",
  messagingSenderId: "832780613815",
  appId: "1:832780613815:web:a59c52e87c95d72b673532",
  measurementId: "G-R17ERB7ZNW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };