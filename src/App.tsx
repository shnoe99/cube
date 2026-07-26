import { useState, useEffect } from 'react';
import { NavTab, UserProfile } from './types';
import { StorageService } from './services/storageService';
import { AudioEngine } from './services/audioEngine';
import { AuthService } from './services/firebase';

import { InitialLoginScreen } from './components/auth/InitialLoginScreen';
import { QuizNHeader } from './components/quizn/QuizNHeader';

import { StageMap } from './components/StageMap';
import { CubeCodex } from './components/encyclopedia/CubeCodex';
import { Leaderboard } from './components/leaderboard/Leaderboard';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { SettingsModal } from './components/settings/SettingsModal';
import { AITutorModal } from './components/ai/AITutorModal';
import { AuthModal } from './components/auth/AuthModal';

// Mini games
import { AssemblyGame } from './components/games/AssemblyGame';
import { SameShapeGame } from './components/games/SameShapeGame';
import { OrthoViewGame } from './components/games/OrthoViewGame';
import { NetFindGame } from './components/games/NetFindGame';
import { FinalExam } from './components/games/FinalExam';

import { Play, Sparkles, Trophy, BookOpen, GraduationCap, Flame, ArrowRight, ShieldCheck, Box } from 'lucide-react';
import { CUBE_SHAPES } from './data/cubeShapes';
import { CubeViewer3D } from './components/3d/CubeViewer3D';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [activeGame, setActiveGame] = useState<'assembly' | 'rotation' | 'ortho' | 'net' | 'final' | null>(null);
  const [user, setUser] = useState<UserProfile>(() => StorageService.getUserProfile());
  const [showAIModal, setShowAIModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);

  useEffect(() => {
    // Listen to Firebase Auth changes
    const unsubscribe = AuthService.onAuthChange((fbUser) => {
      if (fbUser) {
        const profile = StorageService.getUserProfile();
        profile.uid = fbUser.uid;
        if (fbUser.displayName) profile.name = fbUser.displayName;
        profile.isLoggedIn = true;
        StorageService.saveUserProfile(profile);
        setUser(profile);
      }
    });
    return () => unsubscribe();
  }, []);

  const refreshUser = () => {
    setUser(StorageService.getUserProfile());
  };

  const handleLaunchGame = (g: 'assembly' | 'rotation' | 'ortho' | 'net' | 'final') => {
    AudioEngine.playWarpSwoosh();
    setActiveGame(g);
    setActiveTab('stages');
  };

  const handleBackToStages = () => {
    AudioEngine.playClick();
    setActiveGame(null);
    refreshUser();
  };

  // 1. Initial Login Selection Screen Gate
  if (!user.isLoggedIn) {
    return (
      <InitialLoginScreen
        onLoginSuccess={(u) => setUser(u)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-purple-950 text-slate-100 flex flex-col font-sans selection:bg-yellow-300 selection:text-purple-950 relative">
      
      {/* QuizN Header */}
      <QuizNHeader
        activeTab={activeTab}
        setActiveTab={(t) => {
          setActiveGame(null);
          setActiveTab(t);
        }}
        user={user}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenAIModal={() => setShowAIModal(true)}
        soundMuted={soundMuted}
        setSoundMuted={setSoundMuted}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        
        {/* 1. Active Mini Game View */}
        {activeGame === 'assembly' && <AssemblyGame onBack={handleBackToStages} onScoreUpdate={refreshUser} />}
        {activeGame === 'rotation' && <SameShapeGame onBack={handleBackToStages} onScoreUpdate={refreshUser} />}
        {activeGame === 'ortho' && <OrthoViewGame onBack={handleBackToStages} onScoreUpdate={refreshUser} />}
        {activeGame === 'net' && <NetFindGame onBack={handleBackToStages} onScoreUpdate={refreshUser} />}
        {activeGame === 'final' && <FinalExam onBack={handleBackToStages} onScoreUpdate={refreshUser} />}

        {/* 2. Home Main View */}
        {!activeGame && activeTab === 'home' && (
          <div className="space-y-10 pb-16">
            
            {/* QuizN Main Hero Banner */}
            <div className="bg-gradient-to-br from-purple-800 via-indigo-900 to-purple-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl border-4 border-yellow-400 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

              <div className="space-y-4 max-w-xl text-center md:text-left z-10">
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="bg-yellow-400 text-purple-950 px-4 py-1.5 rounded-full text-xs font-black inline-flex items-center gap-1.5 shadow-lg shadow-yellow-400/20 animate-bounce">
                    <Flame className="w-4 h-4 text-red-600 fill-red-500" />
                    <span>초등 6학년 3D 공간지각 탐험</span>
                  </span>
                  <span className="bg-purple-800 border border-purple-500 px-3.5 py-1.5 rounded-full text-xs font-bold text-yellow-300">
                    {user.avatar} {user.name} 님 접속 중
                  </span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight drop-shadow-md">
                  Easy & Fun <span className="text-yellow-300">큐브앤 3D</span> <br />
                  <span className="text-cyan-300 font-extrabold text-2xl sm:text-3xl">공간 감각 입체 어드벤처</span>
                </h1>

                <p className="text-sm sm:text-base font-medium text-purple-100 leading-relaxed">
                  정육면체 1~4개로 만드는 12가지 폴리큐브를 직접 조립·회전·투상도·전개도 미니게임으로 정복하고 최고의 큐브 마스터에 도전하세요!
                </p>

                <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
                  <button
                    onClick={() => {
                      AudioEngine.playWarpSwoosh();
                      setActiveTab('stages');
                    }}
                    className="bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-purple-950 font-black px-8 py-4 rounded-2xl shadow-xl shadow-yellow-400/30 text-lg flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <Play className="w-5 h-5 fill-purple-950" />
                    <span>3D 어드벤처 시작하기 🚀</span>
                  </button>

                  <button
                    onClick={() => {
                      AudioEngine.playWarpSwoosh();
                      setActiveTab('encyclopedia');
                    }}
                    className="bg-purple-800 hover:bg-purple-700 text-white font-black px-6 py-4 rounded-2xl border-2 border-purple-500 shadow-lg text-base flex items-center gap-2 transition-transform hover:scale-105"
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>3D 입체 박물관</span>
                  </button>
                </div>
              </div>

              {/* 3D Model Box */}
              <div className="w-60 h-60 sm:w-72 sm:h-72 rounded-3xl bg-purple-900/90 border-4 border-yellow-400 p-4 shadow-2xl flex flex-col items-center justify-center relative group hover:rotate-3 transition-transform">
                <CubeViewer3D cubes={CUBE_SHAPES[3].cubes} height={160} autoRotate={true} />
                <span className="text-xs font-black text-purple-950 bg-yellow-400 px-4 py-1 rounded-full shadow-md mt-2">
                  12종 3D 폴리큐브
                </span>
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div
                onClick={() => {
                  AudioEngine.playClick();
                  setActiveTab('stages');
                }}
                className="bg-gradient-to-br from-blue-600 to-sky-500 rounded-3xl p-6 border-4 border-blue-400 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform">
                  <Box className="w-6 h-6" />
                </div>
                <h3 className="font-black text-xl text-white">
                  3D 어드벤처
                </h3>
                <p className="text-xs text-blue-100 font-bold leading-relaxed">
                  1~4개 정육면체 단계별 조립·회전·투상도·전개도 미니게임
                </p>
              </div>

              <div
                onClick={() => {
                  AudioEngine.playClick();
                  setActiveTab('encyclopedia');
                }}
                className="bg-gradient-to-br from-amber-400 to-yellow-300 rounded-3xl p-6 border-4 border-yellow-200 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer space-y-3 text-purple-950 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-950/20 text-purple-950 flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-black text-xl text-purple-950">
                  3D 입체 박물관
                </h3>
                <p className="text-xs text-purple-900 font-bold leading-relaxed">
                  12가지 입체도형 360도 관찰 및 면·모서리·꼭짓점 특성 정밀 탐구
                </p>
              </div>

              <div
                onClick={() => {
                  AudioEngine.playClick();
                  setActiveTab('leaderboard');
                }}
                className="bg-gradient-to-br from-purple-800 to-indigo-700 rounded-3xl p-6 border-4 border-purple-500 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform">
                  <Trophy className="w-6 h-6 text-yellow-300" />
                </div>
                <h3 className="font-black text-xl text-white">
                  명예의 전당
                </h3>
                <p className="text-xs text-purple-200 font-bold leading-relaxed">
                  학급 및 전교 큐브 에너지 순위 경쟁 & 전설의 마스터 배지
                </p>
              </div>

              <div
                onClick={() => {
                  AudioEngine.playClick();
                  setActiveTab('teacher');
                }}
                className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-3xl p-6 border-4 border-emerald-400 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="font-black text-xl text-white">
                  교사 모드 & 리포트
                </h3>
                <p className="text-xs text-emerald-100 font-bold leading-relaxed">
                  학생 성취도 대시보드 관리, PDF 인쇄 및 CSV 출력
                </p>
              </div>

            </div>
          </div>
        )}

        {/* 3. Stage Map View */}
        {!activeGame && activeTab === 'stages' && <StageMap onSelectGame={handleLaunchGame} />}

        {/* 4. Encyclopedia View */}
        {!activeGame && activeTab === 'encyclopedia' && <CubeCodex />}

        {/* 5. Leaderboard View */}
        {!activeGame && activeTab === 'leaderboard' && <Leaderboard />}

        {/* 6. Teacher Dashboard View */}
        {!activeGame && activeTab === 'teacher' && <TeacherDashboard />}

        {/* 7. Settings View */}
        {!activeGame && activeTab === 'settings' && (
          <SettingsModal
            soundMuted={soundMuted}
            setSoundMuted={setSoundMuted}
            onReset={() => {
              refreshUser();
              setActiveTab('home');
            }}
          />
        )}

      </main>

      {/* AI Tutor Modal */}
      {showAIModal && (
        <AITutorModal
          user={user}
          onClose={() => setShowAIModal(false)}
          onSelectGame={handleLaunchGame}
        />
      )}

      {/* Auth Modal (Switch User / Google / Anonymous) */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onUserUpdate={(u) => setUser(u)}
        />
      )}

      {/* Footer Bar */}
      <footer className="bg-purple-900 border-t border-purple-800 py-6 mt-auto relative z-10 text-purple-200">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs font-bold flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>🧊 큐브앤 (CubeN.show) - Easy & Fun 초등 6학년 공간지각 3D 학습 플랫폼</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-yellow-400" />
            <span>Firebase Auth & Cloud Firestore 동기화</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
