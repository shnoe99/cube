import React from 'react';
import { StorageService } from '../../services/storageService';
import { AudioEngine } from '../../services/audioEngine';
import { Volume2, VolumeX, RotateCcw, ShieldCheck, Database } from 'lucide-react';

interface SettingsModalProps {
  soundMuted: boolean;
  setSoundMuted: (muted: boolean) => void;
  onReset: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  soundMuted,
  setSoundMuted,
  onReset
}) => {
  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    AudioEngine.muted = next;
    if (!next) AudioEngine.playClick();
  };

  const handleResetData = () => {
    if (window.confirm('모든 학습 기록과 큐브 에너지를 초기화하시겠습니까?')) {
      StorageService.resetData();
      onReset();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800">환경설정 (Settings)</h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            사운드 효과음, 오프라인 데이터 동기화 상태 및 연구 기록 관리
          </p>
        </div>

        <div className="space-y-4">
          {/* Sound Toggle Card */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                {soundMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-800">효과음 및 사운드</h4>
                <p className="text-xs text-slate-400">버튼 클릭 및 정답 축하 사운드 켜기/끄기</p>
              </div>
            </div>

            <button
              onClick={toggleSound}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-colors ${
                soundMuted ? 'bg-red-100 text-red-700' : 'bg-blue-600 text-white'
              }`}
            >
              {soundMuted ? '음소거됨' : '사운드 켜짐'}
            </button>
          </div>

          {/* Offline Sync Indicator */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-800">데이터 저장소 상태</h4>
                <p className="text-xs text-slate-400">Firestore 및 LocalStorage 오프라인 자동 동기화 활성화</p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>정상 동기화 중</span>
            </span>
          </div>

          {/* Data Reset */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-red-50/50 border border-red-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-red-900">학습 데이터 초기화</h4>
                <p className="text-xs text-red-600">모든 큐브 에너지, 레벨, 도감 해금 기록 리셋</p>
              </div>
            </div>

            <button
              onClick={handleResetData}
              className="px-4 py-2 rounded-xl text-xs font-black bg-red-600 text-white hover:bg-red-700"
            >
              초기화 실행
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
