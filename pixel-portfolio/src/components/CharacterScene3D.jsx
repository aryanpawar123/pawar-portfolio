import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import Character3D from './Character3D';
import FireParticles from './FireParticles';

function FloatingPixels() {
  const count = 30;
  const meshes = useRef([]);
  const positions = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 8,
      y: (Math.random() - 0.5) * 6,
      z: (Math.random() - 0.5) * 4 - 2,
      speed: 0.3 + Math.random() * 0.6,
      offset: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 1.5,
    })), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    meshes.current.forEach((mesh, i) => {
      if (!mesh) return;
      const p = positions[i];
      mesh.position.y = p.y + Math.sin(t * p.speed + p.offset) * 0.5;
      mesh.position.x = p.x + Math.sin(t * 0.15 + p.offset) * 0.25;
      mesh.rotation.x = t * p.rotSpeed * 0.2;
      mesh.rotation.z = t * p.rotSpeed * 0.15;
    });
  });

  return (
    <>
      {positions.map((p, i) => (
        <mesh key={i} ref={(el) => (meshes.current[i] = el)} position={[p.x, p.y, p.z]} scale={0.03 + Math.random() * 0.04}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? '#FF8C00' : i % 3 === 1 ? '#FFa500' : '#e07800'}
            emissive={i % 2 === 0 ? '#FF8C00' : '#000'}
            emissiveIntensity={0.3}
            transparent opacity={0.4 + Math.random() * 0.3}
          />
        </mesh>
      ))}
    </>
  );
}



export default function CharacterScene3D() {
  return (
    <div className="scene-fixed">
      <Canvas
        camera={{ position: [0, 0.5, 5.5], fov: 40 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* Warm beige background */}
          <color attach="background" args={['#F5F0E8']} />
          <fog attach="fog" args={['#F5F0E8', 10, 20]} />

          {/* Warm lighting setup */}
          <ambientLight intensity={0.7} color="#fff5e6" />
          <directionalLight position={[5, 8, 5]} intensity={1.2} color="#fff" castShadow />
          <directionalLight position={[-3, 4, -3]} intensity={0.3} color="#FFa500" />
          <pointLight position={[0, 2, 4]} intensity={0.4} color="#FF8C00" distance={10} />
          <pointLight position={[-3, 1, 2]} intensity={0.2} color="#ffd700" distance={8} />

          <Character3D />
          <FloatingPixels />
          <FireParticles count={15} />
        </Suspense>
      </Canvas>
    </div>
  );
}
