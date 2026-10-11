import React, { useState, useEffect, useRef } from 'react';
import { Heart, Play, Pause, RotateCcw, ArrowRight, ArrowLeft, Music } from 'lucide-react';
import { loveStoryConfig } from '../config/loveStoryConfig';
import { romanticAudio } from '../utils/romanticAudioEngine';

export default function PehliNazarExperience({ onBackToHome }) {
  // Steps:
  // 0: Intro (First photo with heartwarming entrance animation & text)
  // 1: Question 1 (Aankhein)
  // 2: Question 2 (Baal)
  // 3: Question 3 (Dil)
  // 4: Sealed Letter ("Dil ne kuch likha hai...")
  // 5: Final Song & Sequential Romantic Messages ("Dil Meri Na Sune" - Audio Only)
  const [step, setStep] = useState(0);

  // Entrance animation celebration burst
  const [entranceBurstDone, setEntranceBurstDone] = useState(false);

  // Question 1 state
  const [q1Selected, setQ1Selected] = useState(null);
  const [q1Feedback, setQ1Feedback] = useState(null);
  const [q1Correct, setQ1Correct] = useState(false);

  // Question 2 state
  const [q2Selected, setQ2Selected] = useState(null);
  const [q2Feedback, setQ2Feedback] = useState(null);
  const [q2Correct, setQ2Correct] = useState(false);

  // Question 3 state
  const [q3Selected, setQ3Selected] = useState(null);
  const [q3SpecialStage, setQ3SpecialStage] = useState(0); // 0 = none, 1 = "Achha ji...", 2 = "Nahi Baby... dil toh humein hamara hi..."
  const [q3FeedbackStage, setQ3FeedbackStage] = useState(0); // 0 = none, 1 = "Ummhmm... bilkul sahi", 2 = full two-stage
  const [q3WrongFeedback, setQ3WrongFeedback] = useState(null);
  const [q3Correct, setQ3Correct] = useState(false);

  // Song playback state for "Dil Meri Na Sune" (Audio Only - No Video)
  const [songPlaying, setSongPlaying] = useState(false);
  const [streamSrc, setStreamSrc] = useState('');
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [songMessageStage, setSongMessageStage] = useState(1); // 1, 2, 3, 4 for gradual reveals
  const pehliAudioRef = useRef(null);
  const pehliIframeRef = useRef(null);
  const timersRef = useRef([]);

  // Trigger celebratory burst on opening step 0
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const burstTimer = setTimeout(() => {
      setEntranceBurstDone(true);
    }, 1200);

    return () => {
      clearTimeout(burstTimer);
      stopSongPlayback();
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  // Stop song playback cleanly
  const stopSongPlayback = () => {
    setSongPlaying(false);
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (pehliAudioRef.current) {
      pehliAudioRef.current.pause();
      pehliAudioRef.current.currentTime = 0;
    }
    if (pehliIframeRef.current && pehliIframeRef.current.contentWindow) {
      try {
        pehliIframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
          '*'
        );
      } catch {
        // Safe fallback
      }
    }
  };

  // Send command to embedded stream
  const sendStreamCommand = (command, args = []) => {
    if (pehliIframeRef.current && pehliIframeRef.current.contentWindow) {
      try {
        pehliIframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: command, args }),
          '*'
        );
      } catch {
        // Fallback
      }
    }
  };

  // Schedule gradual message reveals in Step 5
  const startMessageSequence = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    setSongMessageStage(1);

    const t1 = setTimeout(() => {
      setSongMessageStage(2);
    }, 3800);

    const t2 = setTimeout(() => {
      setSongMessageStage(3);
    }, 7800);

    const t3 = setTimeout(() => {
      setSongMessageStage(4);
    }, 11500);

    timersRef.current = [t1, t2, t3];
  };

  // =========================================================================
  // QUESTION 1: AANKHEIN
  // =========================================================================
  const handleQ1Select = (optId) => {
    setQ1Selected(optId);
    if (optId === 'B') {
      setQ1Correct(true);
      setQ1Feedback({
        type: 'correct',
        text: "Hehe, sahi guess kiya tumne, Baby! ❤️\nHumein toh tumhari jaisi aankhein hi pasand hain. 🥹",
      });
    } else {
      setQ1Correct(false);
      setQ1Feedback({
        type: 'wrong',
        text: "Nahi Baby! 😂❤️\nAankhein toh humein tumhari hi pasand hain!\nEk baar aur guess karo. 👀",
      });
    }
  };

  // =========================================================================
  // QUESTION 2: BAAL
  // =========================================================================
  const handleQ2Select = (optId) => {
    setQ2Selected(optId);
    if (optId === 'B') {
      setQ2Correct(true);
      setQ2Feedback({
        type: 'correct',
        text: "Arey waah, jaan! ❤️\nBilkul sahi! Baal toh humein tumhare hi pasand hain. 🥹",
      });
    } else {
      setQ2Correct(false);
      setQ2Feedback({
        type: 'wrong',
        text: "Nahi jaan! 😂❤️\nBaal toh humein tumhare hi pasand hain.\nAb dobara socho! 💗",
      });
    }
  };

  // =========================================================================
  // QUESTION 3: DIL
  // =========================================================================
  const handleQ3Select = (optId) => {
    setQ3Selected(optId);

    if (optId === 'A') {
      // SPECIAL TEASING INTERACTION for Option A
      setQ3WrongFeedback(null);
      setQ3Correct(false);
      setQ3FeedbackStage(0);
      setQ3SpecialStage(1); // "Achha ji, apne jaisa dil chahiye? 😂❤️"

      const t = setTimeout(() => {
        setQ3SpecialStage(2); // "Nahi Baby… dil toh humein hamara hi pasand hai, jo tumhe dekhte hi tumhara ho gaya tha. 🥹❤️"
      }, 1500);
      timersRef.current.push(t);
    } else if (optId === 'B') {
      // CORRECT ANSWER: B — Tumhare jaisa dil
      setQ3Correct(true);
      setQ3SpecialStage(0);
      setQ3WrongFeedback(null);
      setQ3FeedbackStage(1); // "Ummhmm… bilkul sahi, Baby! ❤️" + Stage 1

      const t = setTimeout(() => {
        setQ3FeedbackStage(2); // Stage 2 reveal
      }, 1500);
      timersRef.current.push(t);
    } else {
      // Options C or D
      setQ3SpecialStage(0);
      setQ3Correct(false);
      setQ3FeedbackStage(0);
      setQ3WrongFeedback("Ummhmm… jawab toh achha hai, Baby! 🥹\nLekin ek baar aur socho… ❤️");
    }
  };

  // =========================================================================
  // SONG PLAYBACK: "Dil Meri Na Sune" (AUDIO ONLY, NO VIDEO)
  // Starts ONLY upon explicit user click on "Haan, sunao na… ❤️"
  // =========================================================================
  const startDilMeriNaSune = () => {
    // 1. Explicitly pause general background ambient music
    romanticAudio.pause();

    // 2. Advance step to reveal
    setStep(5);
    setSongPlaying(true);

    // 3. Start audio stream
    const ytId = loveStoryConfig.pehliNazarSong.youtubeId || 'YZLKoG_vhDY';
    const embedUrl = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&enablejsapi=1&playsinline=1&controls=0&loop=1&playlist=${ytId}`;
    setStreamSrc(embedUrl);

    // Also trigger HTML5 local audio if available
    if (pehliAudioRef.current) {
      pehliAudioRef.current.play().then(() => {
        setIsAudioLoaded(true);
      }).catch(() => {
        setIsAudioLoaded(false);
      });
    }

    // 4. Start sequential messages
    startMessageSequence();
  };

  const toggleSong = () => {
    if (songPlaying) {
      // Pause
      setSongPlaying(false);
      if (isAudioLoaded && pehliAudioRef.current) {
        pehliAudioRef.current.pause();
      }
      sendStreamCommand('pauseVideo');
    } else {
      // Resume
      setSongPlaying(true);
      if (isAudioLoaded && pehliAudioRef.current) {
        pehliAudioRef.current.play();
      }
      sendStreamCommand('playVideo');
    }
  };

  const replaySong = () => {
    setSongPlaying(true);
    if (isAudioLoaded && pehliAudioRef.current) {
      pehliAudioRef.current.currentTime = 0;
      pehliAudioRef.current.play();
    }
    sendStreamCommand('seekTo', [0, true]);
    sendStreamCommand('playVideo');
    startMessageSequence();
  };

  return (
    <section className="pehli-nazar-wrapper animate-fade-in" aria-label="Pehli Nazar, Pehla Ehsaas">
      {/* Top Bar with Back Link */}
      <div className="pehli-nazar-topbar">
        <button
          type="button"
          className="pn-back-btn"
          onClick={() => {
            stopSongPlayback();
            onBackToHome();
          }}
          aria-label="Back to home"
        >
          <ArrowLeft size={16} />
          <span>Home</span>
        </button>
        <span className="pn-badge">PEHLI NAZAR, PEHLA EHSAAS ❤️</span>
      </div>

      {/* Hidden Audio Bridge for "Dil Meri Na Sune" — Strictly Audio Only, No Video Displayed */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          width: '1px',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <iframe
          ref={pehliIframeRef}
          title="Dil Meri Na Sune Audio Stream"
          src={streamSrc}
          allow="autoplay; encrypted-media"
          tabIndex="-1"
        />
        <audio
          ref={pehliAudioRef}
          src={loveStoryConfig.pehliNazarSong.audioSrc}
          preload="none"
          onEnded={() => setSongPlaying(false)}
        />
      </div>

      {/* =================================================================== */}
      {/* STEP 0: OPENING SCENE — HEARTWARMING PHOTO ENTRANCE ANIMATION       */}
      {/* =================================================================== */}
      {step === 0 && (
        <div className="pn-card card-intro animate-pop-in">
          {/* Photo Frame with Subtle Centre Glow and Floating Particles Around Frame */}
          <div className="pn-photo-frame-wrap">
            {/* Subtle central glowing aura behind photo */}
            <div className="pn-center-glow-spot" aria-hidden="true" />

            {/* Floating stars, tiny glowing hearts & sparkles around frame (never covering face) */}
            <div className={`pn-outer-particles ${entranceBurstDone ? 'burst-active' : ''}`} aria-hidden="true">
              <span className="p-particle star-p p-top-left">✦</span>
              <span className="p-particle heart-p p-top-right">♥</span>
              <span className="p-particle gold-p p-mid-left">✨</span>
              <span className="p-particle star-p p-mid-right">★</span>
              <span className="p-particle heart-p p-bottom-left">💖</span>
              <span className="p-particle gold-p p-bottom-right">✦</span>
              <span className="p-particle star-p p-top-center">✨</span>
              <span className="p-particle heart-p p-bottom-center">♥</span>
            </div>

            {/* Smooth entrance scaled frame */}
            <div className="pn-photo-frame entrance-frame">
              <img
                src={loveStoryConfig.photos.brownBlazer}
                alt="Sara in brown blazer"
                className="pn-photo-img"
              />
              <div className="pn-frame-glow gold-glow" aria-hidden="true" />
            </div>

            <div className="pn-heart-tag">
              <Heart size={16} fill="#ff4d88" color="#ff4d88" />
              <span>First Impression</span>
            </div>
          </div>

          {/* Exact Text Specified by User */}
          <div className="pn-text-box">
            <p className="pn-lead-line">
              Pehli baar tumhe is brown blazer mein dekha tha… ❤️
            </p>
            <p className="pn-story-para">
              Tab nahi pata tha ki ek din tum meri duniya ka itna khoobsurat hissa ban jaogi. 💗
            </p>
          </div>

          <div className="pn-action-row">
            <button
              type="button"
              className="romantic-btn primary-glow pulse-btn"
              onClick={() => {
                setStep(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <span>Achha Baby, ek baat batao… 👀</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* STEP 1: QUESTION 1 — AANKHEIN                                       */}
      {/* =================================================================== */}
      {step === 1 && (
        <div className="pn-card card-question animate-fade-in">
          <div className="pn-question-header">
            <span className="pn-step-pill">SAWAAL 1 OF 3</span>
            <h2 className="pn-question-title">
              Baby, tumhe pata hai humein aankhein kaisi pasand hain? 👀❤️
            </h2>
          </div>

          <div className="pn-options-list">
            {[
              { id: 'A', text: "Meri jaisi aankhein 😉" },
              { id: 'B', text: "Tumhari jaisi aankhein ❤️" },
              { id: 'C', text: "Aishwarya Rai jaisi aankhein ✨" },
              { id: 'D', text: "Badi-badi expressive aankhein 🥹" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`pn-option-btn ${q1Selected === opt.id ? (q1Correct && opt.id === 'B' ? 'opt-correct' : 'opt-selected') : ''}`}
                onClick={() => handleQ1Select(opt.id)}
              >
                <span className="opt-letter">{opt.id}</span>
                <span className="opt-text">{opt.text}</span>
              </button>
            ))}
          </div>

          {/* Feedback */}
          {q1Feedback && (
            <div className={`pn-feedback-card ${q1Feedback.type === 'correct' ? 'fb-correct animate-pop-in' : 'fb-wrong animate-fade-in'}`}>
              <p className="pn-fb-text">{q1Feedback.text}</p>
            </div>
          )}

          {/* Next Button */}
          {q1Correct && (
            <div className="pn-action-row animate-pop-in">
              <button
                type="button"
                className="romantic-btn primary-glow"
                onClick={() => {
                  setStep(2);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span>Achha ji, agla sawaal! 💗</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* STEP 2: QUESTION 2 — BAAL                                           */}
      {/* =================================================================== */}
      {step === 2 && (
        <div className="pn-card card-question animate-fade-in">
          <div className="pn-question-header">
            <span className="pn-step-pill">SAWAAL 2 OF 3</span>
            <h2 className="pn-question-title">
              Achha jaan, batao… humein baal kaise pasand hain? 🤭❤️
            </h2>
          </div>

          <div className="pn-options-list">
            {[
              { id: 'A', text: "Mere jaise baal 😎" },
              { id: 'B', text: "Tumhare jaise baal 🫶" },
              { id: 'C', text: "Aishwarya Rai jaise baal ✨" },
              { id: 'D', text: "Jennifer Winget jaise baal 💗" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`pn-option-btn ${q2Selected === opt.id ? (q2Correct && opt.id === 'B' ? 'opt-correct' : 'opt-selected') : ''}`}
                onClick={() => handleQ2Select(opt.id)}
              >
                <span className="opt-letter">{opt.id}</span>
                <span className="opt-text">{opt.text}</span>
              </button>
            ))}
          </div>

          {/* Feedback */}
          {q2Feedback && (
            <div className={`pn-feedback-card ${q2Feedback.type === 'correct' ? 'fb-correct animate-pop-in' : 'fb-wrong animate-fade-in'}`}>
              <p className="pn-fb-text">{q2Feedback.text}</p>
            </div>
          )}

          {/* Next Button */}
          {q2Correct && (
            <div className="pn-action-row animate-pop-in">
              <button
                type="button"
                className="romantic-btn primary-glow"
                onClick={() => {
                  setStep(3);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span>Ab last sawaal, Baby! 👀</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* STEP 3: QUESTION 3 — DIL (Emotional Atmosphere & Option A Special)   */}
      {/* =================================================================== */}
      {step === 3 && (
        <div className="pn-card card-question dimmed-romantic-card animate-fade-in">
          <div className="soft-glowing-heart-icon" aria-hidden="true">
            <Heart size={44} fill="#ff3377" color="#ffd700" className="pulse-slow" />
          </div>

          <div className="pn-question-header">
            <span className="pn-step-pill gold-pill">AAKHRI SAWAAL</span>
            <h2 className="pn-question-title">
              Achha Baby, ab batao… humein dil kaisa pasand hai? ❤️
            </h2>
          </div>

          <div className="pn-options-list">
            {[
              { id: 'A', text: "Mere jaisa dil 😎" },
              { id: 'B', text: "Tumhare jaisa dil 🫶" },
              { id: 'C', text: "Shah Rukh Khan jaisa romantic dil ❤️" },
              { id: 'D', text: "Ek aisa dil jo sirf pyaar se bhara ho 💗" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`pn-option-btn ${q3Selected === opt.id ? (q3Correct && opt.id === 'B' ? 'opt-correct' : 'opt-selected') : ''}`}
                onClick={() => handleQ3Select(opt.id)}
              >
                <span className="opt-letter">{opt.id}</span>
                <span className="opt-text">{opt.text}</span>
              </button>
            ))}
          </div>

          {/* SPECIAL INTERACTION FOR OPTION A: Two-Stage Teasing Response */}
          {q3Selected === 'A' && q3SpecialStage >= 1 && (
            <div className="pn-feedback-card fb-wrong special-tease-card animate-pop-in">
              <p className="pn-fb-text tease-stage-one">
                Achha ji, apne jaisa dil chahiye? 😂❤️
              </p>
              {q3SpecialStage >= 2 && (
                <div className="tease-stage-two animate-fade-in">
                  <p className="pn-fb-text tease-stage-deep">
                    Nahi Baby… dil toh humein hamara hi pasand hai,<br />
                    jo tumhe dekhte hi tumhara ho gaya tha. 🥹❤️
                  </p>
                  <p className="tease-retry-hint">
                    (Chalo ab sahi answer choose karo, Baby! 👀)
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Feedback for Options C or D */}
          {q3WrongFeedback && (
            <div className="pn-feedback-card fb-wrong animate-fade-in">
              <p className="pn-fb-text">{q3WrongFeedback}</p>
            </div>
          )}

          {/* Correct Two-Stage Reveal for Option B */}
          {q3Correct && (
            <div className="pn-feedback-card fb-correct heart-reveal-card animate-pop-in">
              <p className="pn-fb-text" style={{ fontWeight: 700, color: '#ffd700', marginBottom: '8px' }}>
                Ummhmm… bilkul sahi, Baby! ❤️
              </p>
              {q3FeedbackStage >= 1 && (
                <p className="stage-one-line animate-fade-in">Dil toh humein hamara hi pasand hai…</p>
              )}
              {q3FeedbackStage >= 2 && (
                <div className="stage-two-block animate-fade-in">
                  <p className="stage-two-highlight">Jo tumhe dekhte hi tumhara ho gaya tha. 🥹❤️</p>
                </div>
              )}
            </div>
          )}

          {/* Continue to Letter Button */}
          {q3Correct && q3FeedbackStage >= 2 && (
            <div className="pn-action-row animate-pop-in" style={{ marginTop: '24px' }}>
              <button
                type="button"
                className="romantic-btn primary-glow pulse-btn"
                onClick={() => {
                  setStep(4);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span>Dil Ka Paigaam Dekho 💌</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* STEP 4: SEALED LETTER ("Dil ne kuch likha hai...")                   */}
      {/* Song DOES NOT PLAY until she taps "Haan, sunao na... ❤️"            */}
      {/* =================================================================== */}
      {step === 4 && (
        <div className="pn-card card-sealed-letter animate-pop-in">
          <div className="sealed-envelope-visual">
            <div className="wax-heart-seal">
              <Heart size={22} fill="#ffd700" color="#ffd700" />
            </div>
          </div>

          <div className="sealed-card-content">
            <h2 className="sealed-invitation-title">
              💌 Dil ne kuch likha hai tumhare liye…
            </h2>
            <p className="sealed-invitation-sub">
              Tumhari ijazat ho toh sunaun?
            </p>
          </div>

          <div className="pn-action-row">
            <button
              type="button"
              className="romantic-btn primary-glow grand-play-btn pulse-btn"
              onClick={startDilMeriNaSune}
            >
              <span>Haan, sunao na… ❤️</span>
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* STEP 5: FINAL SURPRISE — AUDIO ONLY (NO MUSIC VIDEO), PHOTO & MESSAGES */}
      {/* =================================================================== */}
      {step === 5 && (
        <div className="pn-card card-final-reveal animate-fade-in">
          {/* Active Audio Player Pill for Dil Meri Na Sune */}
          <div className="song-playing-pill" aria-label="Song Audio Player">
            <div className="song-pill-left">
              <button
                type="button"
                className="song-toggle-btn"
                onClick={toggleSong}
                aria-label={songPlaying ? "Pause song" : "Resume song"}
              >
                {songPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <div className="song-pill-info">
                <span className="song-track-name">Dil Meri Na Sune</span>
                <span className="song-track-artist">Atif Aslam · Genius</span>
              </div>
            </div>

            <div className="song-pill-right">
              {songPlaying && (
                <div className="soundwave-bars" aria-hidden="true">
                  <span className="sw-bar" />
                  <span className="sw-bar" />
                  <span className="sw-bar" />
                  <span className="sw-bar" />
                </div>
              )}
              <button
                type="button"
                className="song-replay-btn"
                onClick={replaySong}
                title="Replay from beginning"
                aria-label="Replay song"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>

          {/* Sara's Original Brown Blazer Photo in Romantic Golden Frame */}
          <div className="pn-photo-frame-wrap reveal-photo-wrap animate-fade-in">
            {/* Ambient Floating Stars & Hearts */}
            <div className="pn-outer-particles burst-active" aria-hidden="true">
              <span className="p-particle star-p p-top-left">✦</span>
              <span className="p-particle heart-p p-top-right">♥</span>
              <span className="p-particle gold-p p-mid-left">✨</span>
              <span className="p-particle star-p p-mid-right">★</span>
              <span className="p-particle heart-p p-bottom-left">💖</span>
              <span className="p-particle gold-p p-bottom-right">✦</span>
            </div>

            <div className="pn-photo-frame golden-border-frame">
              <img
                src={loveStoryConfig.photos.brownBlazer}
                alt="Sara in brown blazer, pehli nazar"
                className="pn-photo-img"
              />
              <div className="pn-frame-glow gold-glow" aria-hidden="true" />
            </div>
          </div>

          {/* Personal Romantic Messages Appearing Gradually */}
          <div className="final-personal-message-box animate-pop-in">
            {songMessageStage >= 1 && (
              <p className="msg-lead animate-fade-in">
                Pehli baar tumhe is brown blazer mein dekha tha… ❤️
              </p>
            )}

            {songMessageStage >= 2 && (
              <p className="msg-deep animate-fade-in">
                Tab nahi pata tha ki tum meri duniya ka itna khoobsurat hissa ban jaogi.
              </p>
            )}

            {songMessageStage >= 3 && (
              <p className="msg-special-line animate-fade-in">
                Aur aaj bhi, tum mere liye utni hi special ho, Baby. 🥹❤️
              </p>
            )}

            {songMessageStage >= 4 && (
              <div className="msg-closing-birthday animate-pop-in">
                <span className="birthday-final-sparkle">✨</span>
                <p className="msg-birthday-shout">Happy Birthday, meri jaan. ❤️</p>
                <span className="birthday-final-sparkle">✨</span>
              </div>
            )}
          </div>

          {/* Replay & Navigation Controls */}
          <div className="final-bottom-controls">
            <button
              type="button"
              className="romantic-btn secondary-choice"
              onClick={replaySong}
            >
              <Music size={15} />
              <span>Ek baar aur sunu? 🎵</span>
            </button>

            <button
              type="button"
              className="romantic-btn primary-glow"
              onClick={() => {
                stopSongPlayback();
                onBackToHome();
              }}
            >
              <span>Back to Birthday Story 💗</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
