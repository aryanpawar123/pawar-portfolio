import { useRef, useEffect } from 'react';
import { useSound } from '../SoundManager';
export default function ExperienceChapter() {
  const sectionRef = useRef();
  const { sfxSection, sfxClick } = useSound();
  const played = useRef(false);

  return (
    <section ref={sectionRef} className="chapter" id="experience">
      <span className="chapter-number exp-animate">Chapter IV</span>
      <h2 className="chapter-title exp-animate">Guild Quests</h2>
      <hr className="chapter-divider exp-animate" />
      <div className="warm-card exp-animate">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <div>
            <div className="card-title">Frontend Developer Intern</div>
            <div className="card-subtitle">Habitroo Archspace Pvt. Ltd.</div>
          </div>
          <span style={{ fontSize: '28px' }}>🏰</span>
        </div>
        <ul className="card-body" style={{ marginTop: '14px' }}>
          <li>Designed responsive UI components using HTML, CSS, and JS.</li>
          <li>Developed a modern portfolio website for architecture projects.</li>
        </ul>
        <div style={{ marginTop: '20px' }}>
          <a href="https://www.habitroo.com/" target="_blank" rel="noreferrer" className="btn-warm btn-warm--small" onClick={sfxClick}>
            Visit Website →
          </a>
        </div>
      </div>
    </section>
  );
}
