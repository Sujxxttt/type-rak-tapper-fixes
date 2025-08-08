import React from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

interface AchievementsPageProps {
  achievements: Achievement[];
  onBack: () => void;
  theme: string;
  getButtonColor: () => string;
  username: string;
}

export const AchievementsPage: React.FC<AchievementsPageProps> = ({
  achievements,
  onBack,
  theme,
  getButtonColor,
  username
}) => {
  const unlockedAchievements = achievements.filter(achievement => achievement.unlocked);

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px 0',
      flex: 1,
      minHeight: '80vh'
    }}>
      <div style={{
        width: '90%',
        maxWidth: '900px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        padding: '30px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ margin: 0, fontSize: '2rem' }}>Achievements</h2>
          <button
            onClick={onBack}
            style={{
              background: getButtonColor(),
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Back to Dashboard
          </button>
        </div>

        {unlockedAchievements.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>No achievements unlocked yet.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {unlockedAchievements.map(achievement => (
              <div key={achievement.id} style={{
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(15px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '150px'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 10px', fontSize: '1.2rem' }}>{achievement.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>{achievement.description}</p>
                </div>
                <div style={{ marginTop: '15px', fontSize: '0.8rem', opacity: 0.7 }}>
                  Unlocked on {achievement.unlockedAt ? new Date(achievement.unlockedAt).toLocaleDateString() : 'Unknown'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
