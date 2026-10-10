import React, { useState } from 'react';
import { Heart, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Level1Slider({ onNext }) {
  const [value, setValue] = useState(50);
  const [hasReached100, setHasReached100] = useState(false);

  const handleChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setValue(val);
    if (val === 100 && !hasReached100) {
      setHasReached100(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ff4d88', '#ff7da7', '#ffd700'],
      });
    }
  };

  // Dynamic banter message based on percentage
  const getFeedbackMessage = () => {
    if (value <= 30) {
      return "Excuse me, Baby! Are you sure you're on the right website? 😂";
    }
    if (value <= 70) {
      return "Bas itna hi, Baby? I think I deserve a little more love! 🥺";
    }
    if (value < 100) {
      return "Not bad, Baby. But I was expecting something out of this world! ❤️";
    }
    return "ERROR 404: LOVE LIMIT NOT FOUND! 😭❤️";
  };

  // Heart scaling calculation: scales up from 0.8x up to 2.4x at 100%
  const heartScale = 0.8 + (value / 100) * (value === 100 ? 1.5 : 0.8);

  return (
    <section className="screen-container level-screen animate-fade-in" aria-label="Level 1: Love Meter">
      <div className="card challenge-card">
        <span className="question-tag">CHALLENGE 1</span>
        <h2 className="question-title">Baby, tell me how much you love me! ❤️</h2>

        {/* Dynamic Scaling Glowing Heart */}
        <div className="heart-display-area">
          <div
            className={`heart-visual ${value === 100 ? 'system-broken-heart' : ''}`}
            style={{ transform: `scale(${heartScale})` }}
          >
            <Heart
              size={70}
              fill={value === 100 ? '#ff2a6d' : '#ff4d88'}
              color={value === 100 ? '#ffe082' : '#ff7da7'}
              className="drop-shadow-glow"
            />
          </div>
          <div className="love-percent-display">{value}%</div>
        </div>

        {/* The 0-100% Slider */}
        <div className="slider-container">
          <div className="slider-track-wrap">
            <span className="range-label">0%</span>
            <input
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={handleChange}
              className="romantic-slider"
              aria-label="Love meter slider"
            />
            <span className="range-label">100%</span>
          </div>
        </div>

        {/* Message Card */}
        <div className={`feedback-bubble ${value === 100 ? 'error-glitch-bubble' : ''}`}>
          {value === 100 && (
            <div className="glitch-header">
              <AlertTriangle size={18} className="warn-icon" />
              <span>SYSTEM OVERLOAD!</span>
            </div>
          )}
          <p className="feedback-text">{getFeedbackMessage()}</p>

          {value === 100 && (
            <p className="system-break-msg">
              Love limit exceeded! Baby, you've officially broken the system. ❤️
            </p>
          )}
        </div>

        {/* Continue Button appears on 100% */}
        {value === 100 ? (
          <div className="action-row animate-pop-in">
            <button
              type="button"
              className="romantic-btn primary-glow pulse-btn"
              onClick={onNext}
            >
              <span>OBVIOUSLY, I'M OBSESSED WITH YOU! 😂</span>
            </button>
          </div>
        ) : (
          <p className="hint-text">Drag that slider all the way to 100%, princess! 👆</p>
        )}
      </div>
    </section>
  );
}
