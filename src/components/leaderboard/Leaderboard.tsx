import React, { useState } from 'react';
import { StorageService } from '../../services/storageService';
import { AudioEngine } from '../../services/audioEngine';
import { Trophy, Medal, Zap, Award, Sparkles, Users } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  className: string;
  score: number;
  energy: number;
  badge: string;
}

export const Leaderboard: React.FC = () => {
  const [filterClass, setFilterClass] = useState<'all' | 'myClass'>('all');
  const currentUser = StorageService.getUserProfile();

  const mockLeaderboard: LeaderboardEntry[] = [
    { rank: 1, name: '김우주', className: '6학년 1반', score: 100, energy: 850, badge: '큐브 마스터 🏆' },
    { rank: 2, name: '이공간', className: '6학년 1반', score: 95, energy: 720, badge: '공간지각 천재 🌟' },
    { rank: 3, name: '박삼차원', className: '6학년 2반', score: 90, energy: 680, badge: '큐브 탐험가 🚀' },
    { rank: 4, name: currentUser.name, className: currentUser.className, score: currentUser.highScore, energy: currentUser.energy, badge: currentUser.badges[0] || '새내기 연구원' },
    { rank: 5, name: '최도형', className: '6학년 1반', score: 80, energy: 410, badge: '큐브 탐험가' },
    { rank: 6, name: '정전개', className: '6학년 3반', score: 75, energy: 350, badge: '새내기 연구원' }
  ].sort((a, b) => b.energy - a.energy).map((item, idx) => ({ ...item, rank: idx + 1 }));

  const displayedEntries = filterClass === 'myClass'
    ? mockLeaderboard.filter(e => e.className === currentUser.className)
    : mockLeaderboard;

  const handleFilterChange = (f: 'all' | 'myClass') => {
    AudioEngine.playClick();
    setFilterClass(f);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Title Card */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black inline-flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>큐브 연구소 명예의 전당</span>
          </span>
          <h1 className="text-3xl font-black">
            전교 & 학급 큐브 마스터 랭킹 🏆
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 font-medium">
            최고 점수와 큐브 에너지를 쌓아 큐브 마스터 전설의 자리에 도전하세요!
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0">
          <div className="text-xs font-bold text-amber-100">내 현재 순위</div>
          <div className="text-3xl font-black mt-1">
            {mockLeaderboard.find(e => e.name === currentUser.name)?.rank || 4}위
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => handleFilterChange('all')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-extrabold text-sm transition-all ${
            filterClass === 'all'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 scale-105'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>학교 전체 순위</span>
        </button>
        <button
          onClick={() => handleFilterChange('myClass')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-extrabold text-sm transition-all ${
            filterClass === 'myClass'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 scale-105'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>우리 학급({currentUser.className}) 순위</span>
        </button>
      </div>

      {/* Roster Ranking Table Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-4">
        <div className="space-y-3">
          {displayedEntries.map((entry) => {
            const isMe = entry.name === currentUser.name;
            let rankBadge = <span className="font-extrabold text-slate-400 text-lg w-8 text-center">{entry.rank}</span>;

            if (entry.rank === 1) {
              rankBadge = <Medal className="w-8 h-8 text-amber-500 fill-amber-300 shrink-0" />;
            } else if (entry.rank === 2) {
              rankBadge = <Medal className="w-8 h-8 text-slate-400 fill-slate-200 shrink-0" />;
            } else if (entry.rank === 3) {
              rankBadge = <Medal className="w-8 h-8 text-amber-700 fill-amber-200 shrink-0" />;
            }

            return (
              <div
                key={entry.rank}
                className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                  isMe
                    ? 'border-amber-400 bg-amber-50/60 shadow-md ring-2 ring-amber-300'
                    : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center gap-4">
                  {rankBadge}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-base text-slate-800">
                        {entry.name} {isMe && <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">(나)</span>}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {entry.className}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Award className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-xs font-bold text-slate-600">{entry.badge}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    <div className="flex items-center gap-1 font-black text-amber-600 text-sm">
                      <Zap className="w-4 h-4 fill-amber-500" />
                      <span>{entry.energy} 에너지</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-400">
                      최고점수: {entry.score}점
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
