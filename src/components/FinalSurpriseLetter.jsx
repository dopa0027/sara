import React, { useState } from 'react';
import { Heart, Sparkles, RotateCcw, X, Camera } from 'lucide-react';
import confetti from 'canvas-confetti';
import { loveStoryConfig } from '../config/loveStoryConfig';

export default function FinalSurpriseLetter({ onRestart }) {
  const [candlesLit, setCandlesLit] = useState(true);
  const [cakeWished, setCakeWished] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryItems = [
    {
      id: 'bows',
      src: loveStoryConfig.photos.hero,
      title: "My Favourite Girl",
      subtitle: "That pure smile with your pink bows 🌸",
    },
    {
      id: 'us-sunset',
      src: loveStoryConfig.photos.coupleHero,
      title: "Four Years of Us",
      subtitle: "The warmth of your hand resting on my chest ✨",
    },
    {
      id: 'portrait-rings',
      src: loveStoryConfig.photos.portraitRings,
      title: "My Whole World",
      subtitle: "The way you look at me and make everything okay 💖",
    },
    {
      id: 'traditional',
      src: loveStoryConfig.photos.traditional,
      title: "My Queen",
      subtitle: "Looking breathtakingly beautiful as always 👑",
    },
    {
      id: 'ghat-memory',
      src: loveStoryConfig.photos.gangaGhat,
      title: "Under The Stars",
      subtitle: "Our peaceful evenings together by the water 🌙",
    },
    {
      id: 'us-cherished',
      src: loveStoryConfig.photos.coupleOriginal,
      title: "Forever Beside You",
      subtitle: "Every moment with you is my favourite memory 🫂",
    },
  ];

  const handleBlowCandles = () => {
    if (candlesLit) {
      setCandlesLit(false);
      setCakeWished(true);
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#ff4d88', '#ffd700', '#ffffff', '#ff99c8'],
      });
    } else {
      setCandlesLit(true);
      setCakeWished(false);
    }
  };

  return (
    <section className="screen-container final-letter-screen animate-fade-in" aria-label="Love Letter and Celebration">
      {/* ============================================================== */}
      {/* 1. THE SACRED BIRTHDAY LOVE LETTER                             */}
      {/* ============================================================== */}
      <div className="card letter-card">
        <div className="letter-wax-seal" aria-hidden="true">
          <span>S & S</span>
        </div>

        <h2 className="letter-main-title">{loveStoryConfig.finalLetter.title}</h2>

        <div className="letter-body">
          {loveStoryConfig.finalLetter.paragraphs.map((p, idx) => (
            <p key={idx} className="letter-paragraph">
              {p}
            </p>
          ))}
        </div>

        <div className="letter-signoff">
          <div className="signature-line">Forever and always your boy,</div>
          <div className="signature-heart">❤️</div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. INTERACTIVE BIRTHDAY CAKE                                   */}
      {/* ============================================================== */}
      <div className="card cake-card">
        <div className="section-mini-badge">
          <Sparkles size={14} />
          <span>MAKE A BIRTHDAY WISH</span>
        </div>

        <h3 className="cake-title">Sara's Special Birthday Cake 🎂</h3>
        <p className="cake-subtitle">
          {candlesLit
            ? "Close your eyes, make the most beautiful wish in your heart, and blow out the candles! ✨"
            : "May every single wish you made today come true, my baby! 💖"}
        </p>

        {/* CSS Cake with flickering candles */}
        <div className="cake-stage" onClick={handleBlowCandles} role="button" tabIndex={0} aria-label="Birthday cake with candles">
          <div className={`interactive-cake ${!candlesLit ? 'candles-out' : ''}`}>
            {/* Candles with animated flames */}
            <div className="candles-row">
              {[0, 1, 2].map((i) => (
                <div key={i} className="candle-stick">
                  {candlesLit && <div className="candle-flame" />}
                  {!candlesLit && <div className="candle-smoke" />}
                </div>
              ))}
            </div>

            {/* Frosting & Cake Base */}
            <div className="cake-frosting" />
            <div className="cake-layer layer-top" />
            <div className="cake-layer layer-bottom">
              <span className="cake-piping-text">Sara ♡</span>
            </div>
            <div className="cake-plate" />
          </div>
        </div>

        <div className="cake-action-row">
          <button
            type="button"
            className="romantic-btn secondary-choice"
            onClick={handleBlowCandles}
          >
            <span>{candlesLit ? 'BLOW OUT CANDLES 🎂' : 'LIGHT CANDLES AGAIN 🕯️'}</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. PHOTO MEMORIES GALLERY                                      */}
      {/* ============================================================== */}
      <div className="card gallery-section-card">
        <div className="section-mini-badge">
          <Camera size={14} />
          <span>OUR FOUR YEARS TOGETHER</span>
        </div>

        <h3 className="gallery-heading">A Glimpse Into Our Story 📸</h3>
        <p className="gallery-subheading">
          Four years of laughing, loving, and creating memories. Tap any photo to view in full glory!
        </p>

        <div className="gallery-masonry">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="gallery-polaroid-item"
              onClick={() => setSelectedImage(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedImage(item)}
            >
              <div className="polaroid-photo-frame">
                <img
                  src={item.src}
                  alt={item.title}
                  className="gallery-img"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = loveStoryConfig.photos.hero;
                  }}
                />
              </div>
              <div className="polaroid-meta">
                <div className="polaroid-item-title">{item.title}</div>
                <div className="polaroid-item-sub">{item.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. REPLAY / RESTART OPTION                                     */}
      {/* ============================================================== */}
      <div className="replay-footer">
        <button
          type="button"
          className="romantic-btn primary-glow"
          onClick={onRestart}
          aria-label="Replay love story from beginning"
        >
          <RotateCcw size={16} />
          <span>REPLAY OUR LOVE STORY FROM BEGINNING ❤️</span>
        </button>
        <p className="footer-love-note">
          Made with unconditional love, forever and always, for my Sara.
        </p>
      </div>

      {/* ============================================================== */}
      {/* LIGHTBOX MODAL FOR ZOOMED PHOTOS                               */}
      {/* ============================================================== */}
      {selectedImage && (
        <div className="lightbox-backdrop animate-fade-in" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-content animate-pop-in" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={() => setSelectedImage(null)}
              aria-label="Close image"
            >
              <X size={22} />
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="lightbox-img"
            />
            <div className="lightbox-caption">
              <h4>{selectedImage.title}</h4>
              <p>{selectedImage.subtitle}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
