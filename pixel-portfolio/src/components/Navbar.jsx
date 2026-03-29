import { useState, useEffect } from 'react';
import { useSound } from './SoundManager';

const navLinks = [
  { id: 'home', label: 'HOME', index: 0 },
  { id: 'skills', label: 'SKILLS', index: 1 },
  { id: 'education', label: 'EDUCATION', index: 2 },
  { id: 'experience', label: 'EXPERIENCE', index: 3 },
  { id: 'projects', label: 'PROJECTS', index: 4 },
  { id: 'certificates', label: 'CERTS', index: 5 },
  { id: 'contact', label: 'CONTACT', index: 6 },
];

export default function Navbar() {
  const [active, setActive] = useState('');
  const { sfxClick } = useSound();

  useEffect(() => {
    // Poll the global rot value to update active navbar state smoothly
    const interval = setInterval(() => {
      if (window.__TARGET_ROTATION !== undefined) {
        let rot = window.__TARGET_ROTATION % (Math.PI * 2);
        if (rot < 0) rot += Math.PI * 2;
        const index = Math.floor((rot / (Math.PI * 2)) * 7);
        const match = navLinks.find(l => l.index === index);
        setActive(match ? match.id : '');
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (index) => {
    sfxClick();
    if (window.__TARGET_ROTATION !== undefined) {
      // Aim for the center of the sector to ensure robust active-state calculation
      window.__TARGET_ROTATION = (index + 0.5) * (Math.PI * 2) / 7;
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        {navLinks.map((link) => (
          <button
            key={link.id}
            className={`navbar-link ${active === link.id ? 'navbar-link--active' : ''}`}
            onClick={() => handleClick(link.index)}
          >
            {link.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
