
import React from 'react';
import { X, Trophy, Target, Clock, TrendingUp, Award, Star } from 'lucide-react';

interface ResultsPageProps {
  wpm: number;
  accuracy: number;
  errors: number;
  score: number;
  onClose: () => void;
  theme: string;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  wpm,
  accuracy,
  errors,
  score,
  onClose,
  theme
}) => {
  const getThemeColors = () => {
    switch (theme) {
      case 'midnight-black':
        return {
          background: 'rgba(0, 0, 0, 0.95)',
          accent: '#6366f1',
          text: '#FFFFFF',
          cardBg: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.1)',
          gradientTitle: 'linear-gradient(90deg, #e559f7 0%, #9f59f7 100%)'
        };
      case 'cotton-candy-glow':
        return {
          background: 'rgba(255, 255, 255, 0.95)',
          accent: '#f472b6',
          text: '#333333',
          cardBg: 'rgba(0, 0, 0, 0.05)',
          border: 'rgba(0, 0, 0, 0.1)',
          gradientTitle: 'linear-gradient(90deg, #ff59e8 0%, #ff52a8 100%)'
        };
      default:
        return {
          background: 'rgba(12, 12, 30, 0.95)',
          accent: '#8b5cf6',
          text: '#FFFFFF',
          cardBg: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.1)',
          gradientTitle: 'linear-gradient(90deg, #e454f0 0%, #9d54f0 100%)'
        };
    }
  };

  const colors = getThemeColors();

  const getPerformanceLevel = () => {
    if (score >= 800) return { level: 'Expert', icon: Trophy, color: '#FFD700' };
    if (score >= 600) return { level: 'Advanced', icon: Award, color: '#C0C0C0' };
    if (score >= 400) return { level: 'Intermediate', icon: Star, color: '#CD7F32' };
    return { level: 'Beginner', icon: Target, color: colors.accent };
  };

  const performance = getPerformanceLevel();
  const PerformanceIcon = performance.icon;

  const stats = [
    { 
      label: 'Speed', 
      value: `${wpm} WPM`, 
      icon: TrendingUp,
      color: colors.accent,
      description: 'Words per minute'
    },
    { 
      label: 'Accuracy', 
      value: `${accuracy.toFixed(1)}%`, 
      icon: Target,
      color: accuracy >= 95 ? '#22c55e' : accuracy >= 85 ? '#f59e0b' : '#ef4444',
      description: 'Typing accuracy'
    },
    { 
      label: 'Errors', 
      value: errors.toString(), 
      icon: X,
      color: errors <= 2 ? '#22c55e' : errors <= 5 ? '#f59e0b' : '#ef4444',
      description: 'Total mistakes'
    },
    { 
      label: 'Score', 
      value: `${score}/1000`, 
      icon: Trophy,
      color: performance.color,
      description: 'Overall performance'
    }
  ];

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          zIndex: 999,
          backdropFilter: 'blur(15px)'
        }}
        onClick={onClose}
      />
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: colors.background,
        borderRadius: '24px',
        backdropFilter: 'blur(25px)',
        border: `2px solid ${colors.border}`,
        padding: '3rem',
        zIndex: 1000,
        minWidth: '600px',
        maxWidth: '800px',
        textAlign: 'center',
        color: colors.text,
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            color: colors.text,
            cursor: 'pointer',
            padding: '0.75rem',
            borderRadius: '50%',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.accent;
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.cardBg;
            e.currentTarget.style.color = colors.text;
          }}
        >
          <X size={20} />
        </button>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <PerformanceIcon 
              size={40} 
              style={{ color: performance.color }}
            />
            <h2 style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold', 
              margin: 0,
              background: colors.gradientTitle,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {performance.level}
            </h2>
          </div>
          <p style={{ 
            fontSize: '1.2rem', 
            opacity: 0.8, 
            margin: 0,
            fontWeight: '500'
          }}>
            Test Complete! Here's how you performed.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {stats.map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <div key={index} style={{
                padding: '2rem 1.5rem',
                background: colors.cardBg,
                borderRadius: '16px',
                border: `1px solid ${colors.border}`,
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = `0 15px 30px ${stat.color}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <StatIcon 
                  size={24} 
                  style={{ 
                    color: stat.color, 
                    marginBottom: '0.75rem' 
                  }} 
                />
                <div style={{ 
                  fontSize: '0.9rem', 
                  opacity: 0.7, 
                  marginBottom: '0.5rem',
                  fontWeight: '500'
                }}>
                  {stat.label}
                </div>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold', 
                  color: stat.color,
                  marginBottom: '0.25rem'
                }}>
                  {stat.value}
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  opacity: 0.6,
                  fontStyle: 'italic'
                }}>
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={onClose}
            style={{
              background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accent}DD 100%)`,
              color: 'white',
              border: 'none',
              padding: '1rem 2.5rem',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              boxShadow: `0 10px 25px ${colors.accent}40`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 15px 35px ${colors.accent}60`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 10px 25px ${colors.accent}40`;
            }}
          >
            <Clock size={20} />
            Try Again
          </button>
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: colors.cardBg,
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.5rem' }}>
            Performance Tips
          </div>
          <div style={{ fontSize: '0.85rem', opacity: 0.7, lineHeight: '1.5' }}>
            {score >= 800 ? "Outstanding! You're in the top tier of typists." :
             score >= 600 ? "Great work! Focus on maintaining accuracy at higher speeds." :
             score >= 400 ? "Good progress! Try to improve both speed and accuracy gradually." :
             "Keep practicing! Focus on accuracy first, then gradually increase speed."}
          </div>
        </div>
      </div>
    </>
  );
};
