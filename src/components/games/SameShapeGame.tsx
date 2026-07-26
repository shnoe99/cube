import React, { useState } from 'react';
import { CubeViewer3D } from '../3d/CubeViewer3D';
import { CUBE_SHAPES } from '../../data/cubeShapes';
import { AudioEngine } from '../../services/audioEngine';
import { StorageService } from '../../services/storageService';
import { CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SameShapeGameProps {
  onBack: () => void;
  onScoreUpdate: () => void;
}

export const SameShapeGame: React.FC<SameShapeGameProps> = ({ onBack, onScoreUpdate }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const targetShape = CUBE_SHAPES[currentIdx % CUBE_SHAPES.length];

  // Create 4 3D options where 1 is same shape (rotated) and 3 are different
  const optionShapes = [
    { shape: targetShape, isCorrect: true },
    { shape: CUBE_SHAPES[(currentIdx + 1) % CUBE_SHAPES.length], isCorrect: false },
    { shape: CUBE_SHAPES[(currentIdx + 2) % CUBE_SHAPES.length], isCorrect: false },
    { shape: CUBE_SHAPES[(currentIdx + 3) % CUBE_SHAPES.length], isCorrect: false }
  ].sort(() => Math.random() - 0.5);

  const handleSelect = (idx: number, isRight: boolean) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);
    setIsCorrect(isRight);

    StorageService.updateCategoryStats('rotation', isRight);

    if (isRight) {
      AudioEngine.playCorrect();
      StorageService.addEnergy(10);
      onScoreUpdate();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      AudioEngine.playWrong();
      StorageService.recordWrongAnswer({
        id: `rot_${Date.now()}`,
        questionText: `[같은 입체 찾기] ${targetShape.name} 회전 비교`,
        category: 'rotation',
        userChoice: `보기 ${idx + 1}`,
        correctChoice: `정답 보기`,
        explanation: `${targetShape.name}는 3D 공간상에서 회전하더라도 큐브들의 위치 연결 상태가 유지되는 동일한 도형입니다.`,
        timestamp: new Date().toLocaleDateString('ko-KR')
      });
    }
  };

  const handleNext = () => {
    AudioEngine.playClick();
    setSelectedIdx(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setCurrentIdx(prev => prev + 1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Game Header Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 font-bold hover:text-blue-600 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          <span>미니게임 목록</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-cyan-700 bg-cyan-50 px-3 py-1.5 rounded-full border border-cyan-200">
            미니게임 2: 같은 입체 찾기 🔄
          </span>
          <span className="text-xs font-bold text-slate-500">
            문제 {currentIdx + 1}
          </span>
        </div>
      </div>

      {/* Main Game Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            주어진 목표 입체: <span className="text-cyan-600">{targetShape.name}</span>
          </h2>
          <p className="text-sm font-semibold text-slate-500">
            아래 4개 3D 선택지 중에서 **공간상에서 회전시켰을 때 목표 입체와 완전히 동일한 도형**을 찾아보세요!
          </p>
        </div>

        {/* Target Viewer */}
        <div className="flex justify-center">
          <div className="w-full max-w-sm border-2 border-dashed border-cyan-300 rounded-3xl p-4 bg-cyan-50/50 text-center">
            <span className="text-xs font-black text-cyan-700 bg-white px-3 py-1 rounded-full shadow-sm inline-block mb-2">
              🎯 목표 도형
            </span>
            <CubeViewer3D cubes={targetShape.cubes} height={180} autoRotate={true} interactive={true} />
          </div>
        </div>

        {/* 4 3D Options Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {optionShapes.map((opt, idx) => {
            let cardStyle = "border-slate-200 hover:border-cyan-400 bg-white";
            if (isAnswered) {
              if (opt.isCorrect) {
                cardStyle = "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-400";
              } else if (selectedIdx === idx) {
                cardStyle = "border-red-400 bg-red-50";
              } else {
                cardStyle = "opacity-40 border-slate-200 bg-slate-50";
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelect(idx, opt.isCorrect)}
                className={`p-3 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-2 shadow-sm ${cardStyle}`}
              >
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-600">
                  {idx + 1}
                </span>
                <CubeViewer3D cubes={opt.shape.cubes} height={120} autoRotate={false} interactive={false} />
                <span className="text-xs font-bold text-slate-700 mt-1">
                  보기 {idx + 1}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback Section */}
        {isAnswered && (
          <div className={`p-5 rounded-2xl border-2 flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
          }`}>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
              <div>
                <p className="font-extrabold text-base">
                  {isCorrect ? '정답입니다! 3D 회전 감각이 훌륭해요! +10 큐브 에너지 ⚡' : '아쉬워요! 다른 모양이 섞여있었어요.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold px-6 py-3 rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 shrink-0 transition-transform hover:scale-105"
            >
              <span>다음 문제</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
