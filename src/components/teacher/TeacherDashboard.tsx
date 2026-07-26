import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { StudentPdfReport } from './StudentPdfReport';
import { StorageService } from '../../services/storageService';
import { AudioEngine } from '../../services/audioEngine';
import { GraduationCap, Lock, Download, FileText, Sparkles, Users, Award, ShieldAlert } from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Sample Class Student Data
  const mockStudents: UserProfile[] = [
    {
      uid: 'st_1',
      name: '김민준',
      avatar: '🧊 큐브봇',
      className: '6학년 1반',
      role: 'student',
      level: 4,
      energy: 450,
      highScore: 90,
      unlockedShapeIds: ['cube-1', 'cube-2-domino', 'cube-3-line'],
      completedStageIds: [1, 2, 3],
      playTimeMinutes: 45,
      badges: ['큐브 탐험가', '마스터'],
      wrongHistory: [],
      weaknessStats: {
        assembly: { correct: 8, total: 10 },
        rotation: { correct: 7, total: 10 },
        ortho: { correct: 9, total: 10 },
        net: { correct: 6, total: 10 }
      }
    },
    {
      uid: 'st_2',
      name: '이서연',
      avatar: '🐶 멍뭉이',
      className: '6학년 1반',
      role: 'student',
      level: 5,
      energy: 520,
      highScore: 100,
      unlockedShapeIds: ['cube-1', 'cube-2-domino', 'cube-3-line', 'cube-3-lshape'],
      completedStageIds: [1, 2, 3, 4],
      playTimeMinutes: 60,
      badges: ['큐브 탐험가', '전설의 마스터'],
      wrongHistory: [],
      weaknessStats: {
        assembly: { correct: 10, total: 10 },
        rotation: { correct: 9, total: 10 },
        ortho: { correct: 10, total: 10 },
        net: { correct: 9, total: 10 }
      }
    },
    {
      uid: 'st_3',
      name: '박지후',
      avatar: '🐱 냥냥이',
      className: '6학년 1반',
      role: 'student',
      level: 3,
      energy: 310,
      highScore: 80,
      unlockedShapeIds: ['cube-1', 'cube-2-domino'],
      completedStageIds: [1, 2],
      playTimeMinutes: 30,
      badges: ['큐브 탐험가'],
      wrongHistory: [],
      weaknessStats: {
        assembly: { correct: 6, total: 10 },
        rotation: { correct: 5, total: 10 },
        ortho: { correct: 7, total: 10 },
        net: { correct: 4, total: 10 }
      }
    }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput === '0000') {
      AudioEngine.playCorrect();
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      AudioEngine.playWrong();
      setErrorMsg('비밀번호가 올바르지 않습니다. (기본 PIN: 1234)');
    }
  };

  const handleDownloadCSV = () => {
    AudioEngine.playClick();
    const headers = ['이름', '학급', '레벨', '큐브에너지', '최고점수', '전개도정답률(%)'];
    const rows = mockStudents.map(s => {
      const netStats = s.weaknessStats.net;
      const acc = netStats.total > 0 ? Math.round((netStats.correct / netStats.total) * 100) : 0;
      return [s.name, s.className, s.level, s.energy, s.highScore, acc];
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `6학년_1반_공간지각_학습리포트.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto space-y-6 pb-12 pt-6">
        <div className="bg-purple-900 rounded-3xl p-8 border-4 border-yellow-400 text-white shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-yellow-400 text-purple-950 flex items-center justify-center mx-auto text-3xl font-black shadow-lg">
            👩‍🏫
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-yellow-300">교사 연구소 센터</h2>
            <p className="text-xs text-purple-200 font-bold">
              학급 학생 성적 대시보드 및 리포트 관리를 위한 PIN을 입력하세요.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-900 border border-red-400 text-red-200 p-3 rounded-2xl text-xs font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="교사 PIN 입력 (기본: 1234)"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full bg-purple-950 border-2 border-purple-600 rounded-2xl py-3.5 px-4 text-center font-black text-xl text-yellow-300 placeholder-purple-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-black py-4 rounded-2xl shadow-xl text-lg flex items-center justify-center gap-2"
            >
              <Lock className="w-5 h-5" />
              <span>교사 인증 접속</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 pt-2">
      <div className="bg-purple-900 rounded-3xl p-6 sm:p-8 border-4 border-yellow-400 text-white shadow-2xl space-y-6">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-purple-800 pb-4">
          <div>
            <span className="bg-yellow-400 text-purple-950 font-black text-xs px-3.5 py-1 rounded-full">
              👩‍🏫 교사 전용 학급 대시보드
            </span>
            <h2 className="text-3xl font-black text-yellow-300 mt-2">
              6학년 1반 학습 성치도 관리
            </h2>
          </div>

          <button
            onClick={handleDownloadCSV}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-3 rounded-2xl shadow-lg text-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>학급 CSV 데이터 내보내기</span>
          </button>
        </div>

        {/* Student Roster Table */}
        <div className="space-y-4">
          <h3 className="font-black text-lg text-yellow-300 flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span>학생 리스트 및 성적 리포트</span>
          </h3>

          <div className="space-y-3">
            {mockStudents.map(student => (
              <div key={student.uid} className="bg-purple-950 p-4 rounded-2xl border-2 border-purple-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{student.avatar.split(' ')[0]}</span>
                    <div>
                      <div className="font-black text-base text-white">{student.name}</div>
                      <div className="text-xs text-purple-300 font-bold">{student.className} · 레벨 {student.level}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black text-yellow-300">최고점수 {student.highScore}점</div>
                    <div className="text-xs font-bold text-amber-400">{student.energy}⚡ 큐브 에너지</div>
                  </div>
                </div>

                <StudentPdfReport student={student} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
