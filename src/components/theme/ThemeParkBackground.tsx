import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThemeParkBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    // Sky theme park gradient atmosphere
    scene.background = new THREE.Color(0xf0fdf4);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.appendChild(renderer.domElement);

    // 2. Lighting (Vibrant Amusement Park Lights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const light1 = new THREE.PointLight(0x3b82f6, 3, 30);
    light1.position.set(-8, 8, 5);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x10b981, 3, 30);
    light2.position.set(8, 8, 5);
    scene.add(light2);

    const light3 = new THREE.PointLight(0xf59e0b, 2.5, 30);
    light3.position.set(0, -4, 5);
    scene.add(light3);

    // 3. Floating 3D Polycube Islands & Particles
    const group = new THREE.Group();
    const cubeGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const colors = [0x3b82f6, 0x06b6d4, 0x10b981, 0xf59e0b, 0x8b5cf6, 0xec4899];

    const cubesList: THREE.Mesh[] = [];

    for (let i = 0; i < 35; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.75
      });

      const mesh = new THREE.Mesh(cubeGeo, mat);

      // Random scattered positions in background
      mesh.position.set(
        (Math.random() - 0.5) * 26,
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 15 - 5
      );

      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      const scale = Math.random() * 0.8 + 0.4;
      mesh.scale.set(scale, scale, scale);

      group.add(mesh);
      cubesList.push(mesh);
    }

    scene.add(group);

    // 4. Animation Loop (Floating & Rotating Cubes)
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      group.rotation.y += 0.0015;
      group.rotation.x += 0.0008;

      cubesList.forEach((mesh, idx) => {
        mesh.rotation.x += 0.005 * (idx % 2 === 0 ? 1 : -1);
        mesh.rotation.y += 0.008;
        mesh.position.y += Math.sin(Date.now() * 0.001 + idx) * 0.003;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40 mix-blend-multiply transition-opacity duration-1000"
    />
  );
};
