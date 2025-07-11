
import React from 'react';
import { X } from 'lucide-react';

interface EasterEggConfirmationProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
  theme: string;
}

export const EasterEggConfirmation: React.FC<EasterEggConfirmationProps> = ({
  isOpen,
  onConfirm,
  onClose,
  theme
}) => {
  if (!isOpen) return null;

  const getBackgroundStyle = () => {
    switch (theme) {
      case 'midnight-black':
        return 'rgba(26, 26, 26, 0.95)';
      case 'cotton-candy-glow':
        return 'rgba(18, 207, 243, 0.15)';
      case 'cosmic-nebula':
      default:
        return 'rgba(64, 3, 84, 0.15)';
    }
  };

  const getButtonColor = () => {
    switch (theme) {
      case 'midnight-black':
        return '#c559f7';
      case 'cotton-candy-glow':
        return '#ff59e8';
      case 'cosmic-nebula':
      default:
        return '#b109d6';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        position: 'relative',
        background: getBackgroundStyle(),
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            padding: '5px',
            borderRadius: '50%',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
          }}
        >
          <X size={20} />
        </button>

        <h2 style={{
          margin: '0 0 20px 0',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: 'white'
        }}>
          Wanna see the credits ??
        </h2>

        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          marginTop: '30px'
        }}>
          <button
            onClick={onConfirm}
            style={{
              background: getButtonColor(),
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
            }}
          >
            Sure
          </button>
          
          <button
            onClick={onConfirm}
            style={{
              background: getButtonColor(),
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
            }}
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};
