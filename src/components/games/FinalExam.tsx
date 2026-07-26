import React, { useState, useEffect } from 'react';
import { QUIZ_QUESTIONS } from '../../data/quizQuestions';
import { CubeViewer3D } from '../3d/CubeViewer3D';
import { CUBE_SHAPES } from '../../data/cubeShapes';
import { AudioEngine } from '../../services/audioEngine';
import { StorageService } from '../../services/storageService';
import { Trophy, ArrowRight, RotateCcw, Clock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FinalExamProps {
  onBack: () => void;
  onScoreUpdate: () => void;
}

export const FinalExam: React.FC<FinalExamProps> = ({ onBack, onScoreUpdate }) => {
  const [questions] = useState(() => {
    return [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10);
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(new Array(10).fill(null));
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);

  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isFinished]);

  const currentQ = questions[currentIndex];
  const targetShape = CUBE_SHAPES.find(s => s.id === currentQ.targetShapeId) || CUBE_SHAPES[0];

  const handleSelectOption = (optIdx: number) => {
    AudioEngine.playSelect();
    const updated = [...userAnswers];
    updated[currentIndex] = optIdx;
    setUserAnswers(updated);
  };

  const handleNext = () => {
    AudioEngine.playClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      calculateFinalScore();
    }
  };

  const handlePrev = () => {
    AudioEngine.playClick();
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const calculateFinalScore = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      const uAns = userAnswers[idx];
      const isRight = uAns === q.correctAnswerIdx;
      if (isRight) {
        correctCount++;
        StorageService.updateCategoryStats(q.category, true);
      } else {
        StorageService.updateCategoryStats(q.category, false);
        if (uAns !== null) {
          StorageService.recordWrongAnswer({
            id: `final_${Date.now()}_${idx}`,
            questionText: `[최종 시험] ${q.questionText}`,
            category: q.category,
            userChoice: q.options[uAns]?.text || '미응답',
            correctChoice: q.options[q.correctAnswerIdx]?.text || '',
            explanation: q.explanation,
            timestamp: new Date().toLocaleDateString('ko-KR')
          });
        }
      }
    });

    // Each question 10 points (total 100)
    const finalScoreVal = correctCount * 10;
    setScore(finalScoreVal);
    setIsFinished(true);

    // Save score & energy
    const user = StorageService.getUserProfile();
    if (finalScoreVal > user.highScore) {
      user.highScore = finalScoreVal;
    }
    user.energy += finalScoreVal;

    // Check for "큐브 마스터" badge (>= 90 points)
    if (finalScoreVal >= 90) {
      if (!user.badges.includes('큐브 마스터')) {
        user.badges.push('큐브 마스터');
      }
      AudioEngine.playFanfare();
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
    } else {
      AudioEngine.playSubmit();
    }

    StorageService.saveUserProfile(user);
    onScoreUpdate();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}분 ${s < 10 ? '0' : ''}${s}초`;
  };

  // 1. Result View
  if (isFinished) {
    const isCubeMaster = score >= 90;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="inline-block p-4 rounded-full bg-gradient-to-tr from-amber-100 to-yellow-200 border-4 border-amber-300 shadow-inner">
            <Trophy className="w-16 h-16 text-amber-600 animate-bounce-slow" />
          </div>

          <div>
            <h2 className="text-3xl font-black text-slate-800">
              {isCubeMaster ? '🎉 축하합니다! 큐브 마스터 달성!' : '최종 시험 결과 리포트'}
            </h2>
            <p className="text-slate-500 font-semibold mt-1">
              소요 시간: {formatTime(timerSeconds)}
            </p>
          </div>

          {/* Score Circle */}
          <div className="flex justify-center">
            <div className="w-44 h-44 rounded-full bg-gradient-to-tr from-blue-600 via-sky-500 to-emerald-400 p-1.5 shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-white rounded-full flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-blue-600 font-sans">{score}</span>
                <span className="text-xs font-bold text-slate-400">100점 만점</span>
              </div>
            </div>
          </div>

          {/* Badge Grant Banner */}
          {isCubeMaster && (
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-5 rounded-2xl shadow-lg flex items-center justify-center gap-3">
              <Sparkles className="w-8 h-8 animate-spin-slow" />
              <div className="text-left">
                <h4 className="font-black text-lg">"큐브 마스터" 전설 배지 획득! 🏆</h4>
                <p className="text-xs text-amber-100 font-medium">
                  공간지각력 90점 이상 달성으로 명예의 전당 전설 배지를 수여받았습니다.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={onBack}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold px-6 py-3 rounded-2xl transition-colors"
            >
              메인으로 돌아가기
            </button>
            <button
              onClick={() => {
                setCurrentIndex(0);
                setUserAnswers(new Array(10).fill(null));
                setIsFinished(false);
                setTimerSeconds(0);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3 rounded-2xl shadow-lg shadow-blue-500/20 transition-transform hover:scale-105"
            >
              다시 시험 응시하기 🔄
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Exam Progress View
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Exam Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 font-bold hover:text-blue-600 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          <span>나가기</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>{formatTime(timerSeconds)}</span>
          </div>
          <span className="text-xs font-black text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
            🏆 최종 시험 (문제 {currentIndex + 1} / 10)
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            유형: {currentQ.category.toUpperCase()}
          </span>
          <div className="w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / 10) * 100}%` }}
            />
          </div>
        </div>

        <h3 className="text-lg sm:text-xl font-black text-slate-800 leading-snug">
          {currentIndex + 1}. {currentQ.questionText}
        </h3>

        {/* 3D Shape Helper Viewer */}
        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            <CubeViewer3D cubes={targetShape.cubes} height={200} autoRotate={true} interactive={true} />
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQ.options.map((opt, idx) => {
            const isSelected = userAnswers[currentIndex] === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all flex items-start gap-3 shadow-sm ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 text-blue-900 ring-2 ring-blue-400'
                    : 'border-slate-200 hover:border-blue-300 bg-white text-slate-700'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {idx + 1}
                </span>
                <span className="flex-1 leading-snug">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Prev/Next Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            disabled={currentIndex === 0}
            onClick={handlePrev}
            className="px-5 py-2.5 rounded-xl font-extrabold text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            이전 문제
          </button>

          <button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-transform hover:scale-105"
          >
            <span>{currentIndex === 9 ? '최종 제출' : '다음 문제'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
