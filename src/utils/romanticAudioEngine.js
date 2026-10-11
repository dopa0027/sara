// =========================================================================
// ROMANTIC AUDIO ENGINE
// Seamlessly plays audio files OR falls back to a gorgeous synthesized
// romantic piano / music-box melody via Web Audio API. Zero dependencies!
// =========================================================================

class RomanticAudioEngine {
  constructor() {
    this.audioContext = null;
    this.audioElement = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.currentTrackIndex = 0;
    this.gainNode = null;
    this.synthLoopInterval = null;
    this.listeners = new Set();
    this.noteStep = 0;

    // Romantic chord progressions & melodies
    // Chords in frequencies (Hz) for "Tera Hone Laga Hoon" & "Until I Found You" vibes
    this.themes = {
      // Gentle romantic ballad arpeggios
      romantic: [
        // Eb Major chord: Eb4, G4, Bb4, Eb5
        [311.13, 392.00, 466.16, 622.25],
        [311.13, 466.16, 392.00, 466.16],
        // Bb Major: Bb3, D4, F4, Bb4
        [233.08, 293.66, 349.23, 466.16],
        [293.66, 349.23, 466.16, 349.23],
        // C minor: C4, Eb4, G4, C5
        [261.63, 311.13, 392.00, 523.25],
        [311.13, 392.00, 523.25, 392.00],
        // Ab Major: Ab3, C4, Eb4, Ab4
        [207.65, 261.63, 311.13, 415.30],
        [261.63, 311.13, 415.30, 523.25],
      ],
      // Soft music-box melody notes
      melody: [
        392.00, 466.16, 523.25, 622.25, 523.25, 466.16, 392.00, 349.23,
        392.00, 466.16, 523.25, 587.33, 523.25, 466.16, 392.00, 466.16
      ]
    };
    this.volume = 1;
    this.isDucked = false;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((fn) =>
      fn({
        isPlaying: this.isPlaying,
        isMuted: this.isMuted,
        trackIndex: this.currentTrackIndex,
        volume: this.volume,
        isDucked: this.isDucked,
      })
    );
  }

  initAudioContext() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        this.gainNode.connect(this.audioContext.destination);
      }
    }
    if (this.audioContext && this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
  }

  playPianoNote(freq, time, duration = 1.2, isMelody = false) {
    if (!this.audioContext || this.isMuted) return;

    try {
      const osc = this.audioContext.createOscillator();
      const oscHarmonic = this.audioContext.createOscillator();
      const noteGain = this.audioContext.createGain();

      // Warm triangle & sine wave mixture for soft electric piano / bell timbre
      osc.type = isMelody ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, time);

      oscHarmonic.type = "sine";
      oscHarmonic.frequency.setValueAtTime(freq * 2, time);

      // Acoustic envelope: quick attack, gentle exponential decay
      const peakGain = isMelody ? 0.08 : 0.04;
      noteGain.gain.setValueAtTime(0.0001, time);
      noteGain.gain.linearRampToValueAtTime(peakGain, time + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(noteGain);
      oscHarmonic.connect(noteGain);
      noteGain.connect(this.gainNode);

      osc.start(time);
      osc.stop(time + duration);
      oscHarmonic.start(time);
      oscHarmonic.stop(time + duration);
    } catch {
      // Audio node cleanup handling
    }
  }

  startSynthMusic() {
    this.stopSynthMusic();
    this.initAudioContext();
    if (!this.audioContext) return;

    let beat = 0;
    const tempoMs = 520; // gentle slow romantic tempo

    const tick = () => {
      if (!this.isPlaying) return;
      const now = this.audioContext.currentTime + 0.05;

      // Play chord arpeggio
      const chordIndex = Math.floor(beat / 4) % this.themes.romantic.length;
      const chord = this.themes.romantic[chordIndex];
      const noteInChord = chord[beat % chord.length];

      this.playPianoNote(noteInChord, now, 1.4, false);

      // Play melody accent every 2 beats
      if (beat % 2 === 0) {
        const melodyNote = this.themes.melody[(beat / 2) % this.themes.melody.length];
        this.playPianoNote(melodyNote, now + 0.05, 1.8, true);
      }

      beat++;
    };

    // Start immediate first note and loop
    tick();
    this.synthLoopInterval = setInterval(tick, tempoMs);
  }

  stopSynthMusic() {
    if (this.synthLoopInterval) {
      clearInterval(this.synthLoopInterval);
      this.synthLoopInterval = null;
    }
  }

  async play(trackIndex = null, trackConfig = null) {
    if (trackIndex !== null) {
      this.currentTrackIndex = trackIndex;
    }

    this.initAudioContext();
    this.isPlaying = true;

    // Check if an MP3 file was provided and can play
    const audioSrc = trackConfig?.audioSrc;
    if (audioSrc) {
      try {
        if (!this.audioElement) {
          this.audioElement = new Audio();
          this.audioElement.loop = true;
          this.audioElement.onended = () => this.nextTrack();
        }

        if (this.audioElement.src !== audioSrc) {
          this.audioElement.src = audioSrc;
        }

        const playPromise = this.audioElement.play();
        if (playPromise !== undefined) {
          await playPromise;
          this.stopSynthMusic();
          this.notify();
          return;
        }
      } catch {
        // Handled by AudioBridge streaming engine
      }
    }

    this.notify();
  }

  pause() {
    this.isPlaying = false;
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.stopSynthMusic();
    this.notify();
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  setVolume(val) {
    this.volume = val;
    if (this.gainNode && this.audioContext) {
      this.gainNode.gain.setValueAtTime(val * 0.2, this.audioContext.currentTime);
    }
    if (this.audioElement) {
      this.audioElement.volume = val;
    }
    this.notify();
  }

  softDucking(reduce = true) {
    // Slightly lower music volume during deep emotional moments / letter reading
    this.isDucked = reduce;
    const target = reduce ? 0.08 : 0.2;
    if (this.gainNode && this.audioContext) {
      this.gainNode.gain.linearRampToValueAtTime(target, this.audioContext.currentTime + 1.2);
    }
    if (this.audioElement) {
      this.audioElement.volume = reduce ? 0.35 : 0.8;
    }
    this.notify();
  }
}

export const romanticAudio = new RomanticAudioEngine();
