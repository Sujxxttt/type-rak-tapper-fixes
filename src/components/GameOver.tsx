
import React from 'react';

interface GameOverProps {
  wpm: number;
  accuracy: number;
  timeLeft: number;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ wpm, accuracy, timeLeft, onRestart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">Test Complete!</h2>
        
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">{wpm}</div>
            <div className="text-white/70">WPM</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">{accuracy.toFixed(1)}%</div>
            <div className="text-white/70">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">{timeLeft}s</div>
            <div className="text-white/70">Time Left</div>
          </div>
        </div>
        
        <button
          onClick={onRestart}
          className="px-8 py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default GameOver;
