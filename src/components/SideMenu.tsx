
import React from 'react';

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
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 999
        }}
        onClick={() => setSideMenuOpen(false)}
      ></div>
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '300px',
        height: '100%',
        background: 'rgba(30, 35, 45, 0.7)',
        backdropFilter: 'blur(20px)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '1.5rem',
        zIndex: 1000,
        color: '#e0e0e0',
        overflowY: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          paddingBottom: '1rem'
        }}>
          <h2>Settings</h2>
          <button 
            onClick={() => setSideMenuOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#cccccc',
              fontSize: '1.8rem',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>

        {/* User Selection Section */}
        <div style={{ margin: '1.5rem 0' }}>
          <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.95em', color: '#d0d0d0' }}>
            Select User:
          </label>
          <select 
            value={currentActiveUser}
            onChange={(e) => switchUser(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              marginBottom: '10px'
            }}
          >
            {usersList.map(user => (
              <option key={user} value={user} style={{ background: 'rgba(0,0,0,0.9)' }}>
                {user}
              </option>
            ))}
          </select>
          <button 
            onClick={handleDeleteUser}
            style={{
              backgroundColor: deleteConfirmState ? '#e74c3c' : '#c0392b',
              color: 'white',
              border: 'none',
              padding: '0.8rem 1.5rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              width: '100%'
            }}
          >
            {deleteConfirmState ? 'Confirm Delete?' : 'Delete Current User'}
          </button>
        </div>

        <div style={{ margin: '1.5rem 0' }}>
          <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.95em', color: '#d0d0d0' }}>
            Test Duration:
          </label>
          <select 
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value, 10))}
            style={{
              width: '100%',
              padding: '0.8rem',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)'
            }}
          >
            <option value="30" style={{ background: 'rgba(0,0,0,0.9)' }}>30 Seconds</option>
            <option value="60" style={{ background: 'rgba(0,0,0,0.9)' }}>1 Minute</option>
            <option value="120" style={{ background: 'rgba(0,0,0,0.9)' }}>2 Minutes</option>
            <option value="180" style={{ background: 'rgba(0,0,0,0.9)' }}>3 Minutes</option>
            <option value="300" style={{ background: 'rgba(0,0,0,0.9)' }}>5 Minutes</option>
            <option value="600" style={{ background: 'rgba(0,0,0,0.9)' }}>10 Minutes</option>
            <option value="1200" style={{ background: 'rgba(0,0,0,0.9)' }}>20 Minutes</option>
            <option value="1800" style={{ background: 'rgba(0,0,0,0.9)' }}>30 Minutes</option>
            <option value="3600" style={{ background: 'rgba(0,0,0,0.9)' }}>60 Minutes</option>
          </select>
        </div>

        <div style={{ margin: '1.5rem 0' }}>
          <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.95em', color: '#d0d0d0' }}>
            Theme:
          </label>
          <select 
            value={theme}
            onChange={(e) => applyTheme(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)'
            }}
          >
            <option value="cosmic-nebula" style={{ background: 'rgba(0,0,0,0.9)' }}>Cosmic Nebula</option>
            <option value="midnight-black" style={{ background: 'rgba(0,0,0,0.9)' }}>Midnight Black</option>
            <option value="cotton-candy-glow" style={{ background: 'rgba(0,0,0,0.9)' }}>Cotton Candy Glow</option>
          </select>
        </div>

        <div style={{ margin: '1.5rem 0' }}>
          <button
            onClick={handleHistoryClick}
            style={{
              width: '100%',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '0.8rem 1.5rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              marginBottom: '10px'
            }}
          >
            History
          </button>
        </div>

        <div style={{ margin: '1.5rem 0' }}>
          <button
            onClick={() => window.open('https://www.reddit.com/user/Rak_the_rock', '_blank')}
            style={{
              width: '100%',
              backgroundColor: getButtonColor(),
              color: 'white',
              border: 'none',
              padding: '0.8rem 1.5rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              marginBottom: '10px'
            }}
          >
            About Me
          </button>
          <button
            onClick={handleContactMe}
            style={{
              width: '100%',
              backgroundColor: getButtonColor(),
              color: 'white',
              border: 'none',
              padding: '0.8rem 1.5rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              marginBottom: '10px'
            }}
          >
            Contact Me
          </button>
          <button
            onClick={() => window.open('https://github.com/Raktherock', '_blank')}
            style={{
              width: '100%',
              backgroundColor: getButtonColor(),
              color: 'white',
              border: 'none',
              padding: '0.8rem 1.5rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              marginBottom: '10px'
            }}
          >
            Check This Out
          </button>
        </div>
      </div>
    </>
  );
};
