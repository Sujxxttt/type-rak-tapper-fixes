import React from 'react';

interface TopControlsProps {
  currentActiveUser: string;
  onUserMenuClick: () => void;
  onSideMenuClick: () => void;
  onHomeClick: () => void;
  getButtonColor: () => string;
  fontSize: number;
  showHomeButton?: boolean;
}

export const TopControls: React.FC<TopControlsProps> = ({
  currentActiveUser,
  onUserMenuClick,
  onSideMenuClick,
  onHomeClick,
  getButtonColor,
  fontSize,
  showHomeButton = true
}) => {
  const buttonBaseStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: `${fontSize * 0.875}px`,
    fontWeight: '500',
    color: 'white',
    minWidth: '48px',
    height: '48px'
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        display: 'flex',
        gap: '0.75rem',
        zIndex: 10001
      }}
    >
      {/* User button */}
      <div
        onClick={onUserMenuClick}
        style={{
          ...buttonBaseStyle,
          gap: '0.5rem',
          minWidth: 'auto',
          paddingLeft: '1rem',
          paddingRight: '1rem'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        👤 {currentActiveUser || 'User'}
      </div>

      {/* Home button */}
      {showHomeButton && (
        <div
          onClick={onHomeClick}
          style={buttonBaseStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span style={{ fontSize: '1.25rem' }}>🏠</span>
        </div>
      )}

      {/* Sidebar button */}
      <div
        onClick={onSideMenuClick}
        style={buttonBaseStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <span style={{ fontSize: '1.25rem' }}>☰</span>
      </div>
    </div>
  );
};