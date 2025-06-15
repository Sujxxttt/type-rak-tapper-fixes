
import React from 'react';

interface TypedTextPreviewProps {
  typedText: string;
  originalText: string;
  theme: string;
  onClose: () => void;
}

export const TypedTextPreview: React.FC<TypedTextPreviewProps> = ({
  typedText,
  originalText,
  theme,
  onClose
}) => {
  const renderTypedText = () => {
    const result = [];
    const maxLength = Math.max(typedText.length, originalText.length);
    
    for (let i = 0; i < maxLength; i++) {
      const typedChar = typedText[i];
      const originalChar = originalText[i];
      
      if (typedChar === undefined && originalChar !== undefined) {
        // Character not typed yet
        result.push(
          <span key={i} style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
            {originalChar === ' ' ? '\u00A0' : originalChar}
          </span>
        );
      } else if (typedChar === originalChar) {
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
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '90%',
        maxWidth: '800px',
        maxHeight: '80vh',
        background: theme === 'cotton-candy-glow' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '20px',
        overflowY: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ 
            color: theme === 'cotton-candy-glow' ? '#333' : 'white',
            margin: 0 
          }}>
            Typed Text Preview
          </h3>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: theme === 'cotton-candy-glow' ? '#333' : 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '5px'
            }}
          >
            ×
          </button>
        </div>
        
        <div style={{
          background: theme === 'cotton-candy-glow' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.2)',
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
          color: theme === 'cotton-candy-glow' ? '#555' : 'rgba(255, 255, 255, 0.7)'
        }}>
          <div style={{ marginBottom: '5px' }}>
            <span style={{ color: theme === 'midnight-black' ? '#ae1ee3' : theme === 'cotton-candy-glow' ? '#ff1fbc' : '#21b1ff' }}>■</span> Correctly typed
          </div>
          <div style={{ marginBottom: '5px' }}>
            <span style={{ color: '#ff1c14' }}>■</span> Incorrectly typed
          </div>
          <div>
            <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>■</span> Not yet typed
          </div>
        </div>
      </div>
    </div>
  );
};
