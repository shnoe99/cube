import React, { useState } from 'react';
import { CUBE_SHAPES } from '../../data/cubeShapes';
import { CubeViewer3D } from '../3d/CubeViewer3D';
import { StorageService } from '../../services/storageService';
import { AudioEngine } from '../../services/audioEngine';
import { Eye, ArrowLeft, CheckCircle2, XCircle, Sparkles, HelpCircle, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrthoViewGameProps {
  onBack: () => void;
  onScoreUpdate: () => void;
}

export const OrthoViewGame: React.FC<OrthoViewGameProps> = ({ onBack, onScoreUpdate }) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const targetShape = CUBE_SHAPES[currentRound % CUBE_SHAPES.length];
  const directions: Array<'top' | 'front' | 'side'> = ['top', 'front', 'side'];
  const [selectedDirection] = useState<'top' | 'front' | 'side'>(
    directions[currentRound % directions.length]
  );

  const [userSelectedIdx, setUserSelectedIdx] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const orthoData = targetShape.orthoViews || {
    top: [[true, true], [false, true]],
    front: [[true, true], [true, false]],
    side: [[true, false], [true, true]]
  };

  const options = ['위에서 본 모습', '앞에서 본 모습', '옆에서 본 모습'];
  const correctIdx = directions.indexOf(selectedDirection);

  const handleChoice = (idx: number) => {
    if (userSelectedIdx !== null) return;
    setUserSelectedIdx(idx);

    const correct = idx === correctIdx;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      AudioEngine.playCorrect();
      setScore(s => s + 20);
      setStreak(st => st + 1);
      StorageService.updateCategoryStats('ortho', true);
      StorageService.unlockShape(targetShape.id);

      if ((streak + 1) % 3 === 0) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
    } else {
      AudioEngine.playWrong();
      setStreak(0);
      StorageService.updateCategoryStats('ortho', false);
    }
    onScoreUpdate();
  };

  const handleNext = () => {
    AudioEngine.playClick();
    setUserSelectedIdx(null);
    setShowFeedback(false);
    setCurrentRound(r => r + 1);
  };

  const renderGrid = (grid: boolean[][]) => {
    const safeGrid = grid || [[true]];
    return (
      <div className="grid grid-cols-2 gap-2 p-3 bg-purple-950 rounded-2xl border-2 border-purple-700 shadow-inner">
        {safeGrid.map((row, rIdx) =>
          row.map((val, cIdx) => (
            <div
              key={`${rIdx}-${cIdx}`}
              className={`w-10 h-10 rounded-xl transition-all ${
                val ? 'bg-yellow-400 border-2 border-white shadow-md' : 'bg-purple-900 border border-purple-800'
              }`}
            />
          ))
        )}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 pt-2">
      <div className="bg-purple-900 rounded-3xl p-6 sm:p-8 border-4 border-yellow-400 text-white shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-purple-800 pb-4">
          <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-black text-purple-200 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            <span>돌아가기</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-purple-950 font-black text-xs px-3 py-1 rounded-full">
              점수: {score} Pts ⚡
            </span>
          </div>
        </div>

        <h2 className="text-2xl font-black text-center text-yellow-300">
          👁️ 위·앞·옆 모습 맞추기 (투상도)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-950 p-4 rounded-2xl border-2 border-purple-700 text-center">
            <span className="text-xs font-black text-yellow-300 bg-purple-900 px-3 py-1 rounded-full border border-purple-700 mb-2 inline-block">
              🧊 3D 입체도형 ({targetShape.name})
            </span>
            <CubeViewer3D cubes={targetShape.cubes} height={200} autoRotate={true} />
          </div>

          <div className="flex flex-col items-center bg-purple-950 p-6 rounded-2xl border-2 border-purple-700 text-center space-y-3">
            <span className="text-xs font-black text-yellow-300 bg-purple-900 px-3 py-1 rounded-full border border-purple-700 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-yellow-400" />
              <span>관찰된 2D 모습</span>
            </span>
            {renderGrid(orthoData[selectedDirection])}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {options.map((opt, idx) => (
            <button
              key={idx}
              disabled={userSelectedIdx !== null}
              onClick={() => handleChoice(idx)}
              className={`p-4 rounded-2xl border-2 font-black text-sm transition-all ${
                userSelectedIdx === idx
                  ? 'bg-yellow-400 text-purple-950 border-white scale-105 shadow-lg'
                  : 'bg-purple-950 text-white border-purple-700 hover:border-purple-500'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {showFeedback && (
          <div className={`p-4 rounded-2xl border-2 font-black text-center text-sm ${
            isCorrect ? 'bg-emerald-900 border-emerald-400 text-emerald-200' : 'bg-red-900 border-red-400 text-red-200'
          }`}>
            <span>{isCorrect ? '🎉 정답입니다!' : '오답입니다! 다시 관찰해보세요.'}</span>
            <button onClick={handleNext} className="ml-4 underline">다음 문제 ➔</button>
          </div>
        )}
      </div>
    </div>
  );
};
