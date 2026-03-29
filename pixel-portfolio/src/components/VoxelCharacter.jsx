import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { scrollState } from '../utils/scrollStore';

function Voxel({ position, color, scale = 1 }) {
  const s = typeof scale === 'number' ? [scale, scale, scale] : scale;
  return (
    <mesh position={position} scale={s}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} flatShading />
    </mesh>
  );
}

export default function VoxelCharacter() {
  const groupRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const headRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.2) * 0.1;
      // Slight forward lean for determined pose
      groupRef.current.rotation.x = 0.05;
    }

    // Right arm: FIST RAISE — arm goes up with subtle power tremor
    if (rightArmRef.current) {
      const raiseTarget = -Math.PI * 0.72;
      rightArmRef.current.rotation.x = raiseTarget + Math.sin(t * 4) * 0.03;
      rightArmRef.current.rotation.z = -0.15 + Math.sin(t * 3) * 0.02;
    }

    // Left arm: slight idle
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = Math.sin(t * 1.5) * 0.08;
    }

    // Head: slight upward tilt, determined look
    if (headRef.current) {
      headRef.current.rotation.x = -0.08 + Math.sin(t * 0.8) * 0.02;
      headRef.current.rotation.y = Math.sin(t * 0.5) * 0.04;
    }
  });

  const skin = '#c68642';
  const skinDark = '#a0693a';
  const skinShadow = '#8a5530';
  const skinLight = '#d4965a';
  const hair = '#1a1a1a';
  const hairHighlight = '#2d2d2d';
  const stubble = '#3a3020';
  const eyes = '#151515';
  const eyeWhite = '#f5f5f5';
  const eyeShine = '#ffffff';
  const mouthColor = '#663322';
  const shirt = '#FF8C00';
  const shirtDark = '#cc7000';
  const shirtLight = '#FFa000';
  const pants = '#c2b280';
  const pantsDark = '#a89868';
  const belt = '#6b4423';
  const beltBuckle = '#b89050';
  const boots = '#5c3a1e';
  const bootsDark = '#3d2510';

  return (
    <group ref={groupRef} scale={0.35} position={[0, -0.6, 0]}>
      {/* HEAD GROUP — with tilt ref */}
      <group ref={headRef} position={[0, 8.5, 0]}>
        {/* Main head */}
        {[-1, 0, 1].map(x => <Voxel key={`ht-${x}`} position={[x, 1.5, 0]} color={skin} />)}
        {[-1, 0, 1].map(x => <Voxel key={`htf-${x}`} position={[x, 1.5, 1]} color={skin} />)}
        {[-2, -1, 0, 1, 2].map(x => <Voxel key={`huf-${x}`} position={[x, 0.5, 1]} color={skin} />)}
        {[-2, -1, 0, 1, 2].map(x => <Voxel key={`hu-${x}`} position={[x, 0.5, 0]} color={skin} />)}
        {[-2, -1, 0, 1, 2].map(x => <Voxel key={`hmf-${x}`} position={[x, -0.5, 1]} color={skin} />)}
        {[-2, -1, 0, 1, 2].map(x => <Voxel key={`hm-${x}`} position={[x, -0.5, 0]} color={skin} />)}
        {[-2, -1, 0, 1, 2].map(x => <Voxel key={`hlf-${x}`} position={[x, -1.5, 1]} color={skin} />)}
        {[-2, -1, 0, 1, 2].map(x => <Voxel key={`hl-${x}`} position={[x, -1.5, 0]} color={skin} />)}
        {[-1, 0, 1].map(x => <Voxel key={`chin-${x}`} position={[x, -2.5, 1]} color={skin} />)}
        {[-1, 0, 1].map(x => <Voxel key={`chinb-${x}`} position={[x, -2.5, 0]} color={skin} />)}
        {/* Head back */}
        {[-1, 0, 1].map(x => [1.5, 0.5, -0.5, -1.5].map(y =>
          <Voxel key={`hb-${x}-${y}`} position={[x, y, -1]} color={skinDark} />
        ))}
        {[-2, 2].map(x => [0.5, -0.5, -1.5].map(y =>
          <Voxel key={`hbs-${x}-${y}`} position={[x, y, -1]} color={skinShadow} />
        ))}

        {/* HAIR */}
        {[-1, 0, 1].map(x => <Voxel key={`htop-${x}`} position={[x, 2.7, 0]} color={hair} scale={[1, 0.7, 1]} />)}
        <Voxel position={[0, 3, 0.5]} color={hair} scale={[0.8, 0.5, 0.6]} />
        <Voxel position={[-1, 2.8, -0.3]} color={hairHighlight} scale={[0.6, 0.5, 0.5]} />
        <Voxel position={[1, 2.9, 0.2]} color={hair} scale={[0.5, 0.6, 0.5]} />
        <Voxel position={[-0.5, 3.1, 0.3]} color={hairHighlight} scale={[0.4, 0.4, 0.4]} />
        {[-2, -1, 0, 1, 2].map(x => <Voxel key={`hc1-${x}`} position={[x, 2.5, 0]} color={hair} />)}
        {[-2, -1, 0, 1, 2].map(x => <Voxel key={`hc1f-${x}`} position={[x, 2.5, 1]} color={hair} />)}
        {[-2, -1, 0, 1, 2].map(x => <Voxel key={`hc2-${x}`} position={[x, 1.5, -1]} color={hair} />)}
        <Voxel position={[-2, 1.5, 0]} color={hair} />
        <Voxel position={[2, 1.5, 0]} color={hair} />
        <Voxel position={[-2, 1.5, 1]} color={hair} />
        <Voxel position={[2, 1.5, 1]} color={hair} />
        {[-2, -1, 0, 1, 2].map(x => <Voxel key={`hbk1-${x}`} position={[x, 2.5, -1]} color={hair} />)}
        {[-2, -1, 0, 1, 2].map(x => <Voxel key={`hbk2-${x}`} position={[x, 0.5, -1]} color={hair} />)}
        {[-2, -1, 0, 1, 2].map(x => <Voxel key={`hbk3-${x}`} position={[x, -0.5, -1]} color={hair} />)}

        {/* FACE — Serious/Determined Expression */}
        {/* Eyes */}
        <Voxel position={[-1, 0.5, 1.5]} color={eyeWhite} scale={[0.7, 0.65, 0.3]} />
        <Voxel position={[1, 0.5, 1.5]} color={eyeWhite} scale={[0.7, 0.65, 0.3]} />
        <Voxel position={[-1, 0.5, 1.65]} color={eyes} scale={[0.4, 0.45, 0.15]} />
        <Voxel position={[1, 0.5, 1.65]} color={eyes} scale={[0.4, 0.45, 0.15]} />
        <Voxel position={[-0.8, 0.65, 1.7]} color={eyeShine} scale={[0.12, 0.12, 0.1]} />
        <Voxel position={[1.2, 0.65, 1.7]} color={eyeShine} scale={[0.12, 0.12, 0.1]} />
        {/* Eyebrows — angled down for determined look */}
        <Voxel position={[-1, 1.2, 1.5]} color={hair} scale={[1.3, 0.3, 0.25]} />
        <Voxel position={[1, 1.2, 1.5]} color={hair} scale={[1.3, 0.3, 0.25]} />
        <Voxel position={[-1.5, 1.15, 1.45]} color={hair} scale={[0.5, 0.25, 0.2]} />
        <Voxel position={[1.5, 1.15, 1.45]} color={hair} scale={[0.5, 0.25, 0.2]} />
        {/* Nose */}
        <Voxel position={[0, 0, 1.55]} color={skinDark} scale={[0.35, 0.5, 0.3]} />
        <Voxel position={[0, -0.5, 1.6]} color={skinDark} scale={[0.5, 0.35, 0.25]} />
        {/* SERIOUS MOUTH — straight, determined line */}
        <Voxel position={[0, -1.2, 1.55]} color={mouthColor} scale={[1.0, 0.22, 0.18]} />
        {/* MUSTACHE */}
        <Voxel position={[-0.4, -0.9, 1.6]} color={stubble} scale={[0.6, 0.22, 0.15]} />
        <Voxel position={[0.4, -0.9, 1.6]} color={stubble} scale={[0.6, 0.22, 0.15]} />
        <Voxel position={[0, -0.95, 1.6]} color={stubble} scale={[0.3, 0.18, 0.12]} />
        {/* STUBBLE */}
        {[-1.5, -0.5, 0, 0.5, 1.5].map(x =>
          <Voxel key={`stb-${x}`} position={[x, -2, 1.3]} color={stubble} scale={[0.5, 0.25, 0.12]} />
        )}
        {[-1, 0, 1].map(x =>
          <Voxel key={`stb2-${x}`} position={[x, -2.3, 1.2]} color={stubble} scale={[0.4, 0.2, 0.1]} />
        )}
        <Voxel position={[0, -2.5, 1.3]} color={stubble} scale={[0.5, 0.3, 0.15]} />
        {/* Ears */}
        <Voxel position={[-2.5, 0, 0.5]} color={skinDark} scale={[0.4, 0.7, 0.5]} />
        <Voxel position={[2.5, 0, 0.5]} color={skinDark} scale={[0.4, 0.7, 0.5]} />
        {/* Cheek highlight */}
        <Voxel position={[-1.5, -0.5, 1.4]} color={skinLight} scale={[0.35, 0.35, 0.15]} />
        <Voxel position={[1.5, -0.5, 1.4]} color={skinLight} scale={[0.35, 0.35, 0.15]} />
      </group>

      {/* NECK */}
      <Voxel position={[0, 5, 0]} color={skin} />
      <Voxel position={[0, 5, 1]} color={skin} />

      {/* TORSO */}
      {[-1, 0, 1].map(x =>
        [4, 3, 2, 1].map(y =>
          <Voxel key={`tf-${x}-${y}`} position={[x, y, 1]} color={y === 3 ? shirtLight : shirt} />
        )
      )}
      {[-1, 0, 1].map(x =>
        [4, 3, 2, 1].map(y =>
          <Voxel key={`tm-${x}-${y}`} position={[x, y, 0]} color={shirt} />
        )
      )}
      {[-1, 0, 1].map(x =>
        [4, 3, 2, 1].map(y =>
          <Voxel key={`tb-${x}-${y}`} position={[x, y, -1]} color={shirtDark} />
        )
      )}
      <Voxel position={[0, 4.5, 1.2]} color={shirtDark} scale={[1.2, 0.35, 0.2]} />

      {/* LEFT ARM — idle swing */}
      <group ref={leftArmRef} position={[-2, 3, 0.5]}>
        {[0, -1, -2, -3].map(y => (
          <React.Fragment key={`la-${y}`}>
            <Voxel position={[0, y, -0.5]} color={y >= -1 ? shirt : skin} />
            <Voxel position={[0, y, 0.5]} color={y >= -1 ? shirtDark : skinDark} />
          </React.Fragment>
        ))}
        <Voxel position={[0, -3.5, 0]} color={skinDark} scale={[0.9, 0.6, 0.9]} />
      </group>

      {/* RIGHT ARM — FIST RAISED */}
      <group ref={rightArmRef} position={[2, 3, 0.5]}>
        {[0, -1, -2, -3].map(y => (
          <React.Fragment key={`ra-${y}`}>
            <Voxel position={[0, y, -0.5]} color={y >= -1 ? shirt : skin} />
            <Voxel position={[0, y, 0.5]} color={y >= -1 ? shirtDark : skinDark} />
          </React.Fragment>
        ))}
        {/* Clenched fist */}
        <Voxel position={[0, -3.5, 0]} color={skin} scale={[1.1, 0.8, 1.1]} />
        <Voxel position={[0, -3.2, 0.3]} color={skinDark} scale={[0.9, 0.3, 0.3]} />
      </group>

      {/* BELT */}
      {[-1, 0, 1].map(x =>
        <Voxel key={`belt-${x}`} position={[x, 0.6, 1.1]} color={belt} scale={[1, 0.35, 0.15]} />
      )}
      <Voxel position={[0, 0.6, 1.25]} color={beltBuckle} scale={[0.45, 0.4, 0.15]} />

      {/* LEGS */}
      {[0, 1, 2].map(i => (
        <React.Fragment key={`ll-${i}`}>
          <Voxel position={[-0.6, -i, 0]} color={pants} />
          <Voxel position={[-0.6, -i, 1]} color={i === 0 ? pants : pantsDark} />
        </React.Fragment>
      ))}
      {[0, 1, 2].map(i => (
        <React.Fragment key={`rl-${i}`}>
          <Voxel position={[0.6, -i, 0]} color={pants} />
          <Voxel position={[0.6, -i, 1]} color={i === 0 ? pants : pantsDark} />
        </React.Fragment>
      ))}

      {/* BOOTS */}
      <Voxel position={[-0.6, -3, 0]} color={boots} />
      <Voxel position={[-0.6, -3, 1]} color={boots} />
      <Voxel position={[-0.6, -3, 2]} color={bootsDark} scale={[1, 0.8, 0.5]} />
      <Voxel position={[-0.6, -4, 0]} color={bootsDark} />
      <Voxel position={[-0.6, -4, 1]} color={boots} />
      <Voxel position={[0.6, -3, 0]} color={boots} />
      <Voxel position={[0.6, -3, 1]} color={boots} />
      <Voxel position={[0.6, -3, 2]} color={bootsDark} scale={[1, 0.8, 0.5]} />
      <Voxel position={[0.6, -4, 0]} color={bootsDark} />
      <Voxel position={[0.6, -4, 1]} color={boots} />
    </group>
  );
}
