import React, { useState } from 'react';
import { NavTab } from '../types';
import { CUBE_SHAPES } from '../data/cubeShapes';
import { CubeViewer3D } from './3d/CubeViewer3D';
import { AudioEngine } from '../services/audioEngine';
import { Play, Sparkles, Trophy, BookOpen, GraduationCap, Flame, ArrowRight, Star, Compass } from 'lucide-react';

interface ThemeParkMapProps {
  onNavigate: (tab: NavTab) => void;
  onOpenAIModal: () => void;
  onOpenAuthModal: () => void;
}

export const ThemeParkMap: React.FC<ThemeParkMapProps> = ({
  onNavigate,
  onOpenAIModal,
  onOpenAuthModal
}) => {
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);
  const [warpingId, setWarpingId] = useState<string | null>(null);

  const handleAttractionClick = (tab: NavTab, attractionId: string) => {
    AudioEngine.playWarpSwoosh();
    setWarpingId(attractionId);

    // Dynamic 3D Warp Transition delay
    setTimeout(() => {
      setWarpingId(null);
      onNavigate(tab);
    }, 450);
  };

  return (
    <div className="space-y-12 pb-16 relative z-10">
      
      {/* 1. Theme Park Grand Welcome Banner */}
      <div className="relative rounded-3xl p-8 sm:p-12 text-white shadow-2xl overflow-hidden border-4 border-amber-300/40 bg-gradient-to-r from-blue-700 via-indigo-600 to-emerald-500">
        {/* Animated carnival spotlights & floating stars */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-400/20 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="bg-amber-400 text-slate-900 px-4 py-1.5 rounded-full text-xs font-black inline-flex items-center gap-1.5 shadow-lg shadow-amber-400/30 animate-bounce">
                <Flame className="w-4 h-4 text-orange-600 fill-orange-500" />
                <span>🎡 큐브 월드 테마파크에 오신 것을 환영합니다!</span>
              </span>
              <button
                onClick={onOpenAuthModal}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-white border border-white/30 transition-all hover:scale-105"
              >
                🔑 연구원 로그인
              </button>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight drop-shadow-md">
              3D 큐브 어드벤처 <br />
              <span className="text-amber-300 font-black text-2xl sm:text-3xl">공간 감각 테마파크 월드</span>
            </h1>

            <p className="text-sm sm:text-base font-medium text-blue-50 leading-relaxed">
              원하는 어트랙션 관에 입장해보세요! 3D 큐브 미니게임 탐험, 백과사전 관람, 마스터 아레나 랭킹전이 기다립니다.
            </p>

            <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
              <button
                onClick={() => handleAttractionClick('stages', 'attraction_stages')}
                className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-black px-8 py-4 rounded-2xl shadow-xl shadow-amber-400/30 text-lg flex items-center gap-2 transition-transform hover:scale-105"
              >
                <Play className="w-5 h-5 fill-slate-900" />
                <span>테마파크 어트랙션 입장! 🎡</span>
              </button>
            </div>
          </div>

          {/* 3D Spinning Attraction Visualizer */}
          <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-3xl bg-gradient-to-tr from-white/25 via-white/10 to-transparent backdrop-blur-md border-2 border-white/40 flex flex-col items-center justify-center shadow-2xl shrink-0 group hover:rotate-3 transition-all relative">
            <span className="text-8xl filter drop-shadow-2xl animate-bounce-slow">🎡</span>
            <span className="text-xs font-black text-slate-900 bg-amber-300 px-4 py-1.5 rounded-full shadow-md mt-2">
              DYNAMIC 3D WORLD
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Theme Park Attraction Cards (Dynamic 3D Hover & Warp Effect) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Compass className="w-6 h-6 text-blue-600 animate-spin-slow" />
            <span>어트랙션 존 선택하기 (클릭하여 입장)</span>
          </h2>
          <span className="text-xs font-bold text-slate-400">
            마우스를 올리면 3D 틸트 및 인터랙티브 효과가 실행됩니다
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Attraction 1: Stages Ride */}
          <div
            onMouseEnter={() => setActiveHoverId('stages')}
            onMouseLeave={() => setActiveHoverId(null)}
            onClick={() => handleAttractionClick('stages', 'stages')}
            className={`relative bg-gradient-to-br from-white via-blue-50/50 to-sky-100 rounded-3xl p-7 border-4 transition-all cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 group ${
              warpingId === 'stages'
                ? 'scale-110 opacity-30 ring-8 ring-blue-400 transition-all duration-300'
                : 'border-blue-400/80 hover:border-blue-500'
            }`}
          >
            <div className="absolute top-0 right-0 bg-blue-600 text-white font-black text-xs px-4 py-1.5 rounded-bl-2xl shadow-md">
              ATTRACTION ZONE 1
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3 max-w-xs">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-600/30 group-hover:rotate-12 transition-transform">
                  🎡
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 group-hover:text-blue-600 transition-colors">
                    큐브 어드벤처 코스
                  </h3>
                  <p className="text-xs font-bold text-slate-500 mt-1 leading-relaxed">
                    1~4개 정육면체 4단계 라이드! 조립, 회전, 투상도, 전개도 미니게임 탐험
                  </p>
                </div>
              </div>

              {/* 3D Interactive Preview Box */}
              <div className="w-32 h-32 shrink-0 rounded-2xl bg-white p-2 border-2 border-blue-200 shadow-inner group-hover:scale-105 transition-transform">
                <CubeViewer3D cubes={CUBE_SHAPES[3].cubes} height={110} autoRotate={true} interactive={false} />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-blue-200/60">
              <span className="text-xs font-black text-blue-700 bg-blue-100/80 px-3 py-1 rounded-full">
                🔥 5개 미니게임 & 최종시험
              </span>
              <div className="flex items-center gap-1 font-black text-sm text-blue-600 group-hover:translate-x-2 transition-transform">
                <span>입장하기</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Attraction 2: 3D Museum Codex */}
          <div
            onMouseEnter={() => setActiveHoverId('encyclopedia')}
            onMouseLeave={() => setActiveHoverId(null)}
            onClick={() => handleAttractionClick('encyclopedia', 'encyclopedia')}
            className={`relative bg-gradient-to-br from-white via-cyan-50/50 to-teal-100 rounded-3xl p-7 border-4 transition-all cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 group ${
              warpingId === 'encyclopedia'
                ? 'scale-110 opacity-30 ring-8 ring-cyan-400 transition-all duration-300'
                : 'border-cyan-400/80 hover:border-cyan-500'
            }`}
          >
            <div className="absolute top-0 right-0 bg-cyan-600 text-white font-black text-xs px-4 py-1.5 rounded-bl-2xl shadow-md">
              ATTRACTION ZONE 2
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3 max-w-xs">
                <div className="w-14 h-14 rounded-2xl bg-cyan-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-cyan-600/30 group-hover:rotate-12 transition-transform">
                  🏛️
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 group-hover:text-cyan-600 transition-colors">
                    3D 입체도형 박물관
                  </h3>
                  <p className="text-xs font-bold text-slate-500 mt-1 leading-relaxed">
                    12가지 입체도형의 360도 회전 뷰어 및 면·모서리·꼭짓점 특성 정밀 탐구
                  </p>
                </div>
              </div>

              <div className="w-32 h-32 shrink-0 rounded-2xl bg-white p-2 border-2 border-cyan-200 shadow-inner group-hover:scale-105 transition-transform">
                <CubeViewer3D cubes={CUBE_SHAPES[9].cubes} height={110} autoRotate={true} interactive={false} />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-cyan-200/60">
              <span className="text-xs font-black text-cyan-700 bg-cyan-100/80 px-3 py-1 rounded-full">
                📜 12종 입체 해금 도감
              </span>
              <div className="flex items-center gap-1 font-black text-sm text-cyan-600 group-hover:translate-x-2 transition-transform">
                <span>관람하기</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Attraction 3: Hall of Fame Arena */}
          <div
            onMouseEnter={() => setActiveHoverId('leaderboard')}
            onMouseLeave={() => setActiveHoverId(null)}
            onClick={() => handleAttractionClick('leaderboard', 'leaderboard')}
            className={`relative bg-gradient-to-br from-white via-amber-50/50 to-yellow-100 rounded-3xl p-7 border-4 transition-all cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 group ${
              warpingId === 'leaderboard'
                ? 'scale-110 opacity-30 ring-8 ring-amber-400 transition-all duration-300'
                : 'border-amber-400/80 hover:border-amber-500'
            }`}
          >
            <div className="absolute top-0 right-0 bg-amber-500 text-slate-900 font-black text-xs px-4 py-1.5 rounded-bl-2xl shadow-md">
              ATTRACTION ZONE 3
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3 max-w-xs">
                <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-900 flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-500/30 group-hover:rotate-12 transition-transform">
                  👑
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 group-hover:text-amber-600 transition-colors">
                    마스터 랭킹 아레나
                  </h3>
                  <p className="text-xs font-bold text-slate-500 mt-1 leading-relaxed">
                    전교 및 학급 큐브 에너지 순위 경쟁 & 전설의 마스터 배지 수여!
                  </p>
                </div>
              </div>

              <div className="w-32 h-32 shrink-0 rounded-2xl bg-white p-2 border-2 border-amber-200 shadow-inner flex items-center justify-center group-hover:scale-105 transition-transform">
                <Trophy className="w-16 h-16 text-amber-500 animate-bounce-slow" />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-amber-200/60">
              <span className="text-xs font-black text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full">
                🏆 명예의 전당 랭킹
              </span>
              <div className="flex items-center gap-1 font-black text-sm text-amber-600 group-hover:translate-x-2 transition-transform">
                <span>입장하기</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Attraction 4: Teacher Control Hub */}
          <div
            onMouseEnter={() => setActiveHoverId('teacher')}
            onMouseLeave={() => setActiveHoverId(null)}
            onClick={() => handleAttractionClick('teacher', 'teacher')}
            className={`relative bg-gradient-to-br from-white via-emerald-50/50 to-teal-100 rounded-3xl p-7 border-4 transition-all cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 group ${
              warpingId === 'teacher'
                ? 'scale-110 opacity-30 ring-8 ring-emerald-400 transition-all duration-300'
                : 'border-emerald-400/80 hover:border-emerald-500'
            }`}
          >
            <div className="absolute top-0 right-0 bg-emerald-600 text-white font-black text-xs px-4 py-1.5 rounded-bl-2xl shadow-md">
              ATTRACTION ZONE 4
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3 max-w-xs">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-600/30 group-hover:rotate-12 transition-transform">
                  👩‍🏫
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 group-hover:text-emerald-600 transition-colors">
                    교사 연구소 센터
                  </h3>
                  <p className="text-xs font-bold text-slate-500 mt-1 leading-relaxed">
                    학급 학생 대시보드 관리, AI 취약 분석, PDF 리포트 및 CSV 출력
                  </p>
                </div>
              </div>

              <div className="w-32 h-32 shrink-0 rounded-2xl bg-white p-2 border-2 border-emerald-200 shadow-inner flex items-center justify-center group-hover:scale-105 transition-transform">
                <GraduationCap className="w-16 h-16 text-emerald-600" />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-emerald-200/60">
              <span className="text-xs font-black text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full">
                📄 PDF / CSV 내보내기
              </span>
              <div className="flex items-center gap-1 font-black text-sm text-emerald-600 group-hover:translate-x-2 transition-transform">
                <span>관리하기</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* AI Tutor Secret Lab Quick Access Banner */}
      <div
        onClick={onOpenAIModal}
        className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:scale-[1.01] transition-transform border-4 border-amber-300"
      >
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-white text-slate-900 flex items-center justify-center text-3xl font-black shadow-lg shrink-0">
            🤖
          </div>
          <div>
            <span className="bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full text-xs font-black text-white">
              AI 공간지각 진단 연구소
            </span>
            <h3 className="text-xl sm:text-2xl font-black mt-1">
              AI 공간지각 조수의 오답 분석 & 맞춤 퀴즈 추천!
            </h3>
            <p className="text-xs text-amber-100 font-medium">
              내가 틀린 전개도, 회전, 투상도 문제를 분석해 AI가 1:1 맞춤 연습 코스를 추천해드립니다.
            </p>
          </div>
        </div>

        <button className="bg-white text-slate-900 font-black px-6 py-3.5 rounded-2xl shadow-md text-sm shrink-0 hover:bg-amber-100">
          AI 분석 실행 🚀
        </button>
      </div>

    </div>
  );
};
