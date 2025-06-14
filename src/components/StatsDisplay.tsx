
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
  const currentWPM = Math.round(Math.max(0, (correctSigns / 5) / Math.max(elapsed / 60, 1 / 60)));

  const getThemeColors = () => {
    switch (theme) {
      case 'midnight-black':
        return {
          background: 'rgba(0, 0, 0, 0.1)',
          text: '#FFFFFF',
          border: 'rgba(255, 255, 255, 0.1)'
        };
      case 'cotton-candy-glow':
        return {
          background: 'rgba(255, 255, 255, 0.2)',
          text: '#333333',
          border: 'rgba(0, 0, 0, 0.1)'
        };
      default:
        return {
          background: 'rgba(0, 0, 0, 0.1)',
          text: '#FFFFFF',
          border: 'rgba(255, 255, 255, 0.1)'
        };
    }
  };

  const colors = getThemeColors();

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
        background: colors.background,
        padding: '0.8rem 1.2rem',
        borderRadius: '12px',
        textAlign: 'center',
        color: colors.text,
        flexGrow: 1,
        flexBasis: '150px',
        minWidth: '120px',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${colors.border}`
      }}>
        <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.25rem' }}>Time:</span>
        <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
          {String(Math.floor(elapsed / 60)).padStart(2, "0")}:{String(elapsed % 60).padStart(2, "0")}
        </span>
      </div>
      <div style={{
        background: colors.background,
        padding: '0.8rem 1.2rem',
        borderRadius: '12px',
        textAlign: 'center',
        color: colors.text,
        flexGrow: 1,
        flexBasis: '150px',
        minWidth: '120px',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${colors.border}`
      }}>
        <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.25rem' }}>Speed:</span>
        <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{currentWPM} WPM</span>
      </div>
      <div style={{
        background: colors.background,
        padding: '0.8rem 1.2rem',
        borderRadius: '12px',
        textAlign: 'center',
        color: colors.text,
        flexGrow: 1,
        flexBasis: '150px',
        minWidth: '120px',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${colors.border}`
      }}>
        <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.25rem' }}>Errors:</span>
        <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{totalErrors}</span>
      </div>
      <div style={{
        background: colors.background,
        padding: '0.8rem 1.2rem',
        borderRadius: '12px',
        textAlign: 'center',
        color: colors.text,
        flexGrow: 1,
        flexBasis: '150px',
        minWidth: '120px',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${colors.border}`
      }}>
        <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.25rem' }}>Error Rate:</span>
        <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
          {currentErrorRate.toFixed(2)}%
        </span>
      </div>
      <div style={{
        background: colors.background,
        padding: '0.8rem 1.2rem',
        borderRadius: '12px',
        textAlign: 'center',
        color: colors.text,
        flexGrow: 1,
        flexBasis: '150px',
        minWidth: '120px',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${colors.border}`
      }}>
        <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.25rem' }}>Characters:</span>
        <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{correctSigns}</span>
      </div>
    </div>
  );
};
