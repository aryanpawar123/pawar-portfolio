import { useRef, useEffect } from 'react';
import { useSound } from '../SoundManager';
const skillData = [
  { title: 'Languages', badges: ['Python', 'HTML/CSS', 'SQL'] },
  { title: 'Frameworks & Libs', badges: ['TensorFlow', 'Keras', 'Streamlit', 'Pandas', 'NumPy', 'Scikit-learn', 'Matplotlib'] },
  { title: 'Tools', badges: ['Git', 'VS Code', 'MySQL', 'Colab', 'Jupyter'] },
  { title: 'Concepts', badges: ['Deep Learning', 'NLP', 'CNN/LSTM', 'Comp. Vision'] },
];

export default function SkillsChapter() {
  const sectionRef = useRef();
  const { sfxSection, sfxHover } = useSound();
  const played = useRef(false);

  return (
    <section ref={sectionRef} className="chapter" id="skills">
      <span className="chapter-number skills-animate">Chapter II</span>
      <h2 className="chapter-title skills-animate">The Skill Tree</h2>
      <hr className="chapter-divider skills-animate" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px,1fr))', gap: '12px' }}>
        {skillData.map((cat) => (
          <div key={cat.title} className="warm-card skills-animate">
            <div className="card-title" style={{ fontSize: '14px', marginBottom: '10px' }}>{cat.title}</div>
            <div className="skill-grid">
              {cat.badges.map((b) => (
                <span key={b} className="skill-badge" onMouseEnter={sfxHover}>{b}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
