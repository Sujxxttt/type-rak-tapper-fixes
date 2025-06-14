
import React from 'react';
import { X } from 'lucide-react';

interface ResultsPageProps {
  wpm: number;
  accuracy: number;
  errors: number;
  score: number;
  onClose: () => void;
  theme: string;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  wpm,
  accuracy,
  errors,
  score,
  onClose,
  theme
}) => {
  const getThemeColors = () => {
    switch (theme) {
      case 'midnight-black':
        return {
          background: 'rgba(30, 30, 30, 0.95)',
          accent: '#e559f7',
          text: '#FFFFFF'
        };
      case 'cotton-candy-glow':
        return {
          background: 'rgba(255, 255, 255, 0.95)',
          accent: '#FF6B9D',
          text: '#333333'
        };
      default:
        return {
          background: 'rgba(26, 26, 46, 0.95)',
          accent: '#00D4FF',
          text: '#E2E8F0'
        };
    }
  };

  const colors = getThemeColors();

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          backdropFilter: 'blur(10px)'
        }}
        onClick={onClose}
      />
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: colors.background,
        borderRadius: '20px',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${theme === 'cotton-candy-glow' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)'}`,
        padding: '3rem',
        zIndex: 1000,
        minWidth: '500px',
        textAlign: 'center',
        color: colors.text,
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: colors.text,
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '50%',
            transition: 'background-color 0.3s ease'
          }}
        >
          <X size={20} />
        </button>

        <h2 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          marginBottom: '2rem',
          background: `linear-gradient(45deg, ${colors.accent}, ${colors.text})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Test Results
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            padding: '1.5rem',
            background: theme === 'cotton-candy-glow' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            border: `1px solid ${theme === 'cotton-candy-glow' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)'}`
          }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.5rem' }}>Speed</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.accent }}>{wpm} WPM</div>
          </div>
          
          <div style={{
            padding: '1.5rem',
            background: theme === 'cotton-candy-glow' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            border: `1px solid ${theme === 'cotton-candy-glow' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)'}`
          }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.5rem' }}>Accuracy</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.accent }}>{accuracy.toFixed(1)}%</div>
          </div>
          
          <div style={{
            padding: '1.5rem',
            background: theme === 'cotton-candy-glow' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            border: `1px solid ${theme === 'cotton-candy-glow' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)'}`
          }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.5rem' }}>Errors</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff4444' }}>{errors}</div>
          </div>
          
          <div style={{
            padding: '1.5rem',
            background: theme === 'cotton-candy-glow' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            border: `1px solid ${theme === 'cotton-candy-glow' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)'}`
          }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.5rem' }}>Score</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.accent }}>{score}/1000</div>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accent}CC 100%)`,
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            transition: 'transform 0.3s ease',
            boxShadow: `0 8px 25px ${colors.accent}40`
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Try Again
        </button>
      </div>
    </>
  );
};
