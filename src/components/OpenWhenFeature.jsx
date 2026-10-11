import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  CloudSun,
  Flame,
  Moon,
  Clock,
} from 'lucide-react';
import { romanticAudio, getPublicAssetUrl } from '../utils/romanticAudioEngine';

// =========================================================================
// AUDIO CONFIGURATION & GITHUB PAGES COMPATIBILITY
// =========================================================================
const LOVE_LETTER_AUDIO_PATHS = {
  missYouPart1: 'miss-you-1.mp3',
  missYouPart2: 'miss-you-2.mp3',
  missYouPart3: 'miss-you-3.mp3',
};

// Generates robust asset paths respecting Vite base path (e.g. /sara/ on GitHub Pages)
const getLoveLetterAudioUrl = (filename) => {
  return getPublicAssetUrl(`assets/love-letters/${filename}`);
};

const VOICE_NOTE_PARTS = [
  { id: 1, label: 'Part 1', file: LOVE_LETTER_AUDIO_PATHS.missYouPart1 },
  { id: 2, label: 'Part 2', file: LOVE_LETTER_AUDIO_PATHS.missYouPart2 },
  { id: 3, label: 'Part 3', file: LOVE_LETTER_AUDIO_PATHS.missYouPart3 },
];

// =========================================================================
// THE 5 ROMANTIC LETTERS DATA
// =========================================================================
const LETTERS_DATA = [
  {
    id: 'miss-me',
    number: 1,
    title: 'Open When You Miss Me 💗',
    tagline: 'Jab meri yaad sata rahi ho…',
    icon: 'heart',
    hasAudio: true,
    content: `Meri jaan, ❤️

Agar tum ye letter padh rahi ho, toh shayad meri yaad aa rahi hai.

Kaash abhi tumhare paas hota, tumhara haath pakadta aur tumhe apne paas bitha leta. Kabhi-kabhi kuch kehna zaroori nahi hota, bas saath hona hi kaafi hota hai.

Door hoon toh kya hua, Baby, tum mere dil ke bahut kareeb ho. Humari memories aur tumhari smile mere liye bahut precious hain.

Apna khayal rakhna, meri jaan. ❤️

Tumhara hi,
Sudhanshu 🫶`,
  },
  {
    id: 'sad',
    number: 2,
    title: "Open When You're Sad 🥺",
    tagline: 'Jab dil thoda bhari ho…',
    icon: 'sad',
    hasAudio: false,
    content: `Meri Baby, ❤️

Agar aaj mann udaas hai, toh khud ko strong dikhana zaroori nahi. Tumhari feelings important hain, aur tumhe har baat explain karne ki zaroorat bhi nahi.

Agar baat karna chaho, main sunna chahta hoon. Agar thoda waqt chahiye, woh bhi bilkul theek hai.

Kaash abhi ek tight hug de pata aur tumhe yaad dila pata ki tum kitni precious ho.

Apne saath thodi gentle rehna, jaan. 🫂

Tumhara Sudhanshu ❤️`,
  },
  {
    id: 'angry',
    number: 3,
    title: "Open When You're Angry With Me 😂",
    tagline: 'Jab boyfriend se koi kaand ho gaya ho…',
    icon: 'angry',
    hasAudio: false,
    content: `Ohooo, meri gusse wali Baby! 😂❤️

Lagta hai boyfriend se koi kaand ho gaya.

Agar meri kisi baat se tumhe hurt hua hai, toh main use mazaak bana kar taalna nahi chahta. Tumhari feelings mere liye important hain.

Jab mann ho, mujhe bata dena kya bura laga. Main tumhari baat samajhne aur apni galti sudhaarne ki koshish karunga.

Filhaal ek virtual hug le lo. 🫂

PS: Agar galti meri hai, toh sorry bhi bolunga. 😂❤️

Tumhara Sudhanshu`,
  },
  {
    id: 'sleep',
    number: 4,
    title: 'Open Before You Sleep 🌙',
    tagline: 'Sone se pehle ek pyaara sa ehsaas…',
    icon: 'moon',
    hasAudio: false,
    content: `Good night, meri jaan. ❤️

Sone se pehle bas itna kehna tha ki main khush hoon ki tum meri life ka hissa ho.

Aaj ki tension ko thodi der ke liye side mein rakh do. Tumhe sab kuch ek hi din mein solve nahi karna.

Kaash tumhe ek tight hug dekar kehta:
'Ab so jao, Baby, kal phir pareshan karunga.' 😂❤️

Sweet dreams, meri favourite person. 🌙

Love you,
Sudhanshu 💗`,
  },
  {
    id: 'reminder',
    number: 5,
    title: 'Open When You Need a Reminder ❤️',
    tagline: 'Kyunki tum sach mein bahut anmol ho…',
    icon: 'reminder',
    hasAudio: false,
    content: `Meri sabse special Baby, ❤️

Tumhari smile, tumhari aankhein, tumhara emotional hona aur chhoti-chhoti baaton mein khush ho jaana — ye sab tumhe special banata hai.

Lekin tum mere liye sirf isliye special nahi ho kyunki tum mere saath ho. Tum apne aap mein bhi ek precious insaan ho, apne dreams, feelings aur apni identity ke saath.

Humari chaar saal ki memories mere liye bahut precious hain. Main chahta hoon ki hum aage bhi ek-doosre ko samajhte hue, seekhte hue aur saath grow karte hue aage badhein.

Kabhi khud par doubt ho, toh ye yaad rakhna:
tumhara hona hi bahut maayne rakhta hai. 🥹❤️

Hamesha pyaar ke saath,
Tumhara Sudhanshu 💌`,
  },
];

export default function OpenWhenFeature({ onBackToHome }) {
  // Screen Stage: 'intro' | 'password' | 'envelopes' | 'letter'
  const [screenStage, setScreenStage] = useState(() => {
    return sessionStorage.getItem('ow_unlocked') === 'true' ? 'envelopes' : 'intro';
  });

  // Selected letter object
  const [activeLetter, setActiveLetter] = useState(null);

  // Password & Lockout State
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(() => {
    return parseInt(sessionStorage.getItem('ow_failed_attempts') || '0', 10);
  });
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState(null); // { type: 'error' | 'success', msg: string }
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Audio state for Letter 1
  const [voicePartIndex, setVoicePartIndex] = useState(0); // 0, 1, 2
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [voiceAutoplayBlocked, setVoiceAutoplayBlocked] = useState(false);
  const [voiceMissingFile, setVoiceMissingFile] = useState(false);

  const voiceAudioRef = useRef(null);
  const wasBgMusicPlayingRef = useRef(false);
  const cooldownIntervalRef = useRef(null);

  const stopVoiceAudio = () => {
    setIsVoicePlaying(false);
    setVoiceAutoplayBlocked(false);
    setVoicePartIndex(0);
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
      voiceAudioRef.current.currentTime = 0;
    }
  };

  const handleCooldownExpired = () => {
    if (cooldownIntervalRef.current) clearInterval(cooldownIntervalRef.current);
    setIsLockedOut(false);
    setCooldownRemaining(0);
    setFailedAttempts(0);
    sessionStorage.removeItem('ow_lockout_expiry');
    sessionStorage.setItem('ow_failed_attempts', '0');
    setPasswordFeedback(null);
  };

  const startCooldownTimer = (expiryTime) => {
    if (cooldownIntervalRef.current) clearInterval(cooldownIntervalRef.current);
    cooldownIntervalRef.current = setInterval(() => {
      const curRemaining = Math.ceil((expiryTime - Date.now()) / 1000);
      if (curRemaining <= 0) {
        handleCooldownExpired();
      } else {
        setCooldownRemaining(curRemaining);
      }
    }, 1000);
  };

  const checkAndManageCooldown = () => {
    const lockoutExpiryStr = sessionStorage.getItem('ow_lockout_expiry');
    if (!lockoutExpiryStr) return;

    const expiryTime = parseInt(lockoutExpiryStr, 10);
    const now = Date.now();

    if (expiryTime > now) {
      const remainingSeconds = Math.ceil((expiryTime - now) / 1000);
      setIsLockedOut(true);
      setCooldownRemaining(remainingSeconds);
      startCooldownTimer(expiryTime);
    } else {
      // Cooldown expired
      handleCooldownExpired();
    }
  };

  // =========================================================================
  // INITIALIZATION & COOLDOWN MANAGEMENT
  // =========================================================================
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    checkAndManageCooldown();

    return () => {
      if (cooldownIntervalRef.current) clearInterval(cooldownIntervalRef.current);
      stopVoiceAudio();
      if (wasBgMusicPlayingRef.current && !romanticAudio.userPaused) {
        romanticAudio.playTrack('tera-hone-laga-hoon');
      }
      wasBgMusicPlayingRef.current = false;
    };
  }, []);

  // =========================================================================
  // PASSWORD SUBMISSION LOGIC
  // =========================================================================
  const handlePasswordSubmit = (e) => {
    e?.preventDefault();
    if (isLockedOut || isUnlocking) return;

    const trimmed = passwordInput.trim().toLowerCase();

    // Validates password case-insensitively ("saranshu", "Saranshu", "SARANSHU")
    if (trimmed === 'saranshu') {
      setIsUnlocking(true);
      setPasswordFeedback({
        type: 'success',
        msg: "Awww, meri jaan! ❤️\nChalo, tumhare liye likhe dil ki baatein padh lo. 💌",
      });

      // Clear attempts
      sessionStorage.removeItem('ow_failed_attempts');
      sessionStorage.removeItem('ow_lockout_expiry');
      sessionStorage.setItem('ow_unlocked', 'true');

      // Animate lock opening and transition to envelopes after celebration
      setTimeout(() => {
        setIsUnlocking(false);
        setScreenStage('envelopes');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1800);
    } else {
      const nextFailed = failedAttempts + 1;
      setFailedAttempts(nextFailed);
      sessionStorage.setItem('ow_failed_attempts', nextFailed.toString());

      if (nextFailed >= 5) {
        // Enforce 60s cooldown in sessionStorage
        const expiry = Date.now() + 60000;
        sessionStorage.setItem('ow_lockout_expiry', expiry.toString());
        setIsLockedOut(true);
        setCooldownRemaining(60);

        setPasswordFeedback({
          type: 'error',
          msg: "Ohooo! 5 galat attempts ho gaye, Baby! Thoda thehar jao (60s) ❤️",
        });

        startCooldownTimer(expiry);
      } else {
        setPasswordFeedback({
          type: 'error',
          msg: `Galat password hai jaan! 🤭 (Attempt ${nextFailed} of 5)`,
        });
      }
    }
  };

  // =========================================================================
  // ENVELOPE OPENING & CLOSING
  // =========================================================================
  const handleOpenEnvelope = (letter) => {
    setActiveLetter(letter);
    setScreenStage('letter');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (letter.id === 'miss-me') {
      // Pause background music and start voice recording sequence
      wasBgMusicPlayingRef.current = romanticAudio.isPlaying && !romanticAudio.userPaused;
      romanticAudio.pause();
      initVoicePlayback(0);
    }
  };

  const handleCloseLetter = () => {
    stopVoiceAudio();

    // Restore background music only if it was previously playing and not paused by the user
    if (wasBgMusicPlayingRef.current && !romanticAudio.userPaused) {
      romanticAudio.playTrack('tera-hone-laga-hoon');
    }
    wasBgMusicPlayingRef.current = false;

    setActiveLetter(null);
    setScreenStage('envelopes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // =========================================================================
  // SEQUENTIAL AUDIO PLAYBACK ENGINE (FOR LETTER 1)
  // Strictly sequential: miss-you-1.mp3 -> miss-you-2.mp3 -> miss-you-3.mp3
  // =========================================================================
  const initVoicePlayback = (partIdx = 0) => {
    if (partIdx >= VOICE_NOTE_PARTS.length) {
      // Finished all 3 recordings
      setIsVoicePlaying(false);
      setVoicePartIndex(0);
      return;
    }

    setVoicePartIndex(partIdx);
    setVoiceMissingFile(false);
    setVoiceAutoplayBlocked(false);

    const audio = voiceAudioRef.current;
    if (!audio) return;

    const fileToPlay = VOICE_NOTE_PARTS[partIdx].file;
    audio.src = getLoveLetterAudioUrl(fileToPlay);

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsVoicePlaying(true);
          setVoiceAutoplayBlocked(false);
          setVoiceMissingFile(false);
        })
        .catch((err) => {
          setIsVoicePlaying(false);
          if (err.name === 'NotAllowedError') {
            setVoiceAutoplayBlocked(true);
          } else {
            // Audio file awaiting upload in public/assets/love-letters/
            setVoiceMissingFile(true);
          }
        });
    }
  };

  const handleVoiceEnded = () => {
    // Sequentially advance to the next recording
    const nextIdx = voicePartIndex + 1;
    if (nextIdx < VOICE_NOTE_PARTS.length) {
      initVoicePlayback(nextIdx);
    } else {
      setIsVoicePlaying(false);
      setVoicePartIndex(0);
    }
  };

  const handleVoiceError = () => {
    setIsVoicePlaying(false);
    setVoiceMissingFile(true);
  };

  const toggleVoiceAudio = () => {
    const audio = voiceAudioRef.current;
    if (!audio) return;

    if (isVoicePlaying) {
      audio.pause();
      setIsVoicePlaying(false);
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsVoicePlaying(true);
            setVoiceAutoplayBlocked(false);
          })
          .catch(() => {
            initVoicePlayback(voicePartIndex);
          });
      }
    }
  };

  const replayVoiceAudio = () => {
    initVoicePlayback(0);
  };

  // Helper for Envelope Icons
  const renderEnvelopeIcon = (type) => {
    switch (type) {
      case 'heart':
        return <Heart size={26} color="#ff3377" fill="#ff3377" />;
      case 'sad':
        return <CloudSun size={26} color="#ffd700" />;
      case 'angry':
        return <Flame size={26} color="#ff6b6b" />;
      case 'moon':
        return <Moon size={26} color="#ffd700" fill="#ffd700" />;
      case 'reminder':
      default:
        return <Sparkles size={26} color="#ffd700" />;
    }
  };

  return (
    <section className="open-when-container animate-fade-in" aria-label="Open When Letters">
      {/* Top Header Bar */}
      <div className="open-when-topbar">
        <button
          type="button"
          className="pn-back-btn"
          onClick={() => {
            stopVoiceAudio();
            if (wasBgMusicPlayingRef.current && !romanticAudio.userPaused) {
              romanticAudio.playTrack('tera-hone-laga-hoon');
            }
            wasBgMusicPlayingRef.current = false;
            onBackToHome();
          }}
          aria-label="Back to home"
        >
          <ArrowLeft size={16} />
          <span>Home</span>
        </button>
        <span className="quiz-badge">A LITTLE BOX OF MY LOVE 💌</span>
      </div>

      {/* Voice Audio Element for Letter 1 (Pure Audio, zero placeholder voice) */}
      <audio
        ref={voiceAudioRef}
        preload="auto"
        onEnded={handleVoiceEnded}
        onError={handleVoiceError}
        style={{ display: 'none' }}
      />

      {/* =================================================================== */}
      {/* 1. INTRODUCTION SCREEN                                              */}
      {/* =================================================================== */}
      {screenStage === 'intro' && (
        <div className="open-when-card card-intro animate-pop-in">
          {/* Glowing Heart-Shaped Lockbox Visual */}
          <div className="lockbox-visual-wrap">
            <div className="lockbox-glowing-aura" aria-hidden="true" />
            <div className="lockbox-heart-shape pulse-slow">
              <Heart size={72} fill="#ff1f66" color="#ffd700" strokeWidth={1.5} />
              <div className="lockbox-keyhole">
                <Lock size={24} color="#ffd700" />
              </div>
            </div>
            <div className="lockbox-sparkles" aria-hidden="true">
              <span className="star-float sf-1">✦</span>
              <span className="star-float sf-2">✨</span>
              <span className="star-float sf-3">★</span>
              <span className="star-float sf-4">💖</span>
            </div>
          </div>

          <h1 className="open-when-heading">A Little Box of My Love 💌</h1>

          <p className="open-when-desc">
            Meri Baby, har feeling ke liye tumhare naam ek chhota sa letter hai. ❤️<br />
            Jab bhi meri yaad aaye, bas apna letter khol lena.
          </p>

          <div className="open-when-actions">
            <button
              type="button"
              className="romantic-btn primary-glow pulse-btn grand-start-btn"
              onClick={() => {
                setScreenStage('password');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <Lock size={17} />
              <span>Unlock Your Little World 🔐</span>
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. PASSWORD LOCK SCREEN                                             */}
      {/* =================================================================== */}
      {screenStage === 'password' && (
        <div className="open-when-card card-password animate-pop-in">
          <div className={`password-lock-icon-box ${isUnlocking ? 'unlock-celebrate' : ''}`}>
            {isUnlocking ? (
              <Unlock size={44} color="#ffd700" className="animate-pop-in" />
            ) : (
              <Lock size={44} color="#ff4d88" />
            )}
          </div>

          <h2 className="password-prompt-title">
            Hmm… humare little secret ka password kya hai, jaan? 👀❤️
          </h2>

          <div className="password-hint-bubble">
            <Sparkles size={14} color="#ffd700" />
            <span>Hint: Ismein hum dono chhupe hain. 🤭</span>
          </div>

          <form onSubmit={handlePasswordSubmit} className="password-form-box">
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`password-secret-input ${isLockedOut ? 'input-disabled' : ''}`}
                placeholder="Enter secret password…"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                disabled={isLockedOut || isUnlocking}
                autoFocus
                autoComplete="off"
              />
              <button
                type="button"
                className="password-toggle-eye"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Live Cooldown Countdown Alert */}
            {isLockedOut ? (
              <div className="cooldown-alert-banner animate-pop-in">
                <Clock size={16} className="spin-slow" />
                <span>
                  Entry locked! Please wait: <b>{cooldownRemaining}s</b>
                </span>
              </div>
            ) : (
              <div className="attempts-counter-meta">
                <span className={failedAttempts >= 3 ? 'attempts-warning' : ''}>
                  Failed attempts: {failedAttempts} / 5
                </span>
              </div>
            )}

            {/* Feedback Message */}
            {passwordFeedback && (
              <div
                className={`password-feedback-box ${
                  passwordFeedback.type === 'success' ? 'fb-success animate-pop-in' : 'fb-error animate-shake'
                }`}
              >
                <p className="password-feedback-text">{passwordFeedback.msg}</p>
              </div>
            )}

            <button
              type="submit"
              className="romantic-btn primary-glow unlock-submit-btn"
              disabled={isLockedOut || isUnlocking || !passwordInput.trim()}
            >
              {isUnlocking ? (
                <>
                  <Sparkles size={17} className="spin-slow" />
                  <span>Unlocking with love… ❤️</span>
                </>
              ) : (
                <>
                  <Heart size={17} fill="#fff" />
                  <span>Open The Box 💗</span>
                </>
              )}
            </button>
          </form>

          <p className="password-gentle-disclaimer">
            ♡ A sweet romantic surprise lock for my one and only Sara ♡
          </p>
        </div>
      )}

      {/* =================================================================== */}
      {/* 3. FIVE INTERACTIVE ENVELOPES GRID                                  */}
      {/* =================================================================== */}
      {screenStage === 'envelopes' && (
        <div className="open-when-envelopes-wrapper animate-fade-in">
          <div className="envelopes-header-meta">
            <h2 className="envelopes-grid-title">Five Letters For Every Mood 💌</h2>
            <p className="envelopes-grid-sub">
              Tap any envelope to unfold Sudhanshu's letter for you.
            </p>
          </div>

          <div className="envelopes-grid">
            {LETTERS_DATA.map((letter) => (
              <div
                key={letter.id}
                className="envelope-card-item animate-pop-in"
                onClick={() => handleOpenEnvelope(letter)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleOpenEnvelope(letter);
                  }
                }}
              >
                {/* Envelope 3D Visual */}
                <div className="envelope-graphic-box">
                  <div className="envelope-flap-gold" />
                  <div className="envelope-body">
                    <div className="envelope-icon-circle">
                      {renderEnvelopeIcon(letter.icon)}
                    </div>
                  </div>
                  <div className="envelope-stamp">
                    <span>№ {letter.number}</span>
                  </div>
                </div>

                {/* Envelope Content Labels */}
                <div className="envelope-info">
                  <h3 className="envelope-title">{letter.title}</h3>
                  <p className="envelope-tagline">{letter.tagline}</p>
                </div>

                <div className="envelope-tap-badge">
                  <span>Open Letter ✉️</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4. PAPER-STYLE LETTER VIEW                                          */}
      {/* =================================================================== */}
      {screenStage === 'letter' && activeLetter && (
        <div className="open-when-letter-view-wrap animate-pop-in">
          <div className="letter-nav-row">
            <button
              type="button"
              className="romantic-btn secondary-choice return-envelopes-btn"
              onClick={handleCloseLetter}
            >
              <ArrowLeft size={16} />
              <span>Back to Envelopes 💌</span>
            </button>
          </div>

          {/* Special Sequential Audio Bar for Letter 1 */}
          {activeLetter.hasAudio && (
            <div className="voice-recordings-player-card animate-fade-in">
              <div className="voice-player-header">
                <div className="voice-header-left">
                  <Volume2 size={18} color="#ffd700" />
                  <span className="voice-header-caption">
                    Ye teen chhoti si recordings sirf tumhare liye. ❤️
                  </span>
                </div>
                <div className="voice-parts-chips">
                  {VOICE_NOTE_PARTS.map((part, idx) => (
                    <button
                      key={part.id}
                      type="button"
                      className={`voice-part-chip ${voicePartIndex === idx ? 'chip-active' : ''}`}
                      onClick={() => initVoicePlayback(idx)}
                      title={`Play ${part.label}`}
                      aria-label={`Play ${part.label}`}
                    >
                      {part.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="voice-controls-bar">
                <button
                  type="button"
                  className="voice-play-toggle-btn"
                  onClick={toggleVoiceAudio}
                  aria-label={isVoicePlaying ? 'Pause recording' : 'Play recording'}
                >
                  {isVoicePlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>

                <div className="voice-status-info">
                  <span className="voice-track-title">
                    Sudhanshu's Voice Note ({VOICE_NOTE_PARTS[voicePartIndex].label})
                  </span>
                  <span className="voice-sub-desc">
                    {isVoicePlaying
                      ? 'Playing sequentially… listen closely, jaan ♪'
                      : voiceMissingFile
                      ? 'Recordings folder ready: add miss-you-1/2/3.mp3'
                      : 'Tap to listen to Sudhanshu speaking to you'}
                  </span>
                </div>

                {/* Animated soundwave bars when voice is playing */}
                {isVoicePlaying && (
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
                  onClick={replayVoiceAudio}
                  title="Replay from Part 1"
                  aria-label="Replay recording"
                >
                  <RotateCcw size={16} />
                </button>
              </div>

              {/* Autoplay blocked fallback button */}
              {voiceAutoplayBlocked && (
                <div className="voice-autoplay-fallback-row animate-pop-in">
                  <button
                    type="button"
                    className="play-voice-prompt-btn"
                    onClick={() => initVoicePlayback(0)}
                  >
                    <Heart size={15} fill="#ffd700" color="#ffd700" />
                    <span>Meri awaaz sunogi, Baby? ❤️</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* The Paper-Styled Letter Card */}
          <div className="parchment-letter-card animate-pop-in">
            {/* Wax Seal & Romantic Decoration */}
            <div className="parchment-top-seal" aria-hidden="true">
              <div className="wax-seal-circle">
                <span>S & S</span>
              </div>
            </div>

            <div className="parchment-header">
              <span className="parchment-pre-date">To My Baby Sara ♡</span>
              <h2 className="parchment-letter-title">{activeLetter.title}</h2>
              <div className="parchment-divider-gold" />
            </div>

            {/* Letter Body formatted with poetic spacing */}
            <div className="parchment-letter-body">
              {activeLetter.content.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx} className="parchment-paragraph">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Handwritten Signature footer */}
            <div className="parchment-footer">
              <p className="parchment-sign-love">With all my love & hugs,</p>
              <p className="parchment-sign-name">Sudhanshu 🫶</p>
            </div>
          </div>

          <div className="letter-bottom-actions">
            <button
              type="button"
              className="romantic-btn primary-glow"
              onClick={handleCloseLetter}
            >
              <Heart size={16} fill="#fff" />
              <span>Close Letter & See More 💌</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
