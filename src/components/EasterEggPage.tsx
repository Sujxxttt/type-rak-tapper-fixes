
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
  const [currentColorCycle, setCurrentColorCycle] = useState(0);

  const titleGradients = [
    'linear-gradient(45deg, #b109d6 0%, #0c6dc2 100%)', // cosmic nebula
    'linear-gradient(90deg, #c559f7 0%, #7f59f7 100%)', // midnight black
    'linear-gradient(90deg, #ff59e8 0%, #ff52a8 100%)'  // cotton candy
  ];

  const [gradientPosition, setGradientPosition] = useState(0);

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

  useEffect(() => {
    const colorInterval = setInterval(() => {
      setCurrentColorCycle(prev => (prev + 1) % titleGradients.length);
    }, 2000);

    const positionInterval = setInterval(() => {
      setGradientPosition(prev => (prev + 1) % 100);
    }, 50);

    return () => {
      clearInterval(colorInterval);
      clearInterval(positionInterval);
    };
  }, []);

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
      background: '#000000',
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
          zIndex: 10001,
          transition: 'all 0.3s ease'
        }}
      >
        <ArrowLeft size={24} />
      </button>

      <div style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px'
      }}>
        <h1 style={{
          backgroundImage: `${titleGradients[currentColorCycle]}`,
          backgroundSize: '200% 200%',
          backgroundPosition: `${gradientPosition}% 50%`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
          fontSize: '4rem',
          fontWeight: 700,
          textAlign: 'center',
          margin: 0,
          transition: 'background-image 0.5s ease-in-out',
          animation: 'heartbeat 2s ease-in-out infinite'
        }}>
          TypeWave
        </h1>
        
        <div style={{
          fontSize: '1rem',
          color: 'white',
          marginBottom: '20px',
          fontFamily: 'serif',
          fontStyle: 'italic',
          fontWeight: 300
        }}>
          by
        </div>
        
        <div style={{
          fontSize: '1.5rem'
        }}>
          <span
            onClick={handleNameClick}
            style={{
              backgroundImage: `${titleGradients[currentColorCycle]}`,
              backgroundSize: '200% 200%',
              backgroundPosition: `${gradientPosition}% 50%`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'background-image 0.5s ease-in-out'
            }}
          >
            {nameClickCount % 2 === 0 ? 'Rakshan Kumaraa' : 'Raktherock'}
          </span>
        </div>
      </div>
      
      <style>{`
        @keyframes heartbeat {
          0%, 100% { 
            transform: scale(1);
          }
          50% { 
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};
