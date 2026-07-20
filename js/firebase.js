// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Konfigurasi Firebase
const firebaseConfig = {

    apiKey: "AIzaSyBz1sApxp-SWJEl9xHMNEjq5gRwlFFq1aM",

    authDomain: "sistem-ekstrakurikuler-codero.firebaseapp.com",

    projectId: "sistem-ekstrakurikuler-codero",

    storageBucket: "sistem-ekstrakurikuler-codero.firebasestorage.app",

    messagingSenderId: "1085182478197",

    appId: "1:1085182478197:web:cd71175f7bf42dae48f53c"

};

// Inisialisasi
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
