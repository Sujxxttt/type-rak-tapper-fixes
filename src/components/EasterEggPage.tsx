
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface EasterEggPageProps {
  theme: string;
  onGoBack: () => void;
}

export const EasterEggPage: React.FC<EasterEggPageProps> = ({ theme, onGoBack }) => {
  const [nameClicks, setNameClicks] = useState(0);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Show the glass message when entering
    setShowMessage(true);
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const getThemeBackground = () => {
    switch (theme) {
      case 'cosmic-nebula':
        return 'linear-gradient(45deg, #b109d6 35%, #0c6dc2 100%)';
      case 'midnight-black':
        return '#000000';
      case 'cotton-candy-glow':
        return 'linear-gradient(45deg, #74d2f1, #69c8e8)';
      default:
        return 'linear-gradient(45deg, #b109d6 35%, #0c6dc2 100%)';
    }
  };

  const getTitleGradient = () => {
    switch (theme) {
      case 'cosmic-nebula':
        return 'linear-gradient(45deg, #b109d6 0%, #0c6dc2 100%)';
      case 'midnight-black':
        return 'linear-gradient(90deg, #c559f7 0%, #7f59f7 100%)';
      case 'cotton-candy-glow':
        return 'linear-gradient(90deg, #ff59e8 0%, #ff52a8 100%)';
      default:
        return 'linear-gradient(45deg, #b109d6 0%, #0c6dc2 100%)';
    }
  };

  const handleNameClick = () => {
    if (nameClicks === 0) {
      setNameClicks(1);
    }
  };

  const displayName = nameClicks === 0 ? 'Rakshan Kumaraa' : 'Raktherock';

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
      {/* Back arrow */}
      <button
        onClick={onGoBack}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
      >
        <ArrowLeft size={24} color="white" />
      </button>

      {/* Main content */}
      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontSize: '1.5rem',
          color: 'white',
          marginBottom: '1rem'
        }}>
          Developed by
        </p>
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
            margin: 0,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {displayName}
        </h1>
      </div>

      {/* Glass message */}
      {showMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          padding: '10px 20px',
          color: 'white',
          fontSize: '0.9rem',
          zIndex: 10001,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          There you go !!!
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
};
