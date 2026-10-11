import React, { useState, useEffect } from 'react';
import { Music, Play, Pause } from 'lucide-react';
import { romanticAudio } from '../utils/romanticAudioEngine';

export default function HeaderNav({ onOpenNote, onNavigate }) {
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const unsub = romanticAudio.subscribe((state) => {
      setIsPlaying(state.isPlaying);
    });
    return unsub;
  }, []);

  const handleToggleMusic = () => {
    romanticAudio.toggle();
  };

  return (
    <header className="site-header">
      <div className="brand-logo" onClick={() => onNavigate('home')} role="button" tabIndex={0}>
        <span className="heart-icon">♥</span>
        <span className="brand-name">For You Sara</span>
      </div>

      <nav className="nav-links">
        <button type="button" className="nav-link" onClick={() => onNavigate('home')}>Home</button>
        <button type="button" className="nav-link highlight-link" onClick={onOpenNote}>Message</button>
        <button type="button" className="nav-link special-pn-link" onClick={() => onNavigate('pehli-nazar')}>Pehli Nazar ❤️</button>
        <button type="button" className="nav-link special-quiz-link" onClick={() => onNavigate('quiz')}>Know Me? 💌</button>
        <button type="button" className="nav-link" onClick={() => onNavigate('shayari')}>Shayari</button>
        <button type="button" className="nav-link" onClick={() => onNavigate('photos')}>Our Photos</button>
        <button type="button" className="nav-link" onClick={() => onNavigate('surprise')}>Surprise</button>
        <button type="button" className="nav-link" onClick={() => onNavigate('always')}>For Always</button>
      </nav>

      {/* Music Header Pill */}
      <button
        type="button"
        className={`header-music-pill ${isPlaying ? 'is-playing' : ''}`}
        onClick={handleToggleMusic}
        title="Toggle background music"
        aria-label="Toggle music"
      >
        <div className="music-note-icon">
          {isPlaying ? <Music size={14} className="spin-slow" /> : <Play size={12} />}
        </div>
        <div className="music-pill-text">
          <span className="song-name">Tera Hone Laga Hoon</span>
          <span className="song-sub">
            {isPlaying ? 'Our little soundtrack · Playing ♪' : 'Our little soundtrack · Play song'}
          </span>
        </div>
        <div className="mini-eq" aria-hidden="true">
          <span className={`mini-bar ${isPlaying ? 'act' : ''}`} />
          <span className={`mini-bar ${isPlaying ? 'act' : ''}`} />
          <span className={`mini-bar ${isPlaying ? 'act' : ''}`} />
        </div>
      </button>
    </header>
  );
}
