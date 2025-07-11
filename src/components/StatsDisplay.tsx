
import React from 'react';

export interface StatsDisplayProps {
  bestWpm: number;
  testsCompleted: number;
  avgErrorRate: number;
  theme: string;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({
  bestWpm,
  testsCompleted,
  avgErrorRate,
  theme
}) => {
  const getThemeColors = () => {
    switch (theme) {
      case 'midnight-black':
        return {
          primary: '#c559f7',
          secondary: '#9333ea'
        };
      case 'cotton-candy-glow':
        return {
          primary: '#ff59e8',
          secondary: '#ec4899'
        };
      case 'cosmic-nebula':
      default:
        return {
          primary: '#b109d6',
          secondary: '#7c3aed'
        };
    }
  };

  const colors = getThemeColors();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '2rem',
      marginBottom: '2rem',
      flexWrap: 'wrap'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '15px',
        padding: '1.5rem',
        textAlign: 'center',
        minWidth: '150px',
        color: 'white'
      }}>
        <div style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: colors.primary,
          marginBottom: '0.5rem'
        }}>
          {bestWpm}
        </div>
        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Best WPM</div>
      </div>

      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '15px',
        padding: '1.5rem',
        textAlign: 'center',
        minWidth: '150px',
        color: 'white'
      }}>
        <div style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: colors.primary,
          marginBottom: '0.5rem'
        }}>
          {testsCompleted}
        </div>
        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Tests Completed</div>
      </div>

      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '15px',
        padding: '1.5rem',
        textAlign: 'center',
        minWidth: '150px',
        color: 'white'
      }}>
        <div style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: colors.primary,
          marginBottom: '0.5rem'
        }}>
          {avgErrorRate ? avgErrorRate.toFixed(1) : '0.0'}%
        </div>
        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Avg Error Rate</div>
      </div>
    </div>
  );
};
