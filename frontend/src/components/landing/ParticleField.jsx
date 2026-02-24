import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export function ParticleField() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080A06, 0.002);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 200;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (mountRef.current) mountRef.current.appendChild(renderer.domElement);

    // Particles Data Grid Setup
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorCyan = new THREE.Color('#C8F400');
    const colorLime = new THREE.Color('#00FF87');

    for (let i = 0; i < particleCount; i++) {
      // Grid-like positions
      positions[i * 3] = (Math.random() - 0.5) * 800; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 800; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400 - 100; // z

      // Distribute colors mostly cyan with some lime
      const color = Math.random() > 0.85 ? colorLime : colorCyan;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Grid Helper
    const gridHelper = new THREE.GridHelper(1000, 20, '#182015', '#C8F400');
    gridHelper.position.y = -200;
    gridHelper.position.z = -100;
    scene.add(gridHelper);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const onDocumentMouseMove = (event) => {
      mouseX = (event.clientX - windowHalfX) * 0.1;
      mouseY = (event.clientY - windowHalfY) * 0.1;
    };

    document.addEventListener('mousemove', onDocumentMouseMove);

    // Animation Loop
    renderer.setAnimationLoop(() => {
      targetX = mouseX * 0.5;
      targetY = mouseY * 0.5;

      // Subtle tilt/drift mapped to max 8 degrees tilt (in rad roughly 0.14)
      particles.rotation.y += 0.001; 
      particles.rotation.x += (targetY * 0.01 - particles.rotation.x) * 0.05;
      particles.rotation.y += (targetX * 0.01 - particles.rotation.y) * 0.05;
      
      gridHelper.rotation.x += (targetY * 0.005 - gridHelper.rotation.x) * 0.05;

      renderer.render(scene, camera);
    });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousemove', onDocumentMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.setAnimationLoop(null);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}
