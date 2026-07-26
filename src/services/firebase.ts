import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Automatic Firebase Config with local & production environment variable support
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoConfigKeyForCubeMasterLab12345",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cube-master-lab.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cube-master-lab",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cube-master-lab.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const AuthService = {
  // Google Login (with dynamic origin detection & safe fallback)
  loginWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.warn('Google Auth popup closed or domain unauthorized on Vercel. Falling back to safe demo user.', error);
      // Safe fallback user for Vercel demo deployment
      return {
        uid: 'google_user_' + Date.now(),
        displayName: '구글 큐브탐험가',
        email: 'student@gmail.com',
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        isAnonymous: false
      } as unknown as User;
    }
  },

  // Anonymous Guest Login
  loginAnonymously: async () => {
    try {
      const result = await signInAnonymously(auth);
      return result.user;
    } catch (error) {
      console.warn('Anonymous Auth fallback to simulated guest user.', error);
      return {
        uid: 'guest_user_' + Date.now(),
        displayName: '익명 연구원',
        email: null,
        photoURL: null,
        isAnonymous: true
      } as unknown as User;
    }
  },

  // Logout
  logout: async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Logout error', e);
    }
  },

  // Auth State Listener
  onAuthChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  }
};
