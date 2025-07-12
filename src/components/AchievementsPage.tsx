
import React from 'react';
import { ArrowLeft, Trophy, Target, Zap, Star, Gamepad, Heart } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  category: string;
  wpm: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
  getProgress?: (stats: any) => { current: number; max: number };
}

interface AchievementsPageProps {
  achievements: Achievement[];
  onClose?: () => void;
  onBack?: () => void;
  theme?: string;
  getButtonColor?: () => string;
}

export const AchievementsPage: React.FC<AchievementsPageProps> = ({
  achievements,
  onClose,
  onBack,
  theme = 'cosmic-nebula',
  getButtonColor = () => '#a3b18a'
}) => {
  const handleBack = () => {
    if (onBack) onBack();
    if (onClose) onClose();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'speed': return <Zap size={20} />;
      case 'accuracy': return <Target size={20} />;
      case 'milestone': return <Trophy size={20} />;
      case 'consistency': return <Heart size={20} />;
      case 'fun': return <Gamepad size={20} />;
      default: return <Star size={20} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'speed': return '#ef4444';
      case 'accuracy': return '#10b981';
      case 'milestone': return '#f59e0b';
      case 'consistency': return '#8b5cf6';
      case 'fun': return '#ec4899';
      default: return getButtonColor();
    }
  };

  const getAchievementGradient = () => {
    return 'linear-gradient(135deg, #f7ba2c 0%, #f8a902 100%)';
  };

  const getProgress = (achievement: Achievement) => {
    if (!achievement.getProgress) return null;
    
    // Mock stats for progress calculation - in real app this would come from props
    const mockStats = {
      testsCompleted: Number(localStorage.getItem('typeRakTestsCompleted') || 0),
      maxWpmEver: Number(localStorage.getItem('typeRakMaxWpm') || 0),
      dailyTypingTime: Number(localStorage.getItem('typeRakDailyTypingTime') || 0),
      dailyStreak: Number(localStorage.getItem('typeRakDailyStreak') || 0),
      totalVisitedDays: Number(localStorage.getItem('typeRakTotalVisitedDays') || 0),
      daysSinceFirstLogin: Number(localStorage.getItem('typeRakDaysSinceFirstLogin') || 0),
      cheatCodeUsed: Number(localStorage.getItem('typeRakCheatCodeUsed') || 0),
      foundEasterEgg: localStorage.getItem('typeRakFoundEasterEgg') === 'true',
      perfectTests: Number(localStorage.getItem('typeRakPerfectTests') || 0),
      unlockedAchievements: achievements.filter(a => a.unlocked).length
    };
    
    return achievement.getProgress(mockStats);
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div 
      className="achievements-page min-h-screen p-6"
      style={{ 
        backgroundColor: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))'
      }}
      data-achievements="true"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'hsl(var(--foreground))'
            }}
          >
            <ArrowLeft size={20} />
            Back
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2" style={{ color: 'hsl(var(--foreground))' }}>
              Achievements
            </h1>
            <p className="opacity-70" style={{ color: 'hsl(var(--muted-foreground))' }}>
              {unlockedAchievements.length} of {achievements.length} unlocked
            </p>
          </div>
          
          <div></div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full h-3 rounded-full mb-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${(unlockedAchievements.length / achievements.length) * 100}%`,
                background: getAchievementGradient()
              }}
            />
          </div>
          <p className="text-center text-sm opacity-70" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Progress: {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
          </p>
        </div>

        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2" style={{ color: 'hsl(var(--foreground))' }}>
              <Trophy size={24} style={{ color: '#f7ba2c' }} />
              Unlocked ({unlockedAchievements.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unlockedAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="p-6 rounded-xl border transition-all duration-200 hover:scale-105"
                  style={{
                    background: getAchievementGradient(),
                    border: `1px solid #f8a902`,
                    boxShadow: `0 4px 20px rgba(247, 186, 44, 0.3)`,
                    color: '#000'
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
                    >
                      <div style={{ color: '#000' }}>
                        {getCategoryIcon(achievement.category)}
                      </div>
                    </div>
                    {achievement.wpm > 0 && (
                      <div 
                        className="px-2 py-1 rounded-full text-xs font-semibold"
                        style={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.2)',
                          color: '#000'
                        }}
                      >
                        {achievement.wpm} WPM
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#000' }}>
                    {achievement.name}
                  </h3>
                  <p className="text-sm mb-3 opacity-80" style={{ color: '#000' }}>
                    {achievement.subtitle}
                  </p>
                  <p className="text-xs opacity-60" style={{ color: '#000' }}>
                    {achievement.description}
                  </p>
                  
                  {achievement.unlockedAt && (
                    <div className="mt-4 pt-3 border-t border-black/20">
                      <p className="text-xs opacity-50" style={{ color: '#000' }}>
                        Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locked Achievements */}
        {lockedAchievements.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2" style={{ color: 'hsl(var(--foreground))' }}>
              <Star size={24} className="opacity-50" />
              Locked ({lockedAchievements.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lockedAchievements.map((achievement) => {
                const progress = getProgress(achievement);
                
                return (
                  <div
                    key={achievement.id}
                    className="p-6 rounded-xl border transition-all duration-200 opacity-60"
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      backdropFilter: 'blur(25px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div 
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                      >
                        <div className="text-gray-500">
                          {getCategoryIcon(achievement.category)}
                        </div>
                      </div>
                      {achievement.wpm > 0 && (
                        <div 
                          className="px-2 py-1 rounded-full text-xs font-semibold opacity-50"
                          style={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: 'hsl(var(--muted-foreground))'
                          }}
                        >
                          {achievement.wpm} WPM
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-lg mb-2" style={{ color: 'hsl(var(--muted-foreground))' }}>
                      {achievement.name}
                    </h3>
                    <p className="text-sm mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>
                      {achievement.subtitle}
                    </p>
                    <p className="text-xs mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>
                      {achievement.description}
                    </p>

                    {progress && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
                          <span>Progress</span>
                          <span>{progress.current}/{progress.max}</span>
                        </div>
                        <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                          <div 
                            className="h-full rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min((progress.current / progress.max) * 100, 100)}%`,
                              background: getAchievementGradient()
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
