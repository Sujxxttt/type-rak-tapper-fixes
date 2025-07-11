
import React from 'react';

interface TypedTextPreviewProps {
  originalText: string;
  userInput: string;
  theme: string;
}

export const TypedTextPreview: React.FC<TypedTextPreviewProps> = ({
  originalText,
  userInput,
  theme
}) => {
  const getThemeColors = () => {
    switch (theme) {
      case 'midnight-black':
        return {
          correct: '#10b981',
          incorrect: '#ef4444',
          pending: 'rgba(255, 255, 255, 0.5)'
        };
      case 'cotton-candy-glow':
        return {
          correct: '#10b981',
          incorrect: '#ef4444',
          pending: 'rgba(255, 255, 255, 0.5)'
        };
      case 'cosmic-nebula':
      default:
        return {
          correct: '#10b981',
          incorrect: '#ef4444',
          pending: 'rgba(255, 255, 255, 0.5)'
        };
    }
  };

  const colors = getThemeColors();

  const renderPreview = () => {
    return originalText.split('').map((char, index) => {
      let color = colors.pending;
      
      if (index < userInput.length) {
        if (userInput[index] === char) {
          color = colors.correct;
        } else {
          color = colors.incorrect;
        }
      }

      return (
        <span
          key={index}
          style={{ color }}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '15px',
      padding: '1.5rem',
      marginTop: '1rem',
      fontSize: '0.9rem',
      lineHeight: '1.6',
      fontFamily: 'monospace',
      maxHeight: '200px',
      overflowY: 'auto',
      color: 'white'
    }}>
      <h4 style={{ 
        margin: '0 0 1rem 0', 
        color: 'white',
        fontSize: '1rem',
        opacity: 0.8
      }}>
        Your Typed Text:
      </h4>
      <div>
        {renderPreview()}
      </div>
    </div>
  );
};
