import React, { useState } from 'react';
import { Sparkles, Heart, ArrowRight } from 'lucide-react';
import { loveStoryConfig } from '../config/loveStoryConfig';

export default function Level6FavouritePerson({ onNext }) {
  const [selected, setSelected] = useState(null);

  const options = [
    {
      id: 'smile',
      label: 'Your smile. 😊',
      intro: 'Your smile literally lights up my darkest days! But you know what? It’s even deeper than that…',
    },
    {
      id: 'cute',
      label: 'Your cute face. 🥰',
      intro: 'I could look at your cute expressions forever and never get tired! But that’s only the beginning…',
    },
    {
      id: 'heart',
      label: 'Your emotional heart. ❤️',
      intro: 'Your sweet, pure, caring heart is so rare in this world. And yet there is so much more…',
    },
    {
      id: 'everything',
      label: 'Everything that makes you YOU. 🫶',
      intro: 'You know me so well, Baby. Because the truth is…',
    },
  ];

  return (
    <section className="screen-container level-screen animate-fade-in" aria-label="Level 6: My Favourite Person">
      <div className="card challenge-card">
        <span className="question-tag">CHALLENGE 6</span>
        <h2 className="question-title">Baby, do you know what I love most about you? 🥹</h2>

        <div className="options-grid">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`choice-card ${selected?.id === opt.id ? 'active' : ''}`}
              onClick={() => setSelected(opt)}
            >
              <div className="choice-indicator">{selected?.id === opt.id ? '✓' : '•'}</div>
              <span className="choice-text">{opt.label}</span>
            </button>
          ))}
        </div>

        {selected && (
          <div className="favourite-reveal-card animate-pop-in">
            {/* Custom Intro */}
            <p className="intro-line italic-text">{selected.intro}</p>

            {/* Photo of Sara */}
            <div className="sara-showcase-frame">
              <img
                src={loveStoryConfig.photos.portraitRings}
                alt="Sara looking gorgeous"
                className="showcase-img"
                onError={(e) => {
                  e.target.src = loveStoryConfig.photos.hero;
                }}
              />
            </div>

            {/* Heartfelt Verbatim Message */}
            <div className="emotional-message-box">
              <p>It's not just your smile, Baby.</p>
              <p>It's the way you care, the way you feel things deeply, the way you make me smile without even trying.</p>
              <p>You don't have to be perfect to be special to me.</p>
              <p className="highlight-text">
                You are special because you're YOU. And I'm so lucky to have you. ❤️
              </p>
            </div>

            <div className="action-row">
              <button
                type="button"
                className="romantic-btn primary-glow"
                onClick={onNext}
              >
                <span>THE FINAL QUESTION AWAITS... 🎁</span>
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        )}

        {!selected && (
          <p className="hint-text">Choose whichever one your heart tells you, Baby! 🫶</p>
        )}
      </div>
    </section>
  );
}
