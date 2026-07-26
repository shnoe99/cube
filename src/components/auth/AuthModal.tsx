import React, { useState } from 'react';
import { AuthService } from '../../services/firebase';
import { AudioEngine } from '../../services/audioEngine';
import { StorageService } from '../../services/storageService';
import { UserProfile } from '../../types';
import { LogIn, UserCheck, Sparkles, X, ShieldAlert } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onUserUpdate: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onUserUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    AudioEngine.playClick();

    try {
      const fbUser = await AuthService.loginWithGoogle();
      if (fbUser) {
        AudioEngine.playCorrect();
        const profile = StorageService.getUserProfile();
        profile.uid = fbUser.uid;
        profile.name = fbUser.displayName || '구글 큐브탐험가';
        StorageService.saveUserProfile(profile);
        onUserUpdate(profile);
        onClose();
      }
    } catch (err) {
      setErrorMsg('구글 로그인에 실패했습니다. 익명 로그인을 이용해보세요.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    AudioEngine.playClick();

    try {
      const fbUser = await AuthService.loginAnonymously();
      if (fbUser) {
        AudioEngine.playCorrect();
        const profile = StorageService.getUserProfile();
        profile.uid = fbUser.uid || 'guest_' + Date.now();
        profile.name = '익명 큐브연구원';
        StorageService.saveUserProfile(profile);
        onUserUpdate(profile);
        onClose();
      }
    } catch (err) {
      setErrorMsg('익명 로그인 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative animate-fadeIn border-4 border-blue-500/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-emerald-400 p-0.5 shadow-lg shadow-blue-500/20 mx-auto flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-3xl">
              🧊
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">
              연구원 로그인
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              구글 계정 또는 익명 게스트로 큐브 마스터에 도전하세요!
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-2xl text-xs font-bold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="space-y-3 pt-2">
          {/* Google Login Button */}
          <button
            disabled={loading}
            onClick={handleGoogleLogin}
            className="w-full bg-white border-2 border-slate-200 hover:border-blue-500 text-slate-700 font-extrabold py-3.5 px-4 rounded-2xl shadow-sm hover:shadow-md flex items-center justify-center gap-3 transition-all group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span className="text-sm">Google 계정으로 로그인</span>
          </button>

          {/* Anonymous Login Button */}
          <button
            disabled={loading}
            onClick={handleAnonymousLogin}
            className="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-transform hover:scale-105"
          >
            <UserCheck className="w-5 h-5" />
            <span className="text-sm">익명(게스트) 연구원으로 시작</span>
          </button>
        </div>

        <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100 text-center">
          <p className="text-[11px] font-bold text-blue-900 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>로그인 시 도전 과제 및 큐브 에너지가 자동 저장됩니다!</span>
          </p>
        </div>
      </div>
    </div>
  );
};
