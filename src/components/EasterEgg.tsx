
import React from 'react';

interface EasterEggProps {
  onBack: () => void;
  theme: string;
  getButtonColor: () => string;
}

const EasterEgg: React.FC<EasterEggProps> = ({ onBack, theme, getButtonColor }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 text-center max-w-md">
        <h2 className="text-4xl font-bold text-white mb-6">🎉 Easter Egg!</h2>
        <p className="text-white/80 mb-8">
          Congratulations! You found the hidden easter egg. You're quite the explorer!
        </p>
        <button
          onClick={onBack}
          style={{ backgroundColor: getButtonColor() }}
          className="px-6 py-3 rounded-lg text-white font-semibold hover:opacity-80 transition-opacity"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default EasterEgg;
