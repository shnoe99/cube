import React from 'react';
import { NavTab, UserProfile } from '../../types';
import { Sparkles, Trophy, BookOpen, GraduationCap, Box, Volume2, VolumeX, LogOut, Flame } from 'lucide-react';
import { AudioEngine } from '../../services/audioEngine';

interface QuizNHeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  user: UserProfile;
  onOpenAuthModal: () => void;
  onOpenAIModal: () => void;
  soundMuted: boolean;
  setSoundMuted: (muted: boolean) => void;
}

export const QuizNHeader: React.FC<QuizNHeaderProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuthModal,
  onOpenAIModal,
  soundMuted,
  setSoundMuted
}) => {
  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    AudioEngine.muted = next;
    if (!next) AudioEngine.playClick();
  };

  return (
    <header className="sticky top-0 z-50 bg-purple-900 text-white shadow-xl border-b-4 border-yellow-400">
      
      {/* Top Status Bar */}
      <div className="bg-purple-950/90 px-4 py-2 border-b border-purple-800/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-purple-950 font-black px-3 py-0.5 rounded-full text-[11px] flex items-center gap-1 shadow-sm">
              <Flame className="w-3.5 h-3.5 text-red-600 fill-red-500" />
              <span>Easy & Fun QuizN 3D</span>
            </span>
          </div>

          {/* Right User Bar */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAIModal}
              className="bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 px-3 py-1 rounded-full font-black text-xs shadow-md flex items-center gap-1 hover:scale-105 transition-transform"
            >
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              <span>AI 퀴즈 조수</span>
            </button>

            {/* User Profile & Account Switch */}
            <button
              onClick={onOpenAuthModal}
              className="bg-purple-800 hover:bg-purple-700 border border-purple-600 px-3 py-1 rounded-full text-xs font-extrabold text-yellow-300 flex items-center gap-1.5 transition-colors"
              title="계정 관리 및 무작위 전환"
            >
              <span className="text-base">{user.avatar}</span>
              <span className="max-w-[100px] truncate">{user.name}</span>
              <span className="text-[10px] bg-yellow-400 text-purple-950 px-1.5 py-0.2 rounded-full font-black ml-1">
                {user.energy}⚡
              </span>
              <LogOut className="w-3.5 h-3.5 text-purple-300 ml-1" />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="p-1.5 rounded-full bg-purple-800 hover:bg-purple-700 text-purple-200"
              title={soundMuted ? '음소거 해제' : '음소거'}
            >
              {soundMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-yellow-400" />}
            </button>
          </div>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand: QuizN Style */}
          <div
            onClick={() => {
              AudioEngine.playClick();
              setActiveTab('home');
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-yellow-400 via-amber-300 to-orange-400 p-1 shadow-lg shadow-yellow-400/20 group-hover:rotate-6 transition-transform">
              <div className="w-full h-full bg-purple-900 rounded-xl flex items-center justify-center text-2xl font-black text-yellow-300 border border-yellow-400/50">
                🧊
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-2xl tracking-wider text-yellow-300 drop-shadow-md">
                  큐브앤 <span className="text-white text-lg font-bold">QuizN.3D</span>
                </span>
                <span className="bg-red-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full">
                  6학년 공간지각
                </span>
              </div>
              <p className="text-[11px] font-bold text-purple-200 hidden sm:block">
                초등학교 6학년 정육면체 3D 공간감각 학습 플랫폼
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => {
                AudioEngine.playClick();
                setActiveTab('stages');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-sm transition-all ${
                activeTab === 'stages'
                  ? 'bg-yellow-400 text-purple-950 shadow-lg shadow-yellow-400/30 scale-105'
                  : 'text-purple-100 hover:bg-purple-800/80 hover:text-white'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>3D 어드벤처</span>
            </button>

            <button
              onClick={() => {
                AudioEngine.playClick();
                setActiveTab('encyclopedia');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-sm transition-all ${
                activeTab === 'encyclopedia'
                  ? 'bg-cyan-400 text-purple-950 shadow-lg shadow-cyan-400/30 scale-105'
                  : 'text-purple-100 hover:bg-purple-800/80 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>3D 큐브 도감</span>
            </button>

            <button
              onClick={() => {
                AudioEngine.playClick();
                setActiveTab('leaderboard');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-sm transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-amber-400 text-purple-950 shadow-lg shadow-amber-400/30 scale-105'
                  : 'text-purple-100 hover:bg-purple-800/80 hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>명예의 전당</span>
            </button>

            <button
              onClick={() => {
                AudioEngine.playClick();
                setActiveTab('teacher');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-sm transition-all ${
                activeTab === 'teacher'
                  ? 'bg-emerald-400 text-purple-950 shadow-lg shadow-emerald-400/30 scale-105'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>교사 모드 👩‍🏫</span>
            </button>
          </nav>

        </div>
      </div>

      {/* Mobile Sub Nav */}
      <div className="md:hidden flex items-center justify-around bg-purple-950 py-2 border-t border-purple-800 text-xs font-bold">
        <button
          onClick={() => {
            AudioEngine.playClick();
            setActiveTab('stages');
          }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'stages' ? 'text-yellow-300 font-black' : 'text-purple-300'}`}
        >
          <Box className="w-4 h-4" />
          <span>3D 어드벤처</span>
        </button>

        <button
          onClick={() => {
            AudioEngine.playClick();
            setActiveTab('encyclopedia');
          }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'encyclopedia' ? 'text-cyan-300 font-black' : 'text-purple-300'}`}
        >
          <BookOpen className="w-4 h-4" />
          <span>큐브 도감</span>
        </button>

        <button
          onClick={() => {
            AudioEngine.playClick();
            setActiveTab('leaderboard');
          }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'leaderboard' ? 'text-amber-300 font-black' : 'text-purple-300'}`}
        >
          <Trophy className="w-4 h-4" />
          <span>명예의 전당</span>
        </button>

        <button
          onClick={() => {
            AudioEngine.playClick();
            setActiveTab('teacher');
          }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'teacher' ? 'text-emerald-300 font-black' : 'text-purple-300'}`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>교사 모드</span>
        </button>
      </div>

    </header>
  );
};
