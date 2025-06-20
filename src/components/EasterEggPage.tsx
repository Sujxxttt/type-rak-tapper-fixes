
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
    'linear-gradient(135deg, #0c6dc2 0%, #b109d6 100%)', // cosmic nebula
    'linear-gradient(90deg, #c559f7 0%, #7f59f7 100%)', // midnight black
    'linear-gradient(90deg, #fc03df 0%, #ff3be8 100%)'  // cotton candy
  ];

  useEffect(() => {
    setShowMessage(true);
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 4000); // Increased from 3000ms
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
    }, 2500); // Slightly increased from 2000ms

    return () => clearInterval(colorInterval);
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
      background: '#171717',
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
          padding: '12px 24px',
          color: 'white',
          fontSize: '1.1rem',
          zIndex: 10001,
          animation: 'fadeIn 0.5s ease-out'
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
            zIndex: 10001,
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <ArrowLeft size={24} />
        </button>
      )}

      <div style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '15px'
      }}>
        <h1 style={{
          backgroundImage: titleGradients[currentColorCycle],
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
          fontSize: '4rem',
          fontWeight: 700,
          textAlign: 'center',
          margin: 0,
          transition: 'background-image 0.6s ease-in-out'
        }}>
          TypeWave
        </h1>
        
        <div style={{
          fontSize: '1.2rem',
          color: 'white',
          marginBottom: '25px'
        }}>
          by
        </div>
        
        <div style={{
          fontSize: '1.6rem'
        }}>
          <span
            onClick={handleNameClick}
            style={{
              backgroundImage: titleGradients[currentColorCycle],
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'background-image 0.6s ease-in-out'
            }}
          >
            {nameClickCount % 2 === 0 ? 'Rakshan Kumaraa' : 'Raktherock'}
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
