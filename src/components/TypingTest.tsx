
import React, { useEffect } from 'react';

interface TypingTestProps {
  words: string[];
  typed: string;
  cursor: number;
  start: boolean;
  setStart: (start: boolean) => void;
  time: number;
  setTime: (time: number) => void;
  wordCount: number;
  errors: number;
  newTest: () => void;
  resetKeys: () => void;
  clearTyped: () => void;
  showConfetti: boolean;
  theme: string;
  getButtonColor: () => string;
}

export const TypingTest: React.FC<TypingTestProps> = ({
  words,
  typed,
  cursor,
  start,
  setStart,
  time,
  setTime,
  wordCount,
  errors,
  newTest,
  resetKeys,
  clearTyped,
  showConfetti,
  theme,
  getButtonColor
}) => {
  const testText = words.join(' ');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!start && e.key !== 'Enter') {
        setStart(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [start, setStart]);

  const renderText = () => {
    return testText.split('').map((char, index) => {
      let className = '';
      if (index < typed.length) {
        className = typed[index] === char ? 'correct' : 'incorrect';
      } else if (index === cursor) {
        className = 'cursor';
      }
      
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '1040px',
      margin: '3rem auto 2rem auto',
      padding: '1.5rem',
      background: theme === 'cotton-candy-glow' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      position: 'relative'
    }}>
      {showConfetti && (
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          pointerEvents: 'none',
          background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
          animation: 'confetti 3s ease-out'
        }} />
      )}
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        color: 'white'
      }}>
        <div>Time: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</div>
        <div>WPM: {Math.round((wordCount / Math.max((60 - time) / 60, 1/60)))}</div>
        <div>Errors: {errors}</div>
      </div>

      <div style={{
        color: 'white',
        fontSize: '1.2rem',
        lineHeight: '1.6',
        fontFamily: 'monospace',
        minHeight: '120px',
        padding: '20px',
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        {renderText()}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={() => {
            newTest();
            resetKeys();
            clearTyped();
            setTime(60);
            setStart(false);
          }}
          style={{
            padding: '12px 24px',
            background: getButtonColor(),
            border: 'none',
            borderRadius: '6px',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer',
            opacity: 0.7
          }}
        >
          New Test
        </button>
      </div>

      <style>{`
        .correct { color: #4ade80; }
        .incorrect { color: #ef4444; background: rgba(239, 68, 68, 0.2); }
        .cursor { 
          background: rgba(255, 255, 255, 0.8); 
          color: #000;
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes confetti {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
