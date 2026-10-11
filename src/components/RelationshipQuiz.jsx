import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, Trophy, Play, Pause, RotateCcw, ArrowRight, ArrowLeft, Volume2, Music, CheckCircle2, Star } from 'lucide-react';
import { loveStoryConfig } from '../config/loveStoryConfig';
import { romanticAudio } from '../utils/romanticAudioEngine';

// =========================================================================
// THE 10 QUESTIONS DATA
// =========================================================================
const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Jab main tumse naraz hota hoon, toh mujhe sabse zyada kya chahiye hota hai? ❤️",
    options: [
      { id: 'A', text: "Thoda time akele rehne ka" },
      { id: 'B', text: "Tum khud aakar mujhe mana lo ❤️" },
      { id: 'C', text: "Kuch achha khaane ko" },
      { id: 'D', text: "Tum bhi mujhse naraz ho jao 😂" },
    ],
    correctAnswer: 'B',
  },
  {
    id: 2,
    question: "Baby, hum dono ko relationship mein kitne saal ho gaye hain? 🥹",
    options: [
      { id: 'A', text: "2 saal" },
      { id: 'B', text: "3 saal" },
      { id: 'C', text: "4 saal ❤️" },
      { id: 'D', text: "5 saal" },
    ],
    correctAnswer: 'C',
  },
  {
    id: 3,
    question: "Agar mujhe tumhare saath ek shaam dobara jeene ka mauka mile, toh main kya choose karunga? 🌙",
    options: [
      { id: 'A', text: "Ek fancy restaurant mein dinner" },
      { id: 'B', text: "Movie date 🍿" },
      { id: 'C', text: "Ganga Ghat ki woh shaam, jab tum mere shoulder par head rakhkar baithi thi ❤️" },
      { id: 'D', text: "Shopping date 🛍️" },
    ],
    correctAnswer: 'C',
  },
  {
    id: 4,
    question: "Baby, tumhe pata hai main tumhe sabse pyaar se kya bulata hoon? 🫣",
    options: [
      { id: 'A', text: "Princess 👑" },
      { id: 'B', text: "Jaan ❤️" },
      { id: 'C', text: "Baby 💗" },
      { id: 'D', text: "Madam ji 😂" },
    ],
    correctAnswer: 'B', // IMPORTANT: Correct answer is "Jaan", NOT "Baby"
  },
  {
    id: 5,
    question: "Agar tum mujhse poochho ki mujhe tummein sabse zyada kya pasand hai, toh mera answer kya hoga? ❤️",
    options: [
      { id: 'A', text: "Tumhari smile" },
      { id: 'B', text: "Tumhari aankhein" },
      { id: 'C', text: "Tumhara cute sa face" },
      { id: 'D', text: "Tum poori ki poori, apni saari cuteness aur emotions ke saath 🥹❤️" },
    ],
    correctAnswer: 'D',
  },
  {
    id: 6,
    question: "Agar hum dono kisi baat par lad rahe hon, toh mere liye sabse important kya rahega? ❤️",
    options: [
      { id: 'A', text: "Bas main hi sahi prove ho jaun" },
      { id: 'B', text: "Tum pehle sorry bolo 😂" },
      { id: 'C', text: "Humari fight khatam ho aur hum phir se theek ho jaayein ❤️" },
      { id: 'D', text: "Main phone silent karke so jaun" },
    ],
    correctAnswer: 'C',
  },
  {
    id: 7,
    question: "Agar main tumhare saath poora din bita sakun, toh mujhe sabse zyada kya achha lagega? 🫶",
    options: [
      { id: 'A', text: "Bas phone chalana" },
      { id: 'B', text: "Tumhare saath baatein karna, hasna aur chhoti-chhoti memories banana ❤️" },
      { id: 'C', text: "Sirf movie dekhna" },
      { id: 'D', text: "Apne doston ke saath bahar jaana" },
    ],
    correctAnswer: 'B',
  },
  {
    id: 8,
    question: "Jab main tumhe miss karta hoon, toh main sabse zyada kya chahta hoon? 🥹",
    options: [
      { id: 'A', text: "Ek expensive gift" },
      { id: 'B', text: "Tumhari taraf se ek pyaara sa message ya call ❤️" },
      { id: 'C', text: "Ek nayi movie" },
      { id: 'D', text: "Thodi extra neend 😂" },
    ],
    correctAnswer: 'B',
  },
  {
    id: 9,
    question: "Agar main tumhare saamne baitha tumhe chup-chaap dekh raha hoon, toh sabse likely reason kya hai? 👀",
    options: [
      { id: 'A', text: "Main kuch bhool gaya hoon" },
      { id: 'B', text: "Main tumse kuch maangne wala hoon 😂" },
      { id: 'C', text: "Tumhe dekhna hi mujhe achha lagta hai ❤️" },
      { id: 'D', text: "Main bore ho raha hoon" },
    ],
    correctAnswer: 'C',
  },
  {
    id: 10,
    question: "Baby, mere liye humare relationship ki sabse special baat kya hai? 💌",
    options: [
      { id: 'A', text: "Hum kitni baar milte hain" },
      { id: 'B', text: "Hum ek-doosre ko kitne gifts dete hain" },
      { id: 'C', text: "Humne chaar saal mein kitni photos li hain" },
      { id: 'D', text: "Chaar saal baad bhi tum mere liye utni hi special ho ❤️" },
    ],
    correctAnswer: 'D',
  },
];

export default function RelationshipQuiz({ onBackToHome }) {
  // Screen stages:
  // 'intro'  -> Introduction Screen
  // 'quiz'   -> Answering Question (1 to 10)
  // 'result' -> Final Score Screen + Audio Playback
  const [screenStage, setScreenStage] = useState('intro');

  // Question index (0 to 9)
  const [currentIndex, setCurrentIndex] = useState(0);

  // Selected answers record: { [questionId]: 'A' | 'B' | 'C' | 'D' }
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // Temporary selected answer for the current question
  const [selectedOpt, setSelectedOpt] = useState(null);

  // Feedback state during the brief transition
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Audio Playback state for "Gehra Samandar" (AUDIO ONLY, NO VIDEO)
  const [songPlaying, setSongPlaying] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [streamSrc, setStreamSrc] = useState('');
  const quizIframeRef = useRef(null);
  const quizAudioRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Pause main background music
    romanticAudio.pause();
    // Play "Gehra Samandar" the moment the quiz is opened
    startGehraSamandarAudio();

    return () => {
      stopQuizAudio();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Stop quiz audio cleanly
  const stopQuizAudio = () => {
    setSongPlaying(false);
    if (quizAudioRef.current) {
      quizAudioRef.current.pause();
      quizAudioRef.current.currentTime = 0;
    }
    if (quizIframeRef.current && quizIframeRef.current.contentWindow) {
      try {
        quizIframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
          '*'
        );
      } catch {
        // Safe fallback
      }
    }
  };

  // Send command to background iframe stream
  const sendStreamCommand = (command, args = []) => {
    if (quizIframeRef.current && quizIframeRef.current.contentWindow) {
      try {
        quizIframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: command, args }),
          '*'
        );
      } catch {
        // Fallback
      }
    }
  };

  // =========================================================================
  // START QUIZ
  // =========================================================================
  const handleStartQuiz = () => {
    setScreenStage('quiz');
    setCurrentIndex(0);
    setSelectedAnswers({});
    setSelectedOpt(null);
    setIsTransitioning(false);
    setFeedbackMsg(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Ensure Gehra Samandar continues playing smoothly
    if (quizAudioRef.current && quizAudioRef.current.paused) {
      quizAudioRef.current.play().catch(() => {});
    }
  };

  // =========================================================================
  // ANSWER SELECTION & PROGRESSION
  // =========================================================================
  const handleSelectOption = (optId) => {
    if (isTransitioning) return; // Prevent double-clicks

    const currentQ = QUIZ_QUESTIONS[currentIndex];
    setSelectedOpt(optId);
    setIsTransitioning(true);

    const isCorrect = optId === currentQ.correctAnswer;

    // Record answer
    const newAnswers = { ...selectedAnswers, [currentQ.id]: optId };
    setSelectedAnswers(newAnswers);

    // Brief affectionate reaction
    if (isCorrect) {
      setFeedbackMsg({
        type: 'correct',
        text: "Aww, bilkul sahi pakda, jaan! 🥹❤️ (+1 point)",
      });
    } else {
      setFeedbackMsg({
        type: 'wrong',
        text: "Arey re, koi baat nahi Baby… aage dekhte hain! 🤭💗",
      });
    }

    // Advance after brief affectionate reaction (~1.3s)
    timerRef.current = setTimeout(() => {
      if (currentIndex < QUIZ_QUESTIONS.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOpt(null);
        setIsTransitioning(false);
        setFeedbackMsg(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Quiz completed! Calculate score and show result screen
        handleFinishQuiz(newAnswers);
      }
    }, 1300);
  };

  // =========================================================================
  // QUIZ COMPLETION & RESULT
  // =========================================================================
  const calculateFinalScore = (answers = selectedAnswers) => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  const handleFinishQuiz = (finalAnswers) => {
    setScreenStage('result');
    setIsTransitioning(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Ensure Gehra Samandar is playing for results celebration
    if (quizAudioRef.current && quizAudioRef.current.paused) {
      startGehraSamandarAudio();
    }
  };

  // =========================================================================
  // AUDIO PLAYBACK: "Gehra Samandar" (Naina Da Kya Kasoor)
  // Audio only, absolutely NO video player displayed!
  // =========================================================================
  const startGehraSamandarAudio = () => {
    romanticAudio.pause();
    setSongPlaying(true);
    setAutoplayBlocked(false);

    if (quizAudioRef.current) {
      const playPromise = quizAudioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setSongPlaying(true);
            setAutoplayBlocked(false);
          })
          .catch(() => {
            setAutoplayBlocked(true);
            setSongPlaying(false);

            // YouTube fallback stream
            const ytId = "WfDFWLZgQwE";
            setStreamSrc(`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&enablejsapi=1&playsinline=1&controls=0&loop=1&playlist=${ytId}`);
            setTimeout(() => {
              sendStreamCommand('unMute');
              sendStreamCommand('setVolume', [100]);
              sendStreamCommand('playVideo');
            }, 500);
          });
      }
    }
  };

  const toggleSong = () => {
    if (songPlaying) {
      setSongPlaying(false);
      if (quizAudioRef.current) quizAudioRef.current.pause();
      sendStreamCommand('pauseVideo');
    } else {
      setSongPlaying(true);
      setAutoplayBlocked(false);
      if (quizAudioRef.current) quizAudioRef.current.play();
      sendStreamCommand('playVideo');
    }
  };

  const replaySong = () => {
    setSongPlaying(true);
    setAutoplayBlocked(false);
    if (quizAudioRef.current) {
      quizAudioRef.current.currentTime = 0;
      quizAudioRef.current.play();
    }
    sendStreamCommand('seekTo', [0, true]);
    sendStreamCommand('playVideo');
  };

  // =========================================================================
  // TRY AGAIN & NAVIGATION
  // =========================================================================
  const handleTryAgain = () => {
    stopQuizAudio();
    setCurrentIndex(0);
    setSelectedAnswers({});
    setSelectedOpt(null);
    setIsTransitioning(false);
    setFeedbackMsg(null);
    setScreenStage('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExitQuiz = () => {
    stopQuizAudio();
    onBackToHome();
  };

  // Score message mapping
  const finalScore = calculateFinalScore();
  let scoreFeedbackMsg = "";
  if (finalScore <= 3) {
    scoreFeedbackMsg = "Baby, lagta hai tumhe mujhe aur achhe se jaan-na padega! 😂❤️\nChalo, phir se try karte hain.";
  } else if (finalScore <= 6) {
    scoreFeedbackMsg = "Achha ji! 💗 Abhi toh mujhe aur samajhna baaki hai, jaan!";
  } else if (finalScore <= 9) {
    scoreFeedbackMsg = "Ohooo, Baby! 🥹❤️\nTum toh mujhe kaafi achhe se jaanti ho.\nEk tight hug toh banta hai!";
  } else {
    scoreFeedbackMsg = "Perfect 10/10! ❤️\nTum mujhe itna achhe se jaanti ho…\nAb batao, mere dil ka password bhi tum hi ho na? 🥹💗";
  }

  const currentQ = QUIZ_QUESTIONS[currentIndex];
  const progressPercent = ((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <section className="relationship-quiz-wrapper animate-fade-in" aria-label="Relationship Quiz">
      {/* Top Header Bar */}
      <div className="quiz-topbar">
        <button
          type="button"
          className="pn-back-btn"
          onClick={handleExitQuiz}
          aria-label="Back to home"
        >
          <ArrowLeft size={16} />
          <span>Home</span>
        </button>
        <span className="quiz-badge">HOW WELL DO YOU KNOW ME? ❤️</span>
      </div>

      {/* Romantic Audio Player Pill for "Gehra Samandar" (Naina Da Kya Kasoor) */}
      <div className="song-playing-pill quiz-audio-pill animate-fade-in" aria-label="Audio Player">
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
            <span className="song-track-name">Gehra Samandar ❤️</span>
            <span className="song-track-artist">Naina Da Kya Kasoor · Amit Trivedi</span>
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

      {/* Autoplay blocked fallback banner */}
      {autoplayBlocked && !songPlaying && (
        <div className="autoplay-fallback-row animate-pop-in">
          <button
            type="button"
            className="play-our-song-banner-btn"
            onClick={startGehraSamandarAudio}
          >
            <Play size={15} fill="currentColor" />
            <span>Play Song — Gehra Samandar ❤️</span>
          </button>
        </div>
      )}

      {/* Hidden Audio Engine for "Gehra Samandar" — Audio Only, No Video */}
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
          ref={quizIframeRef}
          title="Gehra Samandar Background Audio"
          src={streamSrc}
          allow="autoplay; encrypted-media"
          tabIndex="-1"
        />
        <audio
          ref={quizAudioRef}
          preload="auto"
          autoPlay
          playsInline
          loop
          onPlay={() => {
            setSongPlaying(true);
            setAutoplayBlocked(false);
          }}
          onPause={() => setSongPlaying(false)}
        >
          <source src="./assets/gehra-samandar.m4a" type="audio/mp4" />
          <source src="./assets/gehra-samandar.mp3" type="audio/mpeg" />
        </audio>
      </div>

      {/* =================================================================== */}
      {/* 1. QUIZ INTRODUCTION SCREEN                                         */}
      {/* =================================================================== */}
      {screenStage === 'intro' && (
        <div className="quiz-card card-intro animate-pop-in">
          {/* Soft Glowing Heart & Sparkles Decoration */}
          <div className="quiz-intro-visual">
            <div className="quiz-center-aura" aria-hidden="true" />
            <div className="quiz-heart-icon-box">
              <Heart size={48} fill="#ff3377" color="#ffd700" className="pulse-slow" />
            </div>
            <div className="quiz-floating-stars" aria-hidden="true">
              <span className="star-float sf-1">✦</span>
              <span className="star-float sf-2">✨</span>
              <span className="star-float sf-3">★</span>
              <span className="star-float sf-4">💖</span>
            </div>
          </div>

          <h1 className="quiz-main-heading">
            How Well Do You Know Me, Baby? ❤️
          </h1>

          <p className="quiz-lead-description">
            Chalo jaan, dekhte hain tum mujhe kitna achhe se jaanti ho! 🥹
          </p>

          <div className="quiz-supporting-box">
            <p className="quiz-support-text">
              10 sawaal hain… har sahi jawab par 1 point.<br />
              Dekhte hain tumhara score kitna aata hai! 😉
            </p>
          </div>

          <div className="quiz-action-row">
            <button
              type="button"
              className="romantic-btn primary-glow pulse-btn grand-start-btn"
              onClick={handleStartQuiz}
            >
              <span>Chalo, shuru karein! 💗</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. THE 10 QUESTIONS SCREEN                                          */}
      {/* =================================================================== */}
      {screenStage === 'quiz' && (
        <div className="quiz-card card-question-screen animate-fade-in" key={currentQ.id}>
          {/* Progress Header & Bar */}
          <div className="quiz-progress-section">
            <div className="quiz-progress-meta">
              <span className="quiz-step-text">Question {currentQ.id} of 10</span>
              <span className="quiz-point-badge">1 Point</span>
            </div>
            <div className="quiz-progress-track">
              <div
                className="quiz-progress-fill"
                style={{ width: `${progressPercent}%` }}
                aria-valuenow={progressPercent}
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
          </div>

          {/* Question Title */}
          <div className="quiz-question-box">
            <h2 className="quiz-question-text">
              {currentQ.question}
            </h2>
          </div>

          {/* 4 Distinct Clickable Answer Cards */}
          <div className="quiz-options-grid">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOpt === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={`quiz-opt-btn ${isSelected ? 'opt-tapped' : ''}`}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={isTransitioning}
                  aria-pressed={isSelected}
                >
                  <span className="quiz-opt-badge">{opt.id}</span>
                  <span className="quiz-opt-text">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Brief Affectionate Reaction during transition */}
          {feedbackMsg && (
            <div className={`quiz-mini-feedback ${feedbackMsg.type === 'correct' ? 'fb-mini-correct animate-pop-in' : 'fb-mini-wrong animate-fade-in'}`}>
              <p className="quiz-fb-msg-line">{feedbackMsg.text}</p>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* 3. FINAL RESULT SCREEN + AUDIO-ONLY SONG PLAYBACK                   */}
      {/* =================================================================== */}
      {screenStage === 'result' && (
        <div className="quiz-card card-result-screen animate-pop-in">
          {/* Gentle Celebration Atmosphere & Floating Particles */}
          <div className="result-celebration-aura" aria-hidden="true">
            <span className="res-sparkle rsp-1">✨</span>
            <span className="res-sparkle rsp-2">💖</span>
            <span className="res-sparkle rsp-3">✦</span>
            <span className="res-sparkle rsp-4">★</span>
            <span className="res-sparkle rsp-5">💗</span>
          </div>

          {/* Romantic Song Lyrics Quote Highlight */}
          <div className="quiz-song-lyrics-quote animate-pop-in">
            <div className="lyrics-quote-inner">
              <Music size={15} color="#ffd700" className="spin-slow" />
              <p className="lyrics-quote-text">
                "Gehra samandar, dil dooba jisme… ghayal hua main us pal se ❤️"
              </p>
            </div>
            <span className="lyrics-quote-sub">Naina Da Kya Kasoor · Our Special Song 🎶</span>
          </div>

          {/* Prominent Glowing Score Card */}
          <div className="glowing-score-card animate-pop-in">
            <div className="score-trophy-icon">
              <Trophy size={36} color="#ffd700" />
            </div>
            <span className="score-pre-title">Quiz Results</span>
            <h2 className="score-number-display">
              Your Score: <span className="highlight-points">{finalScore}/10</span> ❤️
            </h2>
            <div className="score-divider-gold" />
            <p className="score-message-text">
              {scoreFeedbackMsg}
            </p>
          </div>

          {/* Sara's Portrait Tastefully Displayed */}
          <div className="quiz-result-portrait-wrap animate-fade-in">
            <div className="quiz-portrait-frame">
              <img
                src={loveStoryConfig.photos.portraitRings || loveStoryConfig.photos.hero}
                alt="Sara, My Happiness"
                className="quiz-portrait-img"
              />
              <div className="portrait-gold-ring" aria-hidden="true" />
            </div>
            <p className="portrait-cute-caption">My One & Only, Sara ♡</p>
          </div>

          {/* Action Buttons */}
          <div className="result-action-buttons">
            <button
              type="button"
              className="romantic-btn secondary-choice"
              onClick={handleTryAgain}
            >
              <RotateCcw size={15} />
              <span>Try Again 💗</span>
            </button>

            <button
              type="button"
              className="romantic-btn primary-glow"
              onClick={handleExitQuiz}
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
