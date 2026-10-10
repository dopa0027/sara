import React, { useState } from 'react';
import { Gift, Heart, Sparkles, MailOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { loveStoryConfig } from '../config/loveStoryConfig';

export default function Level7FinalPromise({ onUnlockLetter }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [chosenAnswer, setChosenAnswer] = useState('');

  const triggerGrandCelebration = () => {
    // Multi-stage confetti celebration
    const duration = 3.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff4d88', '#ffd700', '#ff8da1', '#ffffff'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff4d88', '#ffd700', '#ff8da1', '#ffffff'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleChoose = (answerText) => {
    setChosenAnswer(answerText);
    setIsUnlocked(true);
    triggerGrandCelebration();
  };

  return (
    <section className="screen-container final-promise-screen animate-fade-in" aria-label="Level 7: The Final Promise">
      <div className={`card challenge-card ${isUnlocked ? 'golden-glow-card' : ''}`}>
        <span className="question-tag">THE FINAL LEVEL</span>

        {/* 3D Glowing Gift Box Visual */}
        <div className="gift-box-wrap">
          <div className={`gift-box-container ${isUnlocked ? 'box-opened' : 'box-glowing'}`}>
            <div className="gift-lid">
              <div className="ribbon-bow">🎀</div>
            </div>
            <div className="gift-body">
              <Gift size={58} color="#ffeaa7" className="gift-icon" />
            </div>
            {isUnlocked && <div className="gift-rays-burst" />}
          </div>
        </div>

        {!isUnlocked ? (
          <>
            <div className="promise-preamble">
              <p>
                Baby, four years ago, I didn't know how many memories, smiles, silly fights, and beautiful moments we would share.
              </p>
              <p>
                But here we are. Four years later. Still creating our story. ❤️
              </p>
              <p className="emphasis-line">
                And today, on your birthday, I have one last question for you.
              </p>
            </div>

            <h2 className="final-proposal-question">
              "Baby, will you keep making beautiful memories with me? 🥹❤️"
            </h2>

            {/* Dual Romantic Buttons */}
            <div className="dual-buttons-row">
              <button
                type="button"
                className="romantic-btn primary-glow pulse-btn"
                onClick={() => handleChoose('YES, ALWAYS, BABY ❤️')}
              >
                <span>YES, ALWAYS, BABY ❤️</span>
              </button>

              <button
                type="button"
                className="romantic-btn secondary-choice"
                onClick={() => handleChoose('DO I EVEN HAVE A CHOICE? 😂💗')}
              >
                <span>DO I EVEN HAVE A CHOICE? 😂💗</span>
              </button>
            </div>
          </>
        ) : (
          /* Gift Unlocked State */
          <div className="unlocked-celebration animate-pop-in">
            <h2 className="celebration-birthday-title">
              HAPPY BIRTHDAY, MY {loveStoryConfig.partnerName.toUpperCase()}! ❤️🎂
            </h2>

            <p className="celebration-subtitle">
              You chose: <span className="chosen-pill">"{chosenAnswer}"</span>
            </p>

            <p className="gift-revealed-msg">
              Your greatest birthday gift was unlocked: a piece of my soul written just for you.
            </p>

            <div className="action-row" style={{ marginTop: '28px' }}>
              <button
                type="button"
                className="romantic-btn primary-glow"
                onClick={onUnlockLetter}
              >
                <MailOpen size={18} />
                <span>OPEN YOUR LOVE LETTER 💌</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
