import React from 'react';
import { Sparkles, Heart, Feather, Quote } from 'lucide-react';
import { loveStoryConfig } from '../config/loveStoryConfig';

export default function ShayariSection() {
  const { shayariList } = loveStoryConfig;

  return (
    <section id="shayari-section" className="shayari-section-wrap animate-fade-in" aria-label="Shayari for Sara">
      <div className="shayari-header-box">
        <div className="section-mini-badge">
          <Feather size={14} />
          <span>SHAYARI FOR MY SARA</span>
        </div>
        <h2 className="shayari-section-title">Dil Ki Gehraiyon Se Shayari ♡</h2>
        <p className="shayari-section-subtitle">
          Words that echo every beat of my heart for you, my baby.
        </p>
      </div>

      <div className="shayari-cards-grid">
        {/* Shayari 1: Istikhara */}
        <div className="shayari-card card-istikhara">
          <div className="shayari-corner-decor" aria-hidden="true">
            <Quote size={28} className="quote-icon" />
          </div>

          <div className="shayari-meta-badge">
            <Heart size={12} fill="#ff4d88" color="#ff4d88" />
            <span>{shayariList[0].tag}</span>
          </div>

          <h3 className="shayari-card-title">{shayariList[0].title}</h3>

          <div className="shayari-verse-box">
            {shayariList[0].lines.map((line, idx) => (
              <p key={idx} className="shayari-line">
                {line}
              </p>
            ))}
          </div>

          <div className="shayari-whisper">
            <span>~ Because no matter what, my heart will always choose you. ❤️</span>
          </div>
        </div>

        {/* Shayari 2: Birthday Dua */}
        <div className="shayari-card card-dua">
          <div className="shayari-corner-decor" aria-hidden="true">
            <Sparkles size={26} className="sparkle-icon" />
          </div>

          <div className="shayari-meta-badge dua-badge">
            <Sparkles size={12} color="#ffd700" />
            <span>{shayariList[1].tag}</span>
          </div>

          <h3 className="shayari-card-title">{shayariList[1].title}</h3>

          <div className="shayari-verse-box">
            {shayariList[1].lines.map((line, idx) => (
              <p key={idx} className={`shayari-line ${idx === shayariList[1].lines.length - 1 ? 'shayari-highlight' : ''}`}>
                {line}
              </p>
            ))}
          </div>

          <div className="shayari-whisper">
            <span>~ Meri har dua mein sirf aur sirf tumhara naam hai, jaann. 🤲✨</span>
          </div>
        </div>
      </div>
    </section>
  );
}
