// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBgPmLBLvwXOwH4o2cVlPP_9tM-NSkYtrA",
//   authDomain: "society-subscription-413ab.firebaseapp.com",
//   projectId: "society-subscription-413ab",
//   storageBucket: "society-subscription-413ab.firebasestorage.app",
//   messagingSenderId: "931339900026",
//   appId: "1:931339900026:web:c6f63c0457747e67ce17c3"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);


// npm install firebase

// BCHzVajWdPEHQOOglEH_OKIJRAitQ6qVGIPn1gkk-6gx24_pMkLfw1bk7mDvUUrugxAUbwP__lf6Z9xt7R71Tg4 

// Sender ID
// 	Service account
// 931339900026

// var admin = require("firebase-admin");

// var serviceAccount = require("path/to/serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });



const admin = require("firebase-admin");
const serviceAccount = require("./society-subscription-413ab-firebase-adminsdk-fbsvc-e4045bc903.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
