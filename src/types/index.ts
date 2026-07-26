export type StageId = 1 | 2 | 3 | 4;

export interface CubePos {
  x: number;
  y: number;
  z: number;
  color?: string;
}

export interface OrthoViewData {
  top: boolean[][];    // 3x3 grid (true = cube present)
  front: boolean[][];  // 3x3 grid
  side: boolean[][];   // 3x3 grid
}

export interface CubeShape {
  id: string;
  name: string;
  stage: StageId;
  cubeCount: number;
  cubes: CubePos[];
  description: string;
  features: {
    faces: number;
    edges: number;
    vertices: number;
  };
  orthoViews: OrthoViewData;
  category: 'basic' | 'line' | 'l_shape' | 'i_shape' | 'o_shape' | 't_shape' | 's_shape' | 'corner_3d' | 'tripod_3d' | 'twisted_3d';
}

export interface UserProfile {
  uid: string;
  name: string;
  className: string;
  role: 'student' | 'teacher';
  level: number;
  energy: number;
  highScore: number;
  unlockedShapeIds: string[];
  completedStageIds: number[];
  playTimeMinutes: number;
  badges: string[];
  wrongHistory: WrongAnswerItem[];
  weaknessStats: {
    net: { correct: number; total: number };
    rotation: { correct: number; total: number };
    ortho: { correct: number; total: number };
    assembly: { correct: number; total: number };
  };
}

export interface WrongAnswerItem {
  id: string;
  questionText: string;
  category: 'net' | 'rotation' | 'ortho' | 'assembly';
  userChoice: string;
  correctChoice: string;
  explanation: string;
  timestamp: string;
}

export type QuizCategory = 'assembly' | 'rotation' | 'ortho' | 'net' | 'final';

export interface QuizOption {
  id: number;
  text: string;
  shapeId?: string;
  isCorrect?: boolean;
}

export interface QuizQuestion {
  id: string;
  category: 'net' | 'rotation' | 'ortho' | 'assembly';
  stage: StageId;
  questionText: string;
  targetShapeId: string;
  options: QuizOption[];
  correctAnswerIdx: number;
  explanation: string;
  hint?: string;
}

export type NavTab = 'home' | 'stages' | 'encyclopedia' | 'leaderboard' | 'teacher' | 'settings' | 'final_exam';
