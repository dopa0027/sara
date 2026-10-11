import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipForward, Music } from 'lucide-react';
import { romanticAudio } from '../utils/romanticAudioEngine';
import { loveStoryConfig } from '../config/loveStoryConfig';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const playlist = loveStoryConfig.playlist;
  const currentTrack = playlist[trackIndex] || playlist[0];

  useEffect(() => {
    const unsubscribe = romanticAudio.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setIsMuted(state.isMuted);
      if (state.trackIndex !== undefined) {
        setTrackIndex(state.trackIndex);
      }
    });
    return unsubscribe;
  }, []);

  const handleTogglePlay = () => {
    romanticAudio.userToggle();
  };

  const handleNextTrack = () => {
    const nextIdx = (trackIndex + 1) % playlist.length;
    setTrackIndex(nextIdx);
    romanticAudio.play(nextIdx, playlist[nextIdx]);
  };

  const handleSelectTrack = (idx) => {
    setTrackIndex(idx);
    romanticAudio.play(idx, playlist[idx]);
    setIsExpanded(false);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    romanticAudio.isMuted = nextMuted;
    if (nextMuted) {
      romanticAudio.setVolume(0);
    } else {
      romanticAudio.setVolume(1);
    }
  };

  return (
    <div className="audio-player-pill" aria-label="Romantic Music Player">
      {/* Equalizer animation when playing */}
      <button 
        type="button"
        className="play-btn" 
        onClick={handleTogglePlay}
        aria-label={isPlaying ? "Pause Song" : "Play Song"}
      >
        {isPlaying ? <Pause size={17} /> : <Play size={17} />}
      </button>

      <div className="track-details" onClick={() => setIsExpanded(!isExpanded)} title="Click to view playlist">
        <span className="track-title">{currentTrack.title}</span>
        <span className="track-artist">{currentTrack.artist}</span>
      </div>

      <div className="eq-bars" aria-hidden="true">
        <span className={`bar ${isPlaying ? 'animated' : ''}`} style={{ animationDelay: '0.1s' }} />
        <span className={`bar ${isPlaying ? 'animated' : ''}`} style={{ animationDelay: '0.3s' }} />
        <span className={`bar ${isPlaying ? 'animated' : ''}`} style={{ animationDelay: '0.2s' }} />
      </div>

      <button 
        type="button"
        className="ctrl-btn" 
        onClick={handleNextTrack} 
        title="Next Song (Boyfriend Banale / Until I Found You)"
        aria-label="Next Song"
      >
        <SkipForward size={16} />
      </button>

      <button 
        type="button"
        className="ctrl-btn" 
        onClick={handleToggleMute} 
        title={isMuted ? "Unmute" : "Mute"}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

      {/* Playlist Dropdown */}
      {isExpanded && (
        <div className="playlist-dropdown">
          <div className="playlist-header">
            <Music size={14} />
            <span>Our Songs for Sara</span>
          </div>
          {playlist.map((t, idx) => (
            <button
              key={t.id}
              type="button"
              className={`playlist-item ${idx === trackIndex ? 'active' : ''}`}
              onClick={() => handleSelectTrack(idx)}
            >
              <div className="item-title">{t.title}</div>
              <div className="item-artist">{t.artist}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
