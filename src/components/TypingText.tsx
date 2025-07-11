
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

  const renderText = () => {
    return originalText.split('').map((char, index) => {
      let className = '';
      if (index < typedText.length) {
        className = typedText[index] === char ? 'text-green-500' : 'text-red-500 bg-red-200';
      } else if (index === typedText.length) {
        className = 'bg-blue-500';
      }
      
      return (
        <span key={index} className={className}>
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
        fontFamily: 'monospace'
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
          color: 'white',
          fontSize: '1rem',
          resize: 'vertical'
        }}
        placeholder="Start typing..."
      />
    </div>
  );
};
