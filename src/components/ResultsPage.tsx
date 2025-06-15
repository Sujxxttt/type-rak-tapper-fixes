
import React from 'react';

interface ResultsPageProps {
  wpm: number;
  accuracy: number;
  totalErrors: number;
  correctCharacters: number;
  duration: number;
  theme: string;
  onTryAgain: () => void;
  onBackHome: () => void;
  getButtonColor: () => string;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  wpm,
  accuracy,
  totalErrors,
  correctCharacters,
  duration,
  theme,
  onTryAgain,
  onBackHome,
  getButtonColor
}) => {
  const getTextColor = () => {
    return theme === 'cotton-candy-glow' ? '#333' : 'white';
  };

  const getGlassStyle = () => {
    let background = 'rgba(255, 255, 255, 0.1)';
    if (theme === 'cotton-candy-glow') {
      background = 'rgba(255, 255, 255, 0.2)';
    } else if (theme === 'midnight-black') {
      background = 'rgba(0, 0, 0, 0.1)';
    }

    return {
      background,
      borderRadius: '16px',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    };
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      color: getTextColor()
    }}>
      <div style={{
        ...getGlassStyle(),
        padding: '3rem',
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          marginBottom: '2rem',
          background: theme === 'cosmic-nebula' 
            ? 'linear-gradient(90deg, #e454f0 0%, #9d54f0 100%)'
            : theme === 'cotton-candy-glow'
            ? 'linear-gradient(90deg, #ff59e8 0%, #ff52a8 100%)'
            : 'linear-gradient(90deg, #e559f7 0%, #9f59f7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Test Complete!
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          <div style={{
            ...getGlassStyle(),
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: getButtonColor() }}>
              {wpm}
            </div>
            <div style={{ fontSize: '1rem', opacity: 0.8 }}>WPM</div>
          </div>

          <div style={{
            ...getGlassStyle(),
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: getButtonColor() }}>
              {accuracy.toFixed(1)}%
            </div>
            <div style={{ fontSize: '1rem', opacity: 0.8 }}>Accuracy</div>
          </div>

          <div style={{
            ...getGlassStyle(),
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: getButtonColor() }}>
              {totalErrors}
            </div>
            <div style={{ fontSize: '1rem', opacity: 0.8 }}>Errors</div>
          </div>

          <div style={{
            ...getGlassStyle(),
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: getButtonColor() }}>
              {correctCharacters}
            </div>
            <div style={{ fontSize: '1rem', opacity: 0.8 }}>Characters</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onTryAgain}
            style={{
              background: getButtonColor(),
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}
          >
            Try Again
          </button>
          
          <button
            onClick={onBackHome}
            style={{
              background: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1.1rem'
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
