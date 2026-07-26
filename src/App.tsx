import { useState, useEffect } from 'react';
import { NavTab, UserProfile } from './types';
import { StorageService } from './services/storageService';
import { AudioEngine } from './services/audioEngine';
import { AuthService } from './services/firebase';
import { Navbar } from './components/Navbar';
import { ThemeParkBackground } from './components/theme/ThemeParkBackground';
import { ThemeParkMap } from './components/ThemeParkMap';
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

import { ShieldCheck } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-cyan-200 selection:text-cyan-900 relative overflow-x-hidden">
      
      {/* 3D Theme Park Animated Background Canvas */}
      <ThemeParkBackground />

      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(t) => {
          setActiveGame(null);
          setActiveTab(t);
        }}
        user={user}
        onOpenAIModal={() => setShowAIModal(true)}
        onOpenAuthModal={() => setShowAuthModal(true)}
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

        {/* 2. Theme Park Main World Map View */}
        {!activeGame && activeTab === 'home' && (
          <ThemeParkMap
            onNavigate={(t) => {
              setActiveGame(null);
              setActiveTab(t);
            }}
            onOpenAIModal={() => setShowAIModal(true)}
            onOpenAuthModal={() => setShowAuthModal(true)}
          />
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

      {/* Auth Modal (Google & Anonymous Login) */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onUserUpdate={(u) => setUser(u)}
        />
      )}

      {/* Footer Bar */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-slate-200 py-6 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs font-semibold text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>🧊 큐브 월드 테마파크 (Cube World Theme Park) - 초등학교 6학년 공간감각 3D 어드벤처</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Firebase Auth & LocalStorage 오프라인 동기화 지원</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
