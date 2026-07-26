import React from 'react';
import { StageId } from '../types';
import { CUBE_SHAPES } from '../data/cubeShapes';
import { CubeViewer3D } from './3d/CubeViewer3D';
import { AudioEngine } from '../services/audioEngine';
import { Play, Sparkles, Box, Compass, RefreshCw, Eye, Grid } from 'lucide-react';

interface StageMapProps {
  onSelectGame: (gameType: 'assembly' | 'rotation' | 'ortho' | 'net' | 'final') => void;
}

export const StageMap: React.FC<StageMapProps> = ({ onSelectGame }) => {
  const stages: Array<{ id: StageId; title: string; desc: string; shapeIds: string[]; color: string }> = [
    {
      id: 1,
      title: 'Stage 1: 정육면체 1개',
      desc: '공간 감각의 첫걸음! 1개 정육면체의 면, 모서리, 꼭짓점 조립 익히기',
      shapeIds: ['cube_1'],
      color: 'from-blue-500 to-sky-400'
    },
    {
      id: 2,
      title: 'Stage 2: 정육면체 2개',
      desc: '2개의 정육면체를 나란히 연결하여 만든 직육면체(도미노 큐브) 탐구',
      shapeIds: ['cube_2_domino'],
      color: 'from-sky-500 to-cyan-400'
    },
    {
      id: 3,
      title: 'Stage 3: 정육면체 3개',
      desc: '일자형과 ㄱ자형 3큐브의 회전 및 투상도 모습 관찰하기',
      shapeIds: ['cube_3_line', 'cube_3_l'],
      color: 'from-cyan-500 to-emerald-400'
    },
    {
      id: 4,
      title: 'Stage 4: 정육면체 4개 (폴리큐브 8종)',
      desc: 'I, O, L, T, S형 평면 테트라큐브 및 입체 L, 입체 T, 꼬인 3D형 정밀 파악',
      shapeIds: [
        'cube_4_i', 'cube_4_o', 'cube_4_l', 'cube_4_t',
        'cube_4_s', 'cube_4_corner_3d', 'cube_4_tripod_3d', 'cube_4_twisted'
      ],
      color: 'from-emerald-500 to-amber-500'
    }
  ];

  const handleLaunch = (gameType: 'assembly' | 'rotation' | 'ortho' | 'net' | 'final') => {
    AudioEngine.playClick();
    onSelectGame(gameType);
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Top Title Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-sky-600 to-emerald-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 text-9xl">🧊</div>
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-white inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>큐브 마스터 탐험 로드맵</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight">
            1개부터 4개 큐브 입체도형을 정복해보자!
          </h1>
          <p className="text-sm font-medium text-blue-100 leading-relaxed">
            스테이지별 입체도형을 3D로 직접 돌려보고 5가지 신나는 미니게임으로 공간감각을 완성해보세요.
          </p>
        </div>
      </div>

      {/* Mini Game Selection Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <Play className="w-5 h-5 text-blue-600 fill-blue-600" />
          <span>신나는 5가지 미니게임 모드 선택</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Game 1: Assembly */}
          <div
            onClick={() => handleLaunch('assembly')}
            className="bg-white rounded-2xl p-5 border-2 border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                <Box className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-800 group-hover:text-blue-600 transition-colors">
                  1. 큐브 조립 미니게임
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  1~4개 정육면체를 결합하여 다양한 3D 폴리큐브 형태로 조립하는 훈련!
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-blue-600">도전하기 (+10 ⚡)</span>
              <Play className="w-4 h-4 text-blue-600 fill-blue-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Game 2: Rotation */}
          <div
            onClick={() => handleLaunch('rotation')}
            className="bg-white rounded-2xl p-5 border-2 border-slate-200 hover:border-cyan-500 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-800 group-hover:text-cyan-600 transition-colors">
                  2. 같은 입체 찾기
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  3D 공간에서 회전된 여러 입체 중 원래 도형과 동일한 모양 판별하기!
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-cyan-600">도전하기 (+10 ⚡)</span>
              <Play className="w-4 h-4 text-cyan-600 fill-cyan-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Game 3: Orthographic */}
          <div
            onClick={() => handleLaunch('ortho')}
            className="bg-white rounded-2xl p-5 border-2 border-slate-200 hover:border-indigo-500 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-800 group-hover:text-indigo-600 transition-colors">
                  3. 앞·옆·위 모습 맞추기
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  3D 입체의 시선 방향에 따른 2D 투상도 격자 모습 매칭 훈련!
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-indigo-600">도전하기 (+10 ⚡)</span>
              <Play className="w-4 h-4 text-indigo-600 fill-indigo-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Game 4: Net */}
          <div
            onClick={() => handleLaunch('net')}
            className="bg-white rounded-2xl p-5 border-2 border-slate-200 hover:border-amber-500 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                <Grid className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-800 group-hover:text-amber-600 transition-colors">
                  4. 전개도 찾기
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  전개도를 접었을 때 겹치는 면 오류를 찾아내고 완성형 전개도 구별하기!
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-amber-600">도전하기 (+10 ⚡)</span>
              <Play className="w-4 h-4 text-amber-600 fill-amber-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Game 5: Final Exam Banner */}
          <div
            onClick={() => handleLaunch('final')}
            className="bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 rounded-2xl p-5 text-white shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all cursor-pointer sm:col-span-2 lg:col-span-2 flex items-center justify-between"
          >
            <div className="space-y-2 max-w-md">
              <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-black inline-flex items-center gap-1">
                🏆 "큐브 마스터" 도전
              </span>
              <h3 className="text-xl font-black">
                5. 최종 시험 (10문제 총괄 테스트)
              </h3>
              <p className="text-xs font-medium text-amber-100">
                조립, 회전, 투상도, 전개도 전 영역 10문제를 풀어 90점 이상으로 "큐브 마스터" 배지를 획득하세요!
              </p>
            </div>
            <button className="bg-white text-slate-900 font-black px-5 py-3 rounded-xl shadow-md text-sm shrink-0 hover:bg-amber-50">
              시험 응시하기
            </button>
          </div>
        </div>
      </div>

      {/* Stages Overview Roadmap */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <Compass className="w-5 h-5 text-emerald-600" />
          <span>Stage 1 ~ Stage 4 큐브 입체도형 도감 미리보기</span>
        </h2>

        <div className="space-y-6">
          {stages.map(st => {
            const shapes = CUBE_SHAPES.filter(s => st.shapeIds.includes(s.id));
            return (
              <div key={st.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-slate-800">{st.title}</h3>
                    <p className="text-xs text-slate-500 font-medium">{st.desc}</p>
                  </div>
                  <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 self-start sm:self-auto">
                    {shapes.length}개 도형 보유
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {shapes.map(sp => (
                    <div key={sp.id} className="bg-slate-50 rounded-2xl p-3 border border-slate-200 text-center flex flex-col items-center gap-2 hover:bg-slate-100/80 transition-colors">
                      <CubeViewer3D cubes={sp.cubes} height={120} autoRotate={false} interactive={false} />
                      <span className="text-xs font-black text-slate-700">{sp.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
