
import React from 'react';
import { X } from 'lucide-react';

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
  onClose,
}) => {
  const getCorrectColor = () => {
    switch (theme) {
      case 'midnight-black':
        return '#ae1ee3';
      case 'cotton-candy-glow':
        return '#ff1fbc';
      case 'cosmic-nebula':
      default:
        return '#21b1ff';
    }
  };

  const getErrorColor = () => {
    return '#ff1c14'; // Red for all themes
  };

  const renderTypedText = () => {
    const result = [];
    const textToRender = typedText;

    for (let i = 0; i < textToRender.length; i++) {
      const typedChar = textToRender[i];
      const originalChar = originalText[i];
      
      if (typedChar === originalChar) {
        result.push(
          <span key={i} style={{ color: getCorrectColor() }}>
            {typedChar === ' ' ? '\u00A0' : typedChar}
          </span>
        );
      } else {
        result.push(
          <span key={i} style={{ color: getErrorColor(), backgroundColor: 'rgba(255, 28, 20, 0.3)', borderRadius: '2px', padding: '0 1px' }}>
            {typedChar === ' ' ? '\u00A0' : originalChar === ' ' ? '\u00A0' : typedChar}
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
      background: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1040px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '20px',
        color: theme === 'cotton-candy-glow' ? '#333' : 'white'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            color: theme === 'cotton-candy-glow' ? '#333' : 'white',
            cursor: 'pointer'
          }}
        >
          <X size={24} />
        </button>

        <h3 style={{ margin: '0 0 20px 0' }}>Typed Text Preview</h3>
        
        <div style={{
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
          padding: '15px',
          fontSize: '1.1rem',
          lineHeight: '1.6',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          {renderTypedText()}
        </div>
        
        <div style={{
          marginTop: '15px',
          fontSize: '0.9rem',
          color: theme === 'cotton-candy-glow' ? 'rgba(51, 51, 51, 0.7)' : 'rgba(255, 255, 255, 0.7)'
        }}>
          <div style={{ marginBottom: '5px' }}>
            <span style={{ color: getCorrectColor() }}>■</span> Correctly typed
          </div>
          <div>
            <span style={{ color: getErrorColor() }}>■</span> Incorrectly typed
          </div>
        </div>
      </div>
    </div>
  );
};
