import React, { useRef, useEffect, useState } from 'react';

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
  const textFlowRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  useEffect(() => {
    adjustCaretPosition();
  }, [pos, chars, fontSize]);

  const adjustCaretPosition = () => {
    if (!caretRef.current || !chars || chars.length === 0 || !textFlowRef.current || !containerRef.current) return;
    
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.width / 2;
    
    if (pos < chars.length) {
      const currentChar = chars[pos];
      const charRect = currentChar.getBoundingClientRect();
      
      // Calculate offset to keep current character in center
      const charLeft = charRect.left - containerRect.left;
      const offset = containerCenter - charLeft - (charRect.width / 2);
      
      // Apply offset to text flow with smooth transition
      textFlowRef.current.style.transform = `translateX(${offset}px)`;
      
      // Position caret directly below the current character
      caretRef.current.style.left = `${containerCenter}px`;
      caretRef.current.style.top = `${charRect.bottom - containerRect.top + 2}px`;
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
        marginBottom: '5rem',
        marginTop: '6rem',
        padding: '4rem',
        minHeight: '220px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div style={{
        position: 'relative',
        fontSize: `${fontSize}%`,
        lineHeight: '1.8',
        letterSpacing: '0.05em',
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
            transition: 'transform 0.3s ease-out',
            color: theme === 'cotton-candy-glow' ? '#333' : '#fff',
            fontWeight: '500',
            userSelect: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          {/* Text will be rendered here by useTypingGame hook */}
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
