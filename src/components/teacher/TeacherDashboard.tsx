import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { StorageService } from '../../services/storageService';
import { StudentPdfReport } from './StudentPdfReport';
import { AudioEngine } from '../../services/audioEngine';
import { GraduationCap, Users, Download, Printer, Lock, Key, Award, BarChart3, AlertCircle } from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [selectedStudentForPdf, setSelectedStudentForPdf] = useState<UserProfile | null>(null);

  const currentUser = StorageService.getUserProfile();

  // Mock class student list for Teacher Dashboard
  const mockStudents: UserProfile[] = [
    currentUser,
    {
      uid: 'st_2',
      name: '김우주',
      className: '6학년 1반',
      role: 'student',
      level: 4,
      energy: 850,
      highScore: 100,
      unlockedShapeIds: ['cube_1', 'cube_2_domino', 'cube_3_line', 'cube_3_l', 'cube_4_i', 'cube_4_o'],
      completedStageIds: [1, 2, 3],
      playTimeMinutes: 45,
      badges: ['큐브 마스터', '공간지각 천재'],
      wrongHistory: [],
      weaknessStats: {
        net: { correct: 9, total: 10 },
        rotation: { correct: 8, total: 10 },
        ortho: { correct: 10, total: 10 },
        assembly: { correct: 10, total: 10 }
      }
    },
    {
      uid: 'st_3',
      name: '이공간',
      className: '6학년 1반',
      role: 'student',
      level: 3,
      energy: 720,
      highScore: 95,
      unlockedShapeIds: ['cube_1', 'cube_2_domino', 'cube_3_line'],
      completedStageIds: [1, 2],
      playTimeMinutes: 30,
      badges: ['공간지각 천재'],
      wrongHistory: [],
      weaknessStats: {
        net: { correct: 5, total: 10 },
        rotation: { correct: 8, total: 10 },
        ortho: { correct: 9, total: 10 },
        assembly: { correct: 8, total: 10 }
      }
    },
    {
      uid: 'st_4',
      name: '최도형',
      className: '6학년 1반',
      role: 'student',
      level: 2,
      energy: 410,
      highScore: 80,
      unlockedShapeIds: ['cube_1', 'cube_2_domino'],
      completedStageIds: [1],
      playTimeMinutes: 20,
      badges: ['큐브 탐험가'],
      wrongHistory: [],
      weaknessStats: {
        net: { correct: 3, total: 8 },
        rotation: { correct: 4, total: 8 },
        ortho: { correct: 6, total: 8 },
        assembly: { correct: 5, total: 8 }
      }
    }
  ];

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 1234
    if (pinInput === '1234' || pinInput === '0000') {
      AudioEngine.playCorrect();
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      AudioEngine.playWrong();
      setPinError(true);
    }
  };

  // Export CSV File
  const handleExportCSV = () => {
    AudioEngine.playClick();
    const headers = ['이름,학급,레벨,큐브에너지,최고점수,도감해금수,학습시간(분)\n'];
    const rows = mockStudents.map(s =>
      `${s.name},${s.className},${s.level},${s.energy},${s.highScore},${s.unlockedShapeIds.length},${s.playTimeMinutes}`
    ).join('\n');

    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `큐브마스터_학급_학습기록_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. PIN Auth View
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-800">교사 전용 대시보드</h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              학급 학생들의 성적, AI 오답 분석 및 리포트 출력을 위해 인증 PIN 번호를 입력하세요.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="relative">
              <Key className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="password"
                placeholder="PIN 번호 입력 (기본: 1234)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none font-bold text-center tracking-widest text-lg"
              />
            </div>

            {pinError && (
              <p className="text-xs text-red-500 font-bold flex items-center justify-center gap-1">
                <AlertCircle className="w-4 h-4" />
                <span>PIN 번호가 올바르지 않습니다. (1234 입력)</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-emerald-500/20 transition-transform hover:scale-105"
            >
              교사 인증 로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Authenticated Dashboard View
  const avgScore = Math.round(mockStudents.reduce((acc, s) => acc + s.highScore, 0) / mockStudents.length);
  const avgEnergy = Math.round(mockStudents.reduce((acc, s) => acc + s.energy, 0) / mockStudents.length);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black inline-flex items-center gap-1">
            <GraduationCap className="w-4 h-4" />
            <span>교사 전용 대시보드</span>
          </span>
          <h1 className="text-3xl font-black">
            6학년 1반 공간지각 학습 관리 👩‍🏫
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium">
            학생별 성취도, AI 오답 취약점 및 PDF 리포트 출력·CSV 내보내기를 지원합니다.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="bg-white text-emerald-800 hover:bg-emerald-50 font-black px-4 py-2.5 rounded-2xl shadow-md text-xs flex items-center gap-2 transition-transform hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>CSV 데이터 다운로드</span>
          </button>
        </div>
      </div>

      {/* Class Overview Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">총 학생 수</div>
            <div className="text-2xl font-black text-slate-800 mt-1">{mockStudents.length}명</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">학급 평균 점수</div>
            <div className="text-2xl font-black text-blue-600 mt-1">{avgScore}점</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">평균 큐브 에너지</div>
            <div className="text-2xl font-black text-amber-600 mt-1">{avgEnergy}⚡</div>
          </div>
        </div>
      </div>

      {/* Student Roster Table Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="font-extrabold text-lg text-slate-800">
            학생별 학습 성과 및 리포트 출력
          </h3>
          <span className="text-xs font-semibold text-slate-400">
            총 {mockStudents.length}명 등록됨
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold text-slate-400">
                <th className="py-3 px-4">학생 이름</th>
                <th className="py-3 px-4">레벨</th>
                <th className="py-3 px-4">큐브 에너지</th>
                <th className="py-3 px-4">최종점수</th>
                <th className="py-3 px-4">도감 완성</th>
                <th className="py-3 px-4 text-right">PDF 리포트</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {mockStudents.map(st => (
                <tr key={st.uid} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-black text-slate-800">{st.name}</td>
                  <td className="py-3.5 px-4">Lv.{st.level}</td>
                  <td className="py-3.5 px-4 text-amber-600 font-bold">{st.energy}⚡</td>
                  <td className="py-3.5 px-4 font-black text-blue-600">{st.highScore}점</td>
                  <td className="py-3.5 px-4">{st.unlockedShapeIds.length} / 12개</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        AudioEngine.playClick();
                        setSelectedStudentForPdf(st);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl hover:bg-emerald-100 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>PDF 출력</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF Modal Trigger */}
      {selectedStudentForPdf && (
        <StudentPdfReport
          student={selectedStudentForPdf}
          onClose={() => setSelectedStudentForPdf(null)}
        />
      )}
    </div>
  );
};
