import { CubeShape } from '../types';

export const CUBE_SHAPES: CubeShape[] = [
  // Stage 1 (1 Cube)
  {
    id: 'cube_1',
    name: '단일 큐브',
    stage: 1,
    cubeCount: 1,
    category: 'basic',
    description: '모든 입체도형의 기본 단위가 되는 1개의 정육면체입니다.',
    features: { faces: 6, edges: 12, vertices: 8 },
    cubes: [{ x: 0, y: 0, z: 0, color: '#3B82F6' }],
    orthoViews: {
      top:   [[true, false, false], [false, false, false], [false, false, false]],
      front: [[true, false, false], [false, false, false], [false, false, false]],
      side:  [[true, false, false], [false, false, false], [false, false, false]]
    }
  },

  // Stage 2 (2 Cubes)
  {
    id: 'cube_2_domino',
    name: '도미노 큐브',
    stage: 2,
    cubeCount: 2,
    category: 'basic',
    description: '정육면체 2개를 이어붙인 가장 간단한 직육면체 모양입니다.',
    features: { faces: 6, edges: 12, vertices: 8 },
    cubes: [
      { x: 0, y: 0, z: 0, color: '#3B82F6' },
      { x: 1, y: 0, z: 0, color: '#06B6D4' }
    ],
    orthoViews: {
      top:   [[true, true, false], [false, false, false], [false, false, false]],
      front: [[true, true, false], [false, false, false], [false, false, false]],
      side:  [[true, false, false], [false, false, false], [false, false, false]]
    }
  },

  // Stage 3 (3 Cubes)
  {
    id: 'cube_3_line',
    name: '일자형 3큐브',
    stage: 3,
    cubeCount: 3,
    category: 'line',
    description: '정육면체 3개를 일직선으로 길게 연결한 입체도형입니다.',
    features: { faces: 6, edges: 12, vertices: 8 },
    cubes: [
      { x: -1, y: 0, z: 0, color: '#3B82F6' },
      { x: 0, y: 0, z: 0, color: '#06B6D4' },
      { x: 1, y: 0, z: 0, color: '#10B981' }
    ],
    orthoViews: {
      top:   [[true, true, true], [false, false, false], [false, false, false]],
      front: [[true, true, true], [false, false, false], [false, false, false]],
      side:  [[true, false, false], [false, false, false], [false, false, false]]
    }
  },
  {
    id: 'cube_3_l',
    name: 'ㄱ자형 3큐브',
    stage: 3,
    cubeCount: 3,
    category: 'l_shape',
    description: '3개의 큐브를 직각으로 꺾어 ㄱ자 모양으로 만든 평면 입체도형입니다.',
    features: { faces: 8, edges: 16, vertices: 10 },
    cubes: [
      { x: 0, y: 0, z: 0, color: '#3B82F6' },
      { x: 1, y: 0, z: 0, color: '#06B6D4' },
      { x: 0, y: 1, z: 0, color: '#10B981' }
    ],
    orthoViews: {
      top:   [[true, true, false], [false, false, false], [false, false, false]],
      front: [[true, true, false], [true, false, false], [false, false, false]],
      side:  [[true, false, false], [true, false, false], [false, false, false]]
    }
  },

  // Stage 4 (4 Cubes - Tetracubes 8 shapes)
  {
    id: 'cube_4_i',
    name: 'I형 4큐브',
    stage: 4,
    cubeCount: 4,
    category: 'i_shape',
    description: '4개의 큐브를 나란히 일직선으로 길게 늘어놓은 모양입니다.',
    features: { faces: 6, edges: 12, vertices: 8 },
    cubes: [
      { x: -1, y: 0, z: 0, color: '#3B82F6' },
      { x: 0, y: 0, z: 0, color: '#06B6D4' },
      { x: 1, y: 0, z: 0, color: '#10B981' },
      { x: 2, y: 0, z: 0, color: '#F59E0B' }
    ],
    orthoViews: {
      top:   [[true, true, true], [true, false, false], [false, false, false]],
      front: [[true, true, true], [true, false, false], [false, false, false]],
      side:  [[true, false, false], [false, false, false], [false, false, false]]
    }
  },
  {
    id: 'cube_4_o',
    name: 'O형 4큐브',
    stage: 4,
    cubeCount: 4,
    category: 'o_shape',
    description: '4개의 큐브를 2x2 정사각형 형태로 모아 만든 도톰한 입체입니다.',
    features: { faces: 6, edges: 12, vertices: 8 },
    cubes: [
      { x: 0, y: 0, z: 0, color: '#3B82F6' },
      { x: 1, y: 0, z: 0, color: '#06B6D4' },
      { x: 0, y: 1, z: 0, color: '#10B981' },
      { x: 1, y: 1, z: 0, color: '#F59E0B' }
    ],
    orthoViews: {
      top:   [[true, true, false], [false, false, false], [false, false, false]],
      front: [[true, true, false], [true, true, false], [false, false, false]],
      side:  [[true, true, false], [false, false, false], [false, false, false]]
    }
  },
  {
    id: 'cube_4_l',
    name: 'L형 4큐브',
    stage: 4,
    cubeCount: 4,
    category: 'l_shape',
    description: '3개의 긴 축 끝에 1개를 직각으로 이어붙인 L자형 평면 입체입니다.',
    features: { faces: 10, edges: 20, vertices: 12 },
    cubes: [
      { x: 0, y: 0, z: 0, color: '#3B82F6' },
      { x: 1, y: 0, z: 0, color: '#06B6D4' },
      { x: 2, y: 0, z: 0, color: '#10B981' },
      { x: 0, y: 1, z: 0, color: '#F59E0B' }
    ],
    orthoViews: {
      top:   [[true, true, true], [false, false, false], [false, false, false]],
      front: [[true, true, true], [true, false, false], [false, false, false]],
      side:  [[true, false, false], [true, false, false], [false, false, false]]
    }
  },
  {
    id: 'cube_4_t',
    name: 'T형 4큐브',
    stage: 4,
    cubeCount: 4,
    category: 't_shape',
    description: '3개 큐브의 중앙에 큐브 1개를 세로로 튀어나오게 붙인 T자형 입체입니다.',
    features: { faces: 10, edges: 20, vertices: 12 },
    cubes: [
      { x: -1, y: 0, z: 0, color: '#3B82F6' },
      { x: 0, y: 0, z: 0, color: '#06B6D4' },
      { x: 1, y: 0, z: 0, color: '#10B981' },
      { x: 0, y: 1, z: 0, color: '#F59E0B' }
    ],
    orthoViews: {
      top:   [[true, true, true], [false, false, false], [false, false, false]],
      front: [[true, true, true], [false, true, false], [false, false, false]],
      side:  [[true, false, false], [true, false, false], [false, false, false]]
    }
  },
  {
    id: 'cube_4_s',
    name: 'S형 4큐브',
    stage: 4,
    cubeCount: 4,
    category: 's_shape',
    description: '2개씩 엇갈리게 지그재그 모양으로 연결한 S자(Z자) 형태입니다.',
    features: { faces: 10, edges: 20, vertices: 12 },
    cubes: [
      { x: 0, y: 0, z: 0, color: '#3B82F6' },
      { x: 1, y: 0, z: 0, color: '#06B6D4' },
      { x: 1, y: 1, z: 0, color: '#10B981' },
      { x: 2, y: 1, z: 0, color: '#F59E0B' }
    ],
    orthoViews: {
      top:   [[true, true, true], [false, false, false], [false, false, false]],
      front: [[true, true, false], [false, true, true], [false, false, false]],
      side:  [[true, true, false], [false, false, false], [false, false, false]]
    }
  },
  {
    id: 'cube_4_corner_3d',
    name: '입체 L형 (코너 3D)',
    stage: 4,
    cubeCount: 4,
    category: 'corner_3d',
    description: 'X, Y, Z 세 축으로 큐브가 번갈아 뻗어나가는 대표적인 3차원 입체도형입니다.',
    features: { faces: 10, edges: 20, vertices: 12 },
    cubes: [
      { x: 0, y: 0, z: 0, color: '#3B82F6' },
      { x: 1, y: 0, z: 0, color: '#06B6D4' },
      { x: 0, y: 1, z: 0, color: '#10B981' },
      { x: 0, y: 0, z: 1, color: '#8B5CF6' }
    ],
    orthoViews: {
      top:   [[true, true, false], [true, false, false], [false, false, false]],
      front: [[true, true, false], [true, false, false], [false, false, false]],
      side:  [[true, true, false], [true, false, false], [false, false, false]]
    }
  },
  {
    id: 'cube_4_tripod_3d',
    name: '입체 T형 (삼발이 3D)',
    stage: 4,
    cubeCount: 4,
    category: 'tripod_3d',
    description: '중앙 큐브를 기준으로 3방향 공간으로 뻗어나간 삼발이 모양 3D 큐브입니다.',
    features: { faces: 10, edges: 20, vertices: 12 },
    cubes: [
      { x: 0, y: 0, z: 0, color: '#3B82F6' },
      { x: 1, y: 0, z: 0, color: '#06B6D4' },
      { x: -1, y: 0, z: 0, color: '#10B981' },
      { x: 0, y: 0, z: 1, color: '#8B5CF6' }
    ],
    orthoViews: {
      top:   [[true, true, true], [false, true, false], [false, false, false]],
      front: [[true, true, true], [false, false, false], [false, false, false]],
      side:  [[true, true, false], [false, false, false], [false, false, false]]
    }
  },
  {
    id: 'cube_4_twisted',
    name: '꼬인 3D형 (소마 큐브)',
    stage: 4,
    cubeCount: 4,
    category: 'twisted_3d',
    description: '나선 방향으로 입체적으로 꼬여 만들어진 소마 큐브 핵심 입체입니다.',
    features: { faces: 10, edges: 20, vertices: 12 },
    cubes: [
      { x: 0, y: 0, z: 0, color: '#3B82F6' },
      { x: 1, y: 0, z: 0, color: '#06B6D4' },
      { x: 1, y: 1, z: 0, color: '#10B981' },
      { x: 1, y: 1, z: 1, color: '#8B5CF6' }
    ],
    orthoViews: {
      top:   [[true, true, false], [false, true, false], [false, false, false]],
      front: [[true, true, false], [false, true, false], [false, false, false]],
      side:  [[true, false, false], [true, true, false], [false, false, false]]
    }
  }
];
