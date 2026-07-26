import { CubeShape } from '../types';

export const CUBE_SHAPES: CubeShape[] = [
  // Stage 1: 1 Cube
  {
    id: 'cube-1',
    name: '단일 정육면체',
    stage: 1,
    cubeCount: 1,
    cubes: [[0, 0, 0]],
    description: '모든 면이 정사각형인 기본 1개의 정육면체입니다.',
    faces: 6,
    edges: 12,
    vertices: 8
  },

  // Stage 2: 2 Cubes
  {
    id: 'cube-2-domino',
    name: '직육면체 2큐브',
    stage: 2,
    cubeCount: 2,
    cubes: [[0, 0, 0], [1, 0, 0]],
    description: '정육면체 2개를 이어붙여 만든 직육면체 모양입니다.',
    faces: 10,
    edges: 20,
    vertices: 12
  },

  // Stage 3: 3 Cubes
  {
    id: 'cube-3-line',
    name: '일자형 3큐브',
    stage: 3,
    cubeCount: 3,
    cubes: [[-1, 0, 0], [0, 0, 0], [1, 0, 0]],
    description: '정육면체 3개를 나란히 1자형으로 연결한 모양입니다.',
    faces: 14,
    edges: 28,
    vertices: 16
  },
  {
    id: 'cube-3-lshape',
    name: 'ㄱ자형 3큐브 (트라이큐브)',
    stage: 3,
    cubeCount: 3,
    cubes: [[0, 0, 0], [1, 0, 0], [0, 1, 0]],
    description: '정육면체 3개를 직각(ㄱ자)으로 배치한 모양입니다.',
    faces: 14,
    edges: 28,
    vertices: 16
  },

  // Stage 4: 4 Cubes (Tetracubes)
  {
    id: 'cube-4-i',
    name: 'I형 테트라큐브',
    stage: 4,
    cubeCount: 4,
    cubes: [[-1.5, 0, 0], [-0.5, 0, 0], [0.5, 0, 0], [1.5, 0, 0]],
    description: '정육면체 4개를 일렬로 길게 늘린 I자 모양입니다.',
    faces: 18,
    edges: 36,
    vertices: 20
  },
  {
    id: 'cube-4-o',
    name: 'O형 테트라큐브 (정사각형)',
    stage: 4,
    cubeCount: 4,
    cubes: [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0]],
    description: '정육면체 4개를 2x2 정사각형 형태로 배치한 모양입니다.',
    faces: 16,
    edges: 32,
    vertices: 16
  },
  {
    id: 'cube-4-l',
    name: 'L형 테트라큐브',
    stage: 4,
    cubeCount: 4,
    cubes: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 1, 0]],
    description: '3개를 잇고 한쪽에 1개를 덧붙인 평면 L자 모양입니다.',
    faces: 18,
    edges: 36,
    vertices: 20
  },
  {
    id: 'cube-4-t',
    name: 'T형 테트라큐브',
    stage: 4,
    cubeCount: 4,
    cubes: [[-1, 0, 0], [0, 0, 0], [1, 0, 0], [0, 1, 0]],
    description: '중앙을 중심으로 4방향 중 3곳에 큐브를 붙인 T자 모양입니다.',
    faces: 18,
    edges: 36,
    vertices: 20
  },
  {
    id: 'cube-4-s',
    name: 'S형/Z형 테트라큐브',
    stage: 4,
    cubeCount: 4,
    cubes: [[0, 0, 0], [1, 0, 0], [1, 1, 0], [2, 1, 0]],
    description: '지그재그 형태로 엇갈리게 큐브 4개를 이은 Z자/S자 모양입니다.',
    faces: 18,
    edges: 36,
    vertices: 20
  },
  {
    id: 'cube-4-3dl',
    name: '입체 L형 테트라큐브',
    stage: 4,
    cubeCount: 4,
    cubes: [[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]],
    description: '3차원 공간에서 z축 방향으로 솟아오른 3D 입체 L형 큐브입니다.',
    faces: 18,
    edges: 36,
    vertices: 20
  },
  {
    id: 'cube-4-3dt',
    name: '입체 T형 테트라큐브',
    stage: 4,
    cubeCount: 4,
    cubes: [[-1, 0, 0], [0, 0, 0], [1, 0, 0], [0, 0, 1]],
    description: '바닥 일자형 3개 위에 z축으로 큐브 1개가 올라간 입체 T자입니다.',
    faces: 18,
    edges: 36,
    vertices: 20
  },
  {
    id: 'cube-4-twisted',
    name: '입체 꼬인형 3D 큐브 (소마 큐브 조각)',
    stage: 4,
    cubeCount: 4,
    cubes: [[0, 0, 0], [1, 0, 0], [1, 1, 0], [1, 1, 1]],
    description: '소마 큐브 핵심 조각으로 3차원 공간에서 꼬여있는 입체 구조입니다.',
    faces: 18,
    edges: 36,
    vertices: 20
  }
];
