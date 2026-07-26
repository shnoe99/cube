import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // 1. Assembly Category
  {
    id: 'q-ass-1',
    category: 'assembly',
    question: '정육면체 3개를 직각(ㄱ자) 모양으로 연결할 때 필요한 최소 큐브 수는?',
    shapeId: 'cube-3-lshape',
    options: ['2개', '3개', '4개', '5개'],
    correctIndex: 1,
    explanation: 'ㄱ자형 트라이큐브는 정육면체 3개로 구성되어 있습니다.',
    points: 10
  },
  {
    id: 'q-ass-2',
    category: 'assembly',
    question: '2x2 정사각형 모양의 O형 테트라큐브를 만드는데 필요한 정육면체의 개수는?',
    shapeId: 'cube-4-o',
    options: ['3개', '4개', '5개', '6개'],
    correctIndex: 1,
    explanation: '2x2 형태의 정사각형 테트라큐브는 4개의 정육면체로 이루어져 있습니다.',
    points: 10
  },
  {
    id: 'q-ass-3',
    category: 'assembly',
    question: '소마 큐브의 꼬인형 3D 조각을 이루는 정육면체 부피 단위는?',
    shapeId: 'cube-4-twisted',
    options: ['3단위', '4단위', '5단위', '6단위'],
    correctIndex: 1,
    explanation: '꼬인형 3D 조각은 테트라큐브의 한 종류로 4개의 단위 큐브로 이루어져 있습니다.',
    points: 10
  },

  // 2. Rotation Category
  {
    id: 'q-rot-1',
    category: 'rotation',
    question: '일자형 3큐브를 x축으로 90도 회전시켰을 때 모양 변화는?',
    shapeId: 'cube-3-line',
    options: ['ㄱ자 모양이 된다', '여전히 일자형 모양이다', '정사각형이 된다', '부피가 늘어난다'],
    correctIndex: 1,
    explanation: '일자형 3큐브를 축 중심으로 회전해도 본래의 일자형 형태는 변하지 않습니다.',
    points: 10
  },
  {
    id: 'q-rot-2',
    category: 'rotation',
    question: '입체 L자형 테트라큐브를 360도 한 바퀴 완전히 회전하면 겉보기 모양은?',
    shapeId: 'cube-4-3dl',
    options: ['완전히 원래 모양으로 돌아온다', 'I자형으로 변한다', 'O자형으로 변한다', 'Z자형으로 변한다'],
    correctIndex: 0,
    explanation: '어떤 3D 입체도형이든 360도 회전하면 처음 위치와 모양으로 완벽히 돌아옵니다.',
    points: 10
  },

  // 3. Orthographic View Category
  {
    id: 'q-ort-1',
    category: 'ortho',
    question: '단일 정육면체(1큐브)를 위, 앞, 옆 3가지 방향에서 바라본 모습은 모두 무슨 모양인가요?',
    shapeId: 'cube-1',
    options: ['직사각형', '정사각형', '삼각형', '원형'],
    correctIndex: 1,
    explanation: '정육면체는 6개의 모든 면이 합동인 정사각형이므로 투상도 역시 모두 정사각형입니다.',
    points: 10
  },
  {
    id: 'q-ort-2',
    category: 'ortho',
    question: 'I형 테트라큐브(4개 1자)를 앞에서 바라보았을 때 가로로 늘어선 정사각형의 개수는?',
    shapeId: 'cube-4-i',
    options: ['2개', '3개', '4개', '5개'],
    correctIndex: 2,
    explanation: 'I형 테트라큐브는 4개의 정육면체가 길게 늘어서 있으므로 정면 투상도에 정사각형 4개가 보입니다.',
    points: 10
  },

  // 4. Net Category
  {
    id: 'q-net-1',
    category: 'net',
    question: '정육면체의 전개도를 접어서 완성했을 때 마주보는 면의 총 쌍(pair) 수는?',
    shapeId: 'cube-1',
    options: ['2쌍', '3쌍', '4쌍', '6쌍'],
    correctIndex: 1,
    explanation: '정육면체는 총 6개의 면으로 구성되어 있으며, 마주보는 면은 3쌍(상하, 좌우, 앞뒤)입니다.',
    points: 10
  },
  {
    id: 'q-net-2',
    category: 'net',
    question: '정육면체 전개도를 접을 때 서로 겹쳐서 완성할 수 없는 전개도의 특징은?',
    shapeId: 'cube-1',
    options: ['면 6개가 연결되어 있다', '접었을 때 면 2개가 겹쳐버린다', '마주보는 면이 3쌍이다', '모서리가 맞아떨어진다'],
    correctIndex: 1,
    explanation: '올바르지 않은 전개도는 접는 과정에서 면들이 겹치거나 막히지 않은 빈 공간이 생깁니다.',
    points: 10
  }
];
