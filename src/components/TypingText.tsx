
import React, { useState, useEffect, useRef } from 'react';

interface TypingTextProps {
  text: string;
  typedText: string;
  onTypedTextChange: (text: string) => void;
  onTestStart: () => void;
  theme: string;
  testActive: boolean;
  showResults: boolean;
  wpm: number;
  errorRate: number;
  timeLeft: number;
  onRestart: () => void;
  onShowTypedText: () => void;
}

export const TypingText: React.FC<TypingTextProps> = ({
  text,
  typedText,
  onTypedTextChange,
  onTestStart,
  theme,
  testActive,
  showResults,
  wpm,
  errorRate,
  timeLeft,
  onRestart,
  onShowTypedText
}) => {
  const [currentPos, setCurrentPos] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (!testActive && !showResults) {
      onTestStart();
    }
    
    if (e.key === 'Backspace') {
      const newText = typedText.slice(0, -1);
      onTypedTextChange(newText);
      setCurrentPos(Math.max(0, currentPos - 1));
    } else if (e.key.length === 1) {
      const newText = typedText + e.key;
      onTypedTextChange(newText);
      setCurrentPos(currentPos + 1);
    }
  };

  const getCharacterClass = (index: number) => {
    if (index < typedText.length) {
      return typedText[index] === text[index] ? 'text-green-400' : 'text-red-400 bg-red-400/20';
    }
    if (index === currentPos) {
      return 'bg-blue-400/30';
    }
    return 'text-gray-400';
  };

  const getButtonColor = () => {
    switch (theme) {
      case 'midnight-black': return '#c559f7';
      case 'cotton-candy-glow': return '#ff59e8';
      case 'cosmic-nebula':
      default: return '#b109d6';
    }
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '16px',
      padding: '30px',
      marginBottom: '30px'
    }}>
      {!showResults ? (
        <>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div style={{ color: 'white', fontSize: '1.2rem' }}>
              Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
            {testActive && (
              <div style={{ color: 'white', fontSize: '1.2rem' }}>
                WPM: {Math.round((typedText.split(' ').length / ((300 - timeLeft) / 60)) || 0)}
              </div>
            )}
          </div>
          
          <div style={{
            fontSize: '1.5rem',
            lineHeight: '2',
            marginBottom: '20px',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap'
          }}>
            {text.split('').map((char, index) => (
              <span key={index} className={getCharacterClass(index)}>
                {char}
              </span>
            ))}
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={typedText}
            onChange={() => {}} // Controlled by keypress
            onKeyDown={handleKeyPress}
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '1.2rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              color: 'white',
              outline: 'none'
            }}
            placeholder="Start typing..."
            disabled={showResults}
          />
        </>
      ) : (
        <div style={{ textAlign: 'center', color: 'white' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Test Complete!</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: getButtonColor() }}>{wpm}</div>
              <div>WPM</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: getButtonColor() }}>{errorRate.toFixed(1)}%</div>
              <div>Error Rate</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button
              onClick={onRestart}
              style={{
                background: getButtonColor(),
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Try Again
            </button>
            <button
              onClick={onShowTypedText}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              View Typed Text
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
