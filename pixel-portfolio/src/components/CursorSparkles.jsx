import { useEffect, useState } from 'react';

export default function CursorSparkles() {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    const handlePointerDown = (e) => {
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
    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99999, overflow: 'hidden' }}>
      <style>{`
        * {
          cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path fill='%23FF8C00' d='M12 2L9 9H2L7 14L5 22L12 17L19 22L17 14L22 9H15L12 2Z' stroke='%232a2420' stroke-width='1.5'/></svg>") 12 12, auto !important;
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
    </div>
  );
}
