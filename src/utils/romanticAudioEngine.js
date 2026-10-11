// =========================================================================
// CENTRALIZED GLOBAL AUDIO MANAGEMENT SYSTEM
// =========================================================================
// Guarantees that ONLY ONE audio track, background soundtrack, stream,
// or voice recording plays at any given moment across the entire application.
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

// Complete catalog of registered tracks across all sections of the website
export const AUDIO_TRACKS = {
  'tera-hone-laga-hoon': {
    id: 'tera-hone-laga-hoon',
    title: 'Tera Hone Laga Hoon',
    artist: 'Ajab Prem Ki Ghazab Kahani · Atif Aslam',
    section: 'home',
    src: './assets/tera-hone-laga-hoon.m4a',
    fallbackSrc: './assets/tera-hone-laga-hoon.mp3',
  },
  'gehra-samandar': {
    id: 'gehra-samandar',
    title: 'Gehra Samandar',
    artist: 'Naina Da Kya Kasoor · Amit Trivedi',
    section: 'quiz',
    src: './assets/gehra-samandar.m4a',
    fallbackSrc: './assets/gehra-samandar.mp3',
    youtubeId: 'R2_241d7a8E',
  },
  'dil-meri-na-sune': {
    id: 'dil-meri-na-sune',
    title: 'Dil Meri Na Sune',
    artist: 'Atif Aslam · Genius',
    section: 'pehli-nazar',
    src: './assets/dil-meri-na-sune.mp3',
    youtubeId: 'YZLKoG_vhDY',
  },
  'until-i-found-you': {
    id: 'until-i-found-you',
    title: 'Until I Found You',
    artist: 'Stephen Sanchez',
    section: 'playlist',
    src: './assets/until-i-found-you.mp3',
  },
  'boyfriend-banale': {
    id: 'boyfriend-banale',
    title: 'Boyfriend Banale',
    artist: 'Special Track for Sara',
    section: 'playlist',
    src: './assets/boyfriend-banale.mp3',
  },
};

export const LOVE_LETTER_PARTS = [
  { id: 1, label: 'Part 1', file: 'miss-you-1.mp4', fallbacks: ['miss-you-1.m4a', 'miss-you-1.mp3'] },
  { id: 2, label: 'Part 2', file: 'miss-you-2.mp4', fallbacks: ['miss-you-2.m4a', 'miss-you-2.mp3'] },
  { id: 3, label: 'Part 3', file: 'miss-you-3.mp4', fallbacks: ['miss-you-3.m4a', 'miss-you-3.mp3'] },
];

class GlobalAudioManager {
  constructor() {
    this.audioElement = null;
    this.voiceAudioElement = null;
    this.streamIframe = null;

    this.currentOwner = 'home'; // 'home' | 'pehli-nazar' | 'quiz' | 'open-when' | 'playlist'
    this.currentTrackId = 'tera-hone-laga-hoon';

    this.isPlaying = false;
    this.isStreamPlaying = false;
    this.isMuted = false;
    this.volume = 1;
    this.isDucked = false;
    this.userPaused = false; // Persistent user pause intent

    this.playbackToken = 0; // Monotonic token to prevent async race conditions
    this.listeners = new Set();
    this.gestureListenersAttached = false;
    this._onGesture = null;

    // Sequential Voice Recordings State
    this.voiceState = {
      isPlaying: false,
      partIndex: 0,
      partLabel: 'Part 1',
      isMissingFile: false,
      autoplayBlocked: false,
    };
    this.voiceParts = LOVE_LETTER_PARTS;
    this.previousMusicStateBeforeVoice = null;
  }

  // Subscribe to playback changes
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
    const isVoiceActive = this.currentOwner === 'open-when' && this.voiceState.isPlaying;
    const trackInfo = AUDIO_TRACKS[this.currentTrackId] || AUDIO_TRACKS['tera-hone-laga-hoon'];
    const playlistIds = ['tera-hone-laga-hoon', 'until-i-found-you', 'boyfriend-banale'];
    const trackIndex = playlistIds.indexOf(this.currentTrackId);

    return {
      isPlaying: this.isPlaying || this.isStreamPlaying || isVoiceActive,
      isPaused: !this.isPlaying && !this.isStreamPlaying && !isVoiceActive,
      userPaused: this.userPaused,
      currentOwner: this.currentOwner,
      currentTrackId: this.currentTrackId,
      trackInfo,
      trackIndex: trackIndex >= 0 ? trackIndex : 0,
      volume: this.volume,
      isDucked: this.isDucked,
      isStreamPlaying: this.isStreamPlaying,
      voiceState: { ...this.voiceState },
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

  // -------------------------------------------------------------------------
  // DOM Pipeline Initializers
  // -------------------------------------------------------------------------
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
        const track = AUDIO_TRACKS[this.currentTrackId];
        // 1. Try local mp3 fallback if available
        if (track?.fallbackSrc) {
          const fallbackResolved = getPublicAssetUrl(track.fallbackSrc);
          if (this.audioElement && this.audioElement.src !== fallbackResolved) {
            this.audioElement.src = fallbackResolved;
            if (this.isPlaying && !this.userPaused) {
              this.audioElement.play().catch(() => {});
            }
            return;
          }
        }
        // 2. If track has youtubeId and local file failed, seamlessly bridge via stream
        if (track?.youtubeId && !this.userPaused) {
          this.playViaStreamBridge(track.youtubeId);
        }
      };
    }
    return this.audioElement;
  }

  getOrCreateVoiceAudio() {
    if (!this.voiceAudioElement && typeof window !== 'undefined') {
      this.voiceAudioElement = new Audio();
      this.voiceAudioElement.preload = 'auto';
      this.voiceAudioElement.playsInline = true;

      this.voiceAudioElement.onended = () => {
        this.handleVoiceEnded();
      };

      this.voiceAudioElement.onerror = () => {
        this.voiceState.isPlaying = false;
        this.voiceState.isMissingFile = true;
        this.notify();
      };
    }
    return this.voiceAudioElement;
  }

  getOrCreateStreamIframe() {
    if (!this.streamIframe && typeof window !== 'undefined') {
      const iframe = document.createElement('iframe');
      iframe.title = 'Global Background Audio Bridge';
      iframe.allow = 'autoplay; encrypted-media';
      iframe.tabIndex = -1;
      iframe.setAttribute('aria-hidden', 'true');
      iframe.style.position = 'fixed';
      iframe.style.top = '-9999px';
      iframe.style.left = '-9999px';
      iframe.style.width = '1px';
      iframe.style.height = '1px';
      iframe.style.opacity = '0';
      iframe.style.pointerEvents = 'none';
      document.body.appendChild(iframe);
      this.streamIframe = iframe;
    }
    return this.streamIframe;
  }

  // -------------------------------------------------------------------------
  // Universal Exclusivity Mutex: Stop ALL sources before playing anything
  // -------------------------------------------------------------------------
  silenceAllSources() {
    // 1. Pause and reset master HTML5 audio
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.isPlaying = false;

    // 2. Pause and reset voice audio
    if (this.voiceAudioElement) {
      this.voiceAudioElement.pause();
      this.voiceAudioElement.currentTime = 0;
    }
    this.voiceState.isPlaying = false;

    // 3. Unload any active stream iframe completely
    if (this.streamIframe) {
      try {
        this.streamIframe.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
          '*'
        );
      } catch {
        // Safe fallback
      }
      this.streamIframe.src = 'about:blank';
    }
    this.isStreamPlaying = false;

    this.notify();
  }

  // -------------------------------------------------------------------------
  // Main Playback Controller (Section Songs & Playlists)
  // -------------------------------------------------------------------------
  async claimPlayback(owner = 'home', trackId = 'tera-hone-laga-hoon', options = {}) {
    const { forceRestart = false, userInitiated = false } = options;

    if (userInitiated) {
      this.userPaused = false;
    }

    // CRITICAL: If user has explicitly paused playback, do NOT autoplay on navigation
    if (this.userPaused && !forceRestart && !userInitiated) {
      this.currentOwner = owner;
      this.currentTrackId = trackId;
      this.silenceAllSources();
      this.notify();
      return;
    }

    // If this exact song is already actively playing and no restart requested, don't stutter
    const isSameSong = this.currentTrackId === trackId;
    const isAlreadyPlaying = (this.isPlaying || this.isStreamPlaying) && this.currentOwner === owner;
    if (isSameSong && isAlreadyPlaying && !forceRestart) {
      return;
    }

    // Invalidate any in-flight promises from previous calls
    this.playbackToken += 1;
    const token = this.playbackToken;

    // 1. Synchronously silence EVERY other playing source across the website
    this.silenceAllSources();

    this.currentOwner = owner;
    this.currentTrackId = trackId;

    const track = AUDIO_TRACKS[trackId] || AUDIO_TRACKS['tera-hone-laga-hoon'];

    // If track only has a YouTube stream (like 'dil-meri-na-sune' without local mp3)
    if (!track.src && track.youtubeId) {
      this.playViaStreamBridge(track.youtubeId);
      return;
    }

    const audio = this.getOrCreateAudio();
    if (!audio) return;

    const resolvedSrc = getPublicAssetUrl(track.src);
    if (audio.src !== resolvedSrc || forceRestart) {
      audio.currentTime = 0;
      audio.src = resolvedSrc;
    }

    audio.volume = this.isMuted ? 0 : this.isDucked ? 0.35 : this.volume;

    try {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
        // Verify this playback request is still the active one
        if (this.playbackToken === token) {
          this.isPlaying = true;
          this.notify();
        } else {
          audio.pause();
        }
      }
    } catch {
      // Browser autoplay policy might block unmuted audio on cold start
      if (this.playbackToken === token) {
        this.isPlaying = false;
        this.notify();
        this.attachGestureListeners();

        // If local file failed to play and youtubeId exists, attempt stream fallback
        if (track.youtubeId && !this.userPaused) {
          this.playViaStreamBridge(track.youtubeId);
        }
      }
    }
  }

  playViaStreamBridge(youtubeId) {
    if (!youtubeId || typeof window === 'undefined') return;
    if (this.userPaused) return;
    const iframe = this.getOrCreateStreamIframe();
    if (!iframe) return;

    this.isStreamPlaying = true;
    iframe.src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&enablejsapi=1&playsinline=1&controls=0&loop=1&playlist=${youtubeId}`;
    this.notify();
  }

  // -------------------------------------------------------------------------
  // Sequential Voice Note Engine (For "Open When You Miss Me" Letter)
  // -------------------------------------------------------------------------
  playVoiceSequence(parts = LOVE_LETTER_PARTS, startIdx = 0, options = {}) {
    const { userInitiated = true } = options;
    if (userInitiated) {
      this.userPaused = false;
    }
    if (parts && parts.length > 0) {
      this.voiceParts = parts;
    }

    // Capture previous state if starting voice notes
    if (this.currentOwner !== 'open-when') {
      this.previousMusicStateBeforeVoice = {
        wasPlaying: (this.isPlaying || this.isStreamPlaying) && !this.userPaused,
        trackId: this.currentTrackId,
        owner: this.currentOwner,
      };
    }

    this.playbackToken += 1;
    const token = this.playbackToken;

    // Silence all background music before starting voice notes
    this.silenceAllSources();
    this.currentOwner = 'open-when';

    this.playVoicePartInternal(startIdx, token);
  }

  playVoicePart(partIdx) {
    this.playbackToken += 1;
    const token = this.playbackToken;

    this.silenceAllSources();
    this.currentOwner = 'open-when';
    this.playVoicePartInternal(partIdx, token);
  }

  playVoicePartInternal(partIdx, token) {
    if (partIdx >= this.voiceParts.length) {
      // Finished all parts
      this.voiceState.isPlaying = false;
      this.voiceState.partIndex = 0;
      this.notify();
      return;
    }

    const part = this.voiceParts[partIdx];
    this.voiceState.partIndex = partIdx;
    this.voiceState.partLabel = part.label;
    this.voiceState.isMissingFile = false;
    this.voiceState.autoplayBlocked = false;

    const audio = this.getOrCreateVoiceAudio();
    if (!audio) return;

    const fileList = [
      part.file,
      ...(part.fallbacks || [`miss-you-${partIdx + 1}.m4a`, `miss-you-${partIdx + 1}.mp3`]),
    ];

    const tryPlayIndex = (idx) => {
      if (idx >= fileList.length) {
        if (this.playbackToken === token) {
          this.voiceState.isPlaying = false;
          this.voiceState.isMissingFile = true;
          this.notify();
        }
        return;
      }

      const currentFile = fileList[idx];
      const resolvedUrl = getPublicAssetUrl(`assets/love-letters/${currentFile}`);
      audio.src = resolvedUrl;
      audio.currentTime = 0;
      audio.volume = this.volume;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (this.playbackToken === token) {
              this.voiceState.isPlaying = true;
              this.voiceState.autoplayBlocked = false;
              this.voiceState.isMissingFile = false;
              this.notify();
            } else {
              audio.pause();
            }
          })
          .catch((err) => {
            if (this.playbackToken === token) {
              if (err.name === 'NotAllowedError') {
                this.voiceState.isPlaying = false;
                this.voiceState.autoplayBlocked = true;
                this.notify();
              } else {
                // Try next fallback (.m4a, .mp3)
                tryPlayIndex(idx + 1);
              }
            }
          });
      }
    };

    tryPlayIndex(0);
  }

  handleVoiceEnded() {
    const nextIdx = this.voiceState.partIndex + 1;
    if (nextIdx < this.voiceParts.length) {
      this.playbackToken += 1;
      this.playVoicePartInternal(nextIdx, this.playbackToken);
    } else {
      this.voiceState.isPlaying = false;
      this.voiceState.partIndex = 0;
      this.notify();
    }
  }

  toggleVoicePlayback() {
    const audio = this.getOrCreateVoiceAudio();
    if (!audio) return;

    if (this.voiceState.isPlaying) {
      audio.pause();
      this.voiceState.isPlaying = false;
      this.notify();
    } else {
      this.playVoicePart(this.voiceState.partIndex);
    }
  }

  stopVoiceSequence(restorePreviousMusic = true) {
    if (this.voiceAudioElement) {
      this.voiceAudioElement.pause();
      this.voiceAudioElement.currentTime = 0;
    }
    this.voiceState.isPlaying = false;
    this.voiceState.autoplayBlocked = false;
    this.voiceState.partIndex = 0;

    // Restore previous section music if appropriate
    if (restorePreviousMusic && this.previousMusicStateBeforeVoice) {
      const prev = this.previousMusicStateBeforeVoice;
      this.previousMusicStateBeforeVoice = null;

      if (prev.wasPlaying && !this.userPaused) {
        this.claimPlayback(prev.owner || 'home', prev.trackId || 'tera-hone-laga-hoon');
        return;
      }
    } else {
      this.previousMusicStateBeforeVoice = null;
    }

    this.notify();
  }

  // -------------------------------------------------------------------------
  // Section Navigation Release Handler
  // -------------------------------------------------------------------------
  releasePlayback(owner) {
    if (this.currentOwner === owner) {
      this.silenceAllSources();
    }
  }

  // -------------------------------------------------------------------------
  // Common Playback Methods (Backwards Compatible)
  // -------------------------------------------------------------------------
  playTrack(trackId = 'tera-hone-laga-hoon') {
    const owner = trackId === 'gehra-samandar' ? 'quiz' : trackId === 'dil-meri-na-sune' ? 'pehli-nazar' : 'home';
    return this.claimPlayback(owner, trackId);
  }

  play(trackIndexOrId = 0, trackObj = null) {
    this.userPaused = false;
    if (typeof trackIndexOrId === 'string') {
      return this.playTrack(trackIndexOrId, { userInitiated: true });
    }
    if (trackObj?.id) {
      return this.claimPlayback('home', trackObj.id, { userInitiated: true });
    }
    const playlistIds = ['tera-hone-laga-hoon', 'until-i-found-you', 'boyfriend-banale'];
    const resolvedId = playlistIds[trackIndexOrId] || 'tera-hone-laga-hoon';
    return this.claimPlayback('home', resolvedId, { userInitiated: true });
  }

  replayTrack(trackId = null) {
    const targetId = trackId || this.currentTrackId;
    this.userPaused = false;
    return this.claimPlayback(this.currentOwner, targetId, { forceRestart: true });
  }

  // Temporary pause
  pause() {
    this.silenceAllSources();
  }

  // User explicitly paused audio
  userPause() {
    this.userPaused = true;
    this.silenceAllSources();
  }

  // User explicitly resumed audio
  userResume() {
    this.userPaused = false;
    if (this.currentOwner === 'open-when') {
      return this.playVoicePart(this.voiceState.partIndex);
    }
    return this.claimPlayback(this.currentOwner, this.currentTrackId);
  }

  userToggle() {
    const isAnyPlaying = this.isPlaying || this.isStreamPlaying || (this.currentOwner === 'open-when' && this.voiceState.isPlaying);
    if (isAnyPlaying) {
      this.userPause();
    } else {
      this.userResume();
    }
  }

  toggle() {
    this.userToggle();
  }

  stopAll() {
    this.silenceAllSources();
  }

  setVolume(val) {
    this.volume = val;
    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : this.isDucked ? 0.35 : val;
    }
    if (this.voiceAudioElement) {
      this.voiceAudioElement.volume = val;
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

  // -------------------------------------------------------------------------
  // Gesture listener to satisfy strict browser autoplay policies
  // -------------------------------------------------------------------------
  attachGestureListeners() {
    if (this.gestureListenersAttached || typeof window === 'undefined') return;
    this.gestureListenersAttached = true;

    const onGesture = () => {
      this.removeGestureListeners();
      const isAnyPlaying = this.isPlaying || this.isStreamPlaying;
      if (!isAnyPlaying && !this.userPaused && this.currentTrackId) {
        this.claimPlayback(this.currentOwner, this.currentTrackId);
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

export const globalAudioManager = new GlobalAudioManager();
export const romanticAudio = globalAudioManager; // Backwards compatible alias
