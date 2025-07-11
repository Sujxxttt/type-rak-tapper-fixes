
import React, { useState, useEffect } from 'react';

interface IntroductionProps {
  onComplete: () => void;
  onReplay?: () => void;
  clickCount?: number;
  onTitleClick?: () => void;
  theme?: string;
  currentTheme?: string;
  isFromTitleClick?: boolean;
}

export const Introduction: React.FC<IntroductionProps> = ({ 
  onComplete, 
  onReplay, 
  clickCount = 0, 
  onTitleClick,
  theme = 'cosmic-nebula',
  currentTheme,
  isFromTitleClick = false
}) => {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [animationPhase, setAnimationPhase] = useState('themes');
  const [titlePosition, setTitlePosition] = useState('center');
  const [isReplay, setIsReplay] = useState(false);

  // Animation sequence: cosmic-nebula → midnight-black → cotton-candy-glow → current theme
  const themes = [
    {
      id: 'cosmic-nebula',
      background: 'linear-gradient(45deg, #400354, #03568c)',
      titleGradient: 'linear-gradient(45deg, #b109d6 0%, #0c6dc2 100%)'
    },
    {
      id: 'midnight-black',
      background: '#1a1a1a', // Dark gray instead of pure black to prevent white flash
      titleGradient: 'linear-gradient(90deg, #c559f7 0%, #7f59f7 100%)'
    },
    {
      id: 'cotton-candy-glow',
      background: 'linear-gradient(135deg, #12cff3, #5ab2f7)',
      titleGradient: 'linear-gradient(90deg, #fc03df 0%, #ff3be8 100%)'
    }
  ];

  const getCurrentThemeData = () => {
    const actualTheme = currentTheme || theme;
    const targetTheme = themes.find(t => t.id === actualTheme);
    return targetTheme || themes[0];
  };

  useEffect(() => {
    let themeInterval: NodeJS.Timeout;
    let phaseTimeout: NodeJS.Timeout;
    let completeTimeout: NodeJS.Timeout;

    setCurrentThemeIndex(0);

    // Theme switching phase - cycle through themes
    themeInterval = setInterval(() => {
      setCurrentThemeIndex(prev => {
        if (prev < 2) return prev + 1;
        return 0;
      });
    }, 1620);

    // After theme cycles, show current theme and move to position
    phaseTimeout = setTimeout(() => {
      clearInterval(themeInterval);
      setAnimationPhase('moving');
      setTitlePosition('top-left');
      
      // Set to current theme
      const currentThemeData = getCurrentThemeData();
      const themeIndex = themes.findIndex(t => t.id === currentThemeData.id);
      setCurrentThemeIndex(themeIndex >= 0 ? themeIndex : 0);
    }, 4860);

    // Complete animation
    completeTimeout = setTimeout(() => {
      if (isFromTitleClick) {
        window.dispatchEvent(new CustomEvent('showEasterEgg'));
      } else if (onReplay && isReplay) {
        onReplay();
      } else {
        onComplete();
      }
    }, 6885);

    return () => {
      clearInterval(themeInterval);
      clearTimeout(phaseTimeout);
      clearTimeout(completeTimeout);
    };
  }, [onComplete, onReplay, isReplay, theme, currentTheme, isFromTitleClick]);

  const replayAnimation = () => {
    if (onTitleClick) {
      onTitleClick();
    } else {
      setIsReplay(true);
      setCurrentThemeIndex(0);
      setAnimationPhase('themes');
      setTitlePosition('center');
    }
  };

  // Use current theme data or animation theme
  const currentThemeData = animationPhase === 'moving' ? getCurrentThemeData() : themes[currentThemeIndex];

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: currentThemeData.background,
        transition: animationPhase === 'themes' ? 'background 1.62s ease-in-out' : 'background 2.025s ease-in-out',
        display: 'flex',
        alignItems: titlePosition === 'center' ? 'center' : 'flex-start',
        justifyContent: titlePosition === 'center' ? 'center' : 'flex-start',
        zIndex: 9999,
        paddingTop: titlePosition === 'top-left' ? '20px' : '0',
        paddingLeft: titlePosition === 'top-left' ? '20px' : '0'
      }}
    >
      <h1 
        onClick={replayAnimation}
        style={{
          backgroundImage: currentThemeData.titleGradient,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
          fontSize: titlePosition === 'center' ? '5rem' : '2.5rem',
          fontWeight: 700,
          margin: 0,
          transition: animationPhase === 'themes' ? 
            'background-image 1.62s ease-in-out' : 
            'all 2.025s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-image 2.025s ease-in-out',
          textAlign: 'center',
          animation: animationPhase === 'themes' ? 'heartbeat 2.43s ease-in-out infinite' : 'none',
          cursor: titlePosition === 'top-left' ? 'pointer' : 'default'
        }}
      >
        TypeWave
      </h1>
      
      <style>{`
        @keyframes heartbeat {
          0%, 100% { 
            transform: scale(1);
          }
          25% { 
            transform: scale(1.03);
          }
          75% { 
            transform: scale(0.97);
          }
        }
      `}</style>
    </div>
  );
};
