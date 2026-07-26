import React from 'react';
import { UserProfile } from '../../types';
import { AIEngine } from '../../services/aiEngine';

interface StudentPdfReportProps {
  student: UserProfile;
  onClose: () => void;
}

export const StudentPdfReport: React.FC<StudentPdfReportProps> = ({ student, onClose }) => {
  const aiResult = AIEngine.analyzeUserProfile(student);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-8 max-w-3xl w-full space-y-6 shadow-2xl print:shadow-none print:m-0 print:p-6 print:max-w-none">
        
        {/* Report Header (Print style) */}
        <div className="border-b-4 border-emerald-500 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              🧊 큐브 마스터 연구소 - 공간지각 학습 리포트
            </h1>
            <p className="text-xs font-bold text-slate-500 mt-1">
              발행일자: {new Date().toLocaleDateString('ko-KR')} | 학급: {student.className}
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full print:border print:border-emerald-500">
              {student.name} 학생
            </span>
          </div>
        </div>

        {/* Summary Stats Grid */}
        <div className="grid grid-cols-4 gap-3 text-center">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="text-xs text-slate-500 font-bold">현재 레벨</div>
            <div className="text-xl font-black text-slate-800 mt-1">Lv.{student.level}</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="text-xs text-slate-500 font-bold">큐브 에너지</div>
            <div className="text-xl font-black text-emerald-600 mt-1">{student.energy}⚡</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="text-xs text-slate-500 font-bold">최종시험 점수</div>
            <div className="text-xl font-black text-blue-600 mt-1">{student.highScore}점</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="text-xs text-slate-500 font-bold">도감 해금률</div>
            <div className="text-xl font-black text-amber-600 mt-1">
              {Math.round((student.unlockedShapeIds.length / 12) * 100)}%
            </div>
          </div>
        </div>

        {/* AI Weakness Analysis Section */}
        <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200 space-y-2">
          <h3 className="font-extrabold text-sm text-emerald-900">
            🤖 AI 오답 진단 및 맞춤 공간 감각 분석
          </h3>
          <p className="text-sm font-black text-slate-800">
            {aiResult.recommendationTitle}
          </p>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {aiResult.recommendationDetail}
          </p>
        </div>

        {/* Category Accuracy Table */}
        <div className="space-y-2">
          <h4 className="font-bold text-sm text-slate-700">영역별 세부 정확도</h4>
          <table className="w-full text-xs text-left border-collapse border border-slate-200">
            <thead>
              <tr className="bg-slate-100 font-bold text-slate-700">
                <th className="p-2.5 border border-slate-200">영역</th>
                <th className="p-2.5 border border-slate-200 text-center">풀이 수</th>
                <th className="p-2.5 border border-slate-200 text-center">정답 수</th>
                <th className="p-2.5 border border-slate-200 text-right">정답률</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(student.weaknessStats).map(([catKey, val]) => {
                const label = catKey === 'net' ? '전개도 파트' : catKey === 'rotation' ? '회전 감각 파트' : catKey === 'ortho' ? '투상도(위/앞/옆) 파트' : '큐브 조립 파트';
                const pct = val.total > 0 ? Math.round((val.correct / val.total) * 100) : 100;

                return (
                  <tr key={catKey} className="font-medium text-slate-800">
                    <td className="p-2.5 border border-slate-200 font-bold">{label}</td>
                    <td className="p-2.5 border border-slate-200 text-center">{val.total}회</td>
                    <td className="p-2.5 border border-slate-200 text-center">{val.correct}회</td>
                    <td className="p-2.5 border border-slate-200 text-right font-black text-emerald-600">{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Teacher / Parent Guidance Note */}
        <div className="border-t border-slate-200 pt-4 text-xs text-slate-500 font-medium space-y-1">
          <p>지도 교사 의견: 상기 학생은 3D 입체도형 큐브 마스터 연구소 과정을 성실히 이수하고 있습니다.</p>
          <p>큐브 마스터 연구소 (Cube Master Lab) 지도교사 직인: [인]</p>
        </div>

        {/* Non-Print Controls */}
        <div className="flex justify-end gap-3 pt-2 print:hidden">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
          >
            닫기
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20"
          >
            🖨️ PDF 리포트 인쇄 / 저장
          </button>
        </div>

      </div>
    </div>
  );
};
