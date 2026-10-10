import React from 'react';
import { Heart, Sparkles, Music } from 'lucide-react';
import { loveStoryConfig } from '../config/loveStoryConfig';
import { romanticAudio } from '../utils/romanticAudioEngine';

export default function StartScreen({ onStart }) {
  const handleStart = () => {
    // Start music on first deliberate user interaction per browser autoplay policies
    romanticAudio.play(0, loveStoryConfig.playlist[0]);
    onStart();
  };

  return (
    <section className="screen-container start-screen animate-fade-in" aria-label="Welcome Screen">
      <div className="hero-card">
        {/* Floating mini badge */}
        <div className="subtle-badge">
          <Sparkles size={14} className="sparkle-icon" />
          <span>Made with all my heart for my baby</span>
        </div>

        {/* Central Romantic Photo Frame */}
        <div className="portrait-frame-wrap">
          <div className="portrait-frame">
            <img
              src={loveStoryConfig.photos.hero}
              alt="Sara, the love of my life"
              className="portrait-img"
              onError={(e) => {
                // Tasteful fallback if image is missing
                e.target.style.display = 'none';
              }}
            />
            <div className="frame-glow" aria-hidden="true" />
          </div>
          <div className="floating-heart-badge">
            <Heart size={20} fill="#ff4d88" color="#ff4d88" />
          </div>
        </div>

        {/* Cinematic Title & Romantic Greeting */}
        <h1 className="hero-title">
          Happy Birthday, My {loveStoryConfig.partnerName} <span className="title-heart">❤️</span>
        </h1>

        <p className="hero-subtitle">
          Today is all about you, {loveStoryConfig.nickname}. But before you get your special surprise, I have a little challenge for you.
        </p>

        <div className="story-summary-pill">
          <span>7 little challenges</span>
          <span className="dot">•</span>
          <span>4 years of memories</span>
          <span className="dot">•</span>
          <span>One love story ❤️</span>
        </div>

        {/* Big Start Button */}
        <div className="actions-wrap">
          <button
            type="button"
            className="romantic-btn primary-glow"
            onClick={handleStart}
            aria-label="Start our little love story"
          >
            <span>START OUR LITTLE LOVE STORY ❤️</span>
          </button>
        </div>

        <p className="ambient-note">
          <Music size={13} className="inline-icon" />
          <span>Turn your volume up a little for the full experience ♡</span>
        </p>
      </div>
    </section>
  );
}
