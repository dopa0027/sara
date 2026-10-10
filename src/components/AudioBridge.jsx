import React, { useEffect, useRef } from 'react';
import { romanticAudio } from '../utils/romanticAudioEngine';

// YouTube video IDs:
// 1. "Tera Hone Laga Hoon" (From user's link: oeYgD5w3NQo / Tips Official: useznoRhrWU)
// 2. "Until I Found You" (Stephen Sanchez: GxldQ9GyX3I)
// 3. "Boyfriend Banale" (Special track: 7w2r4o3B6W4 / energetic pop)
const YT_TRACK_MAP = {
  'tera-hone-laga-hoon': 'oeYgD5w3NQo',
  'until-i-found-you': 'GxldQ9GyX3I',
  'boyfriend-banale': '7w2r4o3B6W4',
};

export default function AudioBridge() {
  const iframeRef = useRef(null);
  const playerStateRef = useRef({ isPlaying: false, trackId: 'tera-hone-laga-hoon' });

  useEffect(() => {
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
          // Completely hidden audio bridge - ZERO video display in bottom right!
          iframeRef.current.src = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&enablejsapi=1&playsinline=1&controls=0&disablekb=1&fs=0&loop=1&rel=0`;
        } else {
          iframeRef.current.src = 'about:blank';
        }
      }
    };

    const unsubscribe = romanticAudio.subscribe(handleSync);
    return () => unsubscribe();
  }, []);

  return (
    // Strictly hidden audio element - NO VIDEO BOX!
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
        title="Background Music Stream"
        src="about:blank"
        allow="autoplay"
        tabIndex="-1"
      />
    </div>
  );
}
