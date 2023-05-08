// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

/// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD10HZg_xRcwovl4wJVIHNBXkWAK4a7lDs",
  authDomain: "spotify-build-ab932.firebaseapp.com",
  projectId: "spotify-build-ab932",
  storageBucket: "spotify-build-ab932.appspot.com",
  messagingSenderId: "915329333658",
  appId: "1:915329333658:web:d35e769a8c0c5b71cfe223",
  measurementId: "G-1DE315S28S",
};
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

 

module.exports = { db };
