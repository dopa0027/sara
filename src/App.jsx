import React, { useState, useEffect } from 'react';
import FloatingParticles from './components/FloatingParticles';
import AudioBridge from './components/AudioBridge';
import HeaderNav from './components/HeaderNav';
import FrontHero from './components/FrontHero';
import SpecialNoteModal from './components/SpecialNoteModal';
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
  const [stage, setStage] = useState(0); // 0 = Front Page (Hero), 1..8 = Challenges, 9 = Final Surprise & Gallery
  const [isNoteOpen, setIsNoteOpen] = useState(false);

  useEffect(() => {
    // Scroll smoothly to top on stage change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stage]);

  const handleNavigate = (view) => {
    if (view === 'home') {
      setStage(0);
    } else if (view === 'surprise') {
      setStage(1);
    } else if (view === 'photos' || view === 'always') {
      setStage(9);
    }
  };

  const handleRestart = () => {
    setStage(0);
  };

  return (
    <div className="app-container">
      {/* Background Floating Hearts & Stars */}
      <FloatingParticles />

      {/* Invisible Autoplay Music Engine (plays song automatically on site open!) */}
      <AudioBridge />

      {/* Top Header Navigation matching screenshot */}
      <HeaderNav
        onOpenNote={() => setIsNoteOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* Special Note Modal matching Image 2 */}
      <SpecialNoteModal
        isOpen={isNoteOpen}
        onClose={() => setIsNoteOpen(false)}
      />

      {/* Progress Bar (Visible during challenges 1 through 8) */}
      {stage >= 1 && stage <= 8 && (
        <ProgressBar
          currentLevel={stage}
          totalLevels={8}
          onRestart={handleRestart}
        />
      )}

      {/* Main Content Area */}
      <main className="main-content">
        {/* Stage 0: Front Page exactly matching Image 1 */}
        {stage === 0 && (
          <FrontHero
            onOpenSurprise={() => setStage(1)}
            onOpenNote={() => setIsNoteOpen(true)}
          />
        )}

        {/* 7 Challenges & Special Ganga Ghat Memory */}
        {stage === 1 && <Level1Slider onNext={() => setStage(2)} />}
        {stage === 2 && <Level2Drama onNext={() => setStage(3)} />}
        {stage === 3 && <Level3CatchHeart onNext={() => setStage(4)} />}
        {stage === 4 && <Level4Memory onNext={() => setStage(5)} />}
        {stage === 5 && <GangaGhatScene onNext={() => setStage(6)} />}
        {stage === 6 && <Level5SendLove onNext={() => setStage(7)} />}
        {stage === 7 && <Level6FavouritePerson onNext={() => setStage(8)} />}
        {stage === 8 && <Level7FinalPromise onUnlockLetter={() => setStage(9)} />}

        {/* Final Love Letter, Cake & Memories Gallery */}
        {stage === 9 && (
          <FinalSurpriseLetter
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
}
