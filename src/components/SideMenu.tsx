
import React from 'react';
import { X } from 'lucide-react';

interface SideMenuProps {
  sideMenuOpen: boolean;
  setSideMenuOpen: (open: boolean) => void;
  usersList: string[];
  currentActiveUser: string;
  switchUser: (username: string) => void;
  handleDeleteUser: () => void;
  deleteConfirmState: boolean;
  duration: number;
  setDuration: (duration: number) => void;
  theme: string;
  applyTheme: (theme: string) => void;
  handleHistoryClick: () => void;
  handleContactMe: () => void;
  getButtonColor: () => string;
}

export const SideMenu: React.FC<SideMenuProps> = ({
  sideMenuOpen,
  setSideMenuOpen,
  usersList,
  currentActiveUser,
  switchUser,
  handleDeleteUser,
  deleteConfirmState,
  duration,
  setDuration,
  theme,
  applyTheme,
  handleHistoryClick,
  handleContactMe,
  getButtonColor
}) => {
  if (!sideMenuOpen) return null;

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 998
        }}
        onClick={() => setSideMenuOpen(false)}
      />
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '350px',
        height: '100vh',
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        zIndex: 999,
        overflowY: 'auto',
        padding: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Settings</h3>
          <button 
            onClick={() => setSideMenuOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '5px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* User Management */}
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{ marginBottom: '15px' }}>Users</h4>
          {usersList.map(user => (
            <div key={user} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              background: user === currentActiveUser ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              marginBottom: '8px',
              cursor: 'pointer'
            }} onClick={() => switchUser(user)}>
              <span>{user}</span>
              {user === currentActiveUser && <span style={{ fontSize: '0.8rem' }}>✓</span>}
            </div>
          ))}
          <button 
            onClick={handleDeleteUser}
            disabled={usersList.length === 0}
            style={{
              width: '100%',
              background: usersList.length === 0 ? '#6c757d' : (deleteConfirmState ? '#e74c3c' : '#dc3545'),
              color: 'white',
              border: 'none',
              padding: '10px',
              borderRadius: '6px',
              cursor: usersList.length === 0 ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              opacity: usersList.length === 0 ? 0.5 : 1
            }}
          >
            {deleteConfirmState ? 'Confirm Delete' : 'Delete Current User'}
          </button>
        </div>

        {/* Duration Settings */}
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{ marginBottom: '15px' }}>Test Duration</h4>
          {[30, 60, 120, 300].map(dur => (
            <button 
              key={dur}
              onClick={() => setDuration(dur)}
              style={{
                width: '100%',
                background: duration === dur ? getButtonColor() : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: 'none',
                padding: '10px',
                borderRadius: '6px',
                cursor: 'pointer',
                marginBottom: '8px'
              }}
            >
              {dur < 60 ? `${dur} seconds` : `${dur / 60} minute${dur > 60 ? 's' : ''}`}
            </button>
          ))}
        </div>

        {/* Theme Settings */}
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{ marginBottom: '15px' }}>Theme</h4>
          {[
            { id: 'cosmic-nebula', name: 'Cosmic Nebula' },
            { id: 'midnight-black', name: 'Midnight Black' },
            { id: 'cotton-candy-glow', name: 'Cotton Candy Glow' }
          ].map(themeOption => (
            <button 
              key={themeOption.id}
              onClick={() => applyTheme(themeOption.id)}
              style={{
                width: '100%',
                background: theme === themeOption.id ? getButtonColor() : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: 'none',
                padding: '10px',
                borderRadius: '6px',
                cursor: 'pointer',
                marginBottom: '8px'
              }}
            >
              {themeOption.name}
            </button>
          ))}
        </div>

        {/* History Button */}
        <div style={{ marginBottom: '30px' }}>
          <button 
            onClick={() => {
              setSideMenuOpen(false);
              handleHistoryClick();
            }}
            style={{
              width: '100%',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            History
          </button>
        </div>

        {/* Contact */}
        <div>
          <button 
            onClick={handleContactMe}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Contact Me
          </button>
        </div>
      </div>
    </>
  );
};
