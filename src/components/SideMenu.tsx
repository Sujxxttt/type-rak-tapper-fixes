import React, { useState, useRef, useEffect } from 'react';
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
  const [showUsersDropdown, setShowUsersDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
  const [showFontStyleDropdown, setShowFontStyleDropdown] = useState(false);
  const [showCustomSlider, setShowCustomSlider] = useState(false);
  
  const sideMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sideMenuRef.current && !sideMenuRef.current.contains(event.target as Node)) {
        setSideMenuOpen(false);
      }
    };

    if (sideMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sideMenuOpen, setSideMenuOpen]);

  if (!sideMenuOpen) return null;

  const durationOptions = [
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
    { label: 'Source Sans Pro', value: 'source-sans' },
    { label: 'Dancing Script', value: 'dancing-script' },
    { label: 'Pacifico', value: 'pacifico' }
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

  const getFontFamily = (style: string) => {
    switch (style) {
      case 'roboto': return "'Roboto', sans-serif";
      case 'open-sans': return "'Open Sans', sans-serif";
      case 'lato': return "'Lato', sans-serif";
      case 'source-sans': return "'Source Sans Pro', sans-serif";
      case 'dancing-script': return "'Dancing Script', cursive";
      case 'pacifico': return "'Pacifico', cursive";
      default: return "'Inter', sans-serif";
    }
  };

  const getGlassStyle = () => {
    switch (theme) {
      case 'midnight-black':
        return {
          background: 'rgba(20, 20, 30, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(147, 51, 234, 0.3)',
          boxShadow: '0 8px 32px rgba(147, 51, 234, 0.15)'
        };
      case 'cotton-candy-glow':
        return {
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 182, 193, 0.4)',
          boxShadow: '0 8px 32px rgba(255, 105, 180, 0.2)'
        };
      default: // cosmic-nebula
        return {
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(124, 58, 237, 0.3)',
          boxShadow: '0 8px 32px rgba(124, 58, 237, 0.2)'
        };
    }
  };

  const getDropdownGlassStyle = () => {
    switch (theme) {
      case 'midnight-black':
        return {
          background: 'rgba(30, 30, 45, 0.9)',
          backdropFilter: 'blur(25px)',
          border: '1px solid rgba(147, 51, 234, 0.4)',
          boxShadow: '0 12px 40px rgba(147, 51, 234, 0.25)'
        };
      case 'cotton-candy-glow':
        return {
          background: 'rgba(255, 255, 255, 0.35)',
          backdropFilter: 'blur(25px)',
          border: '1px solid rgba(255, 182, 193, 0.5)',
          boxShadow: '0 12px 40px rgba(255, 105, 180, 0.3)'
        };
      default: // cosmic-nebula
        return {
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(25px)',
          border: '1px solid rgba(124, 58, 237, 0.4)',
          boxShadow: '0 12px 40px rgba(124, 58, 237, 0.3)'
        };
    }
  };

  const getTextColor = () => {
    return theme === 'cotton-candy-glow' ? '#333' : 'white';
  };

  const dropdownStyle = {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
  };

  return (
    <div 
      ref={sideMenuRef}
      style={{
        position: 'fixed',
        top: 0,
        right: sideMenuOpen ? '0' : '-420px',
        width: '420px',
        height: '100vh',
        ...getGlassStyle(),
        padding: '20px',
        transition: 'right 0.3s ease-in-out',
        zIndex: 1000,
        overflowY: 'auto',
        fontSize: '0.85rem'
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px'
      }}>
        <h2 style={{ color: getTextColor(), margin: 0, fontSize: '1.4rem' }}>Settings</h2>
        <button 
          onClick={() => setSideMenuOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: getTextColor(),
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '5px'
          }}
        >
          <X size={24} />
        </button>
      </div>

      {/* Users Dropdown */}
      <div style={{ marginBottom: '20px', position: 'relative' }}>
        <h3 style={{ color: getTextColor(), marginBottom: '10px', fontSize: '1rem' }}>Users</h3>
        <button
          onClick={() => setShowUsersDropdown(!showUsersDropdown)}
          style={{
            width: '100%',
            padding: '10px 12px',
            ...getDropdownGlassStyle(),
            color: getTextColor(),
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem',
            borderRadius: '12px'
          }}
        >
          {currentActiveUser || 'Select User'}
          <span style={{ transform: showUsersDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
        </button>
        
        {showUsersDropdown && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            ...getDropdownGlassStyle(),
            zIndex: 1001,
            maxHeight: '200px',
            overflowY: 'auto',
            marginTop: '5px',
            borderRadius: '12px'
          }}>
            {usersList.map((user, index) => (
              <button
                key={index}
                onClick={() => {
                  switchUser(user);
                  setShowUsersDropdown(false);
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: user === currentActiveUser ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  border: 'none',
                  color: getTextColor(),
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderBottom: index < usersList.length - 1 ? `1px solid rgba(255, 255, 255, 0.1)` : 'none',
                  fontSize: '0.85rem'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = user === currentActiveUser ? 'rgba(255, 255, 255, 0.2)' : 'transparent';
                }}
              >
                {user}
              </button>
            ))}
          </div>
        )}
        
        {currentActiveUser && (
          <button 
            onClick={handleDeleteUser}
            style={{
              width: '100%',
              background: deleteConfirmState ? '#e74c3c' : '#dc3545',
              color: 'white',
              border: 'none',
              padding: '8px',
              borderRadius: '6px',
              cursor: 'pointer',
              marginTop: '8px',
              fontSize: '0.8rem'
            }}
          >
            {deleteConfirmState ? 'Confirm Delete?' : 'Delete Current User'}
          </button>
        )}
      </div>

      {/* Duration Dropdown */}
      <div style={{ marginBottom: '15px', position: 'relative' }}>
        <label style={{ display: 'block', color: getTextColor(), marginBottom: '6px', fontSize: '0.9rem' }}>Test Duration</label>
        <button
          onClick={() => setShowDurationDropdown(!showDurationDropdown)}
          style={{
            width: '100%',
            padding: '10px 12px',
            ...getDropdownGlassStyle(),
            color: getTextColor(),
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem',
            borderRadius: '12px'
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
            ...getDropdownGlassStyle(),
            zIndex: 1001,
            maxHeight: '200px',
            overflowY: 'auto',
            marginTop: '5px',
            borderRadius: '12px'
          }}>
            {durationOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleDurationSelect(option.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'transparent',
                  border: 'none',
                  color: getTextColor(),
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderBottom: index < durationOptions.length - 1 ? `1px solid rgba(255, 255, 255, 0.1)` : 'none',
                  fontSize: '0.85rem'
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
        <div style={{ marginBottom: '15px' }}>
          <CustomDurationSlider
            value={duration}
            onChange={setDuration}
            theme={theme}
          />
        </div>
      )}

      {/* Theme Dropdown */}
      <div style={{ marginBottom: '15px', position: 'relative' }}>
        <label style={{ display: 'block', color: getTextColor(), marginBottom: '6px', fontSize: '0.9rem' }}>Theme</label>
        <button
          onClick={() => setShowThemeDropdown(!showThemeDropdown)}
          style={{
            width: '100%',
            padding: '10px 12px',
            ...getDropdownGlassStyle(),
            color: getTextColor(),
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem',
            borderRadius: '12px'
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
            ...getDropdownGlassStyle(),
            zIndex: 1001,
            marginTop: '5px',
            borderRadius: '12px'
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
                  padding: '8px 12px',
                  background: 'transparent',
                  border: 'none',
                  color: getTextColor(),
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderBottom: index < themeOptions.length - 1 ? `1px solid rgba(255, 255, 255, 0.1)` : 'none',
                  fontSize: '0.85rem'
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
      <div style={{ marginBottom: '15px', position: 'relative' }}>
        <label style={{ display: 'block', color: getTextColor(), marginBottom: '6px', fontSize: '0.9rem' }}>Font Size</label>
        <button
          onClick={() => setShowFontSizeDropdown(!showFontSizeDropdown)}
          style={{
            width: '100%',
            padding: '10px 12px',
            ...getDropdownGlassStyle(),
            color: getTextColor(),
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem',
            borderRadius: '12px'
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
            ...getDropdownGlassStyle(),
            zIndex: 1001,
            marginTop: '5px',
            borderRadius: '12px'
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
                  padding: '8px 12px',
                  background: 'transparent',
                  border: 'none',
                  color: getTextColor(),
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderBottom: index < fontSizeOptions.length - 1 ? `1px solid rgba(255, 255, 255, 0.1)` : 'none',
                  fontSize: '0.85rem'
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
        <label style={{ display: 'block', color: getTextColor(), marginBottom: '6px', fontSize: '0.9rem' }}>Font Style</label>
        <button
          onClick={() => setShowFontStyleDropdown(!showFontStyleDropdown)}
          style={{
            width: '100%',
            padding: '10px 12px',
            ...getDropdownGlassStyle(),
            color: getTextColor(),
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem',
            borderRadius: '12px'
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
            ...getDropdownGlassStyle(),
            zIndex: 1001,
            marginTop: '5px',
            borderRadius: '12px'
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
                  padding: '8px 12px',
                  background: 'transparent',
                  border: 'none',
                  color: getTextColor(),
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderBottom: index < fontStyleOptions.length - 1 ? `1px solid rgba(255, 255, 255, 0.1)` : 'none',
                  fontSize: '0.85rem',
                  fontFamily: getFontFamily(option.value)
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
            background: 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '10px',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '8px',
            fontSize: '0.85rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLElement;
            target.style.background = 'linear-gradient(135deg, #5a6578 0%, #3d4758 100%)';
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLElement;
            target.style.background = 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)';
          }}
        >
          View History
        </button>
        
        <button 
          onClick={handleContactMe}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '10px',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '8px',
            fontSize: '0.85rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLElement;
            target.style.background = 'linear-gradient(135deg, #7689fa 0%, #865bb2 100%)';
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLElement;
            target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
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
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '10px',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '8px',
            fontSize: '0.85rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLElement;
            target.style.background = 'linear-gradient(135deg, #ffa3fb 0%, #f5677c 100%)';
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLElement;
            target.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
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
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '10px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLElement;
            target.style.background = 'linear-gradient(135deg, #5fbcfe 0%, #10f2fe 100%)';
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLElement;
            target.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
          }}
        >
          About Me
        </button>
      </div>
    </div>
  );
};
