import React, { useState, useEffect } from 'react';
import { QUIZ_QUESTIONS } from '../../data/quizQuestions';
import { CUBE_SHAPES } from '../../data/cubeShapes';
import { CubeViewer3D } from '../3d/CubeViewer3D';
import { StorageService } from '../../services/storageService';
import { AudioEngine } from '../../services/audioEngine';
import { Trophy, Clock, CheckCircle2, XCircle, Award, RotateCcw, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FinalExamProps {
  onBack: () => void;
  onScoreUpdate: () => void;
}

export const FinalExam: React.FC<FinalExamProps> = ({ onBack, onScoreUpdate }) => {
  const [questions] = useState(() => {
    const shuffled = [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(Array(10).fill(null));
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isFinished, setIsFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [isMaster, setIsMaster] = useState(false);

  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished]);

  const handleSelectOption = (optIdx: number) => {
    AudioEngine.playSelect();
    setSelectedIdx(optIdx);
    const updated = [...userAnswers];
    updated[currentIndex] = optIdx;
    setUserAnswers(updated);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedIdx(userAnswers[currentIndex + 1]);
    } else {
      handleFinishExam();
    }
  };

  const handleFinishExam = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      const uAns = userAnswers[idx];
      const correctIndex = q.correctIndex !== undefined ? q.correctIndex : (q.correctAnswerIdx || 0);
      if (uAns === correctIndex) {
        correctCount++;
        StorageService.updateCategoryStats(q.category, true);
      } else {
        StorageService.updateCategoryStats(q.category, false);
      }
    });

    const score = correctCount * 10;
    setFinalScore(score);
    setIsFinished(true);

    const user = StorageService.getUserProfile();
    if (score >= 90) {
      setIsMaster(true);
      AudioEngine.playFanfare();
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    } else {
      AudioEngine.playSubmit();
    }

    if (score > (user.highScore || 0)) {
      user.highScore = score;
    }
    user.energy += score;
    StorageService.saveUserProfile(user);
    onScoreUpdate();
  };

  const currentQ = questions[currentIndex];
  const targetShape = CUBE_SHAPES.find(s => s.id === currentQ.shapeId || s.id === currentQ.targetShapeId) || CUBE_SHAPES[0];

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-12 pt-4 text-center">
        <div className="bg-purple-900 rounded-3xl p-8 border-4 border-yellow-400 text-white shadow-2xl space-y-6">
          <div className="w-20 h-20 rounded-full bg-yellow-400 text-purple-950 flex items-center justify-center mx-auto shadow-xl">
            <Trophy className="w-12 h-12" />
          </div>

          <div>
            <span className="bg-yellow-400 text-purple-950 font-black text-xs px-3.5 py-1 rounded-full">
              🏆 최종 큐브 마스터 시험 결과
            </span>
            <h2 className="text-4xl font-black text-yellow-300 mt-3">
              {finalScore}점 / 100점
            </h2>
            <p className="text-sm font-bold text-purple-200 mt-1">
              {isMaster ? '🎉 축하합니다! 큐브 마스터 전설 배지를 획득했습니다!' : '수고하셨습니다! 다시 도전하여 90점 이상을 노려보세요!'}
            </p>
          </div>

          <button
            onClick={onBack}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-black py-4 rounded-2xl shadow-xl text-lg flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>메인으로 돌아가기</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 pt-2">
      <div className="bg-purple-900 rounded-3xl p-6 sm:p-8 border-4 border-yellow-400 text-white shadow-2xl space-y-6">
        
        {/* Exam Header */}
        <div className="flex items-center justify-between border-b border-purple-800 pb-4">
          <span className="bg-yellow-400 text-purple-950 font-black text-xs px-3.5 py-1 rounded-full">
            문제 {currentIndex + 1} / {questions.length}
          </span>
          <div className="flex items-center gap-1.5 bg-purple-950 px-3.5 py-1 rounded-full border border-purple-700 text-yellow-300 font-black text-xs">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>남은 시간: {Math.floor(timeLeft / 60)}분 {timeLeft % 60}초</span>
          </div>
        </div>

        <h3 className="text-xl font-black text-yellow-300">
          {currentQ.question || currentQ.questionText}
        </h3>

        <div className="w-full h-56 bg-purple-950 rounded-2xl border-2 border-purple-700 p-2 shadow-inner">
          <CubeViewer3D cubes={targetShape.cubes} height={200} autoRotate={true} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQ.options.map((opt, idx) => {
            const optText = typeof opt === 'string' ? opt : (opt as any).text;
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`p-4 rounded-2xl border-2 text-left font-black text-sm transition-all ${
                  isSelected
                    ? 'bg-yellow-400 text-purple-950 border-white scale-105 shadow-lg'
                    : 'bg-purple-950/80 text-white border-purple-700 hover:border-purple-500'
                }`}
              >
                {optText}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-black py-4 rounded-2xl shadow-xl text-lg flex items-center justify-center gap-2 mt-4"
        >
          <span>{currentIndex === questions.length - 1 ? '시험 제출하기' : '다음 문제'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
};
