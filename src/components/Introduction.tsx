
import React, { useState, useEffect } from 'react';

interface IntroductionProps {
  onComplete: () => void;
}

export const Introduction: React.FC<IntroductionProps> = ({ onComplete }) => {
  const [currentTheme, setCurrentTheme] = useState(0);
  const [animationPhase, setAnimationPhase] = useState('themes'); // 'themes' or 'moving'
  const [titlePosition, setTitlePosition] = useState('center');

  const themes = [
    {
      id: 'cosmic-nebula',
      background: 'linear-gradient(45deg, #3f034a, #004a7a)',
      titleGradient: 'linear-gradient(90deg, #c454f0 0%, #7d54f0 100%)'
    },
    {
      id: 'midnight-black',
      background: '#000000',
      titleGradient: 'linear-gradient(90deg, #c559f7 0%, #7f59f7 100%)'
    },
    {
      id: 'cotton-candy-glow',
      background: 'linear-gradient(45deg, #3e8cb9, #2f739d)',
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
    }, 4500);

    // Complete animation after title moves to top-left
    completeTimeout = setTimeout(() => {
      onComplete();
    }, 6000);

    return () => {
      clearInterval(themeInterval);
      clearTimeout(phaseTimeout);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  const getDefaultTheme = () => {
    const savedTheme = localStorage.getItem("typeRakTheme");
    return savedTheme || 'cosmic-nebula';
  };

  const getCurrentThemeData = () => {
    if (animationPhase === 'moving') {
      const defaultTheme = getDefaultTheme();
      return themes.find(t => t.id === defaultTheme) || themes[0];
    }
    return themes[currentTheme];
  };

  const currentThemeData = getCurrentThemeData();

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
          animation: animationPhase === 'themes' ? 'colorWave 1.5s ease-in-out infinite' : 'none'
        }}
      >
        TypeWave
      </h1>
      
      <style>{`
        @keyframes colorWave {
          0%, 100% { 
            background-position: 0% 50%;
            transform: scale(1);
          }
          50% { 
            background-position: 100% 50%;
            transform: scale(1.02);
          }
        }
      `}</style>
    </div>
  );
};
