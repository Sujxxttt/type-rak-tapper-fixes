
import React, { useRef, useEffect, useState } from 'react';

interface TypingTestProps {
  testText: string;
  pos: number;
  chars: HTMLElement[];
  theme: string;
  onKeyDown: (e: KeyboardEvent) => void;
  fontSize: number;
}

export const TypingTest: React.FC<TypingTestProps> = ({
  testText,
  pos,
  chars,
  theme,
  onKeyDown,
  fontSize
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
      
      // Apply offset to text flow
      textFlowRef.current.style.transform = `translateX(${offset}px)`;
      
      // Position caret directly below the current character
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
        return 'linear-gradient(90deg, #c559f7 0%, #7f59f7 100%)';
      case 'cotton-candy-glow':
        return 'linear-gradient(90deg, #ff59e8 0%, #ff52a8 100%)';
      default:
        return 'linear-gradient(90deg, #c454f0 0%, #7d54f0 100%)';
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
        lineHeight: '1.6',
        letterSpacing: '0.02em',
        width: '100%',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        overflow: 'hidden'
      }}>
        <div 
          ref={textFlowRef} 
          id="text-flow"
          style={{ 
            display: 'inline-block',
            transition: 'transform 0.2s ease-out',
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
          height: '4px',
          width: `${Math.max(20, fontSize / 5)}px`,
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
