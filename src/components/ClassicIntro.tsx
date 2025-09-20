import React, { useState, useEffect } from 'react';

interface ClassicIntroProps {
  onComplete: () => void;
  theme: string;
}

export const ClassicIntro: React.FC<ClassicIntroProps> = ({ onComplete, theme }) => {
  const [visible, setVisible] = useState(true);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s ease-out'
      }}
    >
      <h1
        style={{
          fontSize: '6rem',
          fontWeight: 800,
          background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
          margin: 0,
          textShadow: `
            0 0 20px ${colors.primary}40,
            0 0 40px ${colors.primary}30,
            0 0 60px ${colors.primary}20,
            0 0 80px ${colors.primary}10
          `,
          filter: `drop-shadow(0 0 30px ${colors.primary}30)`,
          animation: 'classicGlow 2s ease-in-out infinite alternate'
        }}
      >
        CLASSIC
      </h1>
      
      <style>{`
        @keyframes classicGlow {
          0% {
            filter: drop-shadow(0 0 20px ${colors.primary}40) drop-shadow(0 0 40px ${colors.secondary}20);
            transform: scale(1);
          }
          100% {
            filter: drop-shadow(0 0 40px ${colors.primary}60) drop-shadow(0 0 60px ${colors.secondary}40);
            transform: scale(1.02);
          }
        }
      `}</style>
    </div>
  );
};