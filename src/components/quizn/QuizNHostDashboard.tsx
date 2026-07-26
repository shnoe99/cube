import React, { useState } from 'react';
import { AudioEngine } from '../../services/audioEngine';
import { GraduationCap, Play, Users, Sparkles, Copy, Check, RotateCcw } from 'lucide-react';

interface QuizNHostDashboardProps {
  onBackHome: () => void;
}

export const QuizNHostDashboard: React.FC<QuizNHostDashboardProps> = ({ onBackHome }) => {
  const [pinCode] = useState(() => Math.floor(100000 + Math.random() * 900000).toString());
  const [copied, setCopied] = useState(false);
  const [hostStarted, setHostStarted] = useState(false);

  // Simulated connected student avatars
  const connectedStudents = [
    { name: '민준이', avatar: '🧊 큐브봇' },
    { name: '서연이', avatar: '🐶 멍뭉이' },
    { name: '지후', avatar: '🐱 냥냥이' },
    { name: '하은이', avatar: '🦊 여우' },
    { name: '도윤이', avatar: '🐼 판다' }
  ];

  const handleCopyPin = () => {
    navigator.clipboard.writeText(pinCode);
    setCopied(true);
    AudioEngine.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartHostShow = () => {
    AudioEngine.playFanfare();
    setHostStarted(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 pt-4">
      
      {/* QuizN Host Header Card */}
      <div className="bg-purple-900 rounded-3xl p-8 border-4 border-yellow-400 text-white shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left relative z-10">
          <div className="space-y-1">
            <span className="bg-red-500 text-white font-black text-xs px-3.5 py-1 rounded-full animate-pulse">
              ● LIVE 퀴즈쇼 주최자 모드
            </span>
            <h2 className="text-3xl font-black text-yellow-300">
              6학년 3D 공간지각 퀴즈쇼
            </h2>
            <p className="text-xs font-bold text-purple-200">
              학생들이 화면의 PIN 코드를 입력하면 즉시 대기실에 입장합니다.
            </p>
          </div>

          {/* Huge PIN Code Display */}
          <div className="bg-purple-950 p-4 sm:p-6 rounded-2xl border-4 border-yellow-400 text-center shrink-0 shadow-2xl">
            <span className="text-[11px] font-bold text-yellow-300">입장 PIN 번호</span>
            <div className="text-4xl sm:text-5xl font-black text-yellow-300 tracking-widest mt-1">
              {pinCode}
            </div>
            <button
              onClick={handleCopyPin}
              className="mt-2 bg-purple-800 hover:bg-purple-700 text-xs font-black text-purple-100 px-3 py-1 rounded-full flex items-center justify-center gap-1 mx-auto"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '복사됨!' : 'PIN 복사'}</span>
            </button>
          </div>
        </div>

        {/* Connected Student Roster */}
        {!hostStarted ? (
          <div className="space-y-4 relative z-10 pt-2 border-t border-purple-800">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-lg text-yellow-300 flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>접속한 참가자 ({connectedStudents.length}명)</span>
              </h3>
              <span className="text-xs font-bold text-purple-300">
                실시간 입장 중...
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {connectedStudents.map((st, i) => (
                <div
                  key={i}
                  className="bg-purple-950/80 p-3 rounded-2xl border border-purple-700 text-center space-y-1 animate-bounce-slow"
                >
                  <div className="text-3xl">{st.avatar.split(' ')[0]}</div>
                  <div className="text-xs font-black text-white truncate">{st.name}</div>
                </div>
              ))}
            </div>

            <button
              onClick={handleStartHostShow}
              className="w-full bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-purple-950 font-black text-2xl py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-3 hover:scale-105 transition-transform mt-4"
            >
              <Play className="w-7 h-7 fill-purple-950" />
              <span>퀴즈쇼 라이브 시작! 🎤</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6 pt-4 border-t border-purple-800 text-center">
            <div className="bg-purple-950 p-6 rounded-2xl border-2 border-yellow-400 space-y-3">
              <Sparkles className="w-12 h-12 text-yellow-300 mx-auto animate-spin-slow" />
              <h3 className="text-2xl font-black text-yellow-300">퀴즈쇼가 진행 중입니다!</h3>
              <p className="text-xs text-purple-200 font-bold">
                학생들이 4가지 색상 버튼(▲, ◆, ●, ■)으로 3D 정육면체 퀴즈를 풀고 있습니다.
              </p>
            </div>

            <button
              onClick={onBackHome}
              className="bg-purple-950 hover:bg-purple-900 border border-purple-700 text-white font-black px-6 py-3 rounded-2xl text-sm inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>주최자 모드 종료하기</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
