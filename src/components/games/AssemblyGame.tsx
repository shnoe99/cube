import React, { useState } from 'react';
import { CubeViewer3D } from '../3d/CubeViewer3D';
import { CUBE_SHAPES } from '../../data/cubeShapes';
import { AudioEngine } from '../../services/audioEngine';
import { StorageService } from '../../services/storageService';
import { CheckCircle2, ArrowRight, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AssemblyGameProps {
  onBack: () => void;
  onScoreUpdate: () => void;
}

export const AssemblyGame: React.FC<AssemblyGameProps> = ({ onBack, onScoreUpdate }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentShape = CUBE_SHAPES[currentIdx % CUBE_SHAPES.length];

  // Options generator (1 correct, 3 wrong choices)
  const options = [
    { text: `${currentShape.cubeCount}개의 정육면체로 조립된 ${currentShape.name}`, shape: currentShape, isCorrect: true },
    { text: `${currentShape.cubeCount + 1}개의 정육면체로 조립된 변형 입체`, shape: CUBE_SHAPES[(currentIdx + 1) % CUBE_SHAPES.length], isCorrect: false },
    { text: `다른 각도로 잘못 닿은 큐브 조립체`, shape: CUBE_SHAPES[(currentIdx + 2) % CUBE_SHAPES.length], isCorrect: false },
    { text: `꼭짓점만 맞닿아 불가능한 큐브 조립체`, shape: CUBE_SHAPES[(currentIdx + 3) % CUBE_SHAPES.length], isCorrect: false }
  ].sort(() => Math.random() - 0.5);

  const handleSelect = (idx: number, isRight: boolean) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);
    setIsCorrect(isRight);

    StorageService.updateCategoryStats('assembly', isRight);

    if (isRight) {
      AudioEngine.playCorrect();
      StorageService.addEnergy(10);
      StorageService.unlockShape(currentShape.id);
      onScoreUpdate();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      AudioEngine.playWrong();
      StorageService.recordWrongAnswer({
        id: `asm_${Date.now()}`,
        questionText: `[큐브 조립] ${currentShape.name} 조립하기`,
        category: 'assembly',
        userChoice: options[idx].text,
        correctChoice: options.find(o => o.isCorrect)?.text || '',
        explanation: `${currentShape.name}는 ${currentShape.cubeCount}개의 정육면체가 모서리와 면을 공유하여 완벽하게 조립된 도형입니다.`,
        timestamp: new Date().toLocaleDateString('ko-KR')
      });
    }
  };

  const handleNext = () => {
    AudioEngine.playClick();
    setSelectedAnswer(null);
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
          <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
            미니게임 1: 큐브 조립 🧩
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
            목표 입체도형: <span className="text-blue-600">{currentShape.name}</span>
          </h2>
          <p className="text-sm font-semibold text-slate-500">
            3D 화면을 직접 드래그해 올바르게 조립된 입체도형 설명과 매칭해보세요!
          </p>
        </div>

        {/* 3D Interactive Target Viewer */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <CubeViewer3D cubes={currentShape.cubes} height={260} interactive={true} autoRotate={true} />
            <p className="text-center text-xs font-semibold text-slate-400 mt-2">
              💡 마우스로 드래그하면 360도 돌려볼 수 있습니다!
            </p>
          </div>
        </div>

        {/* Choices Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt, idx) => {
            let btnStyle = "border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-700 bg-white";
            if (isAnswered) {
              if (opt.isCorrect) {
                btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-400";
              } else if (selectedAnswer === idx) {
                btnStyle = "border-red-400 bg-red-50 text-red-700";
              } else {
                btnStyle = "opacity-40 border-slate-200 bg-slate-50 text-slate-400";
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelect(idx, opt.isCorrect)}
                className={`p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all flex items-start gap-3 shadow-sm ${btnStyle}`}
              >
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black shrink-0 text-slate-600">
                  {idx + 1}
                </span>
                <span className="flex-1 leading-snug">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback & Next Button */}
        {isAnswered && (
          <div className={`p-5 rounded-2xl border-2 flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
          }`}>
            <div className="flex items-center gap-3">
              {isCorrect ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
              ) : (
                <Award className="w-8 h-8 text-red-500 shrink-0" />
              )}
              <div>
                <p className="font-extrabold text-base">
                  {isCorrect ? '정답입니다! +10 큐브 에너지 획득 ⚡' : '아쉬워요! 다시 한번 생각해보세요.'}
                </p>
                <p className="text-xs font-semibold mt-1 opacity-90">
                  {currentShape.description}
                </p>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2 shrink-0 transition-transform hover:scale-105"
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
