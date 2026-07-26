import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // 1. 큐브 조립 (Assembly)
  {
    id: 'q_asm_1',
    category: 'assembly',
    stage: 1,
    questionText: '정육면체 1개의 면, 모서리, 꼭짓점의 개수로 바른 조합은 무엇일까요?',
    targetShapeId: 'cube_1',
    options: [
      { id: 0, text: '면 6개, 모서리 12개, 꼭짓점 8개' },
      { id: 1, text: '면 8개, 모서리 12개, 꼭짓점 6개' },
      { id: 2, text: '면 6개, 모서리 8개, 꼭짓점 12개' },
      { id: 3, text: '면 4개, 모서리 8개, 꼭짓점 6개' }
    ],
    correctAnswerIdx: 0,
    explanation: '정육면체는 6개의 정사각형 면, 12개의 모서리, 8개의 꼭짓점으로 이루어져 있습니다.',
    hint: '정육면체의 상하좌우전후 면의 수(6개)를 떠올려보세요.'
  },
  {
    id: 'q_asm_2',
    category: 'assembly',
    stage: 3,
    questionText: 'ㄱ자형 3큐브를 만들기 위해 필요한 최소 정육면체 개수는 몇 개일까요?',
    targetShapeId: 'cube_3_l',
    options: [
      { id: 0, text: '2개' },
      { id: 1, text: '3개' },
      { id: 2, text: '4개' },
      { id: 3, text: '5개' }
    ],
    correctAnswerIdx: 1,
    explanation: 'ㄱ자형 3큐브는 직각 방향으로 큐브 3개를 이어 붙여 만듭니다.',
    hint: '도형의 이름에 답이 나와있어요! (3큐브)'
  },
  {
    id: 'q_asm_3',
    category: 'assembly',
    stage: 4,
    questionText: '입체 L형(코너 3D) 큐브는 X, Y, Z 세 방향 축으로 큐브가 배치되어 있습니다. 총 사용된 큐브 부피는 몇 큐브일까요?',
    targetShapeId: 'cube_4_corner_3d',
    options: [
      { id: 0, text: '3큐브' },
      { id: 1, text: '4큐브' },
      { id: 2, text: '5큐브' },
      { id: 3, text: '6큐브' }
    ],
    correctAnswerIdx: 1,
    explanation: '중앙 1개 + X축 1개 + Y축 1개 + Z축 1개 = 총 4개의 정육면체로 이루어진 입체도형입니다.',
    hint: '원점 큐브를 포함해 3축으로 각각 1개씩 연결되어 있습니다.'
  },

  // 2. 같은 입체 찾기 (Rotation)
  {
    id: 'q_rot_1',
    category: 'rotation',
    stage: 3,
    questionText: '3D 화면에 보이는 입체도형을 90도 회전시켰을 때, 원래의 도형과 완전히 동일한 입체도형은 무엇일까요?',
    targetShapeId: 'cube_3_l',
    options: [
      { id: 0, text: 'ㄱ자형 3큐브' },
      { id: 1, text: '일자형 3큐브' },
      { id: 2, text: 'O형 4큐브' },
      { id: 3, text: '단일 큐브' }
    ],
    correctAnswerIdx: 0,
    explanation: 'ㄱ자형 3큐브는 회전하더라도 큐브들의 상대적 연결 위치가 변하지 않아 같은 입체도형입니다.',
    hint: '도형을 돌려도 모양 자체가 바뀌지 않는 동일한 도형을 고르세요.'
  },
  {
    id: 'q_rot_2',
    category: 'rotation',
    stage: 4,
    questionText: 'T형 4큐브를 시계방향으로 180도 회전시켰을 때 볼 수 있는 특징은 무엇일까요?',
    targetShapeId: 'cube_4_t',
    options: [
      { id: 0, text: 'T자가 뒤집힌 모양이 되며 여전히 T형 4큐브이다' },
      { id: 1, text: 'I형 4큐브로 변한다' },
      { id: 2, text: 'O형 4큐브로 변한다' },
      { id: 3, text: '입체 L형으로 변한다' }
    ],
    correctAnswerIdx: 0,
    explanation: '입체도형을 아무리 회전시켜도 구성 성분과 부피가 달라지지 않으므로 여전히 T형 4큐브입니다.',
    hint: '공간에서 위치나 방향만 바뀔 뿐 원래 도형의 종류는 변하지 않습니다.'
  },

  // 3. 위·앞·옆 모습 맞추기 (Orthographic views)
  {
    id: 'q_ortho_1',
    category: 'ortho',
    stage: 2,
    questionText: '가로로 놓인 "도미노 큐브(2큐브)"를 앞에서 보았을 때 보이는 정사각형의 개수는 몇 개일까요?',
    targetShapeId: 'cube_2_domino',
    options: [
      { id: 0, text: '1개' },
      { id: 1, text: '2개' },
      { id: 2, text: '3개' },
      { id: 3, text: '4개' }
    ],
    correctAnswerIdx: 1,
    explanation: '나란히 연결된 2개의 정육면체를 정면에서 보면 2개의 정사각형이 옆으로 이어진 모습이 보입니다.',
    hint: '옆으로 긴 도미노 큐브의 정면을 떠올려보세요.'
  },
  {
    id: 'q_ortho_2',
    category: 'ortho',
    stage: 4,
    questionText: '2x2 정사각형 모양의 "O형 4큐브"를 위, 앞, 옆 어느 방향에서 보아도 보이는 모양은 항상 어떤 모양일까요?',
    targetShapeId: 'cube_4_o',
    options: [
      { id: 0, text: '1x2 직사각형' },
      { id: 1, text: '2x2 정사각형 (또는 1x2 선형)' },
      { id: 2, text: '삼각형' },
      { id: 3, text: '원형' }
    ],
    correctAnswerIdx: 1,
    explanation: 'O형 4큐브는 평면에 2x2로 조립된 모양이므로 위에서 보면 2x2 정사각형이 보입니다.',
    hint: '2x2 배열을 위에서 내려다보는 모습을 상상해 보세요.'
  },

  // 4. 전개도 찾기 (Net)
  {
    id: 'q_net_1',
    category: 'net',
    stage: 1,
    questionText: '정육면체 1개의 올바른 전개도는 몇 개의 정사각형으로 이루어져 있을까요?',
    targetShapeId: 'cube_1',
    options: [
      { id: 0, text: '4개' },
      { id: 1, text: '5개' },
      { id: 2, text: '6개' },
      { id: 3, text: '8개' }
    ],
    correctAnswerIdx: 2,
    explanation: '정육면체는 6개의 면을 가지므로 전개도를 펼치면 반드시 6개의 정사각형이 됩니다.',
    hint: '주사위의 눈금 개수(1~6)와 같습니다.'
  },
  {
    id: 'q_net_2',
    category: 'net',
    stage: 4,
    questionText: '다음 중 정육면체의 전개도를 접었을 때, 서로 만나지 않는 (평행하게 마주보는) 두 면의 관계는 무엇일까요?',
    targetShapeId: 'cube_4_l',
    options: [
      { id: 0, text: '전개도에서 일렬로 이어진 3개 면 중 한 면을 건너뛴 두 면' },
      { id: 1, text: '서로 이웃하여 변을 공유하는 두 면' },
      { id: 2, text: '모서리 한 점만 공유하는 두 면' },
      { id: 3, text: '전개도에서 항상 가장 멀리 떨어진 두 면' }
    ],
    correctAnswerIdx: 0,
    explanation: '전개도를 접을 때 일렬로 배치된 면 중에서 한 면을 건너뛴 면이 서로 평행하게 마주보게 됩니다.',
    hint: '한 면을 건너뛰어 만나는 위치를 생각해보세요.'
  },

  // 5. 최종 시험 퀴즈 (Final Exam Extra Set)
  {
    id: 'q_final_1',
    category: 'assembly',
    stage: 4,
    questionText: '입체 T형(삼발이 3D) 큐브와 입체 L형(코너 3D) 큐브의 공통점으로 옳은 것은 무엇일까요?',
    targetShapeId: 'cube_4_tripod_3d',
    options: [
      { id: 0, text: '모두 4개의 정육면체로 구성되며 3차원 공간으로 뻗어있다.' },
      { id: 1, text: '모두 평면 상에만 놓여있다.' },
      { id: 2, text: '정육면체 3개로만 만들 수 있다.' },
      { id: 3, text: '접었을 때 정육면체가 된다.' }
    ],
    correctAnswerIdx: 0,
    explanation: '입체 T형과 입체 L형은 모두 4개의 큐브로 이루어져 있으며 평면을 벗어나 3차원 공간으로 뻗어있는 입체도형입니다.',
    hint: '3D 입체도형이라는 점과 큐브 개수(4개)를 떠올리세요.'
  },
  {
    id: 'q_final_2',
    category: 'rotation',
    stage: 4,
    questionText: '꼬인 3D형(소마 큐브) 입체를 회전시켰을 때 관찰할 수 있는 3차원 특징은 무엇일까요?',
    targetShapeId: 'cube_4_twisted',
    options: [
      { id: 0, text: '어느 방향에서 보아도 3차원 나선 형태로 꼬여있다.' },
      { id: 1, text: '완벽한 2D 평면 도형이다.' },
      { id: 2, text: '큐브가 총 2개뿐이다.' },
      { id: 3, text: '모든 면이 정삼각형이다.' }
    ],
    correctAnswerIdx: 0,
    explanation: '꼬인 3D형은 X, Y, Z 방향으로 층층이 꺾여 회전하더라도 입체감이 유지됩니다.',
    hint: '소마 큐브 조각 중 대표적인 3D 꼬임 조각입니다.'
  }
];
