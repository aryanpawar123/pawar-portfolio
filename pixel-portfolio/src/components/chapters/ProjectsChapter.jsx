import { useRef, useEffect } from 'react';
import { useSound } from '../SoundManager';
const projects = [
  { title: 'Blind Assistance System', tech: 'OpenCV, YOLOv10, PyTorch, Streamlit',
    desc: 'Real-time object detection and distance-estimation with Voice-Controlled AI Navigation using TTS & Speech Recognition.',
    link: 'https://github.com/aryanpawar123/blind-assistance-system' },
  { title: 'Weather Report Generator', tech: 'LLM, Python, OpenAI API',
    desc: 'AI-powered weather analysis using LLMs to generate personalized natural-language summaries based on daily plans.',
    link: 'https://github.com/arya54/weather-report-generator' },
  { title: 'Image Caption Generator', tech: 'Deep Learning, CNN, LSTM',
    desc: 'End-to-end model for automatic image captioning using CNNs for visual feature extraction and attention-based LSTM.',
    link: 'https://github.com/aryanpawar123/image-caption-generator' },
];

export default function ProjectsChapter() {
  const sectionRef = useRef();
  const { sfxSection, sfxClick, sfxHover } = useSound();
  const played = useRef(false);

  return (
    <section ref={sectionRef} className="chapter" id="projects">
      <span className="chapter-number proj-animate">Chapter V</span>
      <h2 className="chapter-title proj-animate">The Inventory</h2>
      <hr className="chapter-divider proj-animate" />
      {projects.map((p) => (
        <div key={p.title} className="warm-card project-card" onMouseEnter={sfxHover}>
          <div className="card-title">{p.title}</div>
          <span className="card-tech">{p.tech}</span>
          <p className="card-body">{p.desc}</p>
          <div style={{ marginTop: '16px' }}>
            <a href={p.link} target="_blank" rel="noreferrer" className="btn-warm btn-warm--small btn-warm--outline" onClick={sfxClick}>
              GitHub Repo →
            </a>
          </div>
        </div>
      ))}
    </section>
  );
}
