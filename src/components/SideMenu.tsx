
import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [durationDropdownOpen, setDurationDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  if (!sideMenuOpen) return null;

  const durationOptions = [
    { value: 15, label: '15 seconds' },
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' },
    { value: 120, label: '2 minutes' },
    { value: 300, label: '5 minutes' },
    { value: 600, label: '10 minutes' }
  ];

  const themeOptions = [
    { id: 'cosmic-nebula', name: 'Cosmic Nebula' },
    { id: 'midnight-black', name: 'Midnight Black' },
    { id: 'cotton-candy-glow', name: 'Cotton Candy Glow' }
  ];

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

        {/* Duration Settings with Dropdown */}
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{ marginBottom: '15px' }}>Test Duration</h4>
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setDurationDropdownOpen(!durationDropdownOpen)}
              style={{
                width: '100%',
                background: getButtonColor(),
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>{durationOptions.find(opt => opt.value === duration)?.label || '1 minute'}</span>
              {durationDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {durationDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '6px',
                marginTop: '4px',
                zIndex: 1000,
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {durationOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setDuration(option.value);
                      setDurationDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      background: duration === option.value ? getButtonColor() : 'transparent',
                      color: duration === option.value ? 'white' : '#333',
                      border: 'none',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Theme Settings with Dropdown */}
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{ marginBottom: '15px' }}>Theme</h4>
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              style={{
                width: '100%',
                background: getButtonColor(),
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>{themeOptions.find(opt => opt.id === theme)?.name || 'Cosmic Nebula'}</span>
              {themeDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {themeDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '6px',
                marginTop: '4px',
                zIndex: 1000
              }}>
                {themeOptions.map(themeOption => (
                  <button
                    key={themeOption.id}
                    onClick={() => {
                      applyTheme(themeOption.id);
                      setThemeDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      background: theme === themeOption.id ? getButtonColor() : 'transparent',
                      color: theme === themeOption.id ? 'white' : '#333',
                      border: 'none',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {themeOption.name}
                  </button>
                ))}
              </div>
            )}
          </div>
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

        {/* About Me Button */}
        <div style={{ marginBottom: '15px' }}>
          <button 
            onClick={() => {
              setSideMenuOpen(false);
              window.open('https://github.com/Raktherock', '_blank');
            }}
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
            About Me
          </button>
        </div>

        {/* Contact Me Button */}
        <div style={{ marginBottom: '15px' }}>
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

        {/* Check This Out Button */}
        <div>
          <button 
            onClick={() => {
              setSideMenuOpen(false);
              window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
            }}
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
            Check This Out
          </button>
        </div>
      </div>
    </>
  );
};
