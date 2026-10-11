import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, Play, Pause, RotateCcw, ArrowRight, ArrowLeft, Volume2, Music, ExternalLink } from 'lucide-react';
import { loveStoryConfig } from '../config/loveStoryConfig';
import { romanticAudio } from '../utils/romanticAudioEngine';

export default function PehliNazarExperience({ onBackToHome }) {
  // Steps:
  // 0: Intro (First photo in brown blazer + invitation)
  // 1: Question 1 (Eyes)
  // 2: Question 2 (Hair)
  // 3: Question 3 (Heart)
  // 4: Sealed Letter ("Dil ne kuch likha hai...")
  // 5: Final Song & Reveal ("Haan, sunao na... ❤️")
  const [step, setStep] = useState(0);

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
  const [q3FeedbackStage, setQ3FeedbackStage] = useState(0); // 0 = none, 1 = "Ummhmm...", 2 = full message
  const [q3WrongFeedback, setQ3WrongFeedback] = useState(null);
  const [q3Correct, setQ3Correct] = useState(false);

  // Song playback state for "Dil Meri Na Sune"
  const [songPlaying, setSongPlaying] = useState(false);
  const [streamSrc, setStreamSrc] = useState('');
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const pehliAudioRef = useRef(null);
  const pehliIframeRef = useRef(null);

  // Stop song playback cleanly
  const stopSongPlayback = () => {
    setSongPlaying(false);
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      stopSongPlayback();
    };
  }, []);

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

  // =========================================================================
  // QUESTION HANDLERS
  // =========================================================================

  // Question 1: Eyes
  const handleQ1Select = (optId) => {
    setQ1Selected(optId);
    if (optId === 'D') {
      setQ1Correct(true);
      setQ1Feedback({
        type: 'correct',
        text: "Hehe, sahi pakda! ❤️\n\nGuess kiya tumne mujhe!\n\nMujhe aankhein tumhari jaisi pasand hain, Baby. Ab khush? 🥹❤️",
      });
    } else {
      setQ1Feedback({
        type: 'wrong',
        text: "Ummhmm… answer achha hai, lekin mere dil wala answer abhi mila nahi. 😂❤️ Ek baar aur socho, Baby!",
      });
    }
  };

  // Question 2: Hair
  const handleQ2Select = (optId) => {
    setQ2Selected(optId);
    if (optId === 'D') {
      setQ2Correct(true);
      setQ2Feedback({
        type: 'correct',
        text: "Arey waah, Baby! ❤️\n\nTum toh mujhe kaafi achhe se jaanti ho.\n\nUmmhmm… mujhe baal bhi tumhare jaise pasand hain. Ab itni bhi khush mat ho, warna aur sawaal poochh lunga. 😂❤️",
      });
    } else {
      setQ2Feedback({
        type: 'wrong',
        text: "Ummhmm… close, Baby! 😂 Lekin abhi mere dil wala answer nahi mila. Ek aur guess karo. ❤️",
      });
    }
  };

  // Question 3: Heart
  const handleQ3Select = (optId) => {
    setQ3Selected(optId);
    if (optId === 'D') {
      setQ3Correct(true);
      setQ3WrongFeedback(null);
      // Stage 1 reveal: "Ummhmm… ❤️"
      setQ3FeedbackStage(1);
      // Stage 2 reveal after brief romantic delay
      setTimeout(() => {
        setQ3FeedbackStage(2);
      }, 1500);
    } else {
      setQ3WrongFeedback("Hayee, jawab toh achha hai, Baby… 🥹❤️ Lekin mere dil ka favourite answer abhi baaki hai. Ek baar aur socho!");
    }
  };

  // =========================================================================
  // SONG PLAYBACK: "Dil Meri Na Sune"
  // Starts ONLY upon explicit click on "Haan, sunao na… ❤️"
  // =========================================================================
  const startDilMeriNaSune = () => {
    // 1. Explicitly pause general background ambient music
    romanticAudio.pause();

    // 2. Advance step to reveal
    setStep(5);
    setSongPlaying(true);

    // 3. Activate the authorized official stream (Tips Official: Dil Meri Na Sune - Genius)
    const ytId = loveStoryConfig.pehliNazarSong.youtubeId || 'YZLKoG_vhDY';
    const embedUrl = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&enablejsapi=1&playsinline=1&controls=1&rel=0`;
    setStreamSrc(embedUrl);

    // Also test if a bundled local audio file is available
    if (pehliAudioRef.current) {
      pehliAudioRef.current.play().then(() => {
        setIsAudioLoaded(true);
      }).catch(() => {
        // Authorized stream iframe handles playback
        setIsAudioLoaded(false);
      });
    }
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

      {/* Optional HTML5 Audio element for local asset */}
      <audio
        ref={pehliAudioRef}
        src={loveStoryConfig.pehliNazarSong.audioSrc}
        preload="none"
        onEnded={() => setSongPlaying(false)}
      />

      {/* =================================================================== */}
      {/* STEP 0: OPENING SCENE — HER FIRST PHOTO                             */}
      {/* =================================================================== */}
      {step === 0 && (
        <div className="pn-card card-intro animate-pop-in">
          <div className="pn-photo-frame-wrap">
            <div className="pn-photo-frame">
              <img
                src={loveStoryConfig.photos.brownBlazer}
                alt="Sara in brown blazer"
                className="pn-photo-img"
              />
              <div className="pn-frame-glow" aria-hidden="true" />
            </div>
            <div className="pn-heart-tag">
              <Heart size={16} fill="#ff4d88" color="#ff4d88" />
              <span>First Impression</span>
            </div>
          </div>

          <div className="pn-text-box">
            <p className="pn-lead-line">Baby, ek baat batao… ❤️</p>
            <p className="pn-story-para">
              Tumhe pata hai, jab maine tumhe pehli baar dekha tha, tab mujhe tumhari kaunsi baat sabse zyada pasand aayi thi?
            </p>
            <p className="pn-challenge-para">
              Chalo, dekhte hain mujhe kitna samajhti ho tum. 👀
            </p>
          </div>

          <div className="pn-action-row">
            <button
              type="button"
              className="romantic-btn primary-glow pulse-btn"
              onClick={() => setStep(1)}
            >
              <span>Achha ji, batao phir ❤️</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* STEP 1: QUESTION ONE — HER EYES                                     */}
      {/* =================================================================== */}
      {step === 1 && (
        <div className="pn-card card-question animate-fade-in">
          <div className="pn-question-header">
            <span className="pn-step-pill">SAWAAL 1 OF 3</span>
            <h2 className="pn-question-title">
              Achha Baby, batao… mujhe tumhari aankhon mein sabse zyada kya pasand hai? 👀❤️
            </h2>
          </div>

          <div className="pn-options-list">
            {[
              { id: 'A', text: "Unki cuteness, especially jab tum pyaar se dekhti ho 🥹" },
              { id: 'B', text: "Jab tum aankhon se hi apni saari baatein keh deti ho ✨" },
              { id: 'C', text: "Woh nazar, jise dekhkar main thodi der ke liye sab bhool jaun ❤️" },
              { id: 'D', text: "Tumhari aankhein… kyunki mujhe toh tumhari jaisi hi pasand hain 🫶" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`pn-option-btn ${q1Selected === opt.id ? (q1Correct && opt.id === 'D' ? 'opt-correct' : 'opt-selected') : ''}`}
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
                onClick={() => setStep(2)}
              >
                <span>Achha, next sawaal pucho 😏</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* STEP 2: QUESTION TWO — HER HAIR                                     */}
      {/* =================================================================== */}
      {step === 2 && (
        <div className="pn-card card-question animate-fade-in">
          <div className="pn-question-header">
            <span className="pn-step-pill">SAWAAL 2 OF 3</span>
            <h2 className="pn-question-title">
              Chalo, ab batao… tumhare baalon mein aisa kya hai jo mujhe itna pasand hai? 🤭❤️
            </h2>
          </div>

          <div className="pn-options-list">
            {[
              { id: 'A', text: "Jab tum apne baalon ko casually set karti ho ✨" },
              { id: 'B', text: "Jab tumhare baal tumhare face par aa jaate hain 🥹" },
              { id: 'C', text: "Tumhara woh natural look, bina kisi extra effort ke ❤️" },
              { id: 'D', text: "Tumhare jaise baal… obviously, meri favourite toh tum hi ho 🫶" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`pn-option-btn ${q2Selected === opt.id ? (q2Correct && opt.id === 'D' ? 'opt-correct' : 'opt-selected') : ''}`}
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
                onClick={() => setStep(3)}
              >
                <span>Last question? 👀</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* STEP 3: QUESTION THREE — HER HEART (Dimmed & Romantic Atmosphere)    */}
      {/* =================================================================== */}
      {step === 3 && (
        <div className="pn-card card-question dimmed-romantic-card animate-fade-in">
          <div className="soft-glowing-heart-icon" aria-hidden="true">
            <Heart size={44} fill="#ff3377" color="#ffd700" className="pulse-slow" />
          </div>

          <div className="pn-question-header">
            <span className="pn-step-pill gold-pill">AAKHRI SAWAAL</span>
            <p className="pn-whisper-intro">Achha Baby, last sawaal… ❤️</p>
            <h2 className="pn-question-title">
              Batao, mujhe sabse zyada kaunsa dil pasand hai?
            </h2>
          </div>

          <div className="pn-options-list">
            {[
              { id: 'A', text: "Ek aisa dil jo bina kahe bhi sab samajh jaaye 🫶" },
              { id: 'B', text: "Ek aisa dil jismein dher saara pyaar ho 💗" },
              { id: 'C', text: "Ek aisa dil jo chhoti-chhoti baaton mein bhi khushiyan dhoondh le ✨" },
              { id: 'D', text: "Tumhara dil… jo tumhe dekhte hi tumhara hote hue bhi mera ho gaya tha. ❤️" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`pn-option-btn ${q3Selected === opt.id ? (q3Correct && opt.id === 'D' ? 'opt-correct' : 'opt-selected') : ''}`}
                onClick={() => handleQ3Select(opt.id)}
              >
                <span className="opt-letter">{opt.id}</span>
                <span className="opt-text">{opt.text}</span>
              </button>
            ))}
          </div>

          {/* Incorrect feedback */}
          {q3WrongFeedback && (
            <div className="pn-feedback-card fb-wrong animate-fade-in">
              <p className="pn-fb-text">{q3WrongFeedback}</p>
            </div>
          )}

          {/* Correct Two-Stage Reveal */}
          {q3Correct && (
            <div className="pn-feedback-card fb-correct heart-reveal-card animate-pop-in">
              {q3FeedbackStage >= 1 && (
                <p className="stage-one-line animate-fade-in">Ummhmm… ❤️</p>
              )}
              {q3FeedbackStage >= 2 && (
                <div className="stage-two-block animate-fade-in">
                  <p className="stage-two-line">Dil toh humein tumhara hi pasand hai, Baby…</p>
                  <p className="stage-two-highlight">Jo tumhe dekhte hi hamara ho gaya tha. 🥹❤️</p>
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
                onClick={() => setStep(4)}
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
      {/* STEP 5: FINAL SURPRISE — PHOTO REVEAL & DIL MERI NA SUNE PLAYING    */}
      {/* =================================================================== */}
      {step === 5 && (
        <div className="pn-card card-final-reveal animate-fade-in">
          {/* Active Audio Player Pill for Dil Meri Na Sune */}
          <div className="song-playing-pill" aria-label="Song Player">
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

          {/* Brown Blazer Photo with Gentle Fade-In & Romantic Glow */}
          <div className="pn-photo-frame-wrap reveal-photo-wrap animate-fade-in">
            <div className="pn-photo-frame golden-border-frame">
              <img
                src={loveStoryConfig.photos.brownBlazer}
                alt="Sara in brown blazer, pehli nazar"
                className="pn-photo-img"
              />
              <div className="pn-frame-glow gold-glow" aria-hidden="true" />
            </div>
          </div>

          {/* Heartfelt Personal Message */}
          <div className="final-personal-message-box animate-pop-in">
            <p className="msg-lead">Pehli baar tumhe is brown blazer mein dekha tha…</p>
            <p className="msg-deep">
              Tab nahi pata tha ki ek din tum meri duniya ka itna khoobsurat hissa ban jaogi. ❤️
            </p>
          </div>

          {/* Authorized Official Song Stream Container */}
          {streamSrc && (
            <div className="authorized-stream-card animate-fade-in">
              <div className="stream-badge-row">
                <div className="stream-badge-pill">
                  <Music size={12} color="#ffd700" />
                  <span>Official Soundtrack Stream · Tips Official</span>
                </div>
              </div>
              <div className="stream-video-container">
                <iframe
                  ref={pehliIframeRef}
                  title="Dil Meri Na Sune - Atif Aslam"
                  src={streamSrc}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="stream-iframe"
                />
              </div>
            </div>
          )}

          {/* Return & Replay Actions */}
          <div className="final-bottom-controls">
            <button
              type="button"
              className="romantic-btn secondary-choice"
              onClick={() => {
                stopSongPlayback();
                setStep(0);
              }}
            >
              <RotateCcw size={15} />
              <span>Ek baar aur khelna hai? 🤭</span>
            </button>

            <button
              type="button"
              className="romantic-btn primary-glow"
              onClick={() => {
                stopSongPlayback();
                onBackToHome();
              }}
            >
              <span>Back to Birthday Story ❤️</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
