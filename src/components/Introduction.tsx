
import React, { useState, useEffect } from 'react';

interface IntroductionProps {
  onComplete: () => void;
  onReplay?: () => void;
  clickCount?: number;
  onTitleClick?: () => void;
  theme?: string;
  isFromTitleClick?: boolean;
}

export const Introduction: React.FC<IntroductionProps> = ({ 
  onComplete, 
  onReplay, 
  clickCount = 0, 
  onTitleClick,
  theme = 'cosmic-nebula',
  isFromTitleClick = false
}) => {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [animationPhase, setAnimationPhase] = useState('themes');
  const [titlePosition, setTitlePosition] = useState('center');
  const [isReplay, setIsReplay] = useState(false);

  const themes = [
    {
      id: 'cosmic-nebula',
      background: 'linear-gradient(45deg, #400354, #03568c)',
      titleGradient: 'linear-gradient(45deg, #b109d6 0%, #0c6dc2 100%)'
    },
    {
      id: 'midnight-black',
      background: '#0a0a0a',
      titleGradient: 'linear-gradient(90deg, #c559f7 0%, #7f59f7 100%)'
    },
    {
      id: 'cotton-candy-glow',
      background: 'linear-gradient(135deg, #12cff3, #5ab2f7)',
      titleGradient: 'linear-gradient(90deg, #fc03df 0%, #ff3be8 100%)'
    }
  ];

  const getCurrentThemeIndex = () => {
    return themes.findIndex(t => t.id === theme);
  };

  useEffect(() => {
    let themeInterval: NodeJS.Timeout;
    let phaseTimeout: NodeJS.Timeout;
    let completeTimeout: NodeJS.Timeout;

    setCurrentThemeIndex(0);

    // Theme switching phase - 10% faster
    themeInterval = setInterval(() => {
      setCurrentThemeIndex(prev => (prev + 1) % themes.length);
    }, 1800); // Reduced from 2000ms to 1800ms

    // After theme cycles - 10% faster
    phaseTimeout = setTimeout(() => {
      clearInterval(themeInterval);
      setAnimationPhase('moving');
      setTitlePosition('top-left');
      
      const actualThemeIndex = getCurrentThemeIndex();
      setCurrentThemeIndex(actualThemeIndex >= 0 ? actualThemeIndex : 0);
    }, 5400); // Reduced from 6000ms to 5400ms

    // Complete animation - 10% faster
    completeTimeout = setTimeout(() => {
      if (isFromTitleClick) {
        window.dispatchEvent(new CustomEvent('showEasterEgg'));
      } else if (onReplay && isReplay) {
        onReplay();
      } else {
        onComplete();
      }
    }, 7650); // Reduced from 8500ms to 7650ms

    return () => {
      clearInterval(themeInterval);
      clearTimeout(phaseTimeout);
      clearTimeout(completeTimeout);
    };
  }, [onComplete, onReplay, isReplay, theme, isFromTitleClick]);

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

  const currentThemeData = themes[currentThemeIndex];

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: currentThemeData.background,
        transition: animationPhase === 'themes' ? 'background 1.8s ease-in-out' : 'background 2.25s ease-in-out',
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
            'background-image 1.8s ease-in-out' : 
            'all 2.25s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-image 2.25s ease-in-out',
          textAlign: 'center',
          animation: animationPhase === 'themes' ? 'heartbeat 2.7s ease-in-out infinite' : 'none',
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
