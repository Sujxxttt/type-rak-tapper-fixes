import React from 'react';
import { BookOpen, Music, Zap, Shuffle, Target } from 'lucide-react';

interface ArcadeMenuProps {
  onSelectMode: (mode: string) => void;
  theme: string;
}

export const ArcadeMenu: React.FC<ArcadeMenuProps> = ({ onSelectMode, theme }) => {
  const getThemeColors = () => {
    switch (theme) {
      case 'cosmic-nebula':
        return {
          primary: '#b109d6',
          secondary: '#0c6dc2'
        };
      case 'midnight-black':
        return {
          primary: '#c559f7',
          secondary: '#7f59f7'
        };
      case 'cotton-candy-glow':
        return {
          primary: '#fc03df',
          secondary: '#ff3be8'
        };
      default:
        return {
          primary: '#b109d6',
          secondary: '#0c6dc2'
        };
    }
  };

  const colors = getThemeColors();

  const arcadeModes = [
    {
      id: 'story',
      name: 'Story Mode',
      description: 'Create your own story through conversation',
      icon: BookOpen,
      color: colors.primary
    },
    {
      id: 'song',
      name: 'Song Mode',
      description: 'Type along to NCS music lyrics',
      icon: Music,
      color: colors.secondary
    },
    {
      id: 'one-last-life',
      name: 'One Last Life',
      description: 'One mistake and it\'s game over',
      icon: Zap,
      color: '#ff4757'
    },
    {
      id: 'element-of-surprise',
      name: 'Element of Surprise',
      description: 'Words transform unexpectedly',
      icon: Shuffle,
      color: '#ffa502'
    },
    {
      id: 'portal-combat',
      name: 'Portal Combat',
      description: 'Multi-line text combat scenario',
      icon: Target,
      color: '#2ed573'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1
        className="text-4xl font-bold mb-12 text-center"
        style={{
          background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        Choose Your Challenge
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
        {arcadeModes.map((mode, index) => (
          <div
            key={mode.id}
            onClick={() => onSelectMode(mode.id)}
            className="group cursor-pointer"
            style={{
              animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center',
                height: '220px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
              className="group-hover:scale-105 group-hover:shadow-2xl"
            >
              <mode.icon 
                size={48} 
                style={{
                  color: mode.color,
                  marginBottom: '1rem',
                  filter: `drop-shadow(0 0 10px ${mode.color}40)`
                }}
              />
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: 'white' }}
              >
                {mode.name}
              </h3>
              <p 
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                {mode.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};