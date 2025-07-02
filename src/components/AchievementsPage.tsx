
import React from 'react';
import { Achievement } from '../types/achievements';

interface AchievementsPageProps {
  achievements: Achievement[];
  theme: string;
  onBack: () => void;
  getButtonColor: () => string;
}

export const AchievementsPage: React.FC<AchievementsPageProps> = ({
  achievements,
  theme,
  onBack,
  getButtonColor
}) => {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercentage = (unlockedCount / totalCount) * 100;

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px 0',
      flex: 1
    }}>
      <div style={{
        width: '100%',
        maxWidth: '800px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '16px',
          color: 'white',
          fontSize: '2rem'
        }}>
          Achievements
        </h2>

        <div style={{
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <div style={{
            fontSize: '1.2rem',
            color: 'white',
            marginBottom: '8px'
          }}>
            Progress: {unlockedCount}/{totalCount} ({progressPercentage.toFixed(1)}%)
          </div>
          
          <div style={{
            width: '100%',
            height: '8px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercentage}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${getButtonColor()}, #4CAF50)`,
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </div>

      <div style={{
        width: '100%',
        maxWidth: '800px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            style={{
              background: achievement.unlocked
                ? 'rgba(255, 255, 255, 0.15)'
                : 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              border: achievement.unlocked
                ? '1px solid rgba(255, 215, 0, 0.5)'
                : '1px solid rgba(255, 255, 255, 0.2)',
              padding: '20px',
              textAlign: 'center',
              opacity: achievement.unlocked ? 1 : 0.6,
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{
              fontSize: '2.5rem',
              marginBottom: '12px',
              filter: achievement.unlocked ? 'none' : 'grayscale(100%)'
            }}>
              {achievement.icon}
            </div>

            <h3 style={{
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>
              {achievement.name}
            </h3>

            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.9rem',
              marginBottom: '12px',
              margin: '0 0 12px 0'
            }}>
              {achievement.subtitle}
            </p>

            <div style={{
              padding: '6px 12px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              fontSize: '0.8rem',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '8px'
            }}>
              {achievement.wpmRequired} WPM for {achievement.timeRequired}s
            </div>

            {achievement.unlocked && achievement.unlockedAt && (
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 215, 0, 0.8)',
                fontStyle: 'italic'
              }}>
                Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onBack}
        style={{
          background: getButtonColor(),
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        Back to Dashboard
      </button>
    </div>
  );
};
