import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Portal/Gateway animation for entering 3D project explorer
type PortalTransitionProps = { durationMs?: number; onDone: () => void };

export default function PortalTransition({ durationMs = 5000, onDone }: PortalTransitionProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    mountRef.current.appendChild(renderer.domElement);

    // Create portal ring geometry
    const ringGeometry = new THREE.RingGeometry(2, 4, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00ffff, 
      transparent: true, 
      opacity: 0.8,
      side: THREE.DoubleSide 
    });
    const portalRing = new THREE.Mesh(ringGeometry, ringMaterial);
    scene.add(portalRing);

    // Create inner portal effect
    const innerGeometry = new THREE.RingGeometry(0, 2, 32);
    const innerMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x4400ff, 
      transparent: true, 
      opacity: 0.6 
    });
    const innerPortal = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerPortal);

    // Create particles around portal
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = Math.random() * 10 + 5;
      const angle = Math.random() * Math.PI * 2;
      positions[i] = Math.cos(angle) * radius;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = Math.sin(angle) * radius;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({ 
      color: 0x00ffff, 
      size: 0.1,
      transparent: true,
      opacity: 0.8 
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    camera.position.z = 15;

    let startTime = Date.now();
    let animationId: number;

    function animate() {
      animationId = requestAnimationFrame(animate);
      
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      
      // Rotate portal rings
      portalRing.rotation.z += 0.02;
      innerPortal.rotation.z -= 0.03;
      
      // Animate particles
      particles.rotation.y += 0.01;
      
      // Zoom into portal effect
      const zoom = 1 + progress * 14; // Zoom from 15 to 1
      camera.position.z = 15 / zoom;
      
      // Fade effect near end
      if (progress > 0.8) {
        const fadeProgress = (progress - 0.8) / 0.2;
        ringMaterial.opacity = 0.8 * (1 - fadeProgress);
        innerMaterial.opacity = 0.6 * (1 - fadeProgress);
        particleMaterial.opacity = 0.8 * (1 - fadeProgress);
      }
      
      renderer.render(scene, camera);
      
      if (progress >= 1) {
        cancelAnimationFrame(animationId);
        onDone();
      }
    }
    
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [durationMs, onDone]);

  return (
    <div 
      ref={mountRef} 
      className={`fixed inset-0 z-[15000] bg-black transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'}`}
    />
  );
}
