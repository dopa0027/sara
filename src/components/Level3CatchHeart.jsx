import React, { useState, useRef } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Level3CatchHeart({ onNext }) {
  const [attempts, setAttempts] = useState(0);
  const [isCaught, setIsCaught] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 }); // percentage within container
  const arenaRef = useRef(null);

  const banterMessages = [
    "Catch it if you can! 😜",
    "Oops, too quick! Try again! 😂",
    "Almost got it, Baby! One more! 🏃‍♂️💨",
    "Okay okay, I surrender! It's yours! 🥹❤️"
  ];

  const handleEvade = () => {
    if (attempts >= 3 || isCaught) return;

    // Calculate new random position inside arena (padding of 15% to 85%)
    const nextX = Math.floor(15 + Math.random() * 70);
    const nextY = Math.floor(20 + Math.random() * 60);

    setPosition({ x: nextX, y: nextY });
    setAttempts((prev) => prev + 1);
  };

  const handleHeartClick = () => {
    if (attempts < 3) {
      handleEvade();
      return;
    }

    // Successfully caught!
    setIsCaught(true);
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff4d88', '#ff7da7', '#ffd700', '#ffffff'],
    });
  };

  return (
    <section className="screen-container level-screen animate-fade-in" aria-label="Level 3: Catch My Heart">
      <div className="card challenge-card">
        <span className="question-tag">CHALLENGE 3</span>
        <h2 className="question-title">Baby, catch my heart! But there's a little problem… 😂❤️</h2>

        {!isCaught ? (
          <>
            <p className="banter-text">{banterMessages[Math.min(attempts, banterMessages.length - 1)]}</p>

            {/* Game Arena with Escaping Heart */}
            <div className="heart-arena" ref={arenaRef}>
              <div
                className="fleeing-heart-wrap"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  transition: attempts < 3 ? 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'all 0.4s ease',
                }}
              >
                <button
                  type="button"
                  className={`heart-catch-btn ${attempts >= 3 ? 'heart-ready-catch' : ''}`}
                  onMouseEnter={handleEvade}
                  onTouchStart={(e) => {
                    if (attempts < 3) {
                      e.preventDefault();
                      handleEvade();
                    }
                  }}
                  onClick={handleHeartClick}
                  aria-label="Catch the glowing heart"
                >
                  <Heart
                    size={48}
                    fill={attempts >= 3 ? '#ff2a6d' : '#ff4d88'}
                    color={attempts >= 3 ? '#ffd700' : '#ffe4e6'}
                    className="heart-icon-glow"
                  />
                  {attempts >= 3 && <span className="tap-hint">Tap me! ❤️</span>}
                </button>
              </div>
            </div>

            {/* Accessibility fallback */}
            <div className="subtle-actions">
              <button
                type="button"
                className="text-link-btn"
                onClick={() => {
                  setAttempts(3);
                  setIsCaught(true);
                  confetti({ particleCount: 50 });
                }}
              >
                Can't catch it? Click here to steal it instantly 💗
              </button>
            </div>
          </>
        ) : (
          /* Heart Caught Reveal */
          <div className="caught-reveal-card animate-pop-in">
            <div className="trophy-heart">
              <Heart size={64} fill="#ff4d88" color="#ffd700" className="drop-shadow-glow" />
            </div>

            <h3 className="reveal-heading">Too late, Baby! 😂❤️</h3>

            <div className="reveal-body">
              <p>You already stole my heart four years ago.</p>
              <p>There's no returning it now. Lifetime ownership is yours. 🥹💗</p>
            </div>

            <div className="action-row">
              <button
                type="button"
                className="romantic-btn primary-glow"
                onClick={onNext}
              >
                <span>CONTINUE, MY HEART THIEF ❤️</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
