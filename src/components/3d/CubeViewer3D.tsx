import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface CubeViewer3DProps {
  cubes: Array<[number, number, number] | { x: number; y: number; z: number }>;
  height?: number;
  autoRotate?: boolean;
  interactive?: boolean;
  highlightIndex?: number;
}

export const CubeViewer3D: React.FC<CubeViewer3DProps> = ({
  cubes,
  height = 240,
  autoRotate = true,
  interactive = true,
  highlightIndex
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / height, 0.1, 1000);
    camera.position.set(4, 4, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xf59e0b, 1.5, 20);
    pointLight.position.set(-5, 5, -5);
    scene.add(pointLight);

    // 3. Group & Cube Meshes
    const pivotGroup = new THREE.Group();
    const cubeGeo = new THREE.BoxGeometry(0.94, 0.94, 0.94);

    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;

    // Standardize positions array
    const parsedPositions = cubes.map((c) => {
      if (Array.isArray(c)) {
        return { x: c[0], y: c[1], z: c[2] };
      }
      return { x: c.x, y: c.y, z: c.z };
    });

    parsedPositions.forEach((p) => {
      minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
      minZ = Math.min(minZ, p.z); maxZ = Math.max(maxZ, p.z);
    });

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const centerZ = (minZ + maxZ) / 2;

    parsedPositions.forEach((p, idx) => {
      const isHighlighted = idx === highlightIndex;
      const mat = new THREE.MeshStandardMaterial({
        color: isHighlighted ? 0xef4444 : 0x3b82f6,
        roughness: 0.2,
        metalness: 0.1
      });

      const mesh = new THREE.Mesh(cubeGeo, mat);
      mesh.position.set(p.x - centerX, p.y - centerY, p.z - centerZ);

      // Edges geometry
      const edges = new THREE.EdgesGeometry(cubeGeo);
      const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
      const wireframe = new THREE.LineSegments(edges, lineMat);
      mesh.add(wireframe);

      pivotGroup.add(mesh);
    });

    scene.add(pivotGroup);

    // 4. Interaction Events (Mouse/Touch Drag Rotation)
    const handleMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !interactive) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      pivotGroup.rotation.y += deltaX * 0.01;
      pivotGroup.rotation.x += deltaY * 0.01;

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    if (interactive) {
      container.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    // 5. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (autoRotate && !isDraggingRef.current) {
        pivotGroup.rotation.y += 0.012;
      }
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        container.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [cubes, height, autoRotate, interactive, highlightIndex]);

  return (
    <div
      ref={mountRef}
      style={{ height: `${height}px` }}
      className="w-full relative cursor-grab active:cursor-grabbing select-none"
    />
  );
};
