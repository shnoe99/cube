import React, { useState } from 'react';
import { CUBE_SHAPES } from '../../data/cubeShapes';
import { CubeViewer3D } from '../3d/CubeViewer3D';
import { StorageService } from '../../services/storageService';
import { AudioEngine } from '../../services/audioEngine';
import { BookOpen, Lock, Unlock, Eye, Sparkles, CheckCircle2 } from 'lucide-react';

export const CubeCodex: React.FC = () => {
  const user = StorageService.getUserProfile();
  const [selectedShapeId, setSelectedShapeId] = useState<string>(CUBE_SHAPES[0].id);

  const selectedShape = CUBE_SHAPES.find(s => s.id === selectedShapeId) || CUBE_SHAPES[0];
  const isUnlocked = user.unlockedShapeIds.includes(selectedShape.id);

  const handleSelect = (id: string) => {
    AudioEngine.playClick();
    setSelectedShapeId(id);
  };

  const completionPct = Math.round((user.unlockedShapeIds.length / CUBE_SHAPES.length) * 100);

  return (
    <div className="space-y-8 pb-12">
      {/* Title & Completion Progress Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-black text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
            <BookOpen className="w-3.5 h-3.5" />
            <span>큐브 입체도형 백과사전</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800">
            3D 큐브 연구 도감 (Cube Codex)
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500">
            정육면체 1~4개로 만들어지는 12가지 입체도형의 면, 모서리, 꼭짓점 및 공간수학적 성질을 관찰해보세요.
          </p>
        </div>

        {/* Completion Meter */}
        <div className="w-full md:w-64 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-2 shrink-0">
          <div className="flex justify-between items-center text-xs font-extrabold text-slate-600">
            <span>도감 완성률</span>
            <span className="text-cyan-600">{completionPct}% ({user.unlockedShapeIds.length}/{CUBE_SHAPES.length})</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Layout: Left Shape Grid / Right Detail Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 12 Shapes Selection Grid (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200 shadow-md space-y-4">
          <h3 className="font-extrabold text-sm text-slate-700 flex items-center justify-between border-b border-slate-100 pb-3">
            <span>입체도형 도감 목록 (12종)</span>
            <span className="text-xs text-slate-400">클릭하여 3D 관찰</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 max-h-[560px] overflow-y-auto pr-1">
            {CUBE_SHAPES.map(sp => {
              const unlocked = user.unlockedShapeIds.includes(sp.id);
              const isSelected = selectedShapeId === sp.id;

              return (
                <button
                  key={sp.id}
                  onClick={() => handleSelect(sp.id)}
                  className={`p-3 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-2 relative ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-50/80 shadow-md shadow-cyan-500/10'
                      : 'border-slate-200 hover:border-cyan-300 bg-white'
                  }`}
                >
                  {unlocked ? (
                    <span className="absolute top-2 right-2 text-emerald-500">
                      <CheckCircle2 className="w-4 h-4 fill-emerald-100" />
                    </span>
                  ) : (
                    <span className="absolute top-2 right-2 text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                  )}

                  <CubeViewer3D cubes={sp.cubes} height={100} autoRotate={false} interactive={false} />
                  <span className={`text-xs font-black ${isSelected ? 'text-cyan-700' : 'text-slate-700'}`}>
                    {sp.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 3D Interactive Detail Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  Stage {selectedShape.stage} ({selectedShape.cubeCount}개 큐브)
                </span>
                <h2 className="text-2xl font-black text-slate-800 mt-2">
                  {selectedShape.name}
                </h2>
              </div>

              {isUnlocked ? (
                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                  <Unlock className="w-3.5 h-3.5" />
                  <span>연구 완료 (해금됨)</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                  <Lock className="w-3.5 h-3.5" />
                  <span>잠김 (미니게임 풀이 시 해금)</span>
                </span>
              )}
            </div>

            {/* 3D Large Viewer */}
            <div className="relative">
              <CubeViewer3D cubes={selectedShape.cubes} height={280} autoRotate={true} interactive={true} />
              <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-sm text-xs font-extrabold text-slate-600 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-cyan-600" />
                <span>마우스 드래그 360도 회전</span>
              </div>
            </div>

            {/* Geometry Properties Cards */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="text-xs font-bold text-slate-400">겉면의 수 (면)</div>
                <div className="text-xl font-black text-slate-800 mt-1">{selectedShape.features.faces}개</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="text-xs font-bold text-slate-400">모서리 개수</div>
                <div className="text-xl font-black text-slate-800 mt-1">{selectedShape.features.edges}개</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="text-xs font-bold text-slate-400">꼭짓점 개수</div>
                <div className="text-xl font-black text-slate-800 mt-1">{selectedShape.features.vertices}개</div>
              </div>
            </div>

            {/* Math Explanation */}
            <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-200 space-y-2">
              <h4 className="font-black text-sm text-blue-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>공간수학 학습 포인트</span>
              </h4>
              <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                {selectedShape.description}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
