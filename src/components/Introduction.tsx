
import React, { useState, useEffect } from 'react';

interface IntroductionProps {
  onComplete: () => void;
  onReplay?: () => void;
}

export const Introduction: React.FC<IntroductionProps> = ({ onComplete, onReplay }) => {
  const [currentTheme, setCurrentTheme] = useState(0);
  const [animationPhase, setAnimationPhase] = useState('themes'); // 'themes' or 'moving'
  const [titlePosition, setTitlePosition] = useState('center');
  const [isReplay, setIsReplay] = useState(false);

  const themes = [
    {
      id: 'cosmic-nebula',
      background: 'linear-gradient(135deg, #3f034a 42%, #004a7a 58%)',
      titleGradient: 'linear-gradient(45deg, #a729f0 0%, #3c95fa 100%)'
    },
    {
      id: 'midnight-black',
      background: '#000000',
      titleGradient: 'linear-gradient(90deg, #c559f7 0%, #7f59f7 100%)'
    },
    {
      id: 'cotton-candy-glow',
      background: 'linear-gradient(45deg, #74d2f1, #69c8e8)',
      titleGradient: 'linear-gradient(90deg, #ff59e8 0%, #ff52a8 100%)'
    }
  ];

  useEffect(() => {
    let themeInterval: NodeJS.Timeout;
    let phaseTimeout: NodeJS.Timeout;
    let completeTimeout: NodeJS.Timeout;

    // Theme switching phase
    themeInterval = setInterval(() => {
      setCurrentTheme(prev => (prev + 1) % themes.length);
    }, 1500);

    // After 3 theme cycles (4.5 seconds), switch to moving phase
    phaseTimeout = setTimeout(() => {
      clearInterval(themeInterval);
      setAnimationPhase('moving');
      setTitlePosition('top-left');
      
      // Get the saved theme or default to cosmic-nebula
      const savedTheme = localStorage.getItem("typeRakTheme") || 'cosmic-nebula';
      const savedThemeIndex = themes.findIndex(t => t.id === savedTheme);
      setCurrentTheme(savedThemeIndex >= 0 ? savedThemeIndex : 0);
    }, 4500);

    // Complete animation after title moves to top-left
    completeTimeout = setTimeout(() => {
      if (onReplay && isReplay) {
        onReplay();
      } else {
        onComplete();
      }
    }, 6000);

    return () => {
      clearInterval(themeInterval);
      clearTimeout(phaseTimeout);
      clearTimeout(completeTimeout);
    };
  }, [onComplete, onReplay, isReplay]);

  const replayAnimation = () => {
    setIsReplay(true);
    setCurrentTheme(0);
    setAnimationPhase('themes');
    setTitlePosition('center');
  };

  const currentThemeData = themes[currentTheme];

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: currentThemeData.background,
        transition: animationPhase === 'themes' ? 'background 1s ease-in-out' : 'background 2s ease-in-out',
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
            'background-image 1s ease-in-out' : 
            'all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-image 2s ease-in-out',
          textAlign: 'center',
          animation: animationPhase === 'themes' ? 'heartbeat 2.5s ease-in-out infinite' : 'none',
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
