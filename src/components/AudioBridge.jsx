import { useEffect } from 'react';
import { romanticAudio } from '../utils/romanticAudioEngine';

export default function AudioBridge() {
  useEffect(() => {
    // Start initial background playback of "Tera Hone Laga Hoon" on frontpage load
    romanticAudio.playTrack('tera-hone-laga-hoon');
  }, []);

  // AudioBridge renders null because romanticAudio engine directly controls
  // the single master HTML5 Audio instance, ensuring no competing audio elements exist.
  return null;
}
