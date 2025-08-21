import { GroupProps, useFrame } from '@react-three/fiber';
import { useRef } from 'react';

type FairyModelProps = GroupProps & {
  opacity?: number;
};

export default function FairyModel({ opacity = 1, ...props }: FairyModelProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      const s = 0.9 + Math.sin(t * 3.0) * 0.08;
      meshRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group {...props}>
      {/* Glowing fairy orb */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial 
          color={'#ffc0ff'} 
          emissive={'#ff7bf7'} 
          emissiveIntensity={1.6} 
          transparent 
          opacity={opacity}
        />
      </mesh>
      {/* Soft light glow */}
      <pointLight position={[0, 0.5, 0.5]} intensity={1.1} color={'#ffd1f5'} distance={3} decay={2} />
    </group>
  );
}


