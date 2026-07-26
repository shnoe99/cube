import { UserProfile } from '../types';

const STORAGE_KEY = 'cube_master_user_profile_v2';

const DEFAULT_PROFILE: UserProfile = {
  uid: 'guest_' + Math.random().toString(36).substring(2, 9),
  name: '익명 연구원',
  avatar: '🧊 큐브봇',
  energy: 150,
  level: 1,
  highScore: 90,
  className: '6학년 1반',
  badges: ['큐브 탐험가'],
  playTimeMinutes: 45,
  role: 'student',
  unlockedShapeIds: ['cube-1'],
  weaknessStats: {
    assembly: { correct: 2, total: 2 },
    rotation: { correct: 1, total: 2 },
    ortho: { correct: 2, total: 3 },
    net: { correct: 1, total: 3 }
  }
};

export const StorageService = {
  getUserProfile: (): UserProfile => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('LocalStorage load error', e);
    }
    return DEFAULT_PROFILE;
  },

  saveUserProfile: (profile: UserProfile): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  },

  addEnergy: (amount: number): UserProfile => {
    const profile = StorageService.getUserProfile();
    profile.energy += amount;
    profile.level = Math.floor(profile.energy / 100) + 1;
    StorageService.saveUserProfile(profile);
    return profile;
  },

  unlockShape: (shapeId: string): UserProfile => {
    const profile = StorageService.getUserProfile();
    if (!profile.unlockedShapeIds.includes(shapeId)) {
      profile.unlockedShapeIds.push(shapeId);
      StorageService.saveUserProfile(profile);
    }
    return profile;
  },

  recordQuizAnswer: (category: 'assembly' | 'rotation' | 'ortho' | 'net', isCorrect: boolean): UserProfile => {
    const profile = StorageService.getUserProfile();
    if (!profile.weaknessStats[category]) {
      profile.weaknessStats[category] = { correct: 0, total: 0 };
    }
    profile.weaknessStats[category].total += 1;
    if (isCorrect) {
      profile.weaknessStats[category].correct += 1;
    }
    StorageService.saveUserProfile(profile);
    return profile;
  },

  updateCategoryStats: (category: 'assembly' | 'rotation' | 'ortho' | 'net', isCorrect: boolean): UserProfile => {
    return StorageService.recordQuizAnswer(category, isCorrect);
  },

  recordWrongAnswer: (_payload?: unknown): UserProfile => {
    const cat = (typeof _payload === 'string' ? _payload : 'assembly') as 'assembly' | 'rotation' | 'ortho' | 'net';
    return StorageService.recordQuizAnswer(cat, false);
  },

  resetData: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('LocalStorage reset error', e);
    }
  }
};
