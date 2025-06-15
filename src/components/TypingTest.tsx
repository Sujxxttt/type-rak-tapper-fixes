
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
      const textFlowElement = document.getElementById('text-flow');
      
      if (currentChar && textFlowElement) {
        // Calculate position for smooth horizontal scrolling
        const charLeft = currentChar.offsetLeft;
        const containerWidth = textFlowElement.clientWidth;
        const scrollLeft = Math.max(0, charLeft - containerWidth / 2);
        
        textFlowElement.scrollTo({
          left: scrollLeft,
          behavior: 'auto'
        });
      }
    }
  }, [pos, chars]);

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
      margin: '4rem auto 2rem auto',
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
          msOverflowStyle: 'none'
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
