
import React from 'react';

interface TypingAreaProps {
  text: string;
  userInput: string;
  currentIndex: number;
  wpm: number;
  accuracy: number;
  timeLeft: number;
  handleInputChange: (value: string) => void;
  handleKeyPress: (event: React.KeyboardEvent) => void;
}

const TypingArea: React.FC<TypingAreaProps> = ({
  text,
  userInput,
  currentIndex,
  wpm,
  accuracy,
  timeLeft,
  handleInputChange,
  handleKeyPress
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div className="text-white text-xl">WPM: {wpm}</div>
          <div className="text-white text-xl">Accuracy: {accuracy.toFixed(1)}%</div>
          <div className="text-white text-xl">Time: {timeLeft}s</div>
        </div>
        
        <div className="text-2xl leading-relaxed mb-8 p-6 rounded-lg bg-white/10 backdrop-blur-md">
          {text.split('').map((char, index) => (
            <span
              key={index}
              className={`${
                index < currentIndex
                  ? userInput[index] === char
                    ? 'text-green-400'
                    : 'text-red-400 bg-red-400/20'
                  : index === currentIndex
                  ? 'bg-white/30'
                  : 'text-white/70'
              }`}
            >
              {char}
            </span>
          ))}
        </div>
        
        <textarea
          value={userInput}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full p-4 text-xl bg-white/10 backdrop-blur-md rounded-lg text-white resize-none outline-none"
          placeholder="Start typing..."
          rows={4}
        />
      </div>
    </div>
  );
};

export default TypingArea;
