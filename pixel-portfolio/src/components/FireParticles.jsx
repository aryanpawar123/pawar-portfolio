import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

export default function FireParticles({ count = 25 }) {
  const meshes = useRef([]);
  const data = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 5,
      y: -3 + Math.random() * 6,
      z: (Math.random() - 0.5) * 4,
      speed: 0.5 + Math.random() * 1.5,
      life: Math.random() * Math.PI * 2,
      size: 0.04 + Math.random() * 0.07,
      drift: (Math.random() - 0.5) * 0.5,
    })), [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    meshes.current.forEach((mesh, i) => {
      if (!mesh) return;
      const d = data[i];
      const yOff = ((t * d.speed + d.life) % 8) - 4;
      mesh.position.y = yOff;
      mesh.position.x = d.x + Math.sin(t * 2 + d.life) * d.drift;
      mesh.position.z = d.z + Math.cos(t * 1.5 + d.life) * 0.2;
      const fadeY = 1 - Math.max(0, (yOff + 1) / 5);
      mesh.scale.setScalar(d.size * (0.3 + fadeY * 0.7));
      if (mesh.material) mesh.material.opacity = fadeY * 0.75;
    });
  });

  const colors = ['#FF4500', '#FF6B00', '#FF8C00', '#FFa500', '#FFD700', '#FF3300'];

  return (
    <>
      {data.map((d, i) => (
        <mesh key={i} ref={el => (meshes.current[i] = el)} position={[d.x, d.y, d.z]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={colors[i % colors.length]}
            emissive={colors[i % colors.length]}
            emissiveIntensity={0.8}
            transparent
            opacity={0.7}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}
