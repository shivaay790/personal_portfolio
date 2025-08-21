import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Text } from '@react-three/drei';
import { Vector3, Euler } from 'three';
// Web-based implementation (Tauri functionality can be added later)
const isTauri = typeof window !== 'undefined' && (window as any).__TAURI__;
import WormholeExact from './WormholeExact';

// StarField component for the background
function StarField() {
  const starsRef = useRef<any>(null);
  
  // Generate random star positions
  const starCount = 200;
  const positions = new Float32Array(starCount * 3);
  
  for (let i = 0; i < starCount; i++) {
    // Random positions in a large sphere around the scene
    const radius = 50 + Math.random() * 50; // 50-100 units away
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi);
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }

  useFrame((state) => {
    if (starsRef.current) {
      // Gentle twinkling effect
      starsRef.current.material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        color="#ffffff" 
        size={0.5} 
        transparent 
        opacity={0.8}
        sizeAttenuation={false}
      />
    </points>
  );
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'available' | 'coming-soon';
  position: Vector3;
  commands?: {
    frontend?: string;
    backend?: string;
    url?: string;
  };
}

// Calculate positions in a perfect circle around the user (radius = 3 meters)
const RADIUS = 3;
const generateCircularPosition = (index: number, total: number): Vector3 => {
  const angle = (index / total) * Math.PI * 2; // Evenly spaced around circle
  const x = Math.cos(angle) * RADIUS;
  const z = Math.sin(angle) * RADIUS;
  return new Vector3(x, 0, z); // Y=0 keeps them at user's eye level
};

const projects: Project[] = [
  {
    id: 'viton',
    name: 'VITON',
    description: 'Virtual Try-On System',
    status: 'available',
    position: generateCircularPosition(0, 6), // Position 0: directly in front
    commands: {
      frontend: 'C:\\Users\\Shivaay Dhondiyal\\Desktop\\shivaay\\coding\\2_projects\\7_personal portfolio\\ezyZip\\frontend',
      backend: 'C:\\Users\\Shivaay Dhondiyal\\Desktop\\shivaay\\coding\\2_projects\\7_personal portfolio\\ezyZip\\backend',
      url: 'http://localhost:8080/viton/front', // Proxied VITON frontend
      mode: 'proxied-routes' // Uses clear proxy routes
    }
  },
  {
    id: 'crowd-analysis',
    name: 'Crowd Analysis',
    description: 'Real-time Crowd Counting',
    status: 'coming-soon',
    position: generateCircularPosition(1, 6) // Position 1: 60° clockwise
  },
  {
    id: 'hand-gesture',
    name: 'Hand Gesture',
    description: 'Gesture-based Game Control',
    status: 'coming-soon',
    position: generateCircularPosition(2, 6) // Position 2: 120° clockwise
  },
  {
    id: 'empathic-ai',
    name: 'Empathic AI',
    description: 'Emotion-aware Chatbot',
    status: 'coming-soon',
    position: generateCircularPosition(3, 6) // Position 3: 180° (behind)
  },
  {
    id: 'research-intern',
    name: 'Research Intern',
    description: 'Academic Research Platform',
    status: 'coming-soon',
    position: generateCircularPosition(4, 6) // Position 4: 240° clockwise
  },
  {
    id: 'sentiment-analysis',
    name: 'Sentiment Analysis',
    description: 'Text Emotion Detection',
    status: 'coming-soon',
    position: generateCircularPosition(5, 6) // Position 5: 300° clockwise
  }
];

function ProjectCard({ project, onSelect, isHighlighted }: { 
  project: Project; 
  onSelect: (project: Project) => void;
  isHighlighted: boolean;
}) {
  const meshRef = useRef<any>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Only highlight scaling - NO rotation
      if (isHighlighted) {
        meshRef.current.scale.setScalar(1.2 + Math.sin(state.clock.elapsedTime * 4) * 0.1);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  // Calculate rotation to face the center (user) - only Y axis rotation to prevent tilting
  const faceCenter = () => {
    const direction = new Vector3(0, 0, 0).sub(project.position).normalize();
    return Math.atan2(direction.x, direction.z);
  };

  return (
    <group 
      ref={meshRef}
      position={project.position}
      rotation={[0, faceCenter(), 0]} // Only Y-axis rotation - no tilting
      onClick={() => onSelect(project)}
    >
      {/* Card Background - Bright and Visible */}
      <mesh>
        <boxGeometry args={[2, 1.5, 0.1]} />
        <meshStandardMaterial 
          color={project.status === 'available' ? '#0066ff' : '#333333'}
          emissive={isHighlighted ? '#ff00d9' : project.status === 'available' ? '#004499' : '#222222'}
          emissiveIntensity={isHighlighted ? 0.5 : 0.3}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {/* Border Glow */}
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[2.2, 1.7, 0.05]} />
        <meshStandardMaterial 
          color={project.status === 'available' ? '#ff00d9' : '#666666'}
          emissive={project.status === 'available' ? '#ff00d9' : '#444444'}
          emissiveIntensity={isHighlighted ? 0.8 : 0.4}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Floating Text - Fixed positioning to prevent tilting */}
      <Text
        position={[0, 0.3, 0.11]}
        fontSize={0.15}
        color={project.status === 'available' ? '#ffffff' : '#cccccc'}
        anchorX="center"
        anchorY="middle"
        rotation={[0, 0, 0]} // Ensure text stays level
      >
        {project.name}
      </Text>
      
      <Text
        position={[0, 0, 0.11]}
        fontSize={0.08}
        color="#aaaaaa"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.8}
        rotation={[0, 0, 0]} // Ensure text stays level
      >
        {project.description}
      </Text>
      
      <Text
        position={[0, -0.3, 0.11]}
        fontSize={0.06}
        color={project.status === 'available' ? '#00ff88' : '#ffaa00'}
        anchorX="center"
        anchorY="middle"
        rotation={[0, 0, 0]} // Ensure text stays level
      >
        {project.status === 'available' ? 'CLICK TO LAUNCH' : 'COMING SOON'}
      </Text>
    </group>
  );
}

function Scene({ onProjectSelect }: { onProjectSelect: (project: Project) => void }) {
  const { camera, gl } = useThree();
  const [highlightedProject, setHighlightedProject] = useState<string | null>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [keys, setKeys] = useState<Set<string>>(new Set());

  const handleProjectSelect = (project: Project) => {
    console.log('Project clicked:', project.name, 'Status:', project.status);
    if (project.status === 'available') {
      onProjectSelect(project);
    }
  };
  
  useEffect(() => {
    const canvas = gl.domElement;
    if (!canvas) return;

    const handlePointerLockChange = () => {
      setIsPointerLocked(document.pointerLockElement === canvas);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isPointerLocked) {
        setRotation(prev => ({
          x: Math.max(-Math.PI/2.2, Math.min(Math.PI/2.2, prev.x - event.movementY * 0.003)), // Allow looking up/down more
          y: prev.y + event.movementX * 0.003
        }));
      }
    };

    const handleClick = () => {
      if (!isPointerLocked) {
        canvas.requestPointerLock();
      } else {
        // If pointer is locked and we're looking at a project, select it
        if (highlightedProject) {
          const project = projects.find(p => p.id === highlightedProject);
          if (project) {
            handleProjectSelect(project);
          }
        }
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        document.exitPointerLock();
        return;
      }
      
      // Add key to pressed keys set
      const key = event.key.toLowerCase();
      setKeys(prev => new Set(prev).add(key));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      // Remove key from pressed keys set
      const key = event.key.toLowerCase();
      setKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(key);
        return newKeys;
      });
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPointerLocked, gl.domElement, highlightedProject, handleProjectSelect]);

  useFrame((state, delta) => {
    // Handle keyboard rotation when pointer is locked
    if (isPointerLocked) {
      const rotationSpeed = 1.5; // radians per second
      
      // Arrow keys or WASD for rotation
      if (keys.has('arrowleft') || keys.has('a')) {
        setRotation(prev => ({ ...prev, y: prev.y - rotationSpeed * delta }));
      }
      if (keys.has('arrowright') || keys.has('d')) {
        setRotation(prev => ({ ...prev, y: prev.y + rotationSpeed * delta }));
      }
      if (keys.has('arrowup') || keys.has('w')) {
        setRotation(prev => ({ 
          ...prev, 
          x: Math.max(-Math.PI/2.2, prev.x - rotationSpeed * delta) // Look up more (almost 90°)
        }));
      }
      if (keys.has('arrowdown') || keys.has('s')) {
        setRotation(prev => ({ 
          ...prev, 
          x: Math.min(Math.PI/2.2, prev.x + rotationSpeed * delta) // Look down more (almost 90°)
        }));
      }
    }
    
    // Update camera rotation
    camera.rotation.x = rotation.x;
    camera.rotation.y = rotation.y;
    
    // Simple raycast detection - check which project is in center of view
    const cameraDirection = new Vector3(0, 0, -1);
    cameraDirection.applyEuler(camera.rotation);
    
    let closestProject = null;
    let smallestAngle = Infinity;
    
    projects.forEach(project => {
      const projectDirection = project.position.clone().normalize();
      const angle = cameraDirection.angleTo(projectDirection);
      
      if (angle < 0.5 && angle < smallestAngle) {
        smallestAngle = angle;
        closestProject = project.id;
      }
    });
    
    setHighlightedProject(closestProject);
  });

  return (
    <>
      {/* Starfield background */}
      <StarField />
      
      {/* Dense star cluster above for when looking up */}
      <group position={[0, 0, 0]}>
        {[...Array(150)].map((_, i) => {
          // Create stars primarily above the user (positive Y)
          const radius = 20 + Math.random() * 30;
          const theta = Math.random() * Math.PI * 2; // Full circle horizontally
          const phi = Math.random() * Math.PI * 0.6; // Bias toward upper hemisphere
          
          const x = radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.cos(phi) + 20; // Higher offset upward
          const z = radius * Math.sin(phi) * Math.sin(theta);
          
          // Vary star types
          const starType = Math.random();
          let color, emissiveIntensity, size;
          
          if (starType < 0.7) {
            // White stars
            color = "#ffffff";
            emissiveIntensity = 0.4 + Math.random() * 0.6;
            size = 0.02 + Math.random() * 0.02;
          } else if (starType < 0.85) {
            // Blue giants
            color = "#aaccff";
            emissiveIntensity = 0.6 + Math.random() * 0.4;
            size = 0.03 + Math.random() * 0.03;
          } else {
            // Red stars
            color = "#ffaaaa";
            emissiveIntensity = 0.3 + Math.random() * 0.4;
            size = 0.025 + Math.random() * 0.025;
          }
          
          return (
            <mesh 
              key={`upper-star-${i}`}
              position={[x, y, z]}
            >
              <sphereGeometry args={[size]} />
              <meshStandardMaterial 
                color={color}
                emissive={color}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Stars below for when looking down */}
      <group position={[0, 0, 0]}>
        {[...Array(30)].map((_, i) => {
          const radius = 15 + Math.random() * 20;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.PI * 0.5 + Math.random() * Math.PI * 0.5; // Lower hemisphere
          
          const x = radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.cos(phi) - 10; // Offset downward
          const z = radius * Math.sin(phi) * Math.sin(theta);
          
          return (
            <mesh 
              key={`lower-star-${i}`}
              position={[x, y, z]}
            >
              <sphereGeometry args={[0.015]} />
              <meshStandardMaterial 
                color="#ccccff" 
                emissive="#ccccff" 
                emissiveIntensity={0.2 + Math.random() * 0.3}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Enhanced lighting for better visibility */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#ff00d9" />
      <directionalLight position={[0, 5, 5]} intensity={0.5} color="#0066ff" />
      
      {/* Center reference point */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Project cards - stationary in orbit */}
      <group>
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            onSelect={handleProjectSelect}
            isHighlighted={highlightedProject === project.id}
          />
        ))}
      </group>
      
      {/* Instructions overlay */}
      {!isPointerLocked && (
        <Html fullscreen>
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="bg-black/90 backdrop-blur-md rounded-xl p-6 border border-primary/50 shadow-2xl">
              <div className="text-center text-white">
                <h3 className="text-2xl font-bold text-primary mb-3">Project Explorer</h3>
                <p className="text-gray-300 mb-2 text-lg">Click anywhere to start looking around</p>
                <p className="text-sm text-gray-400 mb-2">Mouse/WASD to look around • W/S to tilt up/down • Click on project to select • ESC to exit</p>
                <div className="mt-4 text-xs text-gray-500">
                  {projects.length} projects in a circle around you • VITON available • Others coming soon
                </div>
                <div className="mt-2 text-xs text-blue-400">
                  🖱️ Mouse + ⌨️ WASD = Full 360° view • Look up for stars ✨
                </div>
              </div>
            </div>
          </div>
        </Html>
      )}
      
      {/* Active project info when pointer locked */}
      {isPointerLocked && (
        <Html fullscreen>
          <div className="fixed top-4 left-4 pointer-events-none z-50">
            <div className="bg-black/80 backdrop-blur-md rounded-lg p-3 border border-primary/50">
              <div className="text-white text-sm">
                {highlightedProject ? (
                  <>
                    <span className="text-green-400">👁️</span> Looking at: <span className="text-primary font-semibold">{highlightedProject.toUpperCase()}</span>
                    <div className="text-xs text-gray-400 mt-1">
                      {projects.find(p => p.id === highlightedProject)?.status === 'available' ? 'Click to launch!' : 'Coming soon...'}
                    </div>
                  </>
                ) : (
                  <span className="text-gray-400">Look around to find projects</span>
                )}
                <div className="text-xs text-blue-400 mt-2 border-t border-gray-600 pt-2">
                  🖱️ Mouse • ⌨️ WASD/Arrows • ESC to exit
                </div>
              </div>
            </div>
          </div>
        </Html>
      )}
    </>
  );
}

interface ProjectExplorer3DProps {
  onExit: () => void;
  onProjectLaunch: (project: Project) => void;
}

export default function ProjectExplorer3D({ onExit, onProjectLaunch }: ProjectExplorer3DProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        document.exitPointerLock();
        onExit();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [onExit]);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    // Start the launch sequence
    onProjectLaunch(project);
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-gradient-radial from-purple-900/20 via-black to-black">
      <Canvas
        camera={{ 
          position: [0, 0, 0], 
          fov: 75,
          near: 0.1,
          far: 100
        }}
        style={{ 
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #000000 100%)',
          width: '100vw',
          height: '100vh'
        }}
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        <Scene onProjectSelect={handleProjectSelect} />
      </Canvas>
      
      {/* Back button */}
      <button
        onClick={onExit}
        className="fixed top-4 left-4 z-[10001] bg-black/80 backdrop-blur-md border border-primary/50 rounded-lg px-4 py-2 text-white hover:bg-primary/20 transition-colors"
      >
        ← Back to Portfolio
      </button>
      
      {/* Debug info */}
      <div className="fixed bottom-4 right-4 z-[10001] bg-black/60 backdrop-blur-md rounded-lg p-2 text-xs text-gray-400">
        3D Scene Active • {projects.length} Projects in Circle • You control the view
      </div>
    </div>
  );
}
