import { useRef, useEffect } from 'react';
import { useSound } from '../SoundManager';

export default function HeroChapter() {
  const sectionRef = useRef();
  const { sfxClick } = useSound();


  return (
    <section ref={sectionRef} className="chapter chapter--hero" id="hero">
      <div className="hero-content">
        <p className="hero-greeting" style={{ transform: 'translateY(20px)' }}>
          WELCOME, TRAVELER
        </p>
        <h1 className="hero-name" style={{ transform: 'translateY(30px)' }}>
          Aryan<br /><span>Pawar</span>
        </h1>
        <p className="hero-tagline" style={{ transform: 'translateY(20px)' }}>
          AI & ML Enthusiast
        </p>
        <p className="hero-desc" style={{ transform: 'translateY(20px)' }}>
          Crafting intelligent systems at the intersection of deep learning, computer vision, and generative AI.
        </p>
        <div className="hero-buttons" style={{ transform: 'translateY(20px)' }}>
          <a href="https://github.com/aryanpawar123" target="_blank" rel="noreferrer" className="btn-warm btn-warm--small" onClick={sfxClick}>
            🐙 GitHub
          </a>
          <a href="https://www.linkedin.com/in/aryan-pawar-650458290/" target="_blank" rel="noreferrer" className="btn-warm btn-warm--small btn-warm--outline" onClick={sfxClick}>
            💼 LinkedIn
          </a>
          <a href="mailto:aryanpawar19122003@gmail.com" className="btn-warm btn-warm--small btn-warm--outline" onClick={sfxClick}>
            📧 Email
          </a>
        </div>
      </div>
      <div className="hero-scroll-hint">⟷ DRAG TO ROTATE CHARACTER ⟷</div>
    </section>
  );
}
