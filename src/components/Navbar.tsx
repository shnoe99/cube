import React from 'react';
import { NavTab, UserProfile } from '../types';
import { Box, BookOpen, Trophy, GraduationCap, Settings, Zap, Volume2, VolumeX, Sparkles, LogIn, UserCheck } from 'lucide-react';
import { AudioEngine } from '../services/audioEngine';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  user: UserProfile;
  onOpenAIModal: () => void;
  onOpenAuthModal: () => void;
  soundMuted: boolean;
  setSoundMuted: (muted: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAIModal,
  onOpenAuthModal,
  soundMuted,
  setSoundMuted
}) => {
  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    AudioEngine.muted = next;
    if (!next) AudioEngine.playClick();
  };

  const handleTabClick = (tab: NavTab) => {
    AudioEngine.playClick();
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-2 border-blue-500/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand with 3D Cube Theme */}
          <div
            onClick={() => handleTabClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-emerald-400 p-0.5 shadow-md shadow-blue-500/20 group-hover:rotate-6 transition-transform">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-xl">
                🧊
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                  큐브 마스터 연구소
                </span>
                <span className="text-[10px] font-extrabold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full border border-blue-200">
                  CUBE 3D
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-400 hidden sm:block">
                초등 6학년 공간지각 챌린지
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => handleTabClick('stages')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-extrabold text-sm transition-all ${
                activeTab === 'stages'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>스테이지</span>
            </button>

            <button
              onClick={() => handleTabClick('encyclopedia')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-extrabold text-sm transition-all ${
                activeTab === 'encyclopedia'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20 scale-105'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>도감</span>
            </button>

            <button
              onClick={() => handleTabClick('leaderboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-extrabold text-sm transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 scale-105'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>명예의 전당</span>
            </button>

            <button
              onClick={() => handleTabClick('teacher')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-extrabold text-sm transition-all ${
                activeTab === 'teacher'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 scale-105'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>교사 모드</span>
            </button>
          </nav>

          {/* User Controls & Auth Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Tutor Button */}
            <button
              onClick={onOpenAIModal}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-900 px-3 py-1.5 rounded-full font-black text-xs shadow-md shadow-amber-400/20 hover:scale-105 transition-transform"
            >
              <Sparkles className="w-3.5 h-3.5 fill-slate-900 text-slate-900 animate-spin-slow" />
              <span>AI 조수</span>
            </button>

            {/* Energy Badge */}
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full shadow-inner">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-extrabold text-xs sm:text-sm text-amber-700">
                {user.energy} <span className="hidden sm:inline text-[10px] font-bold text-amber-500">⚡</span>
              </span>
            </div>

            {/* Auth Login Trigger Button */}
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 hover:bg-blue-100/80 px-3 py-1.5 rounded-full text-xs font-black text-blue-700 transition-colors shadow-sm"
              title="구글 로그인 또는 익명 로그인"
            >
              {user.uid.startsWith('google') ? (
                <UserCheck className="w-4 h-4 text-emerald-600" />
              ) : (
                <LogIn className="w-4 h-4 text-blue-600" />
              )}
              <span className="max-w-[80px] sm:max-w-[100px] truncate">{user.name}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title={soundMuted ? '음소거 해제' : '음소거'}
            >
              {soundMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5 text-blue-600" />}
            </button>

            {/* Settings */}
            <button
              onClick={() => handleTabClick('settings')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="환경설정"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Sub Nav */}
      <div className="md:hidden flex items-center justify-around bg-slate-100/90 py-2 border-t border-slate-200 text-xs font-bold">
        <button
          onClick={() => handleTabClick('stages')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'stages' ? 'text-blue-600 font-black' : 'text-slate-500'}`}
        >
          <Box className="w-4 h-4" />
          <span>스테이지</span>
        </button>
        <button
          onClick={() => handleTabClick('encyclopedia')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'encyclopedia' ? 'text-cyan-600 font-black' : 'text-slate-500'}`}
        >
          <BookOpen className="w-4 h-4" />
          <span>도감</span>
        </button>
        <button
          onClick={() => handleTabClick('leaderboard')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'leaderboard' ? 'text-amber-500 font-black' : 'text-slate-500'}`}
        >
          <Trophy className="w-4 h-4" />
          <span>명예의 전당</span>
        </button>
        <button
          onClick={() => handleTabClick('teacher')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'teacher' ? 'text-emerald-600 font-black' : 'text-slate-500'}`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>교사모드</span>
        </button>
      </div>
    </header>
  );
};
