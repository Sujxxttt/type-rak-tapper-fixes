
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface EasterEggPageProps {
  theme: string;
  onGoBack: () => void;
}

export const EasterEggPage: React.FC<EasterEggPageProps> = ({ theme, onGoBack }) => {
  const [nameClickCount, setNameClickCount] = useState(0);
  const [showArrow, setShowArrow] = useState(false);

  const getThemeBackground = () => {
    switch (theme) {
      case 'cosmic-nebula':
        return 'linear-gradient(135deg, #9509db 35%, #1c7ed4 100%)';
      case 'midnight-black':
        return '#000000';
      case 'cotton-candy-glow':
        return 'linear-gradient(45deg, #74d2f1, #69c8e8)';
      default:
        return 'linear-gradient(135deg, #9509db 35%, #1c7ed4 100%)';
    }
  };

  const getThemeTextColor = () => {
    switch (theme) {
      case 'cosmic-nebula':
        return 'linear-gradient(45deg, #a729f0 0%, #3c95fa 100%)';
      case 'midnight-black':
        return 'linear-gradient(90deg, #c559f7 0%, #7f59f7 100%)';
      case 'cotton-candy-glow':
        return 'linear-gradient(90deg, #ff59e8 0%, #ff52a8 100%)';
      default:
        return 'linear-gradient(45deg, #a729f0 0%, #3c95fa 100%)';
    }
  };

  const handleNameClick = () => {
    setNameClickCount(prev => prev + 1);
    if (nameClickCount === 1) {
      setShowArrow(true);
    }
  };

  useEffect(() => {
    // Show "There you go !!!" message
    const timer = setTimeout(() => {
      const message = document.createElement('div');
      message.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        padding: 10px 20px;
        color: white;
        font-size: 0.9rem;
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
      `;
      message.textContent = 'There you go !!!';
      document.body.appendChild(message);

      setTimeout(() => {
        if (document.body.contains(message)) {
          document.body.removeChild(message);
        }
      }, 3000);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

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
      zIndex: 9999
    }}>
      {showArrow && (
        <button
          onClick={onGoBack}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            padding: '10px',
            color: 'white',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={24} />
        </button>
      )}

      <div style={{
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          backgroundImage: getThemeTextColor(),
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
          marginBottom: '10px'
        }}>
          Developed by{' '}
          <span
            onClick={handleNameClick}
            style={{
              cursor: 'pointer',
              textDecoration: nameClickCount > 0 ? 'underline' : 'none'
            }}
          >
            {nameClickCount > 0 ? 'Raktherock' : 'Rakshan Kumaraa'}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
};
