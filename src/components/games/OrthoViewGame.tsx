import React, { useState } from 'react';
import { CubeViewer3D } from '../3d/CubeViewer3D';
import { CUBE_SHAPES } from '../../data/cubeShapes';
import { AudioEngine } from '../../services/audioEngine';
import { StorageService } from '../../services/storageService';
import { CheckCircle2, ArrowRight, RotateCcw, Eye, ArrowUp, ArrowRightFromLine } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrthoViewGameProps {
  onBack: () => void;
  onScoreUpdate: () => void;
}

export const OrthoViewGame: React.FC<OrthoViewGameProps> = ({ onBack, onScoreUpdate }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedDirection, setSelectedDirection] = useState<'top' | 'front' | 'side'>('front');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const targetShape = CUBE_SHAPES[currentIdx % CUBE_SHAPES.length];
  const orthoData = targetShape.orthoViews;

  // Options for front/top/side block count & grid representation
  const options = [
    { label: '위(Top) 모습', viewType: 'top', isCorrect: selectedDirection === 'top' },
    { label: '앞(Front) 모습', viewType: 'front', isCorrect: selectedDirection === 'front' },
    { label: '옆(Side) 모습', viewType: 'side', isCorrect: selectedDirection === 'side' }
  ];

  const handleSelect = (idx: number, isRight: boolean) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    setIsCorrect(isRight);

    StorageService.updateCategoryStats('ortho', isRight);

    if (isRight) {
      AudioEngine.playCorrect();
      StorageService.addEnergy(10);
      onScoreUpdate();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      AudioEngine.playWrong();
      StorageService.recordWrongAnswer({
        id: `ortho_${Date.now()}`,
        questionText: `[투상도] ${targetShape.name} 관찰 방향 맞추기`,
        category: 'ortho',
        userChoice: options[idx].label,
        correctChoice: options.find(o => o.isCorrect)?.label || '',
        explanation: `${targetShape.name}의 ${selectedDirection === 'top' ? '위' : selectedDirection === 'front' ? '앞' : '옆'} 모습 투상도입니다.`,
        timestamp: new Date().toLocaleDateString('ko-KR')
      });
    }
  };

  const handleNext = () => {
    AudioEngine.playClick();
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    
    // Pick random direction for next round
    const dirs: Array<'top' | 'front' | 'side'> = ['top', 'front', 'side'];
    setSelectedDirection(dirs[Math.floor(Math.random() * dirs.length)]);
    setCurrentIdx(prev => prev + 1);
  };

  // Render 3x3 Orthographic Grid
  const renderGrid = (grid: boolean[][]) => {
    return (
      <div className="grid grid-cols-3 gap-1 bg-slate-800 p-2 rounded-xl border border-slate-700 shadow-md">
        {grid.flatMap((row, rIdx) =>
          row.map((val, cIdx) => (
            <div
              key={`${rIdx}-${cIdx}`}
              className={`w-8 h-8 rounded-md flex items-center justify-center transition-all ${
                val ? 'bg-gradient-to-tr from-sky-400 to-emerald-400 border border-white/60 shadow-sm' : 'bg-slate-700/50'
              }`}
            >
              {val && <span className="text-[10px] text-slate-900 font-bold">■</span>}
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Game Top Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 font-bold hover:text-blue-600 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          <span>미니게임 목록</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-200">
            미니게임 3: 앞·옆·위 모습 맞추기 👁️
          </span>
          <span className="text-xs font-bold text-slate-500">
            문제 {currentIdx + 1}
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            주어진 투상도 (2D 격자 모습)
          </h2>
          <p className="text-sm font-semibold text-slate-500">
            오른쪽에 표시된 2D 격자 모습이 3D 도형 <span className="text-indigo-600 font-bold">{targetShape.name}</span>을 어느 방향에서 바라본 모습일지 맞혀보세요!
          </p>
        </div>

        {/* 3D Viewer & Target Ortho Grid side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col items-center">
            <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full mb-2">
              🧊 3D 입체도형 ({targetShape.name})
            </span>
            <CubeViewer3D cubes={targetShape.cubes} height={220} autoRotate={true} interactive={true} />
          </div>

          <div className="flex flex-col items-center bg-slate-50 p-6 rounded-3xl border border-slate-200">
            <span className="text-xs font-black text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-200 mb-3 shadow-sm flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              <span>관찰된 2D 모습 (투상도)</span>
            </span>
            {renderGrid(orthoData[selectedDirection])}
            <p className="text-xs font-bold text-slate-400 mt-3">
              (파란색으로 표시된 칸이 눈에 보이는 큐브 면입니다)
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-3 gap-3">
          {options.map((opt, idx) => {
            let btnStyle = "border-slate-200 hover:border-indigo-400 bg-white text-slate-700";
            if (isAnswered) {
              if (opt.isCorrect) {
                btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-400 font-black";
              } else if (selectedOption === idx) {
                btnStyle = "border-red-400 bg-red-50 text-red-700 font-bold";
              } else {
                btnStyle = "opacity-40 border-slate-200 bg-slate-50 text-slate-400";
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelect(idx, opt.isCorrect)}
                className={`p-4 rounded-2xl border-2 text-center font-bold text-sm transition-all shadow-sm flex flex-col items-center gap-1 ${btnStyle}`}
              >
                {opt.viewType === 'top' && <ArrowUp className="w-5 h-5 text-indigo-500" />}
                {opt.viewType === 'front' && <Eye className="w-5 h-5 text-indigo-500" />}
                {opt.viewType === 'side' && <ArrowRightFromLine className="w-5 h-5 text-indigo-500" />}
                <span>{opt.label}</span>
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
                  {isCorrect ? '정답입니다! 위·앞·옆 시각적 공간 감각 완벽! +10 큐브 에너지 ⚡' : '아쉬워요! 다시 방향을 따져보세요.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center gap-2 shrink-0 transition-transform hover:scale-105"
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
