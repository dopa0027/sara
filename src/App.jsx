import React, { useState, useEffect } from 'react';
import FloatingParticles from './components/FloatingParticles';
import AudioPlayer from './components/AudioPlayer';
import AudioBridge from './components/AudioBridge';
import ProgressBar from './components/ProgressBar';
import StartScreen from './components/StartScreen';
import Level1Slider from './components/Level1Slider';
import Level2Drama from './components/Level2Drama';
import Level3CatchHeart from './components/Level3CatchHeart';
import Level4Memory from './components/Level4Memory';
import GangaGhatScene from './components/GangaGhatScene';
import Level5SendLove from './components/Level5SendLove';
import Level6FavouritePerson from './components/Level6FavouritePerson';
import Level7FinalPromise from './components/Level7FinalPromise';
import FinalSurpriseLetter from './components/FinalSurpriseLetter';

export default function App() {
  const [stage, setStage] = useState(() => {
    try {
      const saved = localStorage.getItem('sara_love_story_stage');
      return saved !== null ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sara_love_story_stage', stage.toString());
    } catch {
      // storage unavailable
    }
    // Scroll smoothly to top on stage change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stage]);

  const handleRestart = () => {
    setStage(0);
    try {
      localStorage.removeItem('sara_love_story_stage');
    } catch {
      // ignore
    }
  };

  return (
    <div className="app-container">
      {/* Background Floating Hearts & Stars */}
      <FloatingParticles />

      {/* Invisible YouTube Audio Bridge (pure audio, NO video in bottom right!) */}
      <AudioBridge />

      {/* Floating Glassmorphic Audio Controller */}
      <AudioPlayer />

      {/* Progress Bar (Stages 1 through 8) */}
      {stage >= 1 && stage <= 8 && (
        <ProgressBar
          currentLevel={stage}
          totalLevels={8}
          onRestart={handleRestart}
        />
      )}

      {/* Screen Views */}
      <main className="main-content">
        {stage === 0 && <StartScreen onStart={() => setStage(1)} />}
        {stage === 1 && <Level1Slider onNext={() => setStage(2)} />}
        {stage === 2 && <Level2Drama onNext={() => setStage(3)} />}
        {stage === 3 && <Level3CatchHeart onNext={() => setStage(4)} />}
        {stage === 4 && <Level4Memory onNext={() => setStage(5)} />}
        {stage === 5 && <GangaGhatScene onNext={() => setStage(6)} />}
        {stage === 6 && <Level5SendLove onNext={() => setStage(7)} />}
        {stage === 7 && <Level6FavouritePerson onNext={() => setStage(8)} />}
        {stage === 8 && <Level7FinalPromise onUnlockLetter={() => setStage(9)} />}
        {stage === 9 && <FinalSurpriseLetter onRestart={handleRestart} />}
      </main>
    </div>
  );
}
