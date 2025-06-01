
import React, { useState } from 'react';
import { X } from 'lucide-react';
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
  fontStyle: string;
  setFontStyle: (style: string) => void;
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
  setFontSize,
  fontStyle,
  setFontStyle
}) => {
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
  const [showFontStyleDropdown, setShowFontStyleDropdown] = useState(false);
  const [showCustomSlider, setShowCustomSlider] = useState(false);

  if (!sideMenuOpen) return null;

  const durationOptions = [
    { label: '15 seconds', value: 15 },
    { label: '30 seconds', value: 30 },
    { label: '1 minute', value: 60 },
    { label: '2 minutes', value: 120 },
    { label: '3 minutes', value: 180 },
    { label: '5 minutes', value: 300 },
    { label: '10 minutes', value: 600 },
    { label: '30 minutes', value: 1800 },
    { label: '60 minutes', value: 3600 },
    { label: 'Custom', value: 'custom' }
  ];

  const themeOptions = [
    { label: 'Cosmic Nebula', value: 'cosmic-nebula' },
    { label: 'Midnight Black', value: 'midnight-black' },
    { label: 'Cotton Candy Glow', value: 'cotton-candy-glow' }
  ];

  const fontSizeOptions = [
    { label: '75%', value: 75 },
    { label: '100%', value: 100 },
    { label: '125%', value: 125 },
    { label: '150%', value: 150 },
    { label: '175%', value: 175 },
    { label: '200%', value: 200 }
  ];

  const fontStyleOptions = [
    { label: 'Inter', value: 'inter' },
    { label: 'Roboto', value: 'roboto' },
    { label: 'Open Sans', value: 'open-sans' },
    { label: 'Lato', value: 'lato' },
    { label: 'Source Sans Pro', value: 'source-sans' }
  ];

  const handleDurationSelect = (value: any) => {
    if (value === 'custom') {
      setShowCustomSlider(true);
    } else {
      setDuration(value);
      setShowCustomSlider(false);
    }
    setShowDurationDropdown(false);
  };

  const getDurationLabel = () => {
    const option = durationOptions.find(opt => opt.value === duration);
    if (option) return option.label;
    
    // For custom durations
    if (duration < 60) {
      return `${duration} seconds`;
    } else if (duration < 3600) {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes} minutes`;
    } else {
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours} hours`;
    }
  };

  const getThemeLabel = () => {
    const option = themeOptions.find(opt => opt.value === theme);
    return option ? option.label : 'Unknown Theme';
  };

  const getFontSizeLabel = () => {
    return `${fontSize}%`;
  };

  const getFontStyleLabel = () => {
    const option = fontStyleOptions.find(opt => opt.value === fontStyle);
    return option ? option.label : 'Inter';
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: sideMenuOpen ? '0' : '-400px',
      width: '400px',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.95)',
      backdropFilter: 'blur(20px)',
      borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '20px',
      transition: 'right 0.3s ease-in-out',
      zIndex: 1000,
      overflowY: 'auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: 'white', margin: 0 }}>Settings</h2>
        <button 
          onClick={() => setSideMenuOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '5px'
          }}
        >
          <X size={24} />
        </button>
      </div>

      {/* User Management */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: 'white', marginBottom: '15px' }}>Users</h3>
        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
          {usersList.map((user, index) => (
            <div 
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                marginBottom: '8px',
                background: user === currentActiveUser ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
              onClick={() => switchUser(user)}
            >
              <span style={{ color: 'white' }}>{user}</span>
              {user === currentActiveUser && (
                <span style={{ color: getButtonColor(), fontSize: '0.8rem' }}>Active</span>
              )}
            </div>
          ))}
        </div>
        {currentActiveUser && (
          <button 
            onClick={handleDeleteUser}
            style={{
              width: '100%',
              background: deleteConfirmState ? '#e74c3c' : '#6c757d',
              color: 'white',
              border: 'none',
              padding: '10px',
              borderRadius: '6px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            {deleteConfirmState ? 'Confirm Delete?' : 'Delete Current User'}
          </button>
        )}
      </div>

      {/* Duration Dropdown */}
      <div style={{ marginBottom: '20px', position: 'relative' }}>
        <label style={{ display: 'block', color: 'white', marginBottom: '8px' }}>Test Duration</label>
        <button
          onClick={() => setShowDurationDropdown(!showDurationDropdown)}
          style={{
            width: '100%',
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {getDurationLabel()}
          <span style={{ transform: showDurationDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
        </button>
        
        {showDurationDropdown && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            zIndex: 1001,
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {durationOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleDurationSelect(option.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderBottom: index < durationOptions.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = 'transparent';
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Custom Duration Slider */}
      {showCustomSlider && (
        <CustomDurationSlider
          value={duration}
          onChange={setDuration}
          theme={theme}
        />
      )}

      {/* Theme Dropdown */}
      <div style={{ marginBottom: '20px', position: 'relative' }}>
        <label style={{ display: 'block', color: 'white', marginBottom: '8px' }}>Theme</label>
        <button
          onClick={() => setShowThemeDropdown(!showThemeDropdown)}
          style={{
            width: '100%',
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {getThemeLabel()}
          <span style={{ transform: showThemeDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
        </button>
        
        {showThemeDropdown && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            zIndex: 1001
          }}>
            {themeOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  applyTheme(option.value);
                  setShowThemeDropdown(false);
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderBottom: index < themeOptions.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = 'transparent';
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Font Size Dropdown */}
      <div style={{ marginBottom: '20px', position: 'relative' }}>
        <label style={{ display: 'block', color: 'white', marginBottom: '8px' }}>Font Size</label>
        <button
          onClick={() => setShowFontSizeDropdown(!showFontSizeDropdown)}
          style={{
            width: '100%',
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {getFontSizeLabel()}
          <span style={{ transform: showFontSizeDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
        </button>
        
        {showFontSizeDropdown && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            zIndex: 1001
          }}>
            {fontSizeOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  setFontSize(option.value);
                  setShowFontSizeDropdown(false);
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderBottom: index < fontSizeOptions.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = 'transparent';
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Font Style Dropdown */}
      <div style={{ marginBottom: '20px', position: 'relative' }}>
        <label style={{ display: 'block', color: 'white', marginBottom: '8px' }}>Font Style</label>
        <button
          onClick={() => setShowFontStyleDropdown(!showFontStyleDropdown)}
          style={{
            width: '100%',
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {getFontStyleLabel()}
          <span style={{ transform: showFontStyleDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
        </button>
        
        {showFontStyleDropdown && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            zIndex: 1001
          }}>
            {fontStyleOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  setFontStyle(option.value);
                  setShowFontStyleDropdown(false);
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderBottom: index < fontStyleOptions.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                  fontFamily: option.value === 'roboto' ? "'Roboto', sans-serif" :
                            option.value === 'open-sans' ? "'Open Sans', sans-serif" :
                            option.value === 'lato' ? "'Lato', sans-serif" :
                            option.value === 'source-sans' ? "'Source Sans Pro', sans-serif" :
                            "'Inter', sans-serif"
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = 'transparent';
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Menu Options */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => {
            handleHistoryClick();
            setSideMenuOpen(false);
          }}
          style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '12px',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          View History
        </button>
        
        <button 
          onClick={handleContactMe}
          style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '12px',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          Contact Me
        </button>

        <button 
          onClick={() => {
            window.open('https://github.com/Raktherock', '_blank');
            setSideMenuOpen(false);
          }}
          style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '12px',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          Check This Out
        </button>

        <button 
          onClick={() => {
            window.open('https://www.linkedin.com/in/rakshan-kumaraa-140049365/', '_blank');
            setSideMenuOpen(false);
          }}
          style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '12px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          About Me
        </button>
      </div>
    </div>
  );
};
