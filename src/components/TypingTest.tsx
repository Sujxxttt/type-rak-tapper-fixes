import React, { useEffect } from 'react';

interface TypingTestProps {
  duration: number;
  theme: string;
  fontSize: number;
  fontStyle: string;
  soundEnabled: boolean;
  onTestComplete: (wpm: number, accuracy: number) => void;
}

export const TypingTest: React.FC<TypingTestProps> = ({
  duration,
  theme,
  fontSize,
  fontStyle,
  soundEnabled,
  onTestComplete
}) => {
  const getFontFamily = () => {
    switch (fontStyle) {
      case 'roboto': return "'Roboto', sans-serif";
      case 'open-sans': return "'Open Sans', sans-serif";
      case 'lato': return "'Lato', sans-serif";
      case 'source-sans-pro': return "'Source Sans Pro', sans-serif";
      case 'inter': return "'Inter', sans-serif";
      case 'dancing-script': return "'Dancing Script', cursive";
      case 'pacifico': return "'Pacifico', cursive";
      default: return "'Inter', sans-serif";
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '1040px',
      height: '120px',
      margin: '3rem auto 2rem auto',
      padding: '1.5rem',
      background: theme === 'cotton-candy-glow' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      position: 'relative',
      fontSize: `${fontSize}%`,
      fontFamily: getFontFamily(),
      lineHeight: '1.4',
      letterSpacing: '0.02em',
      overflow: 'hidden'
    }}>
      <div
        id="text-flow"
        style={{
          color: 'white',
          outline: 'none',
          fontSize: 'inherit',
          fontFamily: 'inherit',
          lineHeight: 'inherit',
          letterSpacing: 'inherit',
          userSelect: 'none',
          cursor: 'text',
          height: '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollBehavior: 'smooth',
        }}
        tabIndex={0}
      />
      
      <style>{`
        #text-flow::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
