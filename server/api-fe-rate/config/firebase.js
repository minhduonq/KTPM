// Sử dụng require
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');



const firebaseConfig = {
    apiKey: "AIzaSyAONLS5yBN-ojEM_Gro7K4UEy6l6pxXiII",
    authDomain: "health-endpoint-monitoring.firebaseapp.com",
    projectId: "health-endpoint-monitoring",
    storageBucket: "health-endpoint-monitoring.appspot.com",
    messagingSenderId: "821794068264",
    appId: "1:821794068264:web:3b66cefd8725a8c171a21d",
    measurementId: "G-2M5C9SKHVF"
  };

const app = initializeApp(firebaseConfig)

const db = getFirestore();

module.exports = db;