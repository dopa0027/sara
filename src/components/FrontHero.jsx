import React from 'react';
import { Heart, Play } from 'lucide-react';
import { loveStoryConfig } from '../config/loveStoryConfig';
import { romanticAudio } from '../utils/romanticAudioEngine';

export default function FrontHero({ onOpenSurprise, onOpenNote }) {
  const handlePlaySong = () => {
    romanticAudio.play(0, loveStoryConfig.playlist[0]);
  };

  return (
    <section className="front-hero-section" aria-label="Hero Introduction">
      {/* Background Terrace image with romantic gradient */}
      <div
        className="hero-backdrop"
        style={{
          backgroundImage: "linear-gradient(90deg, rgba(22, 10, 22, 0.94) 0%, rgba(22, 10, 22, 0.78) 45%, rgba(22, 10, 22, 0.15) 100%), url('./assets/birthday-terrace.webp')",
        }}
        aria-hidden="true"
      />

      <div className="hero-content-wrapper">
        {/* Left Column: Romantic Birthday Typography & Call to Actions */}
        <div className="hero-text-col">
          <p className="hero-script-lead">To My Beautiful ♡</p>

          <h1 className="hero-main-name">
            Sara <span className="h1-heart">♡</span>
          </h1>

          <h2 className="hero-birthday-heading">Happy Birthday!</h2>

          <p className="hero-sweet-description">
            Today is a special day because the most amazing person in my life was born.
            You make everything brighter, happier and more beautiful. I'm so grateful to have you. ❤️
          </p>

          <div className="hero-button-group">
            <button
              type="button"
              className="hero-btn-primary"
              onClick={onOpenSurprise}
            >
              <span>♡ Open Your Surprise</span>
              <span className="btn-arrow">›</span>
            </button>

            <button
              type="button"
              className="hero-btn-secondary"
              onClick={handlePlaySong}
            >
              <Play size={15} fill="currentColor" />
              <span>Play Our Song</span>
            </button>
          </div>
        </div>

        {/* Right Column: Stacked Tilted Polaroids matching screenshot */}
        <div className="hero-polaroids-col">
          <div className="polaroid-stack-container">
            {/* Top Polaroid: Sara */}
            <div className="hero-polaroid polaroid-top" onClick={onOpenNote} role="button" tabIndex={0} title="Click to read special note">
              <div className="polaroid-photo-box">
                <img
                  src={loveStoryConfig.photos.hero}
                  alt="Sara, My Happiness"
                  className="polaroid-real-img"
                  onError={(e) => {
                    e.target.src = "./assets/sara-portrait.jpeg";
                  }}
                />
              </div>
              <p className="polaroid-hand-caption">My Happiness</p>
            </div>

            {/* Bottom Polaroid: Couple */}
            <div className="hero-polaroid polaroid-bottom">
              <div className="polaroid-photo-box">
                <img
                  src={loveStoryConfig.photos.coupleHero}
                  alt="You and me always"
                  className="polaroid-real-img"
                  onError={(e) => {
                    e.target.src = "./assets/us.jpeg";
                  }}
                />
              </div>
              <p className="polaroid-hand-caption">You & me, always</p>
            </div>

            {/* Bottom scripted love note */}
            <p className="hero-script-footer">my favourite place is beside you ♡</p>
          </div>
        </div>
      </div>
    </section>
  );
}
