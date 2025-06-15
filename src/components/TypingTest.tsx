
import React, { useEffect } from 'react';

interface TypingTestProps {
  testText: string;
  pos: number;
  chars: HTMLElement[];
  theme: string;
  onKeyDown: (e: KeyboardEvent) => void;
  fontSize: number;
  fontStyle: string;
}

export const TypingTest: React.FC<TypingTestProps> = ({
  testText,
  pos,
  chars,
  theme,
  onKeyDown,
  fontSize,
  fontStyle
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      onKeyDown(e);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onKeyDown]);

  useEffect(() => {
    if (chars.length > 0 && pos < chars.length) {
      const currentChar = chars[pos];
      if (currentChar) {
        currentChar.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
    }
  }, [pos, chars]);

  const getFontFamily = () => {
    switch (fontStyle) {
      case 'roboto': return "'Roboto', sans-serif";
      case 'open-sans': return "'Open Sans', sans-serif";
      case 'lato': return "'Lato', sans-serif";
      case 'source-sans': return "'Source Sans Pro', sans-serif";
      case 'inter': return "'Inter', sans-serif";
      case 'dancing-script': return "'Dancing Script', cursive";
      case 'pacifico': return "'Pacifico', cursive";
      default: return "'Inter', sans-serif";
    }
  };

  if (!testText) {
    return (
      <div style={{
        width: '90%',
        maxWidth: '1000px',
        margin: '2rem auto',
        padding: '2rem',
        background: theme === 'cotton-candy-glow' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        textAlign: 'center',
        color: theme === 'cotton-candy-glow' ? '#333' : 'white'
      }}>
        Loading text...
      </div>
    );
  }

  return (
    <div style={{
      width: '90%',
      maxWidth: '1000px',
      margin: '2rem auto',
      padding: '2rem',
      background: theme === 'cotton-candy-glow' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      // Removed box-shadow
      position: 'relative',
      fontSize: `${fontSize}%`,
      fontFamily: getFontFamily(),
      lineHeight: '1.6',
      letterSpacing: '0.02em'
    }}>
      <div
        id="text-flow"
        style={{
          color: theme === 'cotton-candy-glow' ? '#333' : 'white',
          outline: 'none',
          fontSize: 'inherit',
          fontFamily: 'inherit',
          lineHeight: 'inherit',
          letterSpacing: 'inherit',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          userSelect: 'none',
          cursor: 'text'
        }}
        tabIndex={0}
      />
      
      {pos < chars.length && (
        <div
          style={{
            position: 'absolute',
            width: '2px',
            height: '1.5em',
            backgroundColor: theme === 'cotton-candy-glow' ? '#ff1fbc' : '#21b1ff',
            animation: 'blinkCaret 1s infinite',
            zIndex: 10,
            pointerEvents: 'none',
            transform: 'translateY(-10%)'
          }}
          id="typing-cursor"
        />
      )}
    </div>
  );
};
