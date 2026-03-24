importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBgPmLBLvwXOwH4o2cVlPP_9tM-NSkYtrA",
  authDomain: "society-subscription-413ab.firebaseapp.com",
  projectId: "society-subscription-413ab",
  storageBucket: "society-subscription-413ab.firebasestorage.app",
  messagingSenderId: "931339900026",
  appId: "1:931339900026:web:c6f63c0457747e67ce17c3"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message received:", payload);

  const notificationTitle = payload.notification?.title || "New Message";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new notification",
    icon: payload.notification?.icon || "/favicon.ico",
    data: payload.data, // Preserve data for click handling
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});