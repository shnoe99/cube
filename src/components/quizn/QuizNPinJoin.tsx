import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { StorageService } from '../../services/storageService';
import { AudioEngine } from '../../services/audioEngine';
import { CUBE_SHAPES } from '../../data/cubeShapes';
import { CubeViewer3D } from '../3d/CubeViewer3D';
import { KeyRound, Sparkles, Play, Trophy, RotateCcw, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizNPinJoinProps {
  initialPin?: string;
  user: UserProfile;
  onUserUpdate: (user: UserProfile) => void;
  onBackHome: () => void;
}

const AVATARS = ['🧊 큐브봇', '🐶 멍뭉이', '🐱 냥냥이', '🦊 여우', '🐼 판다', '🚀 로켓보이'];

export const QuizNPinJoin: React.FC<QuizNPinJoinProps> = ({
  initialPin = '',
  user,
  onUserUpdate,
  onBackHome
}) => {
  const [pin, setPin] = useState(initialPin || '839201');
  const [nickname, setNickname] = useState(user.name);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar || '🧊 큐브봇');
  
  // Game Show State
  const [inLobby, setInLobby] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timer, setTimer] = useState(20);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showPodium, setShowPodium] = useState(false);

  // Sample Quiz Show Questions
  const questions = [
    {
      q: '다음 3D 도형의 정육면체 개수는 몇 개일까요?',
      shape: CUBE_SHAPES[3],
      options: ['2개', '3개', '4개', '5개'],
      correct: 2,
      exp: 'Stage 3의 ㄱ자형 3큐브는 정육면체 3개로 구성되어 있습니다!'
    },
    {
      q: '위, 앞, 옆에서 본 2D 모습이 모두 정사각형으로 같은 도형은?',
      shape: CUBE_SHAPES[0],
      options: ['단일 큐브 (정육면체)', 'L자형 테트라큐브', 'T자형 테트라큐브', '꼬인형 3D 큐브'],
      correct: 0,
      exp: '단일 정육면체는 모든 방향에서 바라본 투상도가 1x1 정사각형입니다.'
    },
    {
      q: '다음 3D 입체도형을 x축으로 90도 회전시켰을 때 올바른 설명은?',
      shape: CUBE_SHAPES[6],
      options: ['부피가 달라진다', '모서리와 면의 수는 그대로 유지된다', '꼭짓점이 2배가 된다', '정육면체가 분리된다'],
      correct: 1,
      exp: '공간에서 3D 입체도형을 회전시켜도 면, 모서리, 꼭짓점의 수는 변하지 않습니다!'
    }
  ];

  const handleJoinLobby = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim() || !nickname.trim()) return;

    AudioEngine.playWarpSwoosh();
    
    // Save nickname & avatar
    const updated = { ...user, name: nickname, avatar: selectedAvatar };
    StorageService.saveUserProfile(updated);
    onUserUpdate(updated);

    setInLobby(true);
  };

  const handleStartShow = () => {
    AudioEngine.playFanfare();
    setInLobby(false);
    setGameStarted(true);
    setCurrentQIndex(0);
    setScore(0);
    setTimer(20);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleSelectOption = (idx: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(idx);
    const q = questions[currentQIndex];
    const isCorrect = idx === q.correct;

    if (isCorrect) {
      AudioEngine.playCorrect();
      setScore(s => s + 100);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    } else {
      AudioEngine.playWrong();
    }

    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    AudioEngine.playClick();
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(i => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimer(20);
    } else {
      // Show Final Podium
      AudioEngine.playFanfare();
      setShowPodium(true);
      StorageService.addEnergy(score);
      onUserUpdate(StorageService.getUserProfile());
      confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
    }
  };

  // 1. PIN & Avatar Selection Form
  if (!inLobby && !gameStarted && !showPodium) {
    return (
      <div className="max-w-xl mx-auto space-y-6 pb-12 pt-4">
        
        {/* QuizN Main PIN Box */}
        <div className="bg-gradient-to-br from-purple-800 via-indigo-800 to-purple-900 rounded-3xl p-8 text-white shadow-2xl border-4 border-yellow-400 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

          <div className="text-center space-y-2 relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-purple-950 px-4 py-1 rounded-full text-xs font-black shadow-md">
              <KeyRound className="w-4 h-4" />
              <span>QuizN 라이브 퀴즈쇼 입장</span>
            </div>
            <h2 className="text-3xl font-black text-yellow-300">
              PIN 번호 입력하기
            </h2>
            <p className="text-xs font-bold text-purple-200">
              선생님이나 주최자가 보여준 6자리 PIN 코드를 입력하세요!
            </p>
          </div>

          <form onSubmit={handleJoinLobby} className="space-y-5 relative z-10">
            
            {/* PIN Code Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-yellow-300">
                1. PIN 코드 (6자리)
              </label>
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="예: 839201"
                className="w-full bg-purple-950/90 border-4 border-yellow-400 rounded-2xl py-4 text-center text-3xl font-black tracking-widest text-yellow-300 placeholder-purple-500 focus:outline-none focus:ring-4 focus:ring-yellow-400/50 shadow-inner"
              />
            </div>

            {/* Nickname Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-yellow-300">
                2. 퀴즈쇼 닉네임
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="참여 닉네임 입력"
                className="w-full bg-purple-950/90 border-2 border-purple-400 rounded-2xl py-3 px-4 text-center font-black text-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Avatar Selector */}
            <div className="space-y-2">
              <label className="text-xs font-black text-yellow-300">
                3. 나의 캐릭터 아바타 선택
              </label>
              <div className="grid grid-cols-3 gap-2">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => {
                      AudioEngine.playClick();
                      setSelectedAvatar(av);
                    }}
                    className={`p-3 rounded-2xl border-2 font-black text-sm transition-all flex flex-col items-center gap-1 ${
                      selectedAvatar === av
                        ? 'bg-yellow-400 text-purple-950 border-white scale-105 shadow-lg'
                        : 'bg-purple-900/60 text-purple-200 border-purple-600 hover:bg-purple-800'
                    }`}
                  >
                    <span className="text-2xl">{av.split(' ')[0]}</span>
                    <span className="text-[11px]">{av.split(' ')[1]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Join Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-purple-950 font-black py-4 rounded-2xl shadow-xl text-xl flex items-center justify-center gap-2 transition-transform hover:scale-105 mt-4"
            >
              <Play className="w-6 h-6 fill-purple-950" />
              <span>퀴즈쇼 대기실 입장! 🚀</span>
            </button>

          </form>
        </div>
      </div>
    );
  }

  // 2. QuizN Live Lobby Screen
  if (inLobby && !gameStarted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-12 pt-6 text-center">
        <div className="bg-purple-900 rounded-3xl p-8 border-4 border-yellow-400 text-white shadow-2xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-1.5 rounded-full font-black text-xs animate-pulse">
            <span>● LIVE 퀴즈쇼 대기실</span>
          </div>

          <div>
            <span className="text-xs font-bold text-yellow-300">입장 PIN 코드</span>
            <h2 className="text-5xl font-black tracking-widest text-yellow-300 mt-1 drop-shadow-md">
              {pin}
            </h2>
          </div>

          {/* Connected Character Bouncing Card */}
          <div className="bg-purple-950 p-6 rounded-2xl border-2 border-purple-600 space-y-3">
            <div className="text-6xl animate-bounce">{selectedAvatar.split(' ')[0]}</div>
            <div className="text-xl font-black text-white">{nickname}</div>
            <div className="text-xs font-bold text-purple-300 bg-purple-900 px-3 py-1 rounded-full inline-block">
              준비 완료! 퀴즈쇼가 곧 시작됩니다.
            </div>
          </div>

          <button
            onClick={handleStartShow}
            className="w-full bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-purple-950 font-black text-2xl py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-3 hover:scale-105 transition-transform"
          >
            <Play className="w-7 h-7 fill-purple-950" />
            <span>퀴즈쇼 시작하기! (Start Show)</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. QuizN Live Game Screen (Kahoot/QuizN 4 Color Answer Blocks)
  if (gameStarted && !showPodium) {
    const q = questions[currentQIndex];

    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12 pt-4">
        
        {/* Question Header Card */}
        <div className="bg-purple-900 rounded-3xl p-6 sm:p-8 border-4 border-yellow-400 text-white shadow-2xl space-y-4">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="bg-yellow-400 text-purple-950 px-3.5 py-1 rounded-full">
              QUESTION {currentQIndex + 1} / {questions.length}
            </span>
            <span className="bg-purple-950 text-yellow-300 px-3.5 py-1 rounded-full border border-purple-600">
              현재 점수: {score} Pts ⚡
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-center text-white leading-snug">
            {q.q}
          </h2>

          {/* 3D Model Center View */}
          <div className="w-full h-56 bg-purple-950 rounded-2xl border-2 border-purple-700 p-2 shadow-inner">
            <CubeViewer3D cubes={q.shape.cubes} height={200} autoRotate={true} />
          </div>
        </div>

        {/* QuizN 4-Color Answer Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Option 0: Red Triangle */}
          <button
            disabled={selectedAnswer !== null}
            onClick={() => handleSelectOption(0)}
            className={`p-6 rounded-3xl border-4 text-white font-black text-lg flex items-center gap-4 transition-all shadow-xl hover:scale-[1.02] ${
              selectedAnswer === 0
                ? 'ring-8 ring-white scale-105'
                : ''
            } bg-gradient-to-r from-red-600 to-rose-500 border-red-400`}
          >
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-black shrink-0">
              ▲
            </div>
            <span className="text-left leading-snug">{q.options[0]}</span>
          </button>

          {/* Option 1: Blue Diamond */}
          <button
            disabled={selectedAnswer !== null}
            onClick={() => handleSelectOption(1)}
            className={`p-6 rounded-3xl border-4 text-white font-black text-lg flex items-center gap-4 transition-all shadow-xl hover:scale-[1.02] ${
              selectedAnswer === 1
                ? 'ring-8 ring-white scale-105'
                : ''
            } bg-gradient-to-r from-blue-600 to-sky-500 border-blue-400`}
          >
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-black shrink-0">
              ◆
            </div>
            <span className="text-left leading-snug">{q.options[1]}</span>
          </button>

          {/* Option 2: Yellow Circle */}
          <button
            disabled={selectedAnswer !== null}
            onClick={() => handleSelectOption(2)}
            className={`p-6 rounded-3xl border-4 text-slate-950 font-black text-lg flex items-center gap-4 transition-all shadow-xl hover:scale-[1.02] ${
              selectedAnswer === 2
                ? 'ring-8 ring-white scale-105'
                : ''
            } bg-gradient-to-r from-amber-400 to-yellow-300 border-yellow-200`}
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-950/20 text-purple-950 flex items-center justify-center text-2xl font-black shrink-0">
              ●
            </div>
            <span className="text-left leading-snug">{q.options[2]}</span>
          </button>

          {/* Option 3: Green Square */}
          <button
            disabled={selectedAnswer !== null}
            onClick={() => handleSelectOption(3)}
            className={`p-6 rounded-3xl border-4 text-white font-black text-lg flex items-center gap-4 transition-all shadow-xl hover:scale-[1.02] ${
              selectedAnswer === 3
                ? 'ring-8 ring-white scale-105'
                : ''
            } bg-gradient-to-r from-emerald-600 to-teal-500 border-emerald-400`}
          >
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-black shrink-0">
              ■
            </div>
            <span className="text-left leading-snug">{q.options[3]}</span>
          </button>

        </div>

        {/* Explanation & Next Question Banner */}
        {showExplanation && (
          <div className="bg-purple-900 border-4 border-yellow-400 rounded-3xl p-6 text-white space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-yellow-300" />
              <h4 className="font-black text-lg text-yellow-300">정답 해설 (QuizN Explanation)</h4>
            </div>
            <p className="text-sm font-semibold text-purple-100 leading-relaxed">
              {q.exp}
            </p>
            <button
              onClick={handleNextQuestion}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-black py-4 rounded-2xl shadow-lg text-lg flex items-center justify-center gap-2 transition-transform hover:scale-105"
            >
              <span>다음 문제로 🚀</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>
    );
  }

  // 4. QuizN Live Final Podium Screen
  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12 pt-6 text-center">
      <div className="bg-purple-900 rounded-3xl p-8 border-4 border-yellow-400 text-white shadow-2xl space-y-6">
        <Trophy className="w-20 h-20 text-yellow-300 mx-auto animate-bounce" />

        <div>
          <span className="bg-yellow-400 text-purple-950 font-black text-xs px-3.5 py-1 rounded-full">
            🏆 QuizN 퀴즈쇼 결과 발표
          </span>
          <h2 className="text-4xl font-black text-yellow-300 mt-2">
            축하합니다! {nickname} 님!
          </h2>
          <p className="text-sm text-purple-200 font-bold mt-1">
            최종 획득 점수: <strong className="text-yellow-300 text-2xl">{score}</strong> Pts ⚡
          </p>
        </div>

        {/* Podium Top 3 Representation */}
        <div className="bg-purple-950 p-6 rounded-2xl border-2 border-purple-700 flex items-end justify-center gap-4 h-48">
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl">🐱</span>
            <div className="w-16 bg-slate-400 text-slate-900 font-black py-6 rounded-t-xl text-xs">
              2위 🥈
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-4xl">{selectedAvatar.split(' ')[0]}</span>
            <div className="w-20 bg-yellow-400 text-purple-950 font-black py-10 rounded-t-xl text-sm shadow-lg">
              1위 🥇 <br />
              <span className="text-[10px]">{nickname}</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl">🐶</span>
            <div className="w-16 bg-amber-700 text-white font-black py-4 rounded-t-xl text-xs">
              3위 🥉
            </div>
          </div>
        </div>

        <button
          onClick={onBackHome}
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-black py-4 rounded-2xl shadow-xl text-lg flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>메인 화면으로 돌아가기</span>
        </button>
      </div>
    </div>
  );
};
