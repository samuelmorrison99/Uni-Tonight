import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, browserLocalPersistence, indexedDBLocalPersistence, GoogleAuthProvider } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { getMessaging } from 'firebase/messaging';
import type { Messaging } from 'firebase/messaging';
import { Capacitor } from '@capacitor/core';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAWK20JmN0RkE0FZtkiIun78eF00OSLGqw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "uni-tonight-c8c75.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "uni-tonight-c8c75",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "uni-tonight-c8c75.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "177036369899",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:177036369899:ios:9a60a565f54d981e8a83ae"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Initialize Auth safely for both Capacitor iOS WKWebView and Web
let authInstance: Auth;
try {
  if (Capacitor.isNativePlatform()) {
    authInstance = initializeAuth(app, {
      persistence: [browserLocalPersistence, indexedDBLocalPersistence]
    });
  } else {
    authInstance = getAuth(app);
  }
} catch {
  authInstance = getAuth(app);
}
export const auth = authInstance;

export const googleProvider = new GoogleAuthProvider();

// Initialize Messaging safely (iOS WKWebView does not support Web Push ServiceWorker)
let messagingInstance: Messaging | null = null;
try {
  if (
    typeof window !== 'undefined' &&
    !Capacitor.isNativePlatform() &&
    typeof navigator !== 'undefined' &&
    'serviceWorker' in navigator
  ) {
    messagingInstance = getMessaging(app);
  }
} catch (err) {
  console.warn('Firebase Messaging not supported in this environment:', err);
}
export const messaging = messagingInstance;

export default app;
