
import React, { useEffect } from 'react';

interface TypingTestProps {
  testText: string;
  pos: number;
  chars: HTMLElement[];
  theme: string;
  onKeyDown: (e: KeyboardEvent) => void;
  fontSize: number;
  fontStyle: string;
  textFlowRef: React.RefObject<HTMLDivElement>; // NEW PROP
}

export const TypingTest: React.FC<TypingTestProps> = ({
  testText,
  pos,
  chars,
  theme,
  onKeyDown,
  fontSize,
  fontStyle,
  textFlowRef
}) => {
  // Remove local scrollRef; use textFlowRef everywhere it was used.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      onKeyDown(e);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onKeyDown]);

  // Scroll current character into view (horizontal only)
  useEffect(() => {
    if (!textFlowRef.current) return;
    if (chars.length > 0 && pos < chars.length) {
      const currentChar = chars[pos];
      if (currentChar) {
        const container = textFlowRef.current;
        const offsetLeft = currentChar.offsetLeft;
        container.scrollTo({
          left: Math.max(offsetLeft - 20, 0),
          behavior: 'smooth',
        });
      }
    }
  }, [pos, chars, textFlowRef]);

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
      position: 'relative',
      fontSize: `${fontSize}%`,
      fontFamily: getFontFamily(),
      lineHeight: '1.6',
      letterSpacing: '0.02em'
    }}>
      <div
        id="text-flow"
        ref={textFlowRef} // USE THE EXTERNAL REF!
        style={{
          display: 'flex',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          color: theme === 'cotton-candy-glow' ? '#333' : 'white',
          outline: 'none',
          fontSize: 'inherit',
          fontFamily: 'inherit',
          lineHeight: 'inherit',
          letterSpacing: 'inherit',
          userSelect: 'none',
          cursor: 'text',
          width: '100%',
          alignItems: 'center',
          scrollbarWidth: 'none',
        }}
        tabIndex={0}
        className="no-scrollbar"
      />
      {pos < chars.length && (
        <div
          style={{
            position: 'absolute',
            height: '1.5em',
            width: '2px',
            backgroundColor: theme === 'cotton-candy-glow' ? '#ff1fbc' : '#21b1ff',
            animation: 'blinkCaret 1s infinite',
            zIndex: 10,
            pointerEvents: 'none',
            left: (() => {
              if (chars[pos] && chars[pos].offsetLeft !== undefined) {
                return chars[pos].offsetLeft - (textFlowRef.current?.scrollLeft ?? 0);
              }
              return '0px';
            })(),
            top: '50%',
            transform: 'translateY(-50%)'
          }}
          id="typing-cursor"
        />
      )}
    </div>
  );
};
