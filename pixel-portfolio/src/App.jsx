import { useState, useCallback, useEffect } from 'react';
import { SoundProvider, MuteButton } from './components/SoundManager';
import LoadingScreen from './components/LoadingScreen';
import ScrollProgress from './components/ScrollProgress';
import Navbar from './components/Navbar';
import CursorSparkles from './components/CursorSparkles';
import ParticleBackground from './components/ParticleBackground';
import CharacterScene3D from './components/CharacterScene3D';
import HeroChapter from './components/chapters/HeroChapter';
import SkillsChapter from './components/chapters/SkillsChapter';
import EducationChapter from './components/chapters/EducationChapter';
import ExperienceChapter from './components/chapters/ExperienceChapter';
import ProjectsChapter from './components/chapters/ProjectsChapter';
import CertificatesChapter from './components/chapters/CertificatesChapter';
import ContactChapter from './components/chapters/ContactChapter';
import './index.css';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const onLoadComplete = useCallback(() => setLoaded(true), []);
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    let isDragging = false;
    let prevX = 0;
    window.__TARGET_ROTATION = 0;

    const checkChapter = () => {
      let rot = window.__TARGET_ROTATION % (Math.PI * 2);
      if (rot < 0) rot += Math.PI * 2;
      // 7 sectors
      const index = Math.floor((rot / (Math.PI * 2)) * 7);
      setActiveChapter((prev) => (prev !== index ? index : prev));
    };

    // Poll to catch any external updates (like Navbar clicks)
    const intervalId = setInterval(checkChapter, 100);

    const handleDown = (e) => { isDragging = true; prevX = e.clientX; };
    const handleUp = () => { isDragging = false; };
    const handleMove = (e) => {
      if (isDragging) {
        window.__TARGET_ROTATION += (e.clientX - prevX) * 0.01;
        prevX = e.clientX;
      }
    };

    window.addEventListener('pointerdown', handleDown);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointermove', handleMove);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  return (
    <SoundProvider>
      <LoadingScreen onComplete={onLoadComplete} />
      <Navbar />
      <CursorSparkles />
      <MuteButton />
      <ParticleBackground />
      <CharacterScene3D />

      <div className="ui-overlay">
        <div className={`chapter-container ${activeChapter === 0 ? 'active' : ''}`}><HeroChapter /></div>
        <div className={`chapter-container ${activeChapter === 1 ? 'active' : ''}`}><SkillsChapter /></div>
        <div className={`chapter-container ${activeChapter === 2 ? 'active' : ''}`}><EducationChapter /></div>
        <div className={`chapter-container ${activeChapter === 3 ? 'active' : ''}`}><ExperienceChapter /></div>
        <div className={`chapter-container ${activeChapter === 4 ? 'active' : ''}`}><ProjectsChapter /></div>
        <div className={`chapter-container ${activeChapter === 5 ? 'active' : ''}`}><CertificatesChapter /></div>
        <div className={`chapter-container ${activeChapter === 6 ? 'active' : ''}`}><ContactChapter /></div>
      </div>
    </SoundProvider>
  );
}