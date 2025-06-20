
import React, { useState, useEffect } from 'react';

interface IntroductionProps {
  onComplete: () => void;
  onReplay?: () => void;
  clickCount?: number;
  onTitleClick?: () => void;
  currentTheme?: string;
  isFromTitleClick?: boolean;
}

export const Introduction: React.FC<IntroductionProps> = ({ 
  onComplete, 
  onReplay, 
  clickCount = 0, 
  onTitleClick,
  currentTheme = 'cosmic-nebula',
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
      background: '#000000',
      titleGradient: 'linear-gradient(90deg, #c559f7 0%, #7f59f7 100%)'
    },
    {
      id: 'cotton-candy-glow',
      background: 'linear-gradient(45deg, #74d2f1, #69c8e8)',
      titleGradient: 'linear-gradient(90deg, #fc03df 0%, #ff3be8 100%)'
    }
  ];

  // Find the current theme index
  const getCurrentThemeIndex = () => {
    return themes.findIndex(t => t.id === currentTheme);
  };

  useEffect(() => {
    let themeInterval: NodeJS.Timeout;
    let phaseTimeout: NodeJS.Timeout;
    let completeTimeout: NodeJS.Timeout;

    // Start with cosmic nebula theme (index 0)
    setCurrentThemeIndex(0);

    // Theme switching phase - extended duration
    themeInterval = setInterval(() => {
      setCurrentThemeIndex(prev => (prev + 1) % themes.length);
    }, 2000); // Extended from 1500ms to 2000ms

    // After 3 theme cycles (6 seconds), switch to moving phase
    phaseTimeout = setTimeout(() => {
      clearInterval(themeInterval);
      setAnimationPhase('moving');
      setTitlePosition('top-left');
      
      // Set to the actual current theme for the final transition
      const actualThemeIndex = getCurrentThemeIndex();
      setCurrentThemeIndex(actualThemeIndex >= 0 ? actualThemeIndex : 0);
    }, 6000); // Extended from 4500ms to 6000ms

    // Complete animation after title moves to top-left - extended duration
    completeTimeout = setTimeout(() => {
      if (isFromTitleClick) {
        // If clicked from title, go to easter egg instead
        window.dispatchEvent(new CustomEvent('showEasterEgg'));
      } else if (onReplay && isReplay) {
        onReplay();
      } else {
        onComplete();
      }
    }, 8500); // Extended from 6000ms to 8500ms

    return () => {
      clearInterval(themeInterval);
      clearTimeout(phaseTimeout);
      clearTimeout(completeTimeout);
    };
  }, [onComplete, onReplay, isReplay, currentTheme, isFromTitleClick]);

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
        transition: animationPhase === 'themes' ? 'background 2s ease-in-out' : 'background 2.5s ease-in-out',
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
            'background-image 2s ease-in-out' : 
            'all 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-image 2.5s ease-in-out',
          textAlign: 'center',
          animation: animationPhase === 'themes' ? 'heartbeat 3s ease-in-out infinite' : 'none',
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
