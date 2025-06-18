
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface EasterEggPageProps {
  theme: string;
  onGoBack: () => void;
}

export const EasterEggPage: React.FC<EasterEggPageProps> = ({ theme, onGoBack }) => {
  const [nameClickCount, setNameClickCount] = useState(0);
  const [showArrow, setShowArrow] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    setShowMessage(true);
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (nameClickCount >= 2) {
      setShowArrow(true);
    }
  }, [nameClickCount]);

  const getThemeBackground = () => {
    switch (theme) {
      case 'cosmic-nebula':
        return 'linear-gradient(135deg, #b109d6 35%, #0c6dc2 100%)';
      case 'midnight-black':
        return '#000000';
      case 'cotton-candy-glow':
        return 'linear-gradient(45deg, #74d2f1, #69c8e8)';
      default:
        return 'linear-gradient(135deg, #b109d6 35%, #0c6dc2 100%)';
    }
  };

  const getTitleGradient = () => {
    if (theme === 'cosmic-nebula') {
      return 'linear-gradient(45deg, #a729f0 0%, #3c95fa 100%)';
    } else if (theme === 'midnight-black') {
      return 'linear-gradient(90deg, #c559f7 0%, #7f59f7 100%)';
    } else if (theme === 'cotton-candy-glow') {
      return 'linear-gradient(90deg, #ff59e8 0%, #ff52a8 100%)';
    }
    return 'linear-gradient(45deg, #a729f0 0%, #3c95fa 100%)';
  };

  const handleNameClick = () => {
    setNameClickCount(prev => prev + 1);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: getThemeBackground(),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000
    }}>
      {showMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          padding: '10px 20px',
          color: 'white',
          fontSize: '1rem',
          zIndex: 10001
        }}>
          There you go !!!
        </div>
      )}

      {showArrow && (
        <button
          onClick={onGoBack}
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            cursor: 'pointer',
            zIndex: 10001
          }}
        >
          <ArrowLeft size={24} />
        </button>
      )}

      <h1
        onClick={handleNameClick}
        style={{
          backgroundImage: getTitleGradient(),
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
          fontSize: '3rem',
          fontWeight: 700,
          textAlign: 'center',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        Developed by {nameClickCount > 0 ? 'Raktherock' : 'Rakshan Kumaraa'}
      </h1>
    </div>
  );
};
