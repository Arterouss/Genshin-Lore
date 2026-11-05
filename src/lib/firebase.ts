import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let analytics: Analytics | null = null;

if (firebaseConfig.apiKey) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);

    if (typeof window !== "undefined") {
      isSupported()
        .then((supported) => {
          if (supported && app) {
            analytics = getAnalytics(app);
          }
        })
        .catch(() => {});
    }
  } catch (err) {
    console.warn("Firebase initialization warning:", err);
  }
}

export { app, db, storage, analytics };
