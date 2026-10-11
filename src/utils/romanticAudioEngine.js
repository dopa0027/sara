// =========================================================================
// UNIFIED MASTER ROMANTIC AUDIO ENGINE
// Strictly manages a SINGLE audio pipeline so two songs can NEVER mix!
// =========================================================================

// Generates robust asset paths respecting Vite base path (e.g. /sara/ on GitHub Pages)
export const getPublicAssetUrl = (assetPath) => {
  if (!assetPath) return '';
  const cleanPath = assetPath.replace(/^\.?\//, '');
  const baseUrl = import.meta.env.BASE_URL;

  if (typeof window !== 'undefined') {
    if (baseUrl && baseUrl.startsWith('/')) {
      const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      return `${window.location.origin}${cleanBase}${cleanPath}`;
    }

    const pathname = window.location.pathname;
    let resolvedBase = pathname.endsWith('/')
      ? pathname
      : pathname.slice(0, pathname.lastIndexOf('/') + 1);

    if (!pathname.endsWith('/') && !pathname.includes('.')) {
      resolvedBase = `${pathname}/`;
    }

    return `${window.location.origin}${resolvedBase}${cleanPath}`;
  }

  return `./${cleanPath}`;
};

export const AUDIO_TRACKS = {
  'tera-hone-laga-hoon': {
    id: 'tera-hone-laga-hoon',
    title: 'Tera Hone Laga Hoon',
    artist: 'Ajab Prem Ki Ghazab Kahani · Atif Aslam',
    src: './assets/tera-hone-laga-hoon.m4a',
    fallbackSrc: './assets/tera-hone-laga-hoon.mp3',
  },
  'gehra-samandar': {
    id: 'gehra-samandar',
    title: 'Gehra Samandar',
    artist: 'Naina Da Kya Kasoor · Amit Trivedi',
    src: './assets/gehra-samandar.m4a',
    fallbackSrc: './assets/gehra-samandar.mp3',
  },
};

class RomanticAudioEngine {
  constructor() {
    this.audioElement = null;
    this.currentTrackId = 'tera-hone-laga-hoon';
    this.isPlaying = false;
    this.isMuted = false;
    this.volume = 1;
    this.isDucked = false;
    this.userPaused = false; // Tracks if the user intentionally paused the music
    this.listeners = new Set();
    this.gestureListenersAttached = false;
    this._onGesture = null;
  }

  // Subscribe to changes (notifies immediately with current state)
  subscribe(listener) {
    this.listeners.add(listener);
    try {
      listener(this.getState());
    } catch {
      // Safe fallback
    }
    return () => this.listeners.delete(listener);
  }

  getState() {
    const trackInfo = AUDIO_TRACKS[this.currentTrackId] || AUDIO_TRACKS['tera-hone-laga-hoon'];
    return {
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      userPaused: this.userPaused,
      currentTrackId: this.currentTrackId,
      trackInfo,
      trackIndex: this.currentTrackId === 'gehra-samandar' ? 10 : 0,
      volume: this.volume,
      isDucked: this.isDucked,
    };
  }

  notify() {
    const state = this.getState();
    this.listeners.forEach((fn) => {
      try {
        fn(state);
      } catch {
        // Safe fallback
      }
    });
  }

  getOrCreateAudio() {
    if (!this.audioElement && typeof window !== 'undefined') {
      this.audioElement = new Audio();
      this.audioElement.preload = 'auto';
      this.audioElement.loop = true;
      this.audioElement.playsInline = true;

      this.audioElement.onplay = () => {
        this.isPlaying = true;
        this.notify();
      };

      this.audioElement.onpause = () => {
        this.isPlaying = false;
        this.notify();
      };

      this.audioElement.onerror = () => {
        // Fallback to mp3 if m4a has an issue
        const track = AUDIO_TRACKS[this.currentTrackId];
        if (track && track.fallbackSrc) {
          const fallbackResolved = getPublicAssetUrl(track.fallbackSrc);
          if (this.audioElement && this.audioElement.src !== fallbackResolved) {
            this.audioElement.src = fallbackResolved;
            if (this.isPlaying && !this.userPaused) {
              this.audioElement.play().catch(() => {});
            }
          }
        }
      };
    }
    return this.audioElement;
  }

  // Main method to switch and play a track
  async playTrack(trackId = 'tera-hone-laga-hoon') {
    const audio = this.getOrCreateAudio();
    if (!audio) return;

    const track = AUDIO_TRACKS[trackId] || AUDIO_TRACKS['tera-hone-laga-hoon'];
    const resolvedSrc = getPublicAssetUrl(track.src);

    // If switching track: ALWAYS PAUSE AND STOP PREVIOUS TRACK FIRST!
    const isDifferentTrack = this.currentTrackId !== trackId || audio.src !== resolvedSrc;

    if (isDifferentTrack) {
      audio.pause();
      audio.currentTime = 0;
      audio.src = resolvedSrc;
      this.currentTrackId = trackId;
    }

    audio.volume = this.isMuted ? 0 : this.isDucked ? 0.35 : this.volume;

    try {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
        this.isPlaying = true;
        this.notify();
      }
    } catch {
      // Browser autoplay policy might block unmuted audio on cold start
      this.isPlaying = false;
      this.notify();
      this.attachGestureListeners();
    }
  }

  // Backwards compatibility for play(trackIndex, trackConfig)
  play(trackIndexOrId = 0) {
    if (this.userPaused) return; // Do not restart if user paused!
    if (trackIndexOrId === 'gehra-samandar') {
      return this.playTrack('gehra-samandar');
    }
    return this.playTrack('tera-hone-laga-hoon');
  }

  replayTrack(trackId = null) {
    const targetId = trackId || this.currentTrackId;
    const audio = this.getOrCreateAudio();
    if (!audio) return;

    this.userPaused = false;
    if (targetId !== this.currentTrackId) {
      this.playTrack(targetId);
      return;
    }

    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          this.notify();
        })
        .catch(() => {});
    }
  }

  // Temporary pause (e.g. for sub-features like voice notes or quiz)
  pause() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.isPlaying = false;
    this.notify();
  }

  // User explicitly paused background music
  userPause() {
    this.userPaused = true;
    this.pause();
  }

  // User explicitly resumed background music
  userResume() {
    this.userPaused = false;
    return this.playTrack(this.currentTrackId);
  }

  // User clicked toggle pill
  userToggle() {
    if (this.isPlaying) {
      this.userPause();
    } else {
      this.userResume();
    }
  }

  stopAll() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    this.isPlaying = false;
    this.notify();
  }

  toggle() {
    this.userToggle();
  }

  setVolume(val) {
    this.volume = val;
    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : this.isDucked ? 0.35 : val;
    }
    this.notify();
  }

  softDucking(reduce = true) {
    this.isDucked = reduce;
    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : reduce ? 0.35 : this.volume;
    }
    this.notify();
  }

  // Handle initial browser gesture for cold starts without mixing
  attachGestureListeners() {
    if (this.gestureListenersAttached || typeof window === 'undefined') return;
    this.gestureListenersAttached = true;

    const onGesture = () => {
      this.removeGestureListeners();
      // Only start if still paused AND user hasn't explicitly paused!
      if (!this.isPlaying && !this.userPaused && this.currentTrackId) {
        this.playTrack(this.currentTrackId);
      }
    };

    this._onGesture = onGesture;
    const events = ['pointerdown', 'touchstart', 'mousedown', 'scroll', 'wheel', 'keydown', 'click'];
    events.forEach((evt) => {
      window.addEventListener(evt, onGesture, { capture: true, passive: true });
    });
  }

  removeGestureListeners() {
    if (!this.gestureListenersAttached || typeof window === 'undefined') return;
    this.gestureListenersAttached = false;
    if (this._onGesture) {
      const events = ['pointerdown', 'touchstart', 'mousedown', 'scroll', 'wheel', 'keydown', 'click'];
      events.forEach((evt) => {
        window.removeEventListener(evt, this._onGesture, true);
      });
      this._onGesture = null;
    }
  }
}

export const romanticAudio = new RomanticAudioEngine();
