import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Project-specific launch animation for VITON
type ProjectLaunchTransitionProps = { 
  durationMs?: number; 
  onDone: () => void;
  projectName?: string;
};

export default function ProjectLaunchTransition({ 
  durationMs = 5000, 
  onDone, 
  projectName = "Project" 
}: ProjectLaunchTransitionProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentPhase, setCurrentPhase] = useState<'loading' | 'launching' | 'entering'>('loading');

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000010, 1);
    mountRef.current.appendChild(renderer.domElement);

    // Create hexagonal platform
    const hexGeometry = new THREE.CylinderGeometry(3, 3, 0.2, 6);
    const hexMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00ff88,
      transparent: true,
      opacity: 0.7,
      wireframe: true
    });
    const platform = new THREE.Mesh(hexGeometry, hexMaterial);
    platform.position.y = -2;
    scene.add(platform);

    // Create energy pillars
    const pillars: THREE.Mesh[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const pillarGeometry = new THREE.CylinderGeometry(0.1, 0.1, 5, 8);
      const pillarMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8
      });
      const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
      pillar.position.x = Math.cos(angle) * 4;
      pillar.position.z = Math.sin(angle) * 4;
      pillar.position.y = 0.5;
      scene.add(pillar);
      pillars.push(pillar);
    }

    // Create central energy core
    const coreGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff4400,
      transparent: true,
      opacity: 0.9
    });
    const energyCore = new THREE.Mesh(coreGeometry, coreMaterial);
    energyCore.position.y = 2;
    scene.add(energyCore);

    // Create data streams
    const streamGeometry = new THREE.BufferGeometry();
    const streamCount = 50;
    const streamPositions = new Float32Array(streamCount * 3);
    
    for (let i = 0; i < streamCount * 3; i += 3) {
      streamPositions[i] = (Math.random() - 0.5) * 20;
      streamPositions[i + 1] = Math.random() * 10;
      streamPositions[i + 2] = (Math.random() - 0.5) * 20;
    }
    
    streamGeometry.setAttribute('position', new THREE.BufferAttribute(streamPositions, 3));
    const streamMaterial = new THREE.PointsMaterial({ 
      color: 0x00ff44, 
      size: 0.2,
      transparent: true,
      opacity: 0.6 
    });
    const dataStreams = new THREE.Points(streamGeometry, streamMaterial);
    scene.add(dataStreams);

    camera.position.set(0, 3, 8);
    camera.lookAt(0, 0, 0);

    let startTime = Date.now();
    let animationId: number;

    // Phase timings
    const phases = {
      loading: durationMs * 0.4,    // 40% - Loading phase
      launching: durationMs * 0.3,  // 30% - Launching phase  
      entering: durationMs * 0.3     // 30% - Entering phase
    };

    function animate() {
      animationId = requestAnimationFrame(animate);
      
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      
      // Update phase
      if (elapsed < phases.loading) {
        setCurrentPhase('loading');
      } else if (elapsed < phases.loading + phases.launching) {
        setCurrentPhase('launching');
      } else {
        setCurrentPhase('entering');
      }
      
      // Rotate platform
      platform.rotation.y += 0.01;
      
      // Animate pillars (growing effect)
      const pillarProgress = Math.min(elapsed / (phases.loading + phases.launching), 1);
      pillars.forEach((pillar, index) => {
        pillar.scale.y = pillarProgress;
        pillar.material.opacity = 0.8 * pillarProgress;
        pillar.rotation.y += 0.02 + index * 0.005;
      });
      
      // Animate energy core (pulsing)
      const pulse = Math.sin(elapsed * 0.005) * 0.3 + 1;
      energyCore.scale.setScalar(pulse);
      energyCore.rotation.x += 0.02;
      energyCore.rotation.y += 0.03;
      
      // Animate data streams
      dataStreams.rotation.y += 0.005;
      const positions = dataStreams.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += 0.05; // Move upward
        if (positions[i] > 10) positions[i] = 0; // Reset
      }
      dataStreams.geometry.attributes.position.needsUpdate = true;
      
      // Camera movement in final phase
      if (currentPhase === 'entering') {
        const enterProgress = (elapsed - phases.loading - phases.launching) / phases.entering;
        camera.position.z = 8 - enterProgress * 7; // Move closer
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
  }, [durationMs, onDone, projectName]);

  const phaseMessages = {
    loading: `Initializing ${projectName}...`,
    launching: `Launching ${projectName} Systems...`,
    entering: `Entering ${projectName} Environment...`
  };

  return (
    <div className="fixed inset-0 z-[15000] bg-gradient-to-b from-black via-purple-900/20 to-black">
      <div 
        ref={mountRef} 
        className="w-full h-full"
      />
      
      {/* Overlay UI */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Phase indicator */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
          <div className="bg-black/80 backdrop-blur-md rounded-xl px-6 py-3 border border-cyan-500/50">
            <div className="text-cyan-400 text-lg font-semibold text-center">
              {phaseMessages[currentPhase]}
            </div>
          </div>
        </div>
        
        {/* Bottom status */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="bg-black/80 backdrop-blur-md rounded-xl px-8 py-4 border border-green-500/50">
            <div className="text-center">
              <div className="text-2xl mb-2">Launch</div>
              <div className="text-green-400 font-bold text-xl">{projectName}</div>
              <div className="text-gray-300 text-sm">Preparing launch sequence...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
