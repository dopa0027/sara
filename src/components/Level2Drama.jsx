import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Level2Drama({ onNext }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    {
      id: 'you',
      label: 'You, obviously! 😭',
      reply: 'Objection, Baby! The boyfriend requests a fair trial. 😂',
    },
    {
      id: 'me',
      label: 'Me, the innocent one. 🥺',
      reply: 'An innocent person would never say that so confidently! 😏',
    },
    {
      id: 'both',
      label: "Both of us, because we're idiots in love. 😂",
      reply: 'Finally, some honesty in this relationship! 😂❤️',
    },
    {
      id: 'hug',
      label: "Let's forget the fight and hug. ❤️",
      reply: 'Deal, Baby. No arguments. Just hugs. 🫂❤️',
    },
  ];

  return (
    <section className="screen-container level-screen animate-fade-in" aria-label="Level 2: Drama Queen">
      <div className="card challenge-card">
        <span className="question-tag">CHALLENGE 2</span>
        <h2 className="question-title">Baby, be honest! Who gets more emotional during a fight? 😂</h2>

        <div className="options-grid">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`choice-card ${selectedOption?.id === opt.id ? 'active' : ''}`}
              onClick={() => setSelectedOption(opt)}
            >
              <div className="choice-indicator">
                {selectedOption?.id === opt.id ? '✓' : '•'}
              </div>
              <span className="choice-text">{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Reaction card */}
        {selectedOption && (
          <div className="feedback-bubble animate-pop-in">
            <div className="bubble-icon">
              <Sparkles size={16} />
            </div>
            <p className="feedback-text">{selectedOption.reply}</p>
          </div>
        )}

        <div className="action-row">
          {selectedOption ? (
            <button
              type="button"
              className="romantic-btn primary-glow animate-fade-in"
              onClick={onNext}
            >
              <span>CONTINUE TO CHALLENGE 3</span>
              <ArrowRight size={17} />
            </button>
          ) : (
            <p className="hint-text">Choose your honest answer, Baby! 😉</p>
          )}
        </div>
      </div>
    </section>
  );
}
