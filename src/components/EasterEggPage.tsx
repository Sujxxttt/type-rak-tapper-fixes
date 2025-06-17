
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface EasterEggPageProps {
  theme: string;
  onBack: () => void;
}

export const EasterEggPage: React.FC<EasterEggPageProps> = ({ theme, onBack }) => {
  const [nameClicked, setNameClicked] = useState(false);

  const getTitleColor = () => {
    switch (theme) {
      case 'midnight-black': return '#ae1ee3';
      case 'cotton-candy-glow': return '#ff1fbc';
      default: return '#21b1ff'; // cosmic-nebula
    }
  };

  const getBackground = () => {
    switch (theme) {
      case 'cosmic-nebula': return 'linear-gradient(135deg, #8B5CF6 35%, #3B82F6 65%)';
      case 'midnight-black': return '#000000';
      case 'cotton-candy-glow': return 'linear-gradient(45deg, #74d2f1, #69c8e8)';
      default: return 'linear-gradient(135deg, #8B5CF6 35%, #3B82F6 65%)';
    }
  };

  const handleNameClick = () => {
    setNameClicked(!nameClicked);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: getBackground(),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: getTitleColor(),
      fontSize: '3rem',
      fontWeight: 'bold',
      zIndex: 9999,
      animation: 'fadeIn 0.5s ease-out'
    }}>
      <button
        onClick={onBack}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'none',
          border: 'none',
          color: getTitleColor(),
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '1rem',
          fontWeight: 'normal'
        }}
      >
        <ArrowLeft size={24} />
        Back
      </button>

      <div style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '15px 20px',
          fontSize: '1rem',
          color: 'white',
          animation: 'slideDown 0.5s ease-out 0.5s both'
        }}>
          There you go !!!
        </div>

        <div 
          onClick={handleNameClick}
          style={{
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
            animation: 'slideUp 0.5s ease-out 1s both'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Developed by {nameClicked ? 'Raktherock' : 'Rakshan Kumaraa'}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideDown {
          from { 
            opacity: 0; 
            transform: translateY(-30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </div>
  );
};
