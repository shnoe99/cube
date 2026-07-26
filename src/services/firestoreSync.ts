import { db } from './firebase';
import { doc, setDoc, getDoc, collection, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { UserProfile, PinRoom } from '../types';

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
  },

  // 2. Realtime PIN Game Room Creation (Teacher/Host)
  createPinRoom: async (pin: string, hostName: string, title: string): Promise<void> => {
    try {
      const roomRef = doc(db, 'pin_rooms', pin);
      await setDoc(roomRef, {
        pin,
        hostName,
        title,
        status: 'waiting',
        students: [],
        createdAt: new Date().toISOString()
      });
      console.log('Firestore PIN room created:', pin);
    } catch (error) {
      console.warn('Firestore PIN room create fallback:', error);
    }
  },

  // Student Joins Realtime PIN Room
  joinPinRoom: async (pin: string, studentName: string, avatar: string): Promise<boolean> => {
    try {
      const roomRef = doc(db, 'pin_rooms', pin);
      const snap = await getDoc(roomRef);

      if (snap.exists()) {
        await updateDoc(roomRef, {
          students: arrayUnion({ name: studentName, avatar, joinedAt: new Date().toISOString() })
        });
        return true;
      }
    } catch (error) {
      console.warn('Firestore join PIN room error:', error);
    }
    return false;
  },

  // Realtime Listener for Host/Students in PIN Room
  listenToPinRoom: (pin: string, callback: (data: any) => void) => {
    try {
      const roomRef = doc(db, 'pin_rooms', pin);
      return onSnapshot(roomRef, (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.data());
        }
      });
    } catch (error) {
      console.warn('Firestore snapshot listener warning:', error);
      return () => {};
    }
  }
};
