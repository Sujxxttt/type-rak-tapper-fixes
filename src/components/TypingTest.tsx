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
    if (pos === 0) {
      const tf = document.getElementById('text-flow');
      if (tf) tf.scrollLeft = 0;
    }

    if (chars.length > 0 && pos < chars.length) {
      const currentChar = chars[pos];
      const textFlowElement = document.getElementById('text-flow');
      const caret = document.getElementById('caret-marker');

      if (currentChar && textFlowElement) {
        const containerWidth = textFlowElement.clientWidth;
        const charRect = currentChar.getBoundingClientRect();
        const containerRect = textFlowElement.getBoundingClientRect();
        const charLeftInContainer = charRect.left - containerRect.left;

        // Position caret under current character
        if (caret) {
          const caretX = Math.max(0, charLeftInContainer);
          (caret as HTMLDivElement).style.transform = `translateX(${caretX}px)`;
        }

        // Simple, non-smooth scrolling - just move to keep char visible
        if (charLeftInContainer < 50) {
          // Character is too far left, scroll left
          textFlowElement.scrollLeft = Math.max(0, textFlowElement.scrollLeft - 100);
        } else if (charLeftInContainer > containerWidth - 50) {
          // Character is too far right, scroll right
          textFlowElement.scrollLeft = textFlowElement.scrollLeft + 100;
        }
      }
    }
  }, [pos, chars]);

  const getFontFamily = () => {
    switch (fontStyle) {
      case 'work-sans': return "'Work Sans', sans-serif";
      case 'outfit': return "'Outfit', sans-serif";
      case 'libre-baskerville': return "'Libre Baskerville', serif";
      case 'sniglet': return "'Sniglet', cursive";
      case 'codystar': return "'Codystar', cursive";
      case 'pacifico': return "'Pacifico', cursive";
      case 'simple-day': return "'Simple Day', cursive";
      default: return "'Work Sans', sans-serif";
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '1040px',
      height: '148px',
      margin: '3rem auto 2rem auto', // Changed from 4rem to 3rem to move up by 1cm
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
      <div
        id="caret-marker"
        style={{
          position: 'absolute',
          bottom: '8px',
          left: 0,
          transform: 'translateX(0px)',
          color: 'rgba(255,255,255,0.45)',
          fontWeight: 800,
          fontSize: '1.3em',
          letterSpacing: 0,
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      >-</div>
      
      <style>{`
        #text-flow::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
