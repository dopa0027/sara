import React, { useState, useEffect, useRef } from 'react';
import { Heart, Send, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Level5SendLove({ onNext }) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isCompleted, setIsCompleted] = useState(false);
  const [interrupted, setInterrupted] = useState(false);
  const requestRef = useRef(null);
  const startTimeRef = useRef(null);

  const REQUIRED_HOLD_MS = 4500; // 4.5 seconds for optimal responsiveness

  const startHold = () => {
    if (isCompleted) return;
    setHolding(true);
    setInterrupted(false);
    startTimeRef.current = performance.now() - (progress / 100) * REQUIRED_HOLD_MS;
  };

  const stopHold = () => {
    if (isCompleted) return;
    setHolding(false);
    if (progress < 98) {
      setInterrupted(true);
    }
  };

  useEffect(() => {
    const loop = (now) => {
      if (holding && !isCompleted && startTimeRef.current) {
        const elapsed = now - startTimeRef.current;
        const currentProg = Math.min(100, Math.round((elapsed / REQUIRED_HOLD_MS) * 100));
        setProgress(currentProg);

        if (currentProg >= 100) {
          setIsCompleted(true);
          setHolding(false);
          confetti({
            particleCount: 80,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#ff4d88', '#ff7da7', '#ffd700'],
          });
          return;
        }
      }
      requestRef.current = requestAnimationFrame(loop);
    };

    if (holding && !isCompleted) {
      requestRef.current = requestAnimationFrame(loop);
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [holding, isCompleted]);

  // Accessibility one-click helper
  const handleInstantSend = () => {
    setProgress(100);
    setIsCompleted(true);
    confetti({ particleCount: 60 });
  };

  return (
    <section className="screen-container level-screen animate-fade-in" aria-label="Level 5: Send Love">
      <div className="card challenge-card">
        <span className="question-tag">CHALLENGE 5</span>
        <h2 className="question-title">Baby, press and hold to send me all your love! ❤️</h2>

        {!isCompleted ? (
          <>
            <p className="instruction-text">
              Hold the heart for 5 seconds to fill up the meter!
            </p>

            {/* Glowing Heart Press & Hold Target */}
            <div className="press-hold-area">
              <div
                className={`heart-meter-ring ${holding ? 'is-holding' : ''}`}
                style={{
                  background: `conic-gradient(#ff4d88 ${progress * 3.6}deg, rgba(255, 125, 167, 0.15) 0deg)`,
                }}
              >
                <button
                  type="button"
                  className={`press-hold-heart-btn ${holding ? 'active-pulse' : ''}`}
                  onMouseDown={startHold}
                  onMouseUp={stopHold}
                  onMouseLeave={stopHold}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    startHold();
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    stopHold();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') startHold();
                  }}
                  onKeyUp={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') stopHold();
                  }}
                  aria-label="Hold to send love"
                >
                  <Heart
                    size={64}
                    fill="#ff4d88"
                    color="#ffd700"
                    style={{
                      transform: `scale(${1 + (progress / 100) * 0.35})`,
                      transition: 'transform 0.1s linear',
                    }}
                  />
                  <span className="hold-counter">{progress}%</span>
                </button>
              </div>
            </div>

            {/* Status indicator */}
            <div className="hold-status-bar">
              {holding ? (
                <span className="sending-msg animate-pulse">Delivering your love... keep holding! 💌</span>
              ) : interrupted ? (
                <span className="interrupted-msg">Almost there! Don't let go so fast, Baby! 🥺❤️</span>
              ) : (
                <span className="ready-msg">Press & hold the heart above 👆</span>
              )}
            </div>

            {/* Fallback button */}
            <div className="subtle-actions">
              <button type="button" className="text-link-btn" onClick={handleInstantSend}>
                On mobile or having trouble holding? Tap here to send all your love at once ♡
              </button>
            </div>
          </>
        ) : (
          /* Love Delivery Successful Reveal */
          <div className="delivery-success-card animate-pop-in">
            <div className="delivery-icon">
              <CheckCircle2 size={54} color="#ffd700" />
            </div>

            <h3 className="delivery-title">LOVE DELIVERY SUCCESSFUL! 💌</h3>

            <div className="delivery-message">
              <p>Your baby has received all your love.</p>
              <p>Unfortunately, this website cannot deliver real hugs. 😭</p>
              <p className="debt-highlight">
                So you owe me at least 100 hugs. No negotiations! 😂❤️
              </p>
            </div>

            <div className="action-row">
              <button
                type="button"
                className="romantic-btn primary-glow"
                onClick={onNext}
              >
                <span>I AGREE TO 100 HUGS! 🫂</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
