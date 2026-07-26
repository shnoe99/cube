import React from 'react';
import { UserProfile } from '../../types';
import { AudioEngine } from '../../services/audioEngine';
import { Printer, Award, FileText, CheckCircle, ShieldCheck } from 'lucide-react';

export interface StudentPdfReportProps {
  student: UserProfile;
  onClose?: () => void;
}

export const StudentPdfReport: React.FC<StudentPdfReportProps> = ({ student }) => {
  const handlePrint = () => {
    AudioEngine.playClick();
    window.print();
  };

  const netStats = student.weaknessStats.net;
  const netAcc = netStats.total > 0 ? Math.round((netStats.correct / netStats.total) * 100) : 100;

  return (
    <div className="bg-purple-950/60 p-4 rounded-2xl border border-purple-700 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <FileText className="w-5 h-5 text-yellow-300" />
        <span className="text-xs font-bold text-purple-200">
          전개도 정답률: <strong className="text-yellow-300">{netAcc}%</strong> · 총 퀴즈 풀이: {netStats.total}문제
        </span>
      </div>

      <button
        onClick={handlePrint}
        className="bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md"
      >
        <Printer className="w-4 h-4" />
        <span>PDF 리포트 인쇄 / 저장</span>
      </button>
    </div>
  );
};
