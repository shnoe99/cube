import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CubePos } from '../../types';

interface CubeViewer3DProps {
  cubes: CubePos[];
  autoRotate?: boolean;
  interactive?: boolean;
  height?: string | number;
  colorOverride?: string;
  showGrid?: boolean;
  className?: string;
}

export const CubeViewer3D: React.FC<CubeViewer3DProps> = ({
  cubes,
  autoRotate = true,
  interactive = true,
  height = '240px',
  colorOverride,
  showGrid = true,
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const hVal = typeof height === 'number' ? height : (parseInt(height as string, 10) || 240);

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc); // Light lab background

    const camera = new THREE.PerspectiveCamera(45, width / hVal, 0.1, 1000);
    camera.position.set(4, 3.5, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, hVal);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xa5f3fc, 0.5); // Mint fill light
    fillLight.position.set(-5, -2, -5);
    scene.add(fillLight);

    // 3. Grid Helper & Shadow Plane
    if (showGrid) {
      const grid = new THREE.GridHelper(8, 8, 0x94a3b8, 0xe2e8f0);
      grid.position.y = -1;
      scene.add(grid);
    }

    const planeGeo = new THREE.PlaneGeometry(20, 20);
    const planeMat = new THREE.ShadowMaterial({ opacity: 0.12 });
    const shadowPlane = new THREE.Mesh(planeGeo, planeMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.01;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // 4. Cube Group & Mesh Creation
    const shapeGroup = new THREE.Group();

    // Calculate center offset
    if (cubes.length > 0) {
      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;
      let minZ = Infinity, maxZ = -Infinity;

      cubes.forEach(c => {
        if (c.x < minX) minX = c.x;
        if (c.x > maxX) maxX = c.x;
        if (c.y < minY) minY = c.y;
        if (c.y > maxY) maxY = c.y;
        if (c.z < minZ) minZ = c.z;
        if (c.z > maxZ) maxZ = c.z;
      });

      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      const centerZ = (minZ + maxZ) / 2;

      const cubeGeo = new THREE.BoxGeometry(0.92, 0.92, 0.92);

      cubes.forEach((c, idx) => {
        const matColor = colorOverride || c.color || '#3B82F6';
        
        // Stylish toon/phong material with edge lines
        const mat = new THREE.MeshPhongMaterial({
          color: new THREE.Color(matColor),
          shininess: 60,
          specular: new THREE.Color(0xffffff)
        });

        const mesh = new THREE.Mesh(cubeGeo, mat);
        mesh.position.set(c.x - centerX, c.y - centerY, c.z - centerZ);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Black wireframe edge outline for clean cartoon style
        const edgesGeo = new THREE.EdgesGeometry(cubeGeo);
        const lineMat = new THREE.LineBasicMaterial({ color: 0x1e293b, linewidth: 2 });
        const wireframe = new THREE.LineSegments(edgesGeo, lineMat);
        mesh.add(wireframe);

        shapeGroup.add(mesh);
      });
    }

    scene.add(shapeGroup);

    // 5. Mouse Drag Controls (Simple 3D Orbiting)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !interactive) return;

      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y
      };

      shapeGroup.rotation.y += deltaMove.x * 0.01;
      shapeGroup.rotation.x += deltaMove.y * 0.01;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch events for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (!interactive || e.touches.length === 0) return;
      isDragging = true;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || !interactive || e.touches.length === 0) return;
      const deltaMove = {
        x: e.touches[0].clientX - previousMousePosition.x,
        y: e.touches[0].clientY - previousMousePosition.y
      };

      shapeGroup.rotation.y += deltaMove.x * 0.015;
      shapeGroup.rotation.x += deltaMove.y * 0.015;

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const domEl = renderer.domElement;
    if (interactive) {
      domEl.style.cursor = 'grab';
      domEl.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);

      domEl.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      window.addEventListener('touchend', onMouseUp);
    }

    // 6. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (autoRotate && !isDragging) {
        shapeGroup.rotation.y += 0.008;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 300;
      camera.aspect = newW / hVal;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, hVal);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);

      if (interactive) {
        domEl.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        domEl.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onMouseUp);
      }

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [cubes, autoRotate, interactive, height, colorOverride, showGrid]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full rounded-2xl overflow-hidden shadow-inner bg-slate-100/60 border border-slate-200/80 ${className}`}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    />
  );
};
