
import React, { useState, useRef, useEffect } from 'react';

interface TypingTextProps {
  originalText: string;
  typedText: string;
  onTextChange: (text: string) => void;
  theme: string;
}

export const TypingText: React.FC<TypingTextProps> = ({
  originalText,
  typedText,
  onTextChange,
  theme
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(e.target.value);
  };

  const getTextColor = () => {
    return theme === 'cotton-candy-glow' ? '#333' : 'white';
  };

  const renderText = () => {
    return originalText.split('').map((char, index) => {
      let className = '';
      let style: React.CSSProperties = {};
      
      if (index < typedText.length) {
        if (typedText[index] === char) {
          style.color = '#22c55e'; // Green for correct
        } else {
          style.color = '#ef4444'; // Red for incorrect
          style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
        }
      } else if (index === typedText.length) {
        style.backgroundColor = '#3b82f6'; // Blue cursor
      }
      
      return (
        <span key={index} style={style}>
          {char}
        </span>
      );
    });
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        fontSize: '1.2rem',
        lineHeight: '1.6',
        fontFamily: 'monospace',
        color: getTextColor()
      }}>
        {renderText()}
      </div>
      <textarea
        ref={inputRef}
        value={typedText}
        onChange={handleChange}
        style={{
          width: '100%',
          minHeight: '100px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          padding: '15px',
          color: getTextColor(),
          fontSize: '1rem',
          resize: 'vertical'
        }}
        placeholder="Start typing..."
      />
    </div>
  );
};
