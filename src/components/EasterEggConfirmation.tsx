
import React from 'react';
import { X } from 'lucide-react';

interface EasterEggConfirmationProps {
  theme: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const EasterEggConfirmation: React.FC<EasterEggConfirmationProps> = ({
  theme,
  onConfirm,
  onCancel
}) => {
  const getThemeColors = () => {
    switch (theme) {
      case 'midnight-black':
        return {
          gradient: 'linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(26, 26, 46, 0.95) 50%, rgba(22, 33, 62, 0.95) 100%)',
          textColor: 'white',
          buttonGradient: 'linear-gradient(90deg, #c559f7 0%, #7f59f7 100%)'
        };
      case 'cotton-candy-glow':
        return {
          gradient: 'linear-gradient(135deg, rgba(255, 238, 248, 0.95) 0%, rgba(248, 215, 218, 0.95) 50%, rgba(232, 197, 229, 0.95) 100%)',
          textColor: '#333',
          buttonGradient: 'linear-gradient(90deg, #fc03df 0%, #ff3be8 100%)'
        };
      case 'cosmic-nebula':
      default:
        return {
          gradient: 'linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(26, 26, 46, 0.95) 50%, rgba(22, 33, 62, 0.95) 100%)',
          textColor: 'white',
          buttonGradient: 'linear-gradient(45deg, #b109d6 0%, #0c6dc2 100%)'
        };
    }
  };

  const themeColors = getThemeColors();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        position: 'relative',
        background: themeColors.gradient,
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
        color: themeColors.textColor
      }}>
        <button
          onClick={onCancel}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            color: themeColors.textColor,
            cursor: 'pointer',
            opacity: 0.7,
            transition: 'opacity 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
        >
          <X size={24} />
        </button>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            margin: '0 0 15px 0',
            backgroundImage: themeColors.buttonGradient,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Wanna see the credits ??
          </h2>
          <p style={{
            fontSize: '1rem',
            opacity: 0.8,
            margin: 0
          }}>
            You've scrolled to the bottom! Ready to see who made this magic happen?
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center'
        }}>
          <button
            onClick={onConfirm}
            style={{
              background: themeColors.buttonGradient,
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Sure
          </button>
          <button
            onClick={onConfirm}
            style={{
              background: themeColors.buttonGradient,
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};
