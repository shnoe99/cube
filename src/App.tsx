import { useState, useEffect } from 'react';
import { NavTab, UserProfile } from './types';
import { StorageService } from './services/storageService';
import { AudioEngine } from './services/audioEngine';
import { AuthService } from './services/firebase';

import { QuizNHeader } from './components/quizn/QuizNHeader';
import { QuizNPinJoin } from './components/quizn/QuizNPinJoin';
import { QuizNHostDashboard } from './components/quizn/QuizNHostDashboard';

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

import { KeyRound, Play, Sparkles, Trophy, BookOpen, GraduationCap, Flame, ArrowRight, ShieldCheck, Box } from 'lucide-react';
import { CUBE_SHAPES } from './data/cubeShapes';
import { CubeViewer3D } from './components/3d/CubeViewer3D';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [activeGame, setActiveGame] = useState<'assembly' | 'rotation' | 'ortho' | 'net' | 'final' | null>(null);
  const [user, setUser] = useState<UserProfile>(() => StorageService.getUserProfile());
  const [showAIModal, setShowAIModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [targetPin, setTargetPin] = useState('');

  useEffect(() => {
    // Listen to Firebase Auth changes
    const unsubscribe = AuthService.onAuthChange((fbUser) => {
      if (fbUser) {
        const profile = StorageService.getUserProfile();
        profile.uid = fbUser.uid;
        if (fbUser.displayName) profile.name = fbUser.displayName;
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

  const handleJoinPinCode = (pin: string) => {
    setTargetPin(pin);
    setActiveGame(null);
    setActiveTab('pin-join');
  };

  return (
    <div className="min-h-screen bg-purple-950 text-slate-100 flex flex-col font-sans selection:bg-yellow-300 selection:text-purple-950 relative">
      
      {/* QuizN Style Top Header Navigation */}
      <QuizNHeader
        activeTab={activeTab}
        setActiveTab={(t) => {
          setActiveGame(null);
          setActiveTab(t);
        }}
        user={user}
        onJoinPin={handleJoinPinCode}
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

        {/* 2. QuizN Style Home Main Hero */}
        {!activeGame && activeTab === 'home' && (
          <div className="space-y-10 pb-16">
            
            {/* QuizN Grand Game Show Hero Card */}
            <div className="bg-gradient-to-br from-purple-800 via-indigo-900 to-purple-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl border-4 border-yellow-400 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

              <div className="space-y-4 max-w-xl text-center md:text-left z-10">
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="bg-yellow-400 text-purple-950 px-4 py-1.5 rounded-full text-xs font-black inline-flex items-center gap-1.5 shadow-lg shadow-yellow-400/20 animate-bounce">
                    <Flame className="w-4 h-4 text-red-600 fill-red-500" />
                    <span>QuizN.show 스타일 3D 퀴즈쇼 플랫폼</span>
                  </span>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-purple-800 hover:bg-purple-700 border border-purple-500 px-3.5 py-1.5 rounded-full text-xs font-bold text-yellow-300 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>🔑 구글 / 익명 로그인</span>
                  </button>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight drop-shadow-md">
                  Easy & Fun <span className="text-yellow-300">큐브앤 3D</span> <br />
                  <span className="text-cyan-300 font-extrabold text-2xl sm:text-3xl">실시간 공간지각 라이브 퀴즈쇼</span>
                </h1>

                <p className="text-sm sm:text-base font-medium text-purple-100 leading-relaxed">
                  PIN 코드를 입력하고 실시간 3D 입체도형 퀴즈쇼에 참여해보세요! 4가지 색상 카드(▲, ◆, ●, ■)로 정답을 맞추고 최고의 1위 수상대에 올라보세요!
                </p>

                <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
                  <button
                    onClick={() => {
                      AudioEngine.playWarpSwoosh();
                      setActiveTab('pin-join');
                    }}
                    className="bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-purple-950 font-black px-8 py-4 rounded-2xl shadow-xl shadow-yellow-400/30 text-lg flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <KeyRound className="w-5 h-5" />
                    <span>PIN 퀴즈쇼 입장하기! 🚀</span>
                  </button>

                  <button
                    onClick={() => {
                      AudioEngine.playWarpSwoosh();
                      setActiveTab('host-game');
                    }}
                    className="bg-red-600 hover:bg-red-500 text-white font-black px-6 py-4 rounded-2xl border-2 border-red-400 shadow-lg text-base flex items-center gap-2 transition-transform hover:scale-105"
                  >
                    <GraduationCap className="w-5 h-5" />
                    <span>퀴즈쇼 주최하기! 🎤</span>
                  </button>
                </div>
              </div>

              {/* 3D Quiz Show Box Preview */}
              <div className="w-60 h-60 sm:w-72 sm:h-72 rounded-3xl bg-purple-900/90 border-4 border-yellow-400 p-4 shadow-2xl flex flex-col items-center justify-center relative group hover:rotate-3 transition-transform">
                <CubeViewer3D cubes={CUBE_SHAPES[3].cubes} height={160} autoRotate={true} />
                <span className="text-xs font-black text-purple-950 bg-yellow-400 px-4 py-1 rounded-full shadow-md mt-2">
                  12종 3D 폴리큐브 퀴즈
                </span>
              </div>
            </div>

            {/* QuizN Kahoot-Style 4 Color Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Red Card */}
              <div
                onClick={() => {
                  AudioEngine.playClick();
                  setActiveTab('pin-join');
                }}
                className="bg-gradient-to-br from-red-600 to-rose-500 rounded-3xl p-6 border-4 border-red-400 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform">
                  ▲
                </div>
                <h3 className="font-black text-xl text-white">
                  PIN 퀴즈쇼 입장
                </h3>
                <p className="text-xs text-red-100 font-bold leading-relaxed">
                  선생님이 공유한 6자리 PIN 코드로 3D 라이브 퀴즈룸 직행
                </p>
              </div>

              {/* Blue Card */}
              <div
                onClick={() => {
                  AudioEngine.playClick();
                  setActiveTab('stages');
                }}
                className="bg-gradient-to-br from-blue-600 to-sky-500 rounded-3xl p-6 border-4 border-blue-400 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform">
                  ◆
                </div>
                <h3 className="font-black text-xl text-white">
                  3D 싱글 어드벤처
                </h3>
                <p className="text-xs text-blue-100 font-bold leading-relaxed">
                  1~4개 정육면체 단계별 조립·회전·투상도·전개도 미니게임
                </p>
              </div>

              {/* Yellow Card */}
              <div
                onClick={() => {
                  AudioEngine.playClick();
                  setActiveTab('encyclopedia');
                }}
                className="bg-gradient-to-br from-amber-400 to-yellow-300 rounded-3xl p-6 border-4 border-yellow-200 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer space-y-3 text-purple-950 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-950/20 text-purple-950 flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform">
                  ●
                </div>
                <h3 className="font-black text-xl text-purple-950">
                  3D 입체 박물관
                </h3>
                <p className="text-xs text-purple-900 font-bold leading-relaxed">
                  12가지 입체도형 360도 관찰 및 면·모서리·꼭짓점 특성 정밀 탐구
                </p>
              </div>

              {/* Green Card */}
              <div
                onClick={() => {
                  AudioEngine.playClick();
                  setActiveTab('host-game');
                }}
                className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-3xl p-6 border-4 border-emerald-400 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform">
                  ■
                </div>
                <h3 className="font-black text-xl text-white">
                  퀴즈쇼 주최자 라이브
                </h3>
                <p className="text-xs text-emerald-100 font-bold leading-relaxed">
                  선생님 전용 PIN 생성, 학생 닉네임 로스터 관리 & 결과 리포트
                </p>
              </div>

            </div>
          </div>
        )}

        {/* 3. QuizN PIN Join Screen */}
        {!activeGame && activeTab === 'pin-join' && (
          <QuizNPinJoin
            initialPin={targetPin}
            user={user}
            onUserUpdate={(u) => setUser(u)}
            onBackHome={() => setActiveTab('home')}
          />
        )}

        {/* 4. QuizN Host Dashboard Screen */}
        {!activeGame && activeTab === 'host-game' && (
          <QuizNHostDashboard onBackHome={() => setActiveTab('home')} />
        )}

        {/* 5. Stage Map View */}
        {!activeGame && activeTab === 'stages' && <StageMap onSelectGame={handleLaunchGame} />}

        {/* 6. Encyclopedia View */}
        {!activeGame && activeTab === 'encyclopedia' && <CubeCodex />}

        {/* 7. Leaderboard View */}
        {!activeGame && activeTab === 'leaderboard' && <Leaderboard />}

        {/* 8. Teacher Dashboard View */}
        {!activeGame && activeTab === 'teacher' && <TeacherDashboard />}

        {/* 9. Settings View */}
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

      {/* Auth Modal (Google & Anonymous Login) */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onUserUpdate={(u) => setUser(u)}
        />
      )}

      {/* Footer Bar */}
      <footer className="bg-purple-900 border-t border-purple-800 py-6 mt-auto relative z-10 text-purple-200">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs font-bold flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>🧊 큐브앤 (CubeN.show) - Easy & Fun 초등 6학년 공간지각 라이브 퀴즈쇼</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-yellow-400" />
            <span>Firebase Authentication & PIN Live Show System</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
