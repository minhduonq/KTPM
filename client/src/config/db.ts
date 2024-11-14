import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAONLS5yBN-ojEM_Gro7K4UEy6l6pxXiII",
  authDomain: "health-endpoint-monitoring.firebaseapp.com",
  databaseURL: "https://health-endpoint-monitoring-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "health-endpoint-monitoring",
  storageBucket: "health-endpoint-monitoring.firebasestorage.app",
  messagingSenderId: "821794068264",
  appId: "1:821794068264:web:3b66cefd8725a8c171a21d",
  measurementId: "G-2M5C9SKHVF"
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };