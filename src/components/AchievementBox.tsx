
import React from 'react';
import { Trophy } from 'lucide-react';

interface AchievementBoxProps {
  unlockedCount: number;
  totalCount: number;
  onClick: () => void;
  theme: string;
}

export const AchievementBox: React.FC<AchievementBoxProps> = ({
  unlockedCount,
  totalCount,
  onClick,
  theme
}) => {
  const getButtonColor = () => {
    switch (theme) {
      case 'midnight-black':
        return '#c559f7';
      case 'cotton-candy-glow':
        return '#ff59e8';
      case 'cosmic-nebula':
      default:
        return '#b109d6';
    }
  };

  return (
    <div
      onClick={onClick}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '15px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textAlign: 'center',
        color: 'white'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '10px'
      }}>
        <Trophy size={32} style={{ color: getButtonColor() }} />
      </div>
      
      <h3 style={{
        margin: '0 0 8px 0',
        fontSize: '1.1rem',
        fontWeight: 'bold'
      }}>
        Achievements
      </h3>
      
      <p style={{
        margin: 0,
        fontSize: '0.9rem',
        opacity: 0.8
      }}>
        {unlockedCount} / {totalCount} unlocked
      </p>
      
      <div style={{
        width: '100%',
        height: '4px',
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '2px',
        marginTop: '12px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${(unlockedCount / totalCount) * 100}%`,
          height: '100%',
          background: getButtonColor(),
          borderRadius: '2px',
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );
};
