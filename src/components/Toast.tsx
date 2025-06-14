
import React from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
  theme: string;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, theme }) => {
  if (!message) return null;

  const getAccentColor = () => {
    switch (theme) {
      case 'cosmic-nebula': return '#667eea';
      case 'midnight-black': return '#34495e';
      case 'cotton-candy-glow': return '#fd79a8';
      default: return '#667eea';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(20px)',
      border: `1px solid ${getAccentColor()}`,
      color: 'white',
      padding: '12px 24px 12px 24px',
      borderRadius: '12px',
      zIndex: 2000,
      fontSize: '0.9rem',
      maxWidth: '400px',
      textAlign: 'center',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          padding: '0',
          marginLeft: '12px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};
