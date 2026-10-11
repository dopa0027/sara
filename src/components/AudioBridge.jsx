import React, { useEffect, useRef } from 'react';
import { romanticAudio } from '../utils/romanticAudioEngine';

// Official Tips YouTube video ID as secondary fallback if HTML5 audio fails
const YT_FALLBACK_ID = '843x5r2iTig';

export default function AudioBridge() {
  const audioRef = useRef(null);
  const iframeRef = useRef(null);
  const usingFallbackRef = useRef(false);

  // Helper to send postMessage commands to YouTube iframe fallback if active
  const sendIframeCommand = (func, args = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func, args }),
          '*'
        );
      } catch {
        // Safe fallback
      }
    }
  };

  const attemptPlay = () => {
    if (usingFallbackRef.current) {
      sendIframeCommand('unMute');
      sendIframeCommand('setVolume', [100]);
      sendIframeCommand('playVideo');
      return;
    }

    if (audioRef.current) {
      audioRef.current.volume = romanticAudio.isDucked ? 0.35 : (romanticAudio.volume ?? 1);
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            romanticAudio.isPlaying = true;
            romanticAudio.notify();
          })
          .catch(() => {
            // Browser blocked unmuted autoplay without prior interaction.
            // Will start on very first touch/scroll/click.
          });
      }
    }
  };

  const attemptPause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (usingFallbackRef.current) {
      sendIframeCommand('pauseVideo');
    }
  };

  useEffect(() => {
    // 1. Immediately attempt unmuted autoplay on initial page load
    attemptPlay();

    // Staggered attempts in case DOM or audio buffer is ready a few ms later
    const t1 = setTimeout(attemptPlay, 100);
    const t2 = setTimeout(attemptPlay, 400);
    const t3 = setTimeout(attemptPlay, 1000);

    // 2. Global invisible user-interaction trigger:
    // If mobile Safari/Chrome strictly blocks unmuted audio on cold start,
    // the exact millisecond Sara or any visitor touches, scrolls, or taps ANYWHERE,
    // the song starts playing instantly without needing any button or prompt!
    const handleFirstGesture = () => {
      attemptPlay();
      cleanupGestureListeners();
    };

    const cleanupGestureListeners = () => {
      window.removeEventListener('pointerdown', handleFirstGesture, true);
      window.removeEventListener('touchstart', handleFirstGesture, true);
      window.removeEventListener('touchend', handleFirstGesture, true);
      window.removeEventListener('mousedown', handleFirstGesture, true);
      window.removeEventListener('scroll', handleFirstGesture, true);
      window.removeEventListener('wheel', handleFirstGesture, true);
      window.removeEventListener('keydown', handleFirstGesture, true);
      window.removeEventListener('click', handleFirstGesture, true);
    };

    window.addEventListener('pointerdown', handleFirstGesture, { capture: true, passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { capture: true, passive: true });
    window.addEventListener('touchend', handleFirstGesture, { capture: true, passive: true });
    window.addEventListener('mousedown', handleFirstGesture, { capture: true, passive: true });
    window.addEventListener('scroll', handleFirstGesture, { capture: true, passive: true });
    window.addEventListener('wheel', handleFirstGesture, { capture: true, passive: true });
    window.addEventListener('keydown', handleFirstGesture, { capture: true, passive: true });
    window.addEventListener('click', handleFirstGesture, { capture: true, passive: true });

    // 3. Synchronize with romanticAudio subscription
    const handleSync = (state) => {
      if (audioRef.current) {
        audioRef.current.volume = state.isMuted
          ? 0
          : state.isDucked
          ? 0.35
          : (state.volume ?? 1);
      }

      if (state.isPlaying) {
        // If a different track is selected (e.g. track 1 or 2), pause frontpage song
        if (state.trackIndex !== 0) {
          attemptPause();
        } else {
          attemptPlay();
        }
      } else {
        attemptPause();
      }
    };

    const unsubscribe = romanticAudio.subscribe(handleSync);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      cleanupGestureListeners();
      unsubscribe();
    };
  }, []);

  // If HTML5 audio errors out, switch seamlessly to the YouTube iframe stream
  const handleAudioError = () => {
    usingFallbackRef.current = true;
    if (iframeRef.current) {
      iframeRef.current.src = `https://www.youtube-nocookie.com/embed/${YT_FALLBACK_ID}?autoplay=1&enablejsapi=1&playsinline=1&controls=0&disablekb=1&fs=0&loop=1&playlist=${YT_FALLBACK_ID}`;
      setTimeout(() => {
        sendIframeCommand('unMute');
        sendIframeCommand('setVolume', [100]);
        sendIframeCommand('playVideo');
      }, 500);
    }
  };

  return (
    <>
      {/* High-fidelity HTML5 Audio Element for Tera Hone Laga Hoon */}
      <audio
        ref={audioRef}
        id="bg-audio-tera-hone-laga-hoon"
        preload="auto"
        autoPlay
        playsInline
        loop
        onError={handleAudioError}
        style={{ display: 'none' }}
      >
        <source src="./assets/tera-hone-laga-hoon.m4a" type="audio/mp4" />
        <source src="./assets/tera-hone-laga-hoon.webm" type="audio/webm" />
        <source src="./assets/tera-hone-laga-hoon.mp3" type="audio/mpeg" />
      </audio>

      {/* Hidden YouTube Fallback Stream (Only activated if HTML5 audio fails) */}
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
          overflow: 'hidden',
          zIndex: -1,
        }}
      >
        <iframe
          ref={iframeRef}
          title="Backup Music Player"
          src="about:blank"
          allow="autoplay *; encrypted-media *"
          tabIndex="-1"
        />
      </div>
    </>
  );
}
