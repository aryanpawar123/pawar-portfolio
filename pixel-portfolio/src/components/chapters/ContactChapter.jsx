import { useRef, useEffect, useState } from 'react';
import { useSound } from '../SoundManager';
export default function ContactChapter() {
  const sectionRef = useRef();
  const { sfxSection, sfxClick } = useSound();
  const played = useRef(false);
  const [typed, setTyped] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const fullText = 'The adventure continues...';


  return (
    <section ref={sectionRef} className="chapter" id="contact">
      <span className="chapter-number contact-animate">Final Chapter</span>
      <h2 className="chapter-title contact-animate">Let's Work Together!</h2>
      <hr className="chapter-divider contact-animate" />
      <div className="social-links contact-animate">
        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=aryanpawar19122003@gmail.com" target="_blank" rel="noreferrer" className="social-link" onClick={sfxClick}>
          <span className="icon">📧</span><span>aryanpawar19122003@gmail.com</span><span className="arrow">▶</span>
        </a>
        <a href="https://www.linkedin.com/in/aryan-pawar-650458290/" target="_blank" rel="noreferrer" className="social-link" onClick={sfxClick}>
          <span className="icon">💼</span><span>LinkedIn</span><span className="arrow">▶</span>
        </a>
        <a href="https://github.com/aryanpawar123" target="_blank" rel="noreferrer" className="social-link" onClick={sfxClick}>
          <span className="icon">🐙</span><span>GitHub</span><span className="arrow">▶</span>
        </a>
        <a href="tel:+917666330853" className="social-link" onClick={sfxClick}>
          <span className="icon">📞</span><span>+91 76663 30853</span><span className="arrow">▶</span>
        </a>
      </div>
      <div className="story-footer contact-animate">
        <p><span className="typing-text">{fullText}</span></p>
        <p style={{ marginTop: '14px' }}>© 2026 Aryan Pawar</p>
      </div>
    </section>
  );
}
