
import React, { useState, useEffect } from 'react';

interface IntroductionProps {
  onComplete: () => void;
}

export const Introduction: React.FC<IntroductionProps> = ({ onComplete }) => {
  const [currentTheme, setCurrentTheme] = useState(0);
  const [showTitle, setShowTitle] = useState(true);

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
    const interval = setInterval(() => {
      setCurrentTheme(prev => (prev + 1) % themes.length);
    }, 1500);

    const timeout = setTimeout(() => {
      setShowTitle(false);
      setTimeout(() => {
        onComplete();
      }, 500);
    }, 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: themes[currentTheme].background,
        transition: 'background 1s ease-in-out',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
    >
      <h1 
        style={{
          backgroundImage: themes[currentTheme].titleGradient,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
          fontSize: showTitle ? '5rem' : '2.5rem',
          fontWeight: 700,
          margin: 0,
          transition: 'all 1s ease-in-out, background-image 1s ease-in-out',
          textAlign: 'center',
          animation: showTitle ? 'wave 2s ease-in-out infinite' : 'none',
          transform: showTitle ? 'translateY(0)' : 'translateY(-40vh) scale(0.5)',
          opacity: showTitle ? 1 : 0
        }}
      >
        TypeWave
      </h1>
      
      <style>{`
        @keyframes wave {
          0%, 100% { transform: translateY(0) scale(1); }
          25% { transform: translateY(-10px) scale(1.05); }
          50% { transform: translateY(0) scale(1); }
          75% { transform: translateY(-5px) scale(1.02); }
        }
      `}</style>
    </div>
  );
};
