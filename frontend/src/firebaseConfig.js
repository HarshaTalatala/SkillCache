// Firebase v10+ configuration for SkillCache
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration from environment variables
// Debug env variables
console.log('Firebase ENV Variables Check:');
console.log('VITE_FIREBASE_API_KEY:', import.meta.env.VITE_FIREBASE_API_KEY);
console.log('VITE_FIREBASE_AUTH_DOMAIN:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
console.log('VITE_FIREBASE_PROJECT_ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);

// Using direct values for now to troubleshoot
export const firebaseConfig = {
  apiKey: "AIzaSyBWxC79gRZ-x7CBlKNW2Dv6EzLHmaedzrU",
  authDomain: "skillcache-app.firebaseapp.com",
  projectId: "skillcache-app",
  storageBucket: "skillcache-app.appspot.com",
  messagingSenderId: "387888810669",
  appId: "1:387888810669:web:28f9698021bb825117d424"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
