
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Ces valeurs seront remplacées automatiquement si tu connectes un projet Firebase
// En attendant, on évite d'utiliser une clé bidon qui fait crash l'auth
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialisation sécurisée
let app;
let auth: any;
let db: any;

try {
  if (firebaseConfig.apiKey) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    // Mode sans Firebase (développement local)
    auth = { onAuthStateChanged: (cb: any) => cb(null), signOut: () => {} };
  }
} catch (e) {
  console.error("Firebase config error", e);
  auth = { onAuthStateChanged: (cb: any) => cb(null), signOut: () => {} };
}

export { auth, db };
