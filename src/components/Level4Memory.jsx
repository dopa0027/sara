import React, { useState } from 'react';
import { Sparkles, Moon, ArrowRight } from 'lucide-react';
import { loveStoryConfig } from '../config/loveStoryConfig';

export default function Level4Memory({ onNext }) {
  const [selected, setSelected] = useState(null);

  const memoryChoices = [
    { id: 'first-chat', label: 'Our first conversation. 💌' },
    { id: 'special', label: 'One of our most special memories. 🥹' },
    { id: 'smile', label: 'That moment when I made you smile like crazy. 😂' },
    { id: 'all', label: "Every moment, because it's us. ❤️" },
  ];

  return (
    <section className="screen-container level-screen animate-fade-in" aria-label="Level 4: Four Years One Memory">
      <div className="card challenge-card">
        <span className="question-tag">CHALLENGE 4</span>
        <h2 className="question-title">Baby, if you could relive one moment from our four years together, which would you choose? ❤️</h2>

        {/* Options */}
        <div className="options-grid">
          {memoryChoices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              className={`choice-card ${selected?.id === choice.id ? 'active' : ''}`}
              onClick={() => setSelected(choice)}
            >
              <div className="choice-indicator">{selected?.id === choice.id ? '✓' : '•'}</div>
              <span className="choice-text">{choice.label}</span>
            </button>
          ))}
        </div>

        {/* Response + Real Photo Card */}
        {selected && (
          <div className="memory-reveal-box animate-pop-in">
            <div className="feedback-bubble">
              <p className="feedback-text">
                Whatever memory you choose, Baby, I hope we create a thousand more.
                Four years have passed, but there are still so many beautiful memories waiting for us. ❤️
              </p>
            </div>

            {/* Polaroid Photo of Both of You */}
            <div className="polaroid-card">
              <div className="polaroid-image-frame">
                <img
                  src={loveStoryConfig.photos.coupleHero}
                  alt="Sara and me smiling together in golden sunset"
                  className="polaroid-img"
                  onError={(e) => {
                    e.target.src = loveStoryConfig.photos.coupleOriginal;
                  }}
                />
              </div>
              <div className="polaroid-caption">
                <span>Four years of us. And I'd choose you all over again. ✨</span>
              </div>
            </div>

            <div className="action-row">
              <button
                type="button"
                className="romantic-btn primary-glow"
                onClick={onNext}
              >
                <span>STEP INTO OUR SPECIAL PLACE 🌙</span>
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        )}

        {!selected && (
          <p className="hint-text">Every answer is right, because each second with you is precious. 💖</p>
        )}
      </div>
    </section>
  );
}
