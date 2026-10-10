import React, { useEffect, useRef } from 'react';
import { romanticAudio } from '../utils/romanticAudioEngine';

const YT_TRACK_MAP = {
  'tera-hone-laga-hoon': 'oeYgD5w3NQo',
  'until-i-found-you': 'GxldQ9GyX3I',
  'boyfriend-banale': '7w2r4o3B6W4',
};

export default function AudioBridge() {
  const iframeRef = useRef(null);
  const playerStateRef = useRef({ isPlaying: true, trackId: 'tera-hone-laga-hoon' });

  // Autoplay immediately on mount
  useEffect(() => {
    // 1. Trigger audio engine play state
    romanticAudio.play(0);

    // 2. Set iframe autoplay immediately
    if (iframeRef.current) {
      iframeRef.current.src = `https://www.youtube-nocookie.com/embed/oeYgD5w3NQo?autoplay=1&enablejsapi=1&playsinline=1&controls=0&disablekb=1&fs=0&loop=1&playlist=oeYgD5w3NQo`;
    }

    // 3. Fallback: on any initial touch/scroll/click on the screen, ensure playback is unmuted & active
    const startOnAnyInteraction = () => {
      romanticAudio.play(0);
      if (iframeRef.current && (!iframeRef.current.src || iframeRef.current.src === 'about:blank')) {
        iframeRef.current.src = `https://www.youtube-nocookie.com/embed/oeYgD5w3NQo?autoplay=1&enablejsapi=1&playsinline=1&controls=0&disablekb=1&fs=0&loop=1&playlist=oeYgD5w3NQo`;
      }
      window.removeEventListener('pointerdown', startOnAnyInteraction);
      window.removeEventListener('touchstart', startOnAnyInteraction);
      window.removeEventListener('scroll', startOnAnyInteraction);
      window.removeEventListener('click', startOnAnyInteraction);
    };

    window.addEventListener('pointerdown', startOnAnyInteraction, { passive: true });
    window.addEventListener('touchstart', startOnAnyInteraction, { passive: true });
    window.addEventListener('scroll', startOnAnyInteraction, { passive: true });
    window.addEventListener('click', startOnAnyInteraction, { passive: true });

    // 4. Sync with audio state changes
    const handleSync = (state) => {
      const prev = playerStateRef.current;
      const trackId =
        state.trackIndex === 1
          ? 'until-i-found-you'
          : state.trackIndex === 2
          ? 'boyfriend-banale'
          : 'tera-hone-laga-hoon';

      if (state.isPlaying !== prev.isPlaying || trackId !== prev.trackId) {
        playerStateRef.current = { isPlaying: state.isPlaying, trackId };

        if (!iframeRef.current) return;

        if (state.isPlaying) {
          const ytId = YT_TRACK_MAP[trackId] || 'oeYgD5w3NQo';
          iframeRef.current.src = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&enablejsapi=1&playsinline=1&controls=0&disablekb=1&fs=0&loop=1&playlist=${ytId}`;
        } else {
          iframeRef.current.src = 'about:blank';
        }
      }
    };

    const unsubscribe = romanticAudio.subscribe(handleSync);
    return () => {
      unsubscribe();
      window.removeEventListener('pointerdown', startOnAnyInteraction);
      window.removeEventListener('touchstart', startOnAnyInteraction);
      window.removeEventListener('scroll', startOnAnyInteraction);
      window.removeEventListener('click', startOnAnyInteraction);
    };
  }, []);

  return (
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
        title="Background Music Player"
        src="about:blank"
        allow="autoplay; encrypted-media"
        tabIndex="-1"
      />
    </div>
  );
}
