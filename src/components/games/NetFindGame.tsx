import React, { useState } from 'react';
import { CubeViewer3D } from '../3d/CubeViewer3D';
import { CUBE_SHAPES } from '../../data/cubeShapes';
import { AudioEngine } from '../../services/audioEngine';
import { StorageService } from '../../services/storageService';
import { CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface NetFindGameProps {
  onBack: () => void;
  onScoreUpdate: () => void;
}

export const NetFindGame: React.FC<NetFindGameProps> = ({ onBack, onScoreUpdate }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentShape = CUBE_SHAPES[currentIdx % CUBE_SHAPES.length];

  const options = [
    { text: '6개 면이 겹치지 않고 마주보게 완성되는 올바른 전개도', isCorrect: true },
    { text: '두 면이 같은 위쪽에 겹치게 지어진 오류 전개도', isCorrect: false },
    { text: '면의 개수가 모자란 부족한 전개도', isCorrect: false },
    { text: '접었을 때 모서리가 맞닿지 않고 뚫리는 전개도', isCorrect: false }
  ].sort(() => Math.random() - 0.5);

  const handleSelect = (idx: number, isRight: boolean) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);
    setIsCorrect(isRight);

    StorageService.updateCategoryStats('net', isRight);

    if (isRight) {
      AudioEngine.playCorrect();
      StorageService.addEnergy(10);
      onScoreUpdate();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      AudioEngine.playWrong();
      StorageService.recordWrongAnswer({
        id: `net_${Date.now()}`,
        questionText: `[전개도] ${currentShape.name} 전개도 판별`,
        category: 'net',
        userChoice: options[idx].text,
        correctChoice: options.find(o => o.isCorrect)?.text || '',
        explanation: '올바른 전개도는 접었을 때 면들이 서로 겹치거나 포개어지지 않고 모서리가 정확하게 일치합니다.',
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
          <span className="text-xs font-black text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
            미니게임 4: 전개도 찾기 📐
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
            목표 입체도형: <span className="text-amber-600">{currentShape.name}</span>
          </h2>
          <p className="text-sm font-semibold text-slate-500">
            이 입체도형을 펼쳤을 때 접어서 원래 모습이 완성되는 **올바른 전개도의 성질**을 선택하세요!
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            <CubeViewer3D cubes={currentShape.cubes} height={200} autoRotate={true} interactive={true} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt, idx) => {
            let btnStyle = "border-slate-200 hover:border-amber-400 bg-white text-slate-700";
            if (isAnswered) {
              if (opt.isCorrect) {
                btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-400 font-bold";
              } else if (selectedIdx === idx) {
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
                className={`p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all shadow-sm flex items-start gap-3 ${btnStyle}`}
              >
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black shrink-0 text-slate-600">
                  {idx + 1}
                </span>
                <span className="flex-1 leading-snug">{opt.text}</span>
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
                  {isCorrect ? '정답입니다! 전개도의 닿는 면 성질 파악 완료! +10 큐브 에너지 ⚡' : '아쉬워요! 겹치는 면이 없는지 잘 보세요.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold px-6 py-3 rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 shrink-0 transition-transform hover:scale-105"
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
