import React, { useState, useRef, useEffect } from 'react';
import { UsersDropdown } from './UsersDropdown';

interface TopControlsProps {
  currentActiveUser: string;
  onUserMenuClick: () => void;
  onSideMenuClick: () => void;
  onHomeClick: () => void;
  getButtonColor: () => string;
  fontSize: number;
  showHomeButton?: boolean;
  usersList?: string[];
  onCreateUser?: () => void;
  onSelectUser?: (username: string) => void;
  usersWithPasswords?: Array<{username: string; hasPassword: boolean}>;
}

export const TopControls: React.FC<TopControlsProps> = ({
  currentActiveUser,
  onUserMenuClick,
  onSideMenuClick,
  onHomeClick,
  getButtonColor,
  fontSize,
  showHomeButton = true,
  usersList = [],
  onCreateUser,
  onSelectUser,
  usersWithPasswords = []
}) => {
  const [showUsersDropdown, setShowUsersDropdown] = useState(false);
  const usersButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (usersButtonRef.current && !usersButtonRef.current.contains(event.target as Node)) {
        setShowUsersDropdown(false);
      }
    };

    if (showUsersDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUsersDropdown]);

  const handleUserButtonClick = () => {
    if (usersWithPasswords.length > 0) {
      setShowUsersDropdown(!showUsersDropdown);
    } else {
      onUserMenuClick();
    }
  };
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
        ref={usersButtonRef}
        style={{ position: 'relative' }}
      >
        <div
          onClick={handleUserButtonClick}
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
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span style={{ fontSize: '0.75rem' }}>Users: {currentActiveUser || 'User'}</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
        </div>

        <UsersDropdown
          isOpen={showUsersDropdown}
          onClose={() => setShowUsersDropdown(false)}
          users={usersWithPasswords}
          currentUser={currentActiveUser}
          onSelectUser={(username) => {
            onSelectUser?.(username);
            setShowUsersDropdown(false);
          }}
          onCreateUser={() => {
            onCreateUser?.();
            setShowUsersDropdown(false);
          }}
        />
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
            <path d="M9 22V12h6v10"/>
          </svg>
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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </div>
    </div>
  );
};