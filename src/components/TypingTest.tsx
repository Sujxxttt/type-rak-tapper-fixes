
import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, User } from 'lucide-react';
import { TypedTextPreview } from './TypedTextPreview';

interface TypingTestProps {
  gameState: 'waiting' | 'active' | 'finished';
  currentText: string;
  userInput: string;
  timeLeft: number;
  wpm: number;
  errorRate: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  isActive: boolean;
  onStart: () => void;
  onReset: () => void;
  onInput: (input: string) => void;
  theme: string;
  username: string;
  onUsernameChange: (username: string) => void;
  getButtonColor: () => string;
}

export const TypingTest: React.FC<TypingTestProps> = ({
  gameState,
  currentText,
  userInput,
  timeLeft,
  wpm,
  errorRate,
  correctChars,
  incorrectChars,
  totalChars,
  isActive,
  onStart,
  onReset,
  onInput,
  theme,
  username,
  onUsernameChange,
  getButtonColor
}) => {
  const [showUsernameInput, setShowUsernameInput] = useState(!username);
  const [tempUsername, setTempUsername] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (gameState === 'active' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUsername.trim()) {
      onUsernameChange(tempUsername.trim());
      setShowUsernameInput(false);
    }
  };

  const getThemeColors = () => {
    switch (theme) {
      case 'midnight-black':
        return {
          primary: '#c559f7',
          correct: '#10b981',
          incorrect: '#ef4444',
          pending: 'rgba(255, 255, 255, 0.5)'
        };
      case 'cotton-candy-glow':
        return {
          primary: '#ff59e8',
          correct: '#10b981',
          incorrect: '#ef4444',
          pending: 'rgba(255, 255, 255, 0.5)'
        };
      case 'cosmic-nebula':
      default:
        return {
          primary: '#b109d6',
          correct: '#10b981',
          incorrect: '#ef4444',
          pending: 'rgba(255, 255, 255, 0.5)'
        };
    }
  };

  const colors = getThemeColors();

  const renderText = () => {
    return currentText.split('').map((char, index) => {
      let className = '';
      let color = colors.pending;
      
      if (index < userInput.length) {
        if (userInput[index] === char) {
          color = colors.correct;
        } else {
          color = colors.incorrect;
        }
      } else if (index === userInput.length) {
        className = 'cursor';
      }

      return (
        <span
          key={index}
          className={className}
          style={{ 
            color: color,
            backgroundColor: index === userInput.length ? 'rgba(255, 255, 255, 0.3)' : 'transparent'
          }}
        >
          {char}
        </span>
      );
    });
  };

  if (showUsernameInput || !username) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          padding: '2rem',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%'
        }}>
          <User size={48} style={{ color: colors.primary, margin: '0 auto 1rem' }} />
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>Enter Your Username</h2>
          <form onSubmit={handleUsernameSubmit}>
            <input
              type="text"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              placeholder="Username"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '1rem',
                marginBottom: '1rem',
                backdropFilter: 'blur(10px)'
              }}
              autoFocus
            />
            <button
              type="submit"
              style={{
                background: colors.primary,
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              Start Typing
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2rem',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      {/* Timer and Stats */}
      {gameState === 'active' && (
        <div style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '15px',
            padding: '1rem 1.5rem',
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            Time: {timeLeft}s
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '15px',
            padding: '1rem 1.5rem',
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            WPM: {wpm}
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '15px',
            padding: '1rem 1.5rem',
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            Error: {errorRate.toFixed(1)}%
          </div>
        </div>
      )}

      {/* Text Display */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '20px',
        padding: '2rem',
        fontSize: '1.2rem',
        lineHeight: '1.8',
        maxWidth: '800px',
        width: '100%',
        minHeight: '150px',
        fontFamily: 'monospace',
        color: 'white'
      }}>
        {renderText()}
      </div>

      {/* Input Area */}
      {gameState === 'active' && (
        <textarea
          ref={inputRef}
          value={userInput}
          onChange={(e) => onInput(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '800px',
            height: '120px',
            padding: '1rem',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            fontSize: '1rem',
            lineHeight: '1.6',
            fontFamily: 'monospace',
            resize: 'none',
            backdropFilter: 'blur(10px)'
          }}
          placeholder="Start typing here..."
          autoFocus
        />
      )}

      {/* Control Buttons */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {gameState === 'waiting' && (
          <button
            onClick={onStart}
            style={{
              background: colors.primary,
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Play size={20} />
            Start Test
          </button>
        )}
        
        <button
          onClick={onReset}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '12px 24px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backdropFilter: 'blur(10px)'
          }}
        >
          <RotateCcw size={20} />
          Reset
        </button>
      </div>

      {/* Results */}
      {gameState === 'finished' && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          padding: '2rem',
          textAlign: 'center',
          maxWidth: '600px',
          width: '100%',
          color: 'white'
        }}>
          <h2 style={{ color: colors.primary, marginBottom: '1rem' }}>Test Complete!</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.primary }}>{wpm}</div>
              <div style={{ opacity: 0.8 }}>WPM</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.primary }}>{errorRate.toFixed(1)}%</div>
              <div style={{ opacity: 0.8 }}>Error Rate</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.primary }}>{correctChars}</div>
              <div style={{ opacity: 0.8 }}>Correct</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.primary }}>{incorrectChars}</div>
              <div style={{ opacity: 0.8 }}>Incorrect</div>
            </div>
          </div>

          <TypedTextPreview
            originalText={currentText}
            userInput={userInput}
            theme={theme}
          />
        </div>
      )}

      <style>{`
        .cursor {
          animation: blink 1s infinite;
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};
