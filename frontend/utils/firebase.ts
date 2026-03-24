import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBgPmLBLvwXOwH4o2cVlPP_9tM-NSkYtrA",
  authDomain: "society-subscription-413ab.firebaseapp.com",
  projectId: "society-subscription-413ab",
  storageBucket: "society-subscription-413ab.firebasestorage.app",
  messagingSenderId: "931339900026",
  appId: "1:931339900026:web:c6f63c0457747e67ce17c3"
};

const vapidKey = process.env.NEXT_PUBLIC_VAPID_KEY;

const app = initializeApp(firebaseConfig);
export const messaging = typeof window !== "undefined" ? getMessaging(app) : null;

// Request permission & get FCM token
export const requestFCMToken = async () => {
  const permission = await Notification.requestPermission();
  if (permission === "granted" && messaging) {
    const token = await getToken(messaging, { vapidKey });
    return token;
  }
  return null;
};

// Listen for foreground messages
export const onForegroundMessage = (callback: (payload: any) => void) => {
  if (!messaging) return;
  return onMessage(messaging, callback);
};

// Register service worker
export const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      console.log("Service worker registered successfully:", registration.scope);
      return registration;
    } catch (err) {
      console.error("Service worker registration failed:", err);
      throw err;
    }
  }
};