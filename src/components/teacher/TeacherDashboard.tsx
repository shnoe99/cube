import React from 'react';
import { UserProfile } from '../../types';
import { StudentPdfReport } from './StudentPdfReport';
import { AudioEngine } from '../../services/audioEngine';
import { GraduationCap, Download, Users, ShieldCheck } from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
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

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 pt-2">
      <div className="bg-purple-900 rounded-3xl p-6 sm:p-8 border-4 border-yellow-400 text-white shadow-2xl space-y-6">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-purple-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-yellow-400 text-purple-950 font-black text-xs px-3.5 py-1 rounded-full">
                👩‍🏫 교사 대시보드
              </span>
              <span className="bg-emerald-500 text-slate-950 font-black text-[11px] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Cloud Firestore 동기화</span>
              </span>
            </div>
            <h2 className="text-3xl font-black text-yellow-300 mt-2">
              6학년 1반 공간지각 성취도 관리
            </h2>
          </div>

          <button
            onClick={handleDownloadCSV}
            className="bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-black px-5 py-3 rounded-2xl shadow-lg text-sm flex items-center gap-2"
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
