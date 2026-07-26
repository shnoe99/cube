import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { AuthService } from '../../services/firebase';
import { StorageService } from '../../services/storageService';
import { AudioEngine } from '../../services/audioEngine';
import { LogIn, UserCheck, Sparkles, Flame, ShieldAlert, Check } from 'lucide-react';

interface InitialLoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

const AVATARS = ['🧊 큐브봇', '🐶 멍뭉이', '🐱 냥냥이', '🦊 여우', '🐼 판다', '🚀 로켓보이'];

export const InitialLoginScreen: React.FC<InitialLoginScreenProps> = ({ onLoginSuccess }) => {
  const [nickname, setNickname] = useState('큐브탐험가');
  const [selectedAvatar, setSelectedAvatar] = useState('🧊 큐브봇');
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
        profile.name = fbUser.displayName || nickname;
        profile.avatar = selectedAvatar;
        profile.isLoggedIn = true;
        StorageService.saveUserProfile(profile);
        onLoginSuccess(profile);
      }
    } catch (err) {
      setErrorMsg('구글 로그인에 실패했습니다. 익명 로그인을 이용해보세요.');
      console.error(err);
    } fontally: {
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
        profile.name = nickname || '익명 큐브연구원';
        profile.avatar = selectedAvatar;
        profile.isLoggedIn = true;
        StorageService.saveUserProfile(profile);
        onLoginSuccess(profile);
      }
    } catch (err) {
      setErrorMsg('익명 로그인 처리 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-950 flex items-center justify-center p-4 selection:bg-yellow-300 selection:text-purple-950">
      <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 rounded-3xl p-8 sm:p-12 max-w-lg w-full text-white shadow-2xl border-4 border-yellow-400 space-y-6 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        {/* Title Header */}
        <div className="text-center space-y-3 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-yellow-400 via-amber-300 to-orange-400 p-1 shadow-lg shadow-yellow-400/20 mx-auto flex items-center justify-center">
            <div className="w-full h-full bg-purple-950 rounded-xl flex items-center justify-center text-3xl font-black">
              🧊
            </div>
          </div>
          <div>
            <span className="bg-yellow-400 text-purple-950 font-black text-xs px-3.5 py-1 rounded-full shadow-md">
              Easy & Fun QuizN 3D
            </span>
            <h1 className="text-3xl font-black text-yellow-300 mt-2">
              큐브앤 입구에 오신 것을 환영합니다!
            </h1>
            <p className="text-xs font-bold text-purple-200 mt-1">
              시작 전 로그인 방식과 캐릭터 아바타를 선택하세요.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-900/90 border border-red-400 text-red-200 p-3 rounded-2xl text-xs font-bold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Nickname Input */}
        <div className="space-y-1.5 relative z-10">
          <label className="text-xs font-black text-yellow-300">
            1. 퀴즈쇼 닉네임 설정
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임 입력"
            className="w-full bg-purple-950 border-2 border-purple-600 rounded-2xl py-3 px-4 text-center font-black text-lg text-yellow-300 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Avatar Selector */}
        <div className="space-y-2 relative z-10">
          <label className="text-xs font-black text-yellow-300">
            2. 대표 캐릭터 아바타 선택
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
                className={`p-3 rounded-2xl border-2 font-black text-xs transition-all flex flex-col items-center gap-1 ${
                  selectedAvatar === av
                    ? 'bg-yellow-400 text-purple-950 border-white scale-105 shadow-lg'
                    : 'bg-purple-950/80 text-purple-200 border-purple-700 hover:bg-purple-900'
                }`}
              >
                <span className="text-2xl">{av.split(' ')[0]}</span>
                <span className="text-[11px]">{av.split(' ')[1]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Login Selection Buttons */}
        <div className="space-y-3 pt-2 relative z-10">
          <label className="text-xs font-black text-yellow-300">
            3. 로그인 방식 선택하기
          </label>

          {/* Option 1: Google Login */}
          <button
            disabled={loading}
            onClick={handleGoogleLogin}
            className="w-full bg-white hover:bg-slate-100 text-slate-900 font-extrabold py-4 px-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-transform hover:scale-105 group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span className="text-base font-black">Google 계정으로 시작하기</span>
          </button>

          {/* Option 2: Anonymous Login */}
          <button
            disabled={loading}
            onClick={handleAnonymousLogin}
            className="w-full bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-purple-950 font-black py-4 px-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-105 text-base"
          >
            <UserCheck className="w-5 h-5 text-purple-950" />
            <span>익명 (게스트) 연구원으로 시작하기</span>
          </button>
        </div>

        <div className="bg-purple-950 p-3.5 rounded-2xl border border-purple-700 text-center">
          <p className="text-[11px] font-bold text-purple-200 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>로그인 시 12종 도감 해금 기록과 큐브 에너지가 자동 보존됩니다</span>
          </p>
        </div>

      </div>
    </div>
  );
};
