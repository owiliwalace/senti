// config/firebaseConfig.ts

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDJ4uRbbGgvW0jSNRgILST1N98LeGJxkDg",
    authDomain: "zabuni-985c6.firebaseapp.com",
    projectId: "zabuni-985c6",
    storageBucket: "zabuni-985c6.appspot.com",
    messagingSenderId: "259610582122",
    appId: "1:259610582122:web:6488eed2aea80816ac7e13",
    measurementId: "G-G9K4RL765C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

// Initialize Authentication
const auth = getAuth(app);

// Export the initialized services
export { app, db, storage, auth };
