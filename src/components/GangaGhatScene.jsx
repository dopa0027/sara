import React, { useState, useEffect } from 'react';
import { Moon, Sparkles, ArrowRight, Eye, FastForward } from 'lucide-react';
import { loveStoryConfig } from '../config/loveStoryConfig';
import { romanticAudio } from '../utils/romanticAudioEngine';

export default function GangaGhatScene({ onNext }) {
  const [revealedIndex, setRevealedIndex] = useState(0);
  const [isFullyRevealed, setIsFullyRevealed] = useState(false);
  const [selectedGhatOption, setSelectedGhatOption] = useState(null);
  const [showShootingStar, setShowShootingStar] = useState(false);

  const lines = loveStoryConfig.gangaGhatStory.lines;

  // Soft ducking for music during this intimate cinematic scene
  useEffect(() => {
    romanticAudio.softDucking(true);
    return () => romanticAudio.softDucking(false);
  }, []);

  // Progressive line reveal
  useEffect(() => {
    if (isFullyRevealed) return;

    if (revealedIndex < lines.length) {
      const timer = setTimeout(() => {
        setRevealedIndex((prev) => prev + 1);
      }, 1600); // 1.6s per line for comfortable poetic pacing
      return () => clearTimeout(timer);
    } else {
      setIsFullyRevealed(true);
    }
  }, [revealedIndex, isFullyRevealed, lines.length]);

  const handleSkipReveal = () => {
    setRevealedIndex(lines.length);
    setIsFullyRevealed(true);
  };

  const ghatChoices = [
    { id: 'steps', label: 'Sit on those steps with you again. ❤️' },
    { id: 'stars', label: 'Watch the stars with my head on your shoulder. 🌙' },
    { id: 'hug', label: 'Hug you and never let that moment end. 🫂' },
    { id: 'everything', label: "Everything, as long as it's with you. 💗" },
  ];

  const handleSelectOption = (choice) => {
    setSelectedGhatOption(choice);
    // Trigger majestic shooting star
    setShowShootingStar(true);
    setTimeout(() => {
      setShowShootingStar(false);
    }, 2500);
  };

  return (
    <section className="screen-container ganga-ghat-screen animate-fade-in" aria-label="Our Ganga Ghat Memory">
      {/* ============================================================== */}
      {/* CINEMATIC ARTWORK: GANGA GHAT AT TWILIGHT                      */}
      {/* ============================================================== */}
      <div className="ghat-canvas-wrapper" aria-hidden="true">
        {/* Sky with stars & moon */}
        <div className="ghat-sky">
          <div className="moon-glow" />
          <div className="crescent-moon">
            <Moon size={34} fill="#fff9db" color="#ffeaa7" />
          </div>

          {/* Twinkling ambient stars */}
          <div className="star star-1" />
          <div className="star star-2" />
          <div className="star star-3" />
          <div className="star star-4" />
          <div className="star star-5" />

          {/* Interactive Shooting Star */}
          {showShootingStar && <div className="shooting-star animate-shoot" />}
        </div>

        {/* Distant Temple Shrines & Warm Ghat Lights */}
        <div className="distant-ghat-lights">
          <div className="diya diya-1" />
          <div className="diya diya-2" />
          <div className="diya diya-3" />
          <div className="diya diya-4" />
        </div>

        {/* Peaceful River Ganga with animated water ripples */}
        <div className="ganga-river">
          <div className="water-wave wave-1" />
          <div className="water-wave wave-2" />
          <div className="water-reflection" />
        </div>

        {/* Foreground Wide Stone Steps + Couple Silhouette */}
        <div className="ghat-foreground">
          <div className="ghat-step step-1" />
          <div className="ghat-step step-2" />
          <div className="ghat-step step-3">
            {/* Romantic SVG Silhouette: Girl resting head on boy's shoulder */}
            <div className="couple-silhouette-box" title="You and me on the Ganga Ghat steps">
              <svg viewBox="0 0 160 120" className="couple-svg" aria-label="Two lovers sitting together at the ghat">
                {/* Boy silhouette */}
                <path
                  d="M 45 42 Q 55 18 68 40 Q 80 50 82 85 L 82 120 L 30 120 L 30 75 Q 32 50 45 42 Z"
                  fill="#07080f"
                />
                {/* Girl silhouette leaning head on his shoulder */}
                <path
                  d="M 72 45 Q 85 24 95 44 Q 106 58 108 95 L 108 120 L 68 120 L 68 70 Q 64 52 72 45 Z"
                  fill="#07080f"
                />
                {/* Soft warm outline glow */}
                <path
                  d="M 45 42 Q 55 18 68 40 Q 80 50 82 85"
                  stroke="rgba(255, 215, 0, 0.25)"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M 72 45 Q 85 24 95 44 Q 106 58 108 95"
                  stroke="rgba(255, 125, 167, 0.3)"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* STORYTELLING CONTENT & TEXT REVEAL                             */}
      {/* ============================================================== */}
      <div className="card ghat-story-card">
        <div className="centerpiece-tag">
          <Sparkles size={14} />
          <span>OUR SACRED MEMORY</span>
        </div>

        <h2 className="ghat-title">{loveStoryConfig.gangaGhatStory.title}</h2>

        {/* Progressive Romantic Text Reveal */}
        <div className="poem-prose-container" aria-live="polite">
          {lines.slice(0, revealedIndex).map((line, idx) => (
            <p
              key={idx}
              className={`prose-line ${idx === revealedIndex - 1 ? 'line-highlight animate-fade-in' : ''}`}
            >
              {line}
            </p>
          ))}
        </div>

        {/* Skip/Fast-forward button for reader convenience */}
        {!isFullyRevealed && (
          <div className="reveal-controls">
            <button
              type="button"
              className="text-link-btn"
              onClick={handleSkipReveal}
            >
              <FastForward size={14} />
              <span>Read Full Message Immediately</span>
            </button>
          </div>
        )}

        {/* Interactive Question after the memory is fully revealed */}
        {isFullyRevealed && (
          <div className="after-memory-section animate-fade-in">
            <div className="divider-gold" />

            <h3 className="ghat-subquestion">
              Baby, if we could go back to that evening, what would you choose? 🥹
            </h3>

            <div className="options-grid">
              {ghatChoices.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  className={`choice-card ${selectedGhatOption?.id === choice.id ? 'active' : ''}`}
                  onClick={() => handleSelectOption(choice)}
                >
                  <div className="choice-indicator">{selectedGhatOption?.id === choice.id ? '★' : '•'}</div>
                  <span className="choice-text">{choice.label}</span>
                </button>
              ))}
            </div>

            {/* Response after choice */}
            {selectedGhatOption && (
              <div className="wish-response-bubble animate-pop-in">
                <div className="wish-title">
                  <Sparkles size={16} />
                  <span>Make a wish, Baby. ✨</span>
                </div>
                <p>Mine is simple.</p>
                <p>I wish for more evenings like that one.</p>
                <p>More memories, more laughter, more little moments with you.</p>
                <p>And someday, when we look back at these four years, I hope we'll smile and say…</p>
                <p className="highlight-text">We had something beautiful, didn't we? ❤️</p>

                <div className="action-row" style={{ marginTop: '24px' }}>
                  <button
                    type="button"
                    className="romantic-btn primary-glow"
                    onClick={onNext}
                  >
                    <span>CONTINUE TO LEVEL 5</span>
                    <ArrowRight size={17} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
