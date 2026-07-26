export type NavTab = 'home' | 'pin-join' | 'host-game' | 'stages' | 'encyclopedia' | 'leaderboard' | 'teacher' | 'settings';

export type StageId = 1 | 2 | 3 | 4;

export type QuestionCategory = 'assembly' | 'rotation' | 'ortho' | 'net';

export type CubePos = [number, number, number];

export interface QuizQuestion {
  id: string;
  category: QuestionCategory;
  question: string;
  questionText?: string;
  shapeId: string;
  targetShapeId?: string;
  options: string[];
  correctIndex: number;
  correctAnswerIdx?: number;
  explanation: string;
  points: number;
}

export interface CubeShape {
  id: string;
  name: string;
  stage: number;
  cubeCount: number;
  cubes: CubePos[];
  description: string;
  faces: number;
  edges: number;
  vertices: number;
  features?: {
    faces: number;
    edges: number;
    vertices: number;
  };
  orthoViews?: {
    top: boolean[][];
    front: boolean[][];
    side: boolean[][];
  };
}

export interface UserProfile {
  uid: string;
  name: string;
  avatar: string;
  energy: number;
  level: number;
  highScore: number;
  className: string;
  badges: string[];
  playTimeMinutes: number;
  role?: string;
  completedStageIds?: number[];
  wrongHistory?: unknown[];
  unlockedShapeIds: string[];
  weaknessStats: Record<QuestionCategory, { correct: number; total: number }>;
}

export interface PinRoom {
  pin: string;
  hostName: string;
  title: string;
  studentsCount: number;
  status: 'waiting' | 'playing' | 'finished';
}
