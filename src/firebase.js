import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, setPersistence, browserLocalPersistence, connectAuthEmulator } from 'firebase/auth';

// Check if Firebase is properly configured
const isFirebaseConfigured = process.env.REACT_APP_FIREBASE_API_KEY &&
  process.env.REACT_APP_FIREBASE_API_KEY !== "demo-api-key" &&
  process.env.REACT_APP_FIREBASE_API_KEY !== "AIzaSyDemoKey123456789" &&
  process.env.REACT_APP_FIREBASE_PROJECT_ID &&
  process.env.REACT_APP_FIREBASE_PROJECT_ID !== "demo-project";

const firebaseConfig = isFirebaseConfigured ? {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
} : null;

let app, db, auth;

if (firebaseConfig) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);

    // Connect to emulator if using demo project
    if (process.env.REACT_APP_FIREBASE_PROJECT_ID === 'demo-no-project') {
      console.log('Connecting to Firebase Auth emulator...');
      connectAuthEmulator(auth, "http://127.0.0.1:9099");
    }

    // Set persistence to local (survives browser restarts)
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.log('Firebase persistence error:', error);
    });
  } catch (error) {
    console.warn('Firebase initialization failed, running in demo mode:', error);
    app = null;
    db = null;
    auth = null;
  }
} else {
  console.log('Firebase not configured, running in demo mode');
  app = null;
  db = null;
  auth = null;
}

export { db, auth, isFirebaseConfigured };
