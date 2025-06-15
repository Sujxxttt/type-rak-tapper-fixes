
import React from 'react';

interface TypedTextPreviewProps {
  typedText: string;
  originalText: string;
  theme: string;
}

export const TypedTextPreview: React.FC<TypedTextPreviewProps> = ({
  typedText,
  originalText,
  theme,
}) => {
  const renderTypedText = () => {
    const result = [];
    
    for (let i = 0; i < typedText.length; i++) {
      const typedChar = typedText[i];
      const originalChar = originalText[i];
      
      if (typedChar === originalChar) {
        // Correct character
        result.push(
          <span key={i} style={{ color: theme === 'midnight-black' ? '#ae1ee3' : theme === 'cotton-candy-glow' ? '#ff1fbc' : '#21b1ff' }}>
            {typedChar === ' ' ? '\u00A0' : typedChar}
          </span>
        );
      } else {
        // Incorrect character
        result.push(
          <span key={i} style={{ color: '#ff1c14', backgroundColor: 'rgba(255, 28, 20, 0.3)', borderRadius: '2px', padding: '0 1px' }}>
            {typedChar === ' ' ? '\u00A0' : typedChar}
          </span>
        );
      }
    }
    
    return result;
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '1040px',
      margin: '0 auto',
      background: theme === 'cotton-candy-glow' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '20px',
      overflowY: 'auto'
    }}>
      <h3 style={{ 
        color: 'white',
        margin: '0 0 20px 0' 
      }}>
        Typed Text Preview
      </h3>
      
      <div style={{
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
        padding: '15px',
        fontSize: '1.1rem',
        lineHeight: '1.6',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}>
        {renderTypedText()}
      </div>
      
      <div style={{
        marginTop: '15px',
        fontSize: '0.9rem',
        color: 'rgba(255, 255, 255, 0.7)'
      }}>
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: theme === 'midnight-black' ? '#ae1ee3' : theme === 'cotton-candy-glow' ? '#ff1fbc' : '#21b1ff' }}>■</span> Correctly typed
        </div>
        <div>
          <span style={{ color: '#ff1c14' }}>■</span> Incorrectly typed
        </div>
      </div>
    </div>
  );
};
