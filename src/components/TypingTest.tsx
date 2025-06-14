
import React, { useRef, useEffect, useState } from 'react';

interface TypingTestProps {
  testText: string;
  pos: number;
  chars: HTMLElement[];
  theme: string;
  onKeyDown: (e: KeyboardEvent) => void;
  fontSize: number;
  fontStyle: string;
  extraChars: string[];
}

export const TypingTest: React.FC<TypingTestProps> = ({
  testText,
  pos,
  chars,
  theme,
  onKeyDown,
  fontSize,
  fontStyle,
  extraChars
}) => {
  const textFlowRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      onKeyDown(e);
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onKeyDown]);

  useEffect(() => {
    adjustCaretPosition();
  }, [pos, chars, fontSize, extraChars]);

  const adjustCaretPosition = () => {
    if (!caretRef.current || !chars || chars.length === 0 || !textFlowRef.current || !containerRef.current) {
      return;
    }
    
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.width / 2;
    
    // Calculate position based on current position and extra characters
    const currentIndex = pos + extraChars.length;
    
    if (pos < testText.length) {
      const currentChar = chars[pos];
      if (!currentChar) return;
      
      const charRect = currentChar.getBoundingClientRect();
      
      // Calculate offset to keep current character in center
      const charLeft = charRect.left - containerRect.left;
      const offset = containerCenter - charLeft - (charRect.width / 2);
      
      // Apply smooth transform
      textFlowRef.current.style.transform = `translateX(${offset}px)`;
      textFlowRef.current.style.transition = 'transform 0.2s ease-out';
      
      // Position caret below the current character
      caretRef.current.style.left = `${containerCenter}px`;
      caretRef.current.style.top = `${charRect.bottom - containerRect.top + 4}px`;
      caretRef.current.style.display = 'block';
    } else {
      caretRef.current.style.display = 'none';
    }
  };

  const getCaretColor = () => {
    switch (theme) {
      case 'midnight-black':
        return 'linear-gradient(90deg, #e559f7 0%, #9f59f7 100%)';
      case 'cotton-candy-glow':
        return 'linear-gradient(90deg, #ff59e8 0%, #ff52a8 100%)';
      default:
        return 'linear-gradient(90deg, #e454f0 0%, #9d54f0 100%)';
    }
  };

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

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        width: '95%',
        maxWidth: '1400px',
        background: theme === 'cotton-candy-glow' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
        borderRadius: '16px',
        overflow: 'hidden',
        marginBottom: '3rem',
        marginTop: '4rem',
        padding: '3rem',
        minHeight: '180px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div style={{
        position: 'relative',
        fontSize: `${fontSize}%`,
        lineHeight: '1.6',
        letterSpacing: '0.02em',
        width: '100%',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        fontFamily: getFontFamily()
      }}>
        <div 
          ref={textFlowRef} 
          id="text-flow"
          style={{ 
            display: 'inline-block',
            color: theme === 'cotton-candy-glow' ? '#333' : '#fff',
            fontWeight: '500',
            userSelect: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          {/* Text will be rendered here by useTypingGame hook */}
          {extraChars.length > 0 && (
            <span style={{ color: '#ff4444', backgroundColor: 'rgba(255, 68, 68, 0.2)' }}>
              {extraChars.join('')}
            </span>
          )}
        </div>
      </div>
      <div 
        ref={caretRef}
        style={{
          position: 'absolute',
          height: '3px',
          width: `${Math.max(20, fontSize / 4)}px`,
          background: getCaretColor(),
          zIndex: 10,
          borderRadius: '2px',
          boxShadow: '0 0 8px rgba(0,0,0,0.3)',
          display: 'none'
        }}
      />
    </div>
  );
};
