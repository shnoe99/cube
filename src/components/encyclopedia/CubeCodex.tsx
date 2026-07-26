import React, { useState } from 'react';
import { CUBE_SHAPES } from '../../data/cubeShapes';
import { CubeViewer3D } from '../3d/CubeViewer3D';
import { AudioEngine } from '../../services/audioEngine';
import { BookOpen, Sparkles, Box, Lock, CheckCircle2, ChevronRight, Eye } from 'lucide-react';

export const CubeCodex: React.FC = () => {
  const [selectedShapeId, setSelectedShapeId] = useState<string>(CUBE_SHAPES[0].id);
  const [activeStageFilter, setActiveStageFilter] = useState<number | 'all'>('all');

  const selectedShape = CUBE_SHAPES.find(s => s.id === selectedShapeId) || CUBE_SHAPES[0];

  const filteredShapes = activeStageFilter === 'all'
    ? CUBE_SHAPES
    : CUBE_SHAPES.filter(s => s.stage === activeStageFilter);

  return (
    <div className="space-y-8 pb-12 pt-2">
      
      {/* QuizN Style Header */}
      <div className="bg-purple-900 rounded-3xl p-8 border-4 border-yellow-400 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-purple-950 px-3.5 py-1 rounded-full text-xs font-black">
            <BookOpen className="w-4 h-4" />
            <span>3D 큐브 입체 박물관</span>
          </div>
          <h2 className="text-3xl font-black text-yellow-300">
            12가지 폴리큐브 백과사전
          </h2>
          <p className="text-xs text-purple-200 font-bold">
            정육면체 1~4개로 만들어지는 12개 입체도형의 3D 구조와 면·모서리·꼭짓점 성질 탐구
          </p>
        </div>

        {/* Stage Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-purple-950 p-2 rounded-2xl border border-purple-700">
          <button
            onClick={() => {
              AudioEngine.playClick();
              setActiveStageFilter('all');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              activeStageFilter === 'all'
                ? 'bg-yellow-400 text-purple-950 shadow-md'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            전체 (12종)
          </button>
          {[1, 2, 3, 4].map(s => (
            <button
              key={s}
              onClick={() => {
                AudioEngine.playClick();
                setActiveStageFilter(s);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeStageFilter === s
                  ? 'bg-yellow-400 text-purple-950 shadow-md'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              Stage {s}
            </button>
          ))}
        </div>
      </div>

      {/* Main Codex Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Shape List */}
        <div className="bg-purple-900 rounded-3xl p-6 border-4 border-purple-700 shadow-xl space-y-3">
          <h3 className="font-black text-lg text-yellow-300 border-b border-purple-800 pb-3 flex items-center justify-between">
            <span>도형 도감 목록</span>
            <span className="text-xs text-purple-300">{filteredShapes.length}개 도형</span>
          </h3>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredShapes.map(shape => {
              const isSelected = shape.id === selectedShapeId;
              return (
                <div
                  key={shape.id}
                  onClick={() => {
                    AudioEngine.playClick();
                    setSelectedShapeId(shape.id);
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? 'bg-yellow-400 text-purple-950 border-white font-black shadow-lg scale-[1.02]'
                      : 'bg-purple-950/80 text-white border-purple-800 hover:border-purple-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                      isSelected ? 'bg-purple-950 text-yellow-300' : 'bg-purple-800 text-yellow-400'
                    }`}>
                      {shape.cubeCount}
                    </div>
                    <div>
                      <div className="text-sm font-black">{shape.name}</div>
                      <div className={`text-[11px] font-bold ${isSelected ? 'text-purple-900' : 'text-purple-400'}`}>
                        Stage {shape.stage} · {shape.cubeCount}큐브
                      </div>
                    </div>
                  </div>

                  <ChevronRight className={`w-5 h-5 ${isSelected ? 'text-purple-950' : 'text-purple-500'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 3D Interactive Detail Viewer */}
        <div className="lg:col-span-2 bg-purple-900 rounded-3xl p-6 sm:p-8 border-4 border-yellow-400 text-white shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="bg-yellow-400 text-purple-950 font-black text-xs px-3 py-1 rounded-full">
                STAGE {selectedShape.stage} · {selectedShape.cubeCount}개 정육면체
              </span>
              <h3 className="text-3xl font-black text-yellow-300 mt-2">
                {selectedShape.name}
              </h3>
            </div>
            <span className="text-xs text-purple-300 font-bold bg-purple-950 px-3 py-1.5 rounded-full border border-purple-700">
              360° 마우스/터치 회전 뷰어
            </span>
          </div>

          {/* 3D Canvas Box */}
          <div className="w-full h-72 bg-purple-950 rounded-2xl border-4 border-purple-700 shadow-inner relative overflow-hidden">
            <CubeViewer3D cubes={selectedShape.cubes} height={280} autoRotate={true} />
          </div>

          {/* Shape Math Features Card */}
          <div className="grid grid-cols-3 gap-4 bg-purple-950 p-4 rounded-2xl border-2 border-purple-700 text-center">
            <div>
              <div className="text-xs text-purple-400 font-bold">겉면의 수 (면)</div>
              <div className="text-2xl font-black text-yellow-300 mt-1">{selectedShape.faces || selectedShape.features?.faces || 18}개</div>
            </div>
            <div>
              <div className="text-xs text-purple-400 font-bold">모서리의 수</div>
              <div className="text-2xl font-black text-cyan-300 mt-1">{selectedShape.edges || selectedShape.features?.edges || 36}개</div>
            </div>
            <div>
              <div className="text-xs text-purple-400 font-bold">꼭짓점의 수</div>
              <div className="text-2xl font-black text-emerald-300 mt-1">{selectedShape.vertices || selectedShape.features?.vertices || 20}개</div>
            </div>
          </div>

          <div className="bg-purple-950 p-5 rounded-2xl border border-purple-700 space-y-2">
            <h4 className="font-black text-sm text-yellow-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>공간 수학 해설</span>
            </h4>
            <p className="text-xs text-purple-100 font-medium leading-relaxed">
              {selectedShape.description}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
