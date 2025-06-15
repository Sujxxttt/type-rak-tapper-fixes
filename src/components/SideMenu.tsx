import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
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
  setFontStyle,
  soundEnabled,
  setSoundEnabled
}) => {
  const [showCustomDuration, setShowCustomDuration] = useState(false);

  if (!sideMenuOpen) return null;

  const getGlassBackground = () => {
    if (theme === 'midnight-black') {
      return 'rgba(20, 20, 20, 0.9)';
    } else if (theme === 'cotton-candy-glow') {
      return 'rgba(255, 255, 255, 0.2)';
    }
    return 'rgba(30, 30, 60, 0.9)';
  };

  const getTextColor = () => {
    return theme === 'cotton-candy-glow' ? '#333' : '#fff';
  };

  const getFontFamily = (style: string) => {
    switch (style) {
      case 'roboto': return "'Roboto', sans-serif";
      case 'open-sans': return "'Open Sans', sans-serif";
      case 'lato': return "'Lato', sans-serif";
      case 'source-sans': return "'Source Sans Pro', sans-serif";
      case 'inter': return "'Inter', sans-serif";
      case 'dancing-script': return "'Dancing Script', cursive";
      case 'pacifico': return "'Pacifico', cursive";
      default: return "'Inter', sans-serif";
    }
  };

  const fontSizeOptions = [80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200];
  const fontStyleOptions = [
    { id: 'inter', name: 'Inter' },
    { id: 'roboto', name: 'Roboto' },
    { id: 'open-sans', name: 'Open Sans' },
    { id: 'lato', name: 'Lato' },
    { id: 'source-sans', name: 'Source Sans Pro' },
    { id: 'dancing-script', name: 'Dancing Script' },
    { id: 'pacifico', name: 'Pacifico' }
  ];

  const durationOptions = [
    { label: '30 seconds', value: 30 },
    { label: '1 Minute', value: 60 },
    { label: '2 Minutes', value: 120 },
    { label: '3 Minutes', value: 180 },
    { label: '5 Minutes', value: 300 },
    { label: '10 Minutes', value: 600 },
    { label: '30 Minutes', value: 1800 },
    { label: '45 Minutes', value: 2700 },
    { label: '60 Minutes', value: 3600 },
    { label: 'Custom', value: -1 }
  ];

  const themeOptions = [
    { id: 'cosmic-nebula', name: 'Cosmic Nebula' },
    { id: 'midnight-black', name: 'Midnight Black' },
    { id: 'cotton-candy-glow', name: 'Cotton Candy Glow' }
  ];

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds} seconds`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (remainingSeconds === 0) return `${minutes} Minute${minutes > 1 ? 's' : ''}`;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getCurrentDurationLabel = () => {
    const option = durationOptions.find(opt => opt.value === duration);
    return option ? option.label : formatDuration(duration);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 998,
          opacity: sideMenuOpen ? 1 : 0,
          visibility: sideMenuOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease, visibility 0.3s ease'
        }}
        onClick={() => setSideMenuOpen(false)}
      />

      {/* Side Menu */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: sideMenuOpen ? 0 : '-400px',
        width: '400px',
        height: '100vh',
        background: theme === 'midnight-black' ? '#1a1a1a' : 
                   theme === 'cotton-candy-glow' ? 'linear-gradient(45deg, #3e8cb9, #2f739d)' :
                   'linear-gradient(45deg, #3f034a, #004a7a)',
        zIndex: 999,
        overflowY: 'auto',
        padding: '20px',
        boxShadow: '-5px 0 15px rgba(0, 0, 0, 0.3)',
        transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: sideMenuOpen ? 'translateX(0)' : 'translateX(20px)',
        opacity: sideMenuOpen ? 1 : 0.9
      }}>
        {/* Close Button */}
        <button 
          onClick={() => setSideMenuOpen(false)}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
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

        <div style={{ marginTop: '50px' }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            paddingBottom: '15px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h2 style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              Settings
            </h2>
            <button
              onClick={() => setSideMenuOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: getTextColor(),
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
              }}
            >
              <X size={24} />
            </button>
          </div>

          {/* Users Section */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{
              marginBottom: '15px',
              fontSize: '1.1rem',
              fontWeight: '600',
              opacity: 0.9
            }}>
              Users
            </h3>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '15px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: getTextColor(),
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px'
                    }}
                  >
                    {currentActiveUser || 'Select User'}
                    <ChevronDown size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  style={{
                    background: getGlassBackground(),
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: getTextColor(),
                    zIndex: 1002
                  }}
                >
                  {usersList.map((user) => (
                    <DropdownMenuItem
                      key={user}
                      onClick={() => switchUser(user)}
                      style={{
                        cursor: 'pointer',
                        padding: '8px 12px',
                        background: user === currentActiveUser ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
                      }}
                    >
                      {user} {user === currentActiveUser && '(Active)'}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <button
                onClick={handleDeleteUser}
                style={{
                  background: deleteConfirmState ? '#e74c3c' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  width: '100%'
                }}
              >
                {deleteConfirmState ? 'Confirm Delete?' : 'Delete Current User'}
              </button>
            </div>
          </div>

          {/* Test Duration */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{
              marginBottom: '15px',
              fontSize: '1.1rem',
              fontWeight: '600',
              opacity: 0.9
            }}>
              Test Duration
            </h3>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '15px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: getTextColor(),
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    {getCurrentDurationLabel()}
                    <ChevronDown size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  style={{
                    background: getGlassBackground(),
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: getTextColor(),
                    zIndex: 1002
                  }}
                >
                  {durationOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.label}
                      onClick={() => {
                        if (option.value === -1) {
                          setShowCustomDuration(true);
                        } else {
                          setDuration(option.value);
                          setShowCustomDuration(false);
                        }
                      }}
                      style={{
                        cursor: 'pointer',
                        padding: '8px 12px',
                        background: duration === option.value ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
                      }}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {showCustomDuration && (
                <div style={{ marginTop: '10px' }}>
                  <CustomDurationSlider
                    value={duration}
                    onChange={(value) => setDuration(value)}
                    theme={theme}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Theme Selection - moved up */}
          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ marginBottom: '10px', color: 'white' }}>Theme:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { key: 'cosmic-nebula', label: 'Cosmic Nebula' },
                { key: 'midnight-black', label: 'Midnight Black' },
                { key: 'cotton-candy-glow', label: 'Cotton Candy Glow' }
              ].map(themeOption => (
                <button
                  key={themeOption.key}
                  onClick={() => applyTheme(themeOption.key)}
                  style={{
                    background: theme === themeOption.key ? getButtonColor() : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    textAlign: 'left'
                  }}
                >
                  {themeOption.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Settings */}
          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ marginBottom: '10px', color: 'white' }}>Font Size: {fontSize}%</h4>
            <input
              type="range"
              min="80"
              max="200"
              step="10"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              style={{
                width: '100%',
                marginBottom: '15px'
              }}
            />
            
            <h4 style={{ marginBottom: '10px', color: 'white' }}>Font Style:</h4>
            <select
              value={fontStyle}
              onChange={(e) => setFontStyle(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                marginBottom: '10px'
              }}
            >
              <option value="inter">Inter</option>
              <option value="roboto">Roboto</option>
              <option value="open-sans">Open Sans</option>
              <option value="lato">Lato</option>
              <option value="source-sans">Source Sans Pro</option>
              <option value="dancing-script">Dancing Script</option>
              <option value="pacifico">Pacifico</option>
            </select>
          </div>

          {/* Sound Effects - moved lower */}
          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ marginBottom: '10px', color: 'white' }}>Sound Effects:</h4>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'white',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer'
                }}
              />
              Enable typing sounds
            </label>
          </div>

          {/* Actions */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '15px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <button
              onClick={handleHistoryClick}
              style={{
                background: getButtonColor(),
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
                width: '100%',
                marginBottom: '10px'
              }}
            >
              View History
            </button>
            <button
              onClick={handleContactMe}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: getTextColor(),
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
                width: '100%'
              }}
            >
              Contact Developer
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
