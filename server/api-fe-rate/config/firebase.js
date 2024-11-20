const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

// const firebaseConfig = {
//     apiKey: "YOUR_API_KEY",
//     authDomain: "YOUR_AUTH_DOMAIN",
//     projectId: "YOUR_PROJECT_ID",
//     storageBucket: "YOUR_STORAGE_BUCKET",
//     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//     appId: "YOUR_APP_ID"
// };
const firebaseConfig = {
    apiKey: "AIzaSyChufHnISzrMcAffvxKPZWorcqNaNuHU9I",
    authDomain: "ktpm-c0d2a.firebaseapp.com",
    projectId: "ktpm-c0d2a",
    storageBucket: "ktpm-c0d2a.firebasestorage.app",
    messagingSenderId: "1004871997668",
    appId: "1:1004871997668:web:8c9008fd27636e3f19f4f1",
    measurementId: "G-FBT7WF376G"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = db;