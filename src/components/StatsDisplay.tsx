
import React from 'react';

interface StatsDisplayProps {
  elapsed: number;
  correctSigns: number;
  totalErrors: number;
  currentErrorRate: number;
  theme: string;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({
  elapsed,
  correctSigns,
  totalErrors,
  currentErrorRate,
  theme
}) => {
  // Calculate WPM properly - correctSigns is already the correct character count
  const currentWPM = Math.round(Math.max(0, (correctSigns / 5) / Math.max(elapsed / 60, 1 / 60)));

  console.log('StatsDisplay data:', {
    elapsed,
    correctSigns,
    totalErrors,
    currentErrorRate,
    calculatedWPM: currentWPM
  });

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '1rem',
      width: '90%',
      maxWidth: '1000px',
      margin: '1rem auto',
      marginBottom: '4rem'
    }}>
      <div style={{
        background: theme === 'cotton-candy-glow' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
        padding: '0.8rem 1.2rem',
        borderRadius: '6px',
        textAlign: 'center',
        color: theme === 'cotton-candy-glow' ? '#333' : 'white',
        flexGrow: 1,
        flexBasis: '150px',
        minWidth: '120px'
      }}>
        <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.25rem' }}>Time:</span>
        <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
          {String(Math.floor(elapsed / 60)).padStart(2, "0")}:{String(elapsed % 60).padStart(2, "0")}
        </span>
      </div>
      <div style={{
        background: theme === 'cotton-candy-glow' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
        padding: '0.8rem 1.2rem',
        borderRadius: '6px',
        textAlign: 'center',
        color: theme === 'cotton-candy-glow' ? '#333' : 'white',
        flexGrow: 1,
        flexBasis: '150px',
        minWidth: '120px'
      }}>
        <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.25rem' }}>Speed:</span>
        <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{currentWPM} WPM</span>
      </div>
      <div style={{
        background: theme === 'cotton-candy-glow' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
        padding: '0.8rem 1.2rem',
        borderRadius: '6px',
        textAlign: 'center',
        color: theme === 'cotton-candy-glow' ? '#333' : 'white',
        flexGrow: 1,
        flexBasis: '150px',
        minWidth: '120px'
      }}>
        <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.25rem' }}>Errors:</span>
        <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{totalErrors}</span>
      </div>
      <div style={{
        background: theme === 'cotton-candy-glow' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
        padding: '0.8rem 1.2rem',
        borderRadius: '6px',
        textAlign: 'center',
        color: theme === 'cotton-candy-glow' ? '#333' : 'white',
        flexGrow: 1,
        flexBasis: '150px',
        minWidth: '120px'
      }}>
        <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.25rem' }}>Error Rate:</span>
        <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
          {currentErrorRate.toFixed(2)}%
        </span>
      </div>
      <div style={{
        background: theme === 'cotton-candy-glow' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
        padding: '0.8rem 1.2rem',
        borderRadius: '6px',
        textAlign: 'center',
        color: theme === 'cotton-candy-glow' ? '#333' : 'white',
        flexGrow: 1,
        flexBasis: '150px',
        minWidth: '120px'
      }}>
        <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.25rem' }}>Signs:</span>
        <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{correctSigns}</span>
      </div>
    </div>
  );
};
