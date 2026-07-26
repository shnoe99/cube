import { UserProfile, WrongAnswerItem } from '../types';

const STORAGE_KEY_USER = 'cube_master_user_profile_v1';

const DEFAULT_USER: UserProfile = {
  uid: 'guest_student_1',
  name: '큐브탐험가',
  className: '6학년 1반',
  role: 'student',
  level: 1,
  energy: 0,
  highScore: 0,
  unlockedShapeIds: ['cube_1'],
  completedStageIds: [],
  playTimeMinutes: 5,
  badges: ['새내기 연구원'],
  wrongHistory: [],
  weaknessStats: {
    net: { correct: 0, total: 0 },
    rotation: { correct: 0, total: 0 },
    ortho: { correct: 0, total: 0 },
    assembly: { correct: 0, total: 0 }
  }
};

export const StorageService = {
  // 유저 프로필 불러오기 (LocalStorage 또는 Firebase Fallback)
  getUserProfile: (): UserProfile => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USER);
      if (data) {
        return JSON.parse(data) as UserProfile;
      }
    } catch (e) {
      console.warn('LocalStorage load error, using default user profile.', e);
    }
    return DEFAULT_USER;
  },

  // 유저 프로필 저장 (LocalStorage 동기화)
  saveUserProfile: (profile: UserProfile): void => {
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
    } catch (e) {
      console.error('LocalStorage save error.', e);
    }
  },

  // 포인트 / 큐브 에너지 업데이트
  addEnergy: (amount: number): UserProfile => {
    const user = StorageService.getUserProfile();
    user.energy += amount;
    
    // 레벨 업 계산 (100 에너지마다 1 레벨업)
    const newLevel = Math.floor(user.energy / 100) + 1;
    if (newLevel > user.level) {
      user.level = newLevel;
      if (!user.badges.includes(`Lv.${newLevel} 공간 마스터`)) {
        user.badges.push(`Lv.${newLevel} 공간 마스터`);
      }
    }

    StorageService.saveUserProfile(user);
    return user;
  },

  // 오답 기록 추가
  recordWrongAnswer: (item: WrongAnswerItem): void => {
    const user = StorageService.getUserProfile();
    user.wrongHistory.unshift(item);
    // 최대 20개 저장
    if (user.wrongHistory.length > 20) {
      user.wrongHistory = user.wrongHistory.slice(0, 20);
    }
    StorageService.saveUserProfile(user);
  },

  // 카테고리 통계 업데이트
  updateCategoryStats: (category: 'net' | 'rotation' | 'ortho' | 'assembly', isCorrect: boolean): void => {
    const user = StorageService.getUserProfile();
    user.weaknessStats[category].total += 1;
    if (isCorrect) {
      user.weaknessStats[category].correct += 1;
    }
    StorageService.saveUserProfile(user);
  },

  // 입체도형 도감 해금
  unlockShape: (shapeId: string): void => {
    const user = StorageService.getUserProfile();
    if (!user.unlockedShapeIds.includes(shapeId)) {
      user.unlockedShapeIds.push(shapeId);
      StorageService.saveUserProfile(user);
    }
  },

  // 데이터 초기화
  resetData: (): void => {
    localStorage.removeItem(STORAGE_KEY_USER);
  }
};
