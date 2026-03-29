import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function CursorSparkles() {
  const [sparkles, setSparkles] = useState([]);
  const cursorRef = useRef(null);
  const fingerRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Use GSAP quick setter for maximum performance mouse tracking
    const setX = gsap.quickSetter(cursor, 'x', 'px');
    const setY = gsap.quickSetter(cursor, 'y', 'px');

    const handlePointerMove = (e) => {
      // Hotspot offset: tip of the index finger is roughly at (11, 4) in the SVG
      setX(e.clientX - 11);
      setY(e.clientY - 4);
    };

    const handlePointerDown = (e) => {
      // Animate the robotic finger clicking
      gsap.to(fingerRef.current, { rotation: 25, y: 3, duration: 0.1, ease: 'power2.out' });

      // Generate sparkles
      const newSparkles = Array.from({ length: 12 }).map((_, i) => ({
        id: Date.now() + i,
        x: e.clientX,
        y: e.clientY,
        tx: (Math.random() - 0.5) * 100,
        ty: (Math.random() - 0.5) * 100,
        r: Math.random() * 360,
      }));
      setSparkles((prev) => [...prev.slice(-36), ...newSparkles]);
    };

    const handlePointerUp = () => {
      // Release finger
      gsap.to(fingerRef.current, { rotation: 0, y: 0, duration: 0.2, ease: 'back.out(2)' });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    // Initial position hide before mouse move
    gsap.set(cursor, { x: -100, y: -100 });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  // Make sure we only render this on non-touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99999, overflow: 'hidden' }}>
      <style>{`
        * {
          cursor: none !important;
        }
        .sparkle-part {
          position: absolute;
          width: 8px; height: 8px;
          background: #FF8C00;
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
          animation: spark-shoot 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes spark-shoot {
          0% { transform: translate(0,0) scale(1) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0) rotate(var(--r)); opacity: 0; }
        }
        .robot-cursor {
          position: absolute;
          top: 0; left: 0;
          pointer-events: none;
          z-index: 100000;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4));
          will-change: transform;
        }
      `}</style>
      
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="sparkle-part"
          style={{
            left: s.x - 4,
            top: s.y - 4,
            '--tx': `${s.tx}px`,
            '--ty': `${s.ty}px`,
            '--r': `${s.r}deg`
          }}
        />
      ))}

      {/* Animated Robotic Hand */}
      <div className="robot-cursor" ref={cursorRef}>
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="42" viewBox="0 0 36 42">
          <g>
            {/* Index Finger Tip (Animated) */}
            <g ref={fingerRef} style={{ transformOrigin: '11px 12px' }}>
              <path d="M8 12 L8 6 C8 4 14 4 14 6 L14 12 Z" fill="#d1d8e0" stroke="#2a2420" strokeWidth="1.5" strokeLinejoin="round"/>
              <line x1="9.5" y1="7" x2="12.5" y2="7" stroke="#2a2420" strokeWidth="1" strokeLinecap="round"/>
              <line x1="9.5" y1="9" x2="12.5" y2="9" stroke="#2a2420" strokeWidth="1" strokeLinecap="round"/>
            </g>
            
            {/* Index Finger Base */}
            <rect x="8" y="12" width="6" height="8" fill="#a0aab5" stroke="#2a2420" strokeWidth="1.5" strokeLinejoin="round"/>

            {/* Middle Finger */}
            <path d="M14 14 L14 10 C14 8.5 20 8.5 20 10 L20 14 Z" fill="#95a5a6" stroke="#2a2420" strokeWidth="1.5" strokeLinejoin="round"/>
            <rect x="14" y="14" width="6" height="8" fill="#7f8c8d" stroke="#2a2420" strokeWidth="1.5" strokeLinejoin="round"/>

            {/* Ring Finger */}
            <path d="M20 16 L20 12 C20 10.5 26 10.5 26 12 L26 16 Z" fill="#95a5a6" stroke="#2a2420" strokeWidth="1.5" strokeLinejoin="round"/>
            <rect x="20" y="16" width="6" height="6" fill="#7f8c8d" stroke="#2a2420" strokeWidth="1.5" strokeLinejoin="round"/>

            {/* Palm */}
            <path d="M8 20 L26 20 L28 28 L24 36 L14 36 L8 28 Z" fill="#bdc3c7" stroke="#2a2420" strokeWidth="1.5" strokeLinejoin="round"/>

            {/* Thumb */}
            <path d="M8 22 L2 26 L4 32 L8 28 Z" fill="#95a5a6" stroke="#2a2420" strokeWidth="1.5" strokeLinejoin="round"/>

            {/* Palm Details (Glowing Core) */}
            <circle cx="17" cy="28" r="4.5" fill="#FF8C00" opacity="0.9"/>
            <circle cx="17" cy="28" r="2" fill="#FFEAA7"/>
          </g>
        </svg>
      </div>
    </div>
  );
}
