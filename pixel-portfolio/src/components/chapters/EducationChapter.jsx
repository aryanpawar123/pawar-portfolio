import { useRef, useEffect } from 'react';
import { useSound } from '../SoundManager';
const educationData = [
  { title: 'B.Tech in AI & ML', place: 'Ramdeobaba College of Engineering', date: '2022 – 2026 | Nagpur' },
  { title: 'Higher Secondary (HSC)', place: 'Macro Vision Academy', date: '2022 | Score: 80.89%' },
  { title: 'Secondary School (SSC)', place: "Bhavan's Civil Lines", date: '2020 | Score: 88%' },
];

export default function EducationChapter() {
  const sectionRef = useRef();
  const { sfxSection } = useSound();
  const played = useRef(false);

  return (
    <section ref={sectionRef} className="chapter" id="education">
      <span className="chapter-number edu-animate">Chapter III</span>
      <h2 className="chapter-title edu-animate">The Quest Map</h2>
      <hr className="chapter-divider edu-animate" />
      <div className="timeline">
        {educationData.map((edu) => (
          <div key={edu.title} className="timeline-item">
            <div className="warm-card" style={{ margin: 0 }}>
              <div className="timeline-date">{edu.date}</div>
              <div className="card-title" style={{ fontSize: '14px' }}>{edu.title}</div>
              <p className="card-body" style={{ fontSize: '14px' }}>{edu.place}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
