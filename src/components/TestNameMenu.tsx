
import React from 'react';

interface TestNameMenuProps {
  currentUser: string;
  onOpenSideMenu: () => void;
  theme: string;
}

export const TestNameMenu: React.FC<TestNameMenuProps> = ({
  currentUser,
  onOpenSideMenu,
  theme
}) => {
  const getButtonColor = () => {
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
      top: '20px',
      left: '20px',
      right: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 100
    }}>
      <h1 style={{
        margin: 0,
        fontSize: '2.5rem',
        fontWeight: 700,
        background: theme === 'cosmic-nebula' ? 'linear-gradient(90deg, #c454f0 0%, #7d54f0 100%)' :
                   theme === 'midnight-black' ? 'linear-gradient(90deg, #c559f7 0%, #7f59f7 100%)' :
                   'linear-gradient(90deg, #ff59e8 0%, #ff52a8 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent'
      }}>
        TypeWave
      </h1>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <span style={{ 
          color: 'white', 
          fontSize: '1.2rem',
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '8px 16px',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)'
        }}>
          {currentUser}
        </span>
        
        <button
          onClick={onOpenSideMenu}
          style={{
            background: getButtonColor(),
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '25px',
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease'
          }}
        >
          Settings
        </button>
      </div>
    </div>
  );
};
