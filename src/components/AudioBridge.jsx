import React, { useEffect, useRef, useState } from 'react';
import { Music, Volume2, Sparkles } from 'lucide-react';
import { romanticAudio } from '../utils/romanticAudioEngine';

// Official, high-quality, embeddable YouTube Tracks
const YT_TRACK_MAP = {
  'tera-hone-laga-hoon': '843x5r2iTig', // Tips Official - Tera Hone Laga Hoon (Atif Aslam)
  'until-i-found-you': 'GxldQ9GyX3I',
  'boyfriend-banale': '7w2r4o3B6W4',
};

export default function AudioBridge() {
  const iframeRef = useRef(null);
  const playerStateRef = useRef({ isPlaying: false, trackId: null });
  const [showAutoplayPrompt, setShowAutoplayPrompt] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Send command to embedded YouTube player
  const sendIframeCommand = (func, args = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func, args }),
          '*'
        );
      } catch (err) {
        // Safe fallback
      }
    }
  };

  const playSong = () => {
    sendIframeCommand('unMute');
    sendIframeCommand('setVolume', [100]);
    sendIframeCommand('playVideo');
    setShowAutoplayPrompt(false);
  };

  const pauseSong = () => {
    sendIframeCommand('pauseVideo');
  };

  useEffect(() => {
    const ytId = YT_TRACK_MAP['tera-hone-laga-hoon']; // '843x5r2iTig'

    // 1. Immediately set the iframe to official Tips track
    if (iframeRef.current) {
      iframeRef.current.src = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&enablejsapi=1&playsinline=1&controls=0&disablekb=1&fs=0&loop=1&playlist=${ytId}`;
    }

    // 2. Set audio engine playing
    romanticAudio.play(0);

    // 3. Attempt unmuted playback immediately
    const initialPlayTimer = setTimeout(() => {
      playSong();
    }, 500);

    // 4. Browser autoplay policy handling:
    // If the browser blocks unmuted sound because of no prior user interaction,
    // fire unMute & playVideo on the very first touch, click, scroll or keypress!
    const handleFirstUserInteraction = () => {
      setHasUserInteracted(true);
      setShowAutoplayPrompt(false);
      playSong();
      cleanupListeners();
    };

    const cleanupListeners = () => {
      window.removeEventListener('click', handleFirstUserInteraction, true);
      window.removeEventListener('touchstart', handleFirstUserInteraction, true);
      window.removeEventListener('pointerdown', handleFirstUserInteraction, true);
      window.removeEventListener('scroll', handleFirstUserInteraction, true);
      window.removeEventListener('keydown', handleFirstUserInteraction, true);
    };

    window.addEventListener('click', handleFirstUserInteraction, true);
    window.addEventListener('touchstart', handleFirstUserInteraction, true);
    window.addEventListener('pointerdown', handleFirstUserInteraction, true);
    window.addEventListener('scroll', handleFirstUserInteraction, { passive: true, capture: true });
    window.addEventListener('keydown', handleFirstUserInteraction, true);

    // Check after 2.5s if user hasn't interacted yet, show sweet floating prompt
    const promptTimer = setTimeout(() => {
      if (!hasUserInteracted) {
        setShowAutoplayPrompt(true);
      }
    }, 2200);

    // 5. Synchronize with romanticAudio subscription
    const handleSync = (state) => {
      const trackId =
        state.trackIndex === 1
          ? 'until-i-found-you'
          : state.trackIndex === 2
          ? 'boyfriend-banale'
          : 'tera-hone-laga-hoon';

      const prev = playerStateRef.current;
      playerStateRef.current = { isPlaying: state.isPlaying, trackId };

      if (!iframeRef.current) return;

      if (state.isPlaying) {
        if (prev.trackId !== trackId) {
          const newYtId = YT_TRACK_MAP[trackId] || '843x5r2iTig';
          iframeRef.current.src = `https://www.youtube-nocookie.com/embed/${newYtId}?autoplay=1&enablejsapi=1&playsinline=1&controls=0&disablekb=1&fs=0&loop=1&playlist=${newYtId}`;
          setTimeout(playSong, 600);
        } else {
          playSong();
        }
      } else {
        pauseSong();
      }
    };

    const unsubscribe = romanticAudio.subscribe(handleSync);

    return () => {
      clearTimeout(initialPlayTimer);
      clearTimeout(promptTimer);
      cleanupListeners();
      unsubscribe();
    };
  }, []);

  return (
    <>
      {/* Hidden YouTube Audio Engine (Audio-only background bridge) */}
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
          title="Tera Hone Laga Hoon Player"
          src="about:blank"
          allow="autoplay; encrypted-media"
          tabIndex="-1"
          onLoad={() => {
            // Send play command as soon as iframe loads
            playSong();
          }}
        />
      </div>

      {/* Floating prompt if browser blocked autoplay before user click */}
      {showAutoplayPrompt && (
        <div
          className="floating-audio-unmute-prompt animate-pop-in"
          onClick={() => {
            handleFirstUserInteraction();
          }}
          role="button"
          tabIndex={0}
          title="Click to play Tera Hone Laga Hoon"
        >
          <div className="prompt-inner">
            <Music size={15} className="spin-slow" color="#ffd700" />
            <span>Tap to play <b>Tera Hone Laga Hoon</b> ♪</span>
            <Sparkles size={14} color="#ff4d88" />
          </div>
        </div>
      )}
    </>
  );
}
