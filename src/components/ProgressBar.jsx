import React from 'react';
import { RotateCcw } from 'lucide-react';

export default function ProgressBar({ currentLevel, totalLevels, onRestart }) {
  const percentage = Math.min(100, Math.round(((currentLevel) / totalLevels) * 100));

  return (
    <header className="progress-header" aria-label="Game progress">
      <div className="progress-info">
        <span className="level-badge">LEVEL {currentLevel} OF {totalLevels}</span>
        <button
          type="button"
          className="restart-link"
          onClick={onRestart}
          title="Restart Love Story from beginning"
          aria-label="Restart Love Story"
        >
          <RotateCcw size={13} />
          <span>Restart</span>
        </button>
      </div>

      <div className="progress-track" role="progressbar" aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </header>
  );
}
