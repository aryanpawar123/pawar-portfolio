import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function Character3D() {
  const group = useRef();
  const { viewport } = useThree();
  
  const { scene, animations } = useGLTF('https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/models/gltf/RobotExpressive/RobotExpressive.glb');
  const { actions } = useAnimations(animations, group);
  
  const activeAnim = useRef('Idle');
  const targetLook = useRef(new THREE.Vector3());

  // Find head and neck bones for tracking
  const neckBone = scene.getObjectByName('Neck');
  const headBone = scene.getObjectByName('Head');

  useEffect(() => {
    if (actions['Idle']) {
      actions['Idle'].reset().fadeIn(0.5).play();
    }
  }, [actions]);

  // Frame updates: scroll physics, eye tracking, blinking
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    
    if (actions && window.__TARGET_ROTATION !== undefined) {
      // Rotate character specifically to the user's drag target, offset by -0.5 so it explicitly faces the "screens" (UI cards)
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, window.__TARGET_ROTATION - 0.5, delta * 5);

      let rot = window.__TARGET_ROTATION % (Math.PI * 2);
      if (rot < 0) rot += Math.PI * 2;
      const index = Math.floor((rot / (Math.PI * 2)) * 7);

      let nextAnim = 'Idle';
      if (index === 0) nextAnim = 'Wave';
      else if (index === 1) nextAnim = 'ThumbsUp';
      else if (index === 2) nextAnim = 'Walking';
      else if (index === 3) nextAnim = 'Walking';
      else if (index === 4) nextAnim = 'Dance';
      else if (index === 5) nextAnim = 'Jump';
      else if (index === 6) nextAnim = 'ThumbsUp';

      if (nextAnim !== activeAnim.current && actions[nextAnim]) {
        actions[activeAnim.current]?.fadeOut(0.5);
        actions[nextAnim]?.reset().fadeIn(0.5).play();
        activeAnim.current = nextAnim;
      }
    }

    // 1. Hover bob
    if (group.current) {
      group.current.position.y = -1.55 + Math.sin(t * 1.5) * 0.05;
    }

    // 2. Head Tracking
    const mouseX = (state.pointer.x * Math.PI) / 4;
    const mouseY = (state.pointer.y * Math.PI) / 4;

    targetLook.current.x = THREE.MathUtils.lerp(targetLook.current.x, mouseY, 0.1);
    targetLook.current.y = THREE.MathUtils.lerp(targetLook.current.y, mouseX, 0.1);

    if (neckBone && headBone && activeAnim.current === 'Idle') {
      neckBone.rotation.y = targetLook.current.y * 0.5;
      neckBone.rotation.x = -targetLook.current.x * 0.5;
      headBone.rotation.y = targetLook.current.y * 0.5;
      headBone.rotation.x = -targetLook.current.x * 0.5;
    }

    // 3. Eye Blinking Logic
    const eyes = scene.children.filter(child => child.name === 'EyeRight' || child.name === 'EyeLeft');
    const blinkCycle = t % 4;
    const isBlinking = blinkCycle > 3.8 && blinkCycle < 3.9;
    
    if (eyes.length > 0) {
      eyes.forEach(eye => {
        eye.scale.setComponent(1, isBlinking ? 0.1 : 1);
      });
    }
  });

  // Responsive positioning: on desktop (viewport width > 5) shift right, on mobile keep center
  const isMobile = viewport.width < 5;
  const characterX = isMobile ? 0 : 1.8;
  const characterY = isMobile ? -2.0 : -1.55;

  return (
    <group ref={group} position={[characterX, characterY, 0]} scale={isMobile ? 0.35 : 0.4} rotation={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/models/gltf/RobotExpressive/RobotExpressive.glb');
