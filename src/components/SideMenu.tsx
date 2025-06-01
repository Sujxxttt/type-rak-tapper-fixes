
import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { CustomDurationSlider } from './CustomDurationSlider';

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
  fontSize: number;
  setFontSize: (size: number) => void;
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
  getButtonColor,
  fontSize,
  setFontSize
}) => {
  const [durationDropdownOpen, setDurationDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [fontSizeDropdownOpen, setFontSizeDropdownOpen] = useState(false);
  const [showCustomSlider, setShowCustomSlider] = useState(false);

  if (!sideMenuOpen) return null;

  const durationOptions = [
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' },
    { value: 120, label: '2 minutes' },
    { value: 180, label: '3 minutes' },
    { value: 300, label: '5 minutes' },
    { value: 600, label: '10 minutes' },
    { value: 1800, label: '30 minutes' },
    { value: 3600, label: '60 minutes' },
    { value: -1, label: 'Custom' }
  ];

  const themeOptions = [
    { id: 'cosmic-nebula', name: 'Cosmic Nebula' },
    { id: 'midnight-black', name: 'Midnight Black' },
    { id: 'cotton-candy-glow', name: 'Cotton Candy Glow' }
  ];

  const fontSizeOptions = [
    { value: 50, label: '50%' },
    { value: 75, label: '75%' },
    { value: 100, label: '100%' },
    { value: 125, label: '125%' },
    { value: 150, label: '150%' },
    { value: 175, label: '175%' },
    { value: 200, label: '200%' }
  ];

  const formatDurationLabel = (seconds: number) => {
    if (seconds < 60) return `${seconds} seconds`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
    return `${Math.floor(seconds / 3600)} hours`;
  };

  const handleDurationSelect = (value: number) => {
    if (value === -1) {
      setShowCustomSlider(true);
    } else {
      setDuration(value);
      setShowCustomSlider(false);
    }
    setDurationDropdownOpen(false);
  };

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
        width: '380px',
        height: '100vh',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        zIndex: 999,
        overflowY: 'auto',
        padding: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h3 style={{ color: 'white', margin: 0, fontSize: '1.4rem', fontWeight: '600' }}>Settings</h3>
          <button 
            onClick={() => setSideMenuOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            <X size={22} />
          </button>
        </div>

        {/* User Management */}
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{ marginBottom: '15px', color: 'white', fontSize: '1.1rem' }}>Users</h4>
          <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
            {usersList.map(user => (
              <div key={user} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 15px',
                background: user === currentActiveUser ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                marginBottom: '8px',
                cursor: 'pointer',
                color: 'white',
                transition: 'background 0.2s',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }} 
              onClick={() => switchUser(user)}
              onMouseEnter={(e) => {
                if (user !== currentActiveUser) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (user !== currentActiveUser) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              >
                <span style={{ fontSize: '0.95rem' }}>{user}</span>
                {user === currentActiveUser && <span style={{ fontSize: '1rem', color: getButtonColor() }}>✓</span>}
              </div>
            ))}
          </div>
          <button 
            onClick={handleDeleteUser}
            disabled={usersList.length === 0}
            style={{
              width: '100%',
              background: usersList.length === 0 ? 'rgba(108, 117, 125, 0.5)' : (deleteConfirmState ? '#e74c3c' : '#dc3545'),
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              cursor: usersList.length === 0 ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              opacity: usersList.length === 0 ? 0.5 : 1,
              marginTop: '10px',
              transition: 'background 0.2s'
            }}
          >
            {deleteConfirmState ? 'Confirm Delete' : 'Delete Current User'}
          </button>
        </div>

        {/* Font Size Settings */}
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{ marginBottom: '15px', color: 'white', fontSize: '1.1rem' }}>Font Size</h4>
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setFontSizeDropdownOpen(!fontSizeDropdownOpen)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '12px 15px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
            >
              <span>{fontSize}%</span>
              {fontSizeDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {fontSizeDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'rgba(0, 0, 0, 0.9)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                marginTop: '4px',
                zIndex: 1000,
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {fontSizeOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFontSize(option.value);
                      setFontSizeDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      background: fontSize === option.value ? getButtonColor() : 'transparent',
                      color: 'white',
                      border: 'none',
                      padding: '12px 15px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (fontSize !== option.value) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (fontSize !== option.value) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Duration Settings */}
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{ marginBottom: '15px', color: 'white', fontSize: '1.1rem' }}>Test Duration</h4>
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setDurationDropdownOpen(!durationDropdownOpen)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '12px 15px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
            >
              <span>{showCustomSlider ? 'Custom' : (durationOptions.find(opt => opt.value === duration)?.label || formatDurationLabel(duration))}</span>
              {durationDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {durationDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'rgba(0, 0, 0, 0.9)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                marginTop: '4px',
                zIndex: 1000,
                maxHeight: '250px',
                overflowY: 'auto'
              }}>
                {durationOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleDurationSelect(option.value)}
                    style={{
                      width: '100%',
                      background: (option.value === duration || (option.value === -1 && showCustomSlider)) ? getButtonColor() : 'transparent',
                      color: 'white',
                      border: 'none',
                      padding: '12px 15px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (option.value !== duration && !(option.value === -1 && showCustomSlider)) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (option.value !== duration && !(option.value === -1 && showCustomSlider)) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {showCustomSlider && (
            <CustomDurationSlider
              value={duration}
              onChange={setDuration}
              theme={theme}
            />
          )}
        </div>

        {/* Theme Settings */}
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{ marginBottom: '15px', color: 'white', fontSize: '1.1rem' }}>Theme</h4>
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '12px 15px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
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
                background: 'rgba(0, 0, 0, 0.9)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
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
                      color: 'white',
                      border: 'none',
                      padding: '12px 15px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (theme !== themeOption.id) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (theme !== themeOption.id) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    {themeOption.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => {
              setSideMenuOpen(false);
              handleHistoryClick();
            }}
            style={{
              width: '100%',
              background: 'rgba(108, 117, 125, 0.8)',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              marginBottom: '12px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(108, 117, 125, 1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(108, 117, 125, 0.8)'}
          >
            History
          </button>
        </div>

        {/* Social/Info Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            onClick={() => {
              setSideMenuOpen(false);
              window.open('https://github.com/Raktherock', '_blank');
            }}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '12px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
          >
            About Me
          </button>

          <button 
            onClick={() => {
              setSideMenuOpen(false);
              handleContactMe();
            }}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '12px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
          >
            Contact Me
          </button>

          <button 
            onClick={() => {
              setSideMenuOpen(false);
              window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
            }}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '12px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
          >
            Check This Out
          </button>
        </div>
      </div>
    </>
  );
};
