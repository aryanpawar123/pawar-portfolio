import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

export default function LoadingScreen({ onComplete }) {
  const containerRef = useRef();
  const barRef = useRef();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
        onComplete?.();
      }
    });

    tl.to(barRef.current, {
      width: '100%',
      duration: 1.2,
      ease: 'power2.inOut',
    })
    .to(containerRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
    });

    return () => tl.kill();
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div ref={containerRef} className="loading-screen">
      <div className="loading-text">BOOTING...</div>
      <div className="loading-bar-track">
        <div ref={barRef} className="loading-bar-fill" />
      </div>
    </div>
  );
}
