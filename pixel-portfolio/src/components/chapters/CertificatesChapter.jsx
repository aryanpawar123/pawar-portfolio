import { useRef, useEffect } from 'react';
import { useSound } from '../SoundManager';
const certs = [
  { icon: '🏆', name: 'Oracle GenAI Professional', link: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=99006C725A8B28FE1D2E6DF8DC38AA6B25C210F68EAD3F2C394919752EFF47B8' },
  { icon: '🪙', name: 'IBM GenAI Engineering', link: 'https://www.credly.com/badges/1a43872f-1ed4-4a73-8892-65e32a2c0112' },
  { icon: '⭐', name: 'IBM GenAI Specialization', link: 'https://www.coursera.org/account/accomplishments/specialization/XILFJS0NHMY5' },
  { icon: '🎖️', name: 'GenAI Coursework', link: 'https://www.coursera.org/account/accomplishments/verify/N92QV54JXWHU' },
];

export default function CertificatesChapter() {
  const sectionRef = useRef();
  const { sfxAchievement, sfxClick } = useSound();
  const played = useRef(false);

  return (
    <section ref={sectionRef} className="chapter" id="certificates">
      <span className="chapter-number cert-animate">Chapter VI</span>
      <h2 className="chapter-title cert-animate">Achievements Unlocked</h2>
      <hr className="chapter-divider cert-animate" />
      <div className="cert-grid">
        {certs.map((c) => (
          <div key={c.name} className="warm-card cert-card">
            <span className="cert-icon">{c.icon}</span>
            <div className="cert-name">{c.name}</div>
            <a href={c.link} target="_blank" rel="noreferrer" className="btn-warm btn-warm--small" onClick={sfxClick}>View</a>
          </div>
        ))}
      </div>
    </section>
  );
}
