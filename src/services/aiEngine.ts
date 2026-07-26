import { UserProfile } from '../types';

export interface AIAnalysisResult {
  primaryWeaknessCategory: 'net' | 'rotation' | 'ortho' | 'assembly';
  weaknessLabel: string;
  accuracy: number;
  recommendationTitle: string;
  recommendationDetail: string;
  suggestedActionText: string;
}

export const AIEngine = {
  analyzeUserProfile: (profile: UserProfile): AIAnalysisResult => {
    const stats = profile.weaknessStats;
    const categories: Array<'net' | 'rotation' | 'ortho' | 'assembly'> = ['net', 'rotation', 'ortho', 'assembly'];

    let lowestCategory: 'net' | 'rotation' | 'ortho' | 'assembly' = 'net';
    let lowestAcc = 1.0;
    let totalAttempts = 0;

    categories.forEach(cat => {
      const c = stats[cat];
      totalAttempts += c.total;
      if (c.total > 0) {
        const acc = c.correct / c.total;
        if (acc < lowestAcc) {
          lowestAcc = acc;
          lowestCategory = cat;
        }
      }
    });

    if (totalAttempts < 3) {
      return {
        primaryWeaknessCategory: 'net',
        weaknessLabel: '학습 데이터 축적 중',
        accuracy: 100,
        recommendationTitle: '🧪 AI 조수의 탐색 중!',
        recommendationDetail: '아직 문제를 더 풀어봐야 정확한 공간지각 취약점을 분석할 수 있어요! 퀴즈와 미니게임을 즐겁게 풀어보세요.',
        suggestedActionText: '스테이지 모드로 이동하기'
      };
    }

    const accuracyPct = Math.round(lowestAcc * 100);

    if (lowestCategory === 'net') {
      return {
        primaryWeaknessCategory: 'net',
        weaknessLabel: '3D 전개도 파트',
        accuracy: accuracyPct,
        recommendationTitle: '📐 AI 진단: 전개도 공간지각 보완 필요!',
        recommendationDetail: `현재 전개도 정답률이 ${accuracyPct}%로 머릿속에서 전개도를 접었을 때 마주보는 면을 찾는 훈련이 도움됩니다.`,
        suggestedActionText: '전개도 집중 훈련 퀴즈 풀기'
      };
    } else if (lowestCategory === 'rotation') {
      return {
        primaryWeaknessCategory: 'rotation',
        weaknessLabel: '3D 회전 감각 파트',
        accuracy: accuracyPct,
        recommendationTitle: '🔄 AI 진단: 3D 도형 회전 감각 보완 필요!',
        recommendationDetail: `현재 회전 문제 정답률이 ${accuracyPct}%입니다. 입체도형을 x축, y축으로 돌렸을 때 같은 모양인지 3D 뷰어로 직접 회전해보세요!`,
        suggestedActionText: '같은 입체 찾기 미니게임 플레이'
      };
    } else if (lowestCategory === 'ortho') {
      return {
        primaryWeaknessCategory: 'ortho',
        weaknessLabel: '위·앞·옆 투상도 파트',
        accuracy: accuracyPct,
        recommendationTitle: '👁️ AI 진단: 투상도 (위·앞·옆 모습) 보완 필요!',
        recommendationDetail: `현재 위·앞·옆 모습 정답률이 ${accuracyPct}%입니다. 3D 입체를 각 방향에서 바라보았을 때 가려지는 면의 개수를 따져보는 연습을 권장합니다.`,
        suggestedActionText: '위·앞·옆 모습 맞추기 시작'
      };
    } else {
      return {
        primaryWeaknessCategory: 'assembly',
        weaknessLabel: '큐브 조립 파트',
        accuracy: accuracyPct,
        recommendationTitle: '🧩 AI 진단: 큐브 조립 및 공간 구성 보완 필요!',
        recommendationDetail: `현재 큐브 조립 정답률이 ${accuracyPct}%입니다. 1~4개 큐브의 부피와 모서리 연결 규칙을 3D 도감에서 다시 확인해보세요.`,
        suggestedActionText: '큐브 조립 미니게임 시작'
      };
    }
  }
};
