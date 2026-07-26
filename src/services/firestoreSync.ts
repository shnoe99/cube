import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { UserProfile } from '../types';

export const FirestoreSyncService = {
  
  // 1. User Profile Sync to Firestore
  syncUserProfile: async (user: UserProfile): Promise<void> => {
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        ...user,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log('Firestore user profile synced:', user.uid);
    } catch (error) {
      console.warn('Firestore sync warning (falling back to LocalStorage):', error);
    }
  },

  // Fetch User Profile from Firestore
  fetchUserProfile: async (uid: string): Promise<UserProfile | null> => {
    try {
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
    } catch (error) {
      console.warn('Firestore fetch user error:', error);
    }
    return null;
  }
};
