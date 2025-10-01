
import React from 'react';
import { Trophy, Award, Target, Zap, Calendar, Smile } from 'lucide-react';
import { Achievement } from '../hooks/useAchievementsDB';

interface AchievementsPageProps {
  achievements: Achievement[];
  onBack: () => void;
  theme: string;
  getButtonColor: () => string;
}

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case 'speed': return <Zap size={20} />;
    case 'accuracy': return <Target size={20} />;
    case 'consistency': return <Calendar size={20} />;
    case 'milestone': return <Trophy size={20} />;
    case 'fun': return <Smile size={20} />;
    default: return <Award size={20} />;
  }
};

const CircularProgress = ({ progress, maxProgress, size = 60 }: { progress: number; maxProgress: number; size?: number }) => {
  const percentage = maxProgress > 0 ? (progress / maxProgress) * 100 : 0;
  const circumference = 2 * Math.PI * (size / 2 - 4);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 4}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="3"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 4}
          stroke="#f7ba2c"
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

export const AchievementsPage: React.FC<AchievementsPageProps> = ({
  achievements,
  onBack,
  theme,
  getButtonColor
}) => {
  const categories = ['speed', 'accuracy', 'consistency', 'milestone', 'fun'];
  const totalUnlocked = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;

  const getCategoryAchievements = (category: string) => {
    return achievements.filter(a => a.category === category);
  };

  const getCategoryProgress = (category: string) => {
    const categoryAchievements = getCategoryAchievements(category);
    const unlockedCount = categoryAchievements.filter(a => a.unlocked).length;
    return {
      unlocked: unlockedCount,
      total: categoryAchievements.length,
      percentage: Math.round((unlockedCount / categoryAchievements.length) * 100)
    };
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px',
      color: 'white',
      background: '#000000' // Pitch black background
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            margin: 0,
            backgroundImage: theme === 'midnight-black' ? 
              'linear-gradient(90deg, #c559f7 0%, #7f59f7 100%)' :
              theme === 'cotton-candy-glow' ?
              'linear-gradient(90deg, #fc03df 0%, #ff3be8 100%)' :
              'linear-gradient(45deg, #b109d6 0%, #0c6dc2 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Achievements
          </h1>
          <p style={{
            fontSize: '1.1rem',
            opacity: 0.8,
            margin: '10px 0 0 0'
          }}>
            Your Typing Journey Progress
          </p>
        </div>
        <button
          onClick={onBack}
          style={{
            background: getButtonColor(),
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            backdropFilter: 'blur(10px)'
          }}
        >
          Back to Dashboard
        </button>
      </div>

      {/* Overall Progress */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '16px',
        padding: '30px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <CircularProgress progress={totalUnlocked} maxProgress={totalAchievements} size={100} />
        </div>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>
          Overall Progress
        </h2>
        <p style={{ margin: 0, fontSize: '1.1rem', opacity: 0.8 }}>
          {totalUnlocked} of {totalAchievements} achievements unlocked
        </p>
      </div>

      {/* Category Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {categories.map(category => {
          const progress = getCategoryProgress(category);
          return (
            <div key={category} style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                marginBottom: '10px',
                color: '#f7ba2c'
              }}>
                <CategoryIcon category={category} />
              </div>
              <h3 style={{ 
                margin: '0 0 10px 0', 
                textTransform: 'capitalize',
                fontSize: '1.1rem'
              }}>
                {category}
              </h3>
              <CircularProgress 
                progress={progress.unlocked} 
                maxProgress={progress.total} 
                size={50} 
              />
            </div>
          );
        })}
      </div>

      {/* Achievement Categories */}
      {categories.map(category => {
        const categoryAchievements = getCategoryAchievements(category);
        if (categoryAchievements.length === 0) return null;

        return (
          <div key={category} style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: 'bold',
              margin: '0 0 20px 0',
              textTransform: 'capitalize',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <CategoryIcon category={category} />
              {category} Achievements
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {categoryAchievements.map(achievement => (
                <div
                  key={achievement.id}
                  data-achievement-name={achievement.name}
                  style={{
                    background: achievement.unlocked ? 
                      'linear-gradient(135deg, rgba(247, 186, 44, 0.15), rgba(248, 169, 2, 0.15))' : 
                      'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(20px)',
                    border: achievement.unlocked ? 
                      '1px solid rgba(247, 186, 44, 0.4)' : 
                      '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    padding: '20px',
                    position: 'relative',
                    opacity: achievement.unlocked ? 1 : 0.7,
                    transform: achievement.unlocked ? 'scale(1)' : 'scale(0.98)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Achievement Icon */}
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    color: achievement.unlocked ? '#f7ba2c' : 'rgba(255, 255, 255, 0.4)'
                  }}>
                    <Trophy size={24} />
                  </div>

                  {/* Progress Circle for incomplete achievements */}
                  {!achievement.unlocked && achievement.maxProgress && (
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      left: '15px'
                    }}>
                      <CircularProgress 
                        progress={achievement.progress || 0} 
                        maxProgress={achievement.maxProgress} 
                        size={40} 
                      />
                    </div>
                  )}

                  <div style={{ 
                    marginTop: achievement.maxProgress && !achievement.unlocked ? '50px' : '0'
                  }}>
                    <h3 style={{
                      margin: '0 0 8px 0',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      color: achievement.unlocked ? '#f7ba2c' : 'white'
                    }}>
                      {achievement.name}
                    </h3>
                    
                    <p style={{
                      margin: '0 0 10px 0',
                      fontSize: '0.9rem',
                      opacity: 0.8,
                      fontStyle: 'italic'
                    }}>
                      {achievement.subtitle}
                    </p>
                    
                    <p style={{
                      margin: 0,
                      fontSize: '0.85rem',
                      opacity: 0.7
                    }}>
                      {achievement.description}
                    </p>

                    {/* Progress text for incomplete achievements */}
                    {!achievement.unlocked && achievement.maxProgress && (
                      <p style={{
                        margin: '10px 0 0 0',
                        fontSize: '0.8rem',
                        opacity: 0.6
                      }}>
                        Progress: {achievement.progress || 0} / {achievement.maxProgress}
                      </p>
                    )}

                    {/* Unlock date for completed achievements */}
                    {achievement.unlocked && achievement.unlockedAt && (
                      <p style={{
                        margin: '10px 0 0 0',
                        fontSize: '0.75rem',
                        opacity: 0.6
                      }}>
                        Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
