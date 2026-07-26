import React from 'react';
import { UserProfile } from '../../types';
import { AIEngine } from '../../services/aiEngine';
import { Sparkles, ArrowRight, X } from 'lucide-react';

interface AITutorModalProps {
  user: UserProfile;
  onClose: () => void;
  onSelectGame: (gameType: 'assembly' | 'rotation' | 'ortho' | 'net' | 'final') => void;
}

export const AITutorModal: React.FC<AITutorModalProps> = ({ user, onClose, onSelectGame }) => {
  const result = AIEngine.analyzeUserProfile(user);

  const handleAction = () => {
    onClose();
    onSelectGame(result.primaryWeaknessCategory);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center font-black shadow-md shadow-amber-500/20 shrink-0">
            <Sparkles className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              AI 공간지각 조수 진단
            </span>
            <h3 className="text-xl font-black text-slate-800 mt-0.5">
              맞춤 학습 오답 분석
            </h3>
          </div>
        </div>

        <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 space-y-2">
          <h4 className="font-black text-sm text-amber-900">
            {result.recommendationTitle}
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {result.recommendationDetail}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500">
            <span>취약 유형 정답률 ({result.weaknessLabel})</span>
            <span className="text-amber-600 font-extrabold">{result.accuracy}%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
              style={{ width: `${result.accuracy}%` }}
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleAction}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-transform hover:scale-105"
          >
            <span>{result.suggestedActionText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
