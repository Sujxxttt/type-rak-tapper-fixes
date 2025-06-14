
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
    
    if (pos < testText.length) {
      const currentChar = chars[pos];
      if (!currentChar) return;
      
      const charRect = currentChar.getBoundingClientRect();
      
      // Calculate offset to keep current character centered
      const charLeft = charRect.left - containerRect.left;
      const offset = containerCenter - charLeft - (charRect.width / 2);
      
      // Apply transform to center the text
      textFlowRef.current.style.transform = `translateX(${offset}px)`;
      textFlowRef.current.style.transition = 'transform 0.1s ease-out';
      
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

  const getThemeColors = () => {
    switch (theme) {
      case 'midnight-black':
        return {
          untyped: '#888888',
          correct: '#22c55e',
          incorrect: '#f87171',
          background: 'rgba(0, 0, 0, 0.1)'
        };
      case 'cotton-candy-glow':
        return {
          untyped: '#666666',
          correct: '#059669',
          incorrect: '#dc2626',
          background: 'rgba(255, 255, 255, 0.2)'
        };
      default:
        return {
          untyped: '#CCCCCC',
          correct: '#4ade80',
          incorrect: '#ef4444',
          background: 'rgba(0, 0, 0, 0.1)'
        };
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
      case 'lobster': return "'Lobster', cursive";
      case 'sacramento': return "'Sacramento', cursive";
      default: return "'Inter', sans-serif";
    }
  };

  const colors = getThemeColors();

  useEffect(() => {
    // Apply CSS styles for character states
    const style = document.createElement('style');
    style.textContent = `
      .char {
        color: ${colors.untyped};
        transition: color 0.1s ease;
      }
      .char.correct {
        color: ${colors.correct} !important;
      }
      .char.incorrect {
        color: ${colors.incorrect} !important;
        background-color: rgba(255, 68, 68, 0.2);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [theme]);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        width: '95%',
        maxWidth: '1400px',
        background: colors.background,
        borderRadius: '16px',
        overflow: 'hidden',
        marginBottom: '1rem',
        marginTop: '4rem',
        padding: '3rem',
        minHeight: '180px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${theme === 'cotton-candy-glow' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'}`
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
            fontWeight: '500',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            position: 'relative'
          }}
        >
          {/* Text will be rendered here by useTypingGame hook */}
          <span 
            id="extra-chars"
            style={{ 
              color: colors.incorrect, 
              backgroundColor: 'rgba(255, 68, 68, 0.2)',
              borderRadius: '2px',
              padding: '0 1px'
            }}
          >
            {extraChars.join('')}
          </span>
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
