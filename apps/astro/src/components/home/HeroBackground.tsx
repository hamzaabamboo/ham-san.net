import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const HeroBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const getParticleColor = () => {
      const isDark = document.documentElement.classList.contains('dark');
      // Light Mode: Use a darker gray/black (0x333333) instead of pure black for better visuals
      return isDark ? 0xf59e0b : 0x333333;
    };

    const getShapeColor = () => {
      const isDark = document.documentElement.classList.contains('dark');
      // Light Mode: Use a clean blue or slate color
      return isDark ? 0xfbbf24 : 0x4f46e5;
    };

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.3,
      color: getParticleColor(),
      transparent: true,
      opacity: 0.6,
      blending: THREE.NormalBlending // Additive doesn't work well on white
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    const geometries = [
      new THREE.OctahedronGeometry(2, 0),
      new THREE.TetrahedronGeometry(2, 0),
      new THREE.IcosahedronGeometry(2, 0)
    ];

    const floatingShapes: THREE.Mesh[] = [];

    for (let i = 0; i < 5; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshBasicMaterial({
        color: getShapeColor(),
        wireframe: true,
        transparent: true,
        opacity: 0.3
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 40
      );
      scene.add(mesh);
      floatingShapes.push(mesh);
    }

    // Theme Observer
    const themeObserver = new MutationObserver(() => {
      const pColor = new THREE.Color(getParticleColor());
      particlesMaterial.color.set(pColor);

      const sColor = new THREE.Color(getShapeColor());
      floatingShapes.forEach((shape) => {
        (shape.material as THREE.MeshBasicMaterial).color.set(sColor);
      });
    });

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      requestAnimationFrame(animate);

      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;

      floatingShapes.forEach((shape, index) => {
        shape.rotation.x += 0.005 + index * 0.001;
        shape.rotation.y += 0.003 + index * 0.001;
        shape.position.y = Math.sin(Date.now() * 0.001 + index) * 5;
      });

      camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      themeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
};
