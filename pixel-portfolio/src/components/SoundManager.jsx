import { createContext, useContext, useState, useCallback } from 'react';
import { playHover, playClick, playSection, playAchievement, resumeAudioContext } from '../utils/sounds';

const SoundContext = createContext({
  muted: false,
  sfxHover: () => {},
  sfxClick: () => {},
  sfxSection: () => {},
  sfxAchievement: () => {},
});

export function SoundProvider({ children }) {
  const [muted, setMuted] = useState(false);

  const sfxHover = useCallback(() => { if (!muted) { resumeAudioContext(); playHover(); } }, [muted]);
  const sfxClick = useCallback(() => { if (!muted) { resumeAudioContext(); playClick(); } }, [muted]);
  const sfxSection = useCallback(() => { if (!muted) { resumeAudioContext(); playSection(); } }, [muted]);
  const sfxAchievement = useCallback(() => { if (!muted) { resumeAudioContext(); playAchievement(); } }, [muted]);

  return (
    <SoundContext.Provider value={{ muted, setMuted, sfxHover, sfxClick, sfxSection, sfxAchievement }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  return useContext(SoundContext);
}

export function MuteButton() {
  const { muted, setMuted, sfxClick } = useSound();
  const handleClick = () => {
    resumeAudioContext();
    setMuted(!muted);
    if (muted) sfxClick(); // play click when unmuting
  };
  return (
    <button className="mute-btn" onClick={handleClick} title={muted ? 'Unmute sounds' : 'Mute sounds'}>
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
