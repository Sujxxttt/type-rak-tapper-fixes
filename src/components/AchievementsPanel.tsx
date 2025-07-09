
import React, { useState } from 'react';
import { Trophy, Star } from 'lucide-react';

interface AchievementsPanelProps {
  achievements: Array<{
    name: string;
    subtitle: string;
    wpm: number;
    unlocked: boolean;
  }>;
  theme: string;
}

export const AchievementsPanel: React.FC<AchievementsPanelProps> = ({ achievements, theme }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getButtonColor = () => {
    switch (theme) {
      case 'cosmic-nebula': return '#b109d6';
      case 'midnight-black': return '#c559f7';
      case 'cotton-candy-glow': return '#ff59e8';
      default: return '#c454f0';
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '15px',
          padding: '8px 16px',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.9rem',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
        }}
      >
        <Trophy size={16} style={{ color: getButtonColor() }} />
        Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            marginTop: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '15px',
            padding: '16px',
            color: 'white',
            minWidth: '300px',
            maxHeight: '400px',
            overflowY: 'auto',
            zIndex: 1000,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '600' }}>
            Your Achievements
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {achievements.map((achievement) => (
              <div
                key={achievement.wpm}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: achievement.unlocked 
                    ? 'rgba(255, 215, 0, 0.1)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '10px',
                  border: achievement.unlocked 
                    ? '1px solid rgba(255, 215, 0, 0.3)' 
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  opacity: achievement.unlocked ? 1 : 0.5
                }}
              >
                <div style={{
                  background: achievement.unlocked 
                    ? 'rgba(255, 215, 0, 0.2)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {achievement.unlocked ? (
                    <Trophy size={20} style={{ color: '#ffd700' }} />
                  ) : (
                    <Star size={20} style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                  )}
                </div>
                <div>
                  <h4 style={{ 
                    margin: '0 0 4px 0', 
                    fontSize: '0.95rem', 
                    fontWeight: '600',
                    color: achievement.unlocked ? '#ffd700' : 'rgba(255, 255, 255, 0.7)'
                  }}>
                    {achievement.name}
                  </h4>
                  <p style={{ 
                    margin: '0 0 2px 0', 
                    fontSize: '0.8rem', 
                    opacity: 0.8 
                  }}>
                    {achievement.subtitle}
                  </p>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '0.75rem', 
                    opacity: 0.6 
                  }}>
                    Reach {achievement.wpm} WPM in a 1+ minute test
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
