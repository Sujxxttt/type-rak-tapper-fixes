import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
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

  const getSwitchThemeColor = () => {
    if (theme === 'midnight-black') {
      return '#fff';
    } else if (theme === 'cotton-candy-glow') {
      return '#333';
    }
    return '#fff';
  };

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
          transition: 'opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), visibility 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
        onClick={() => setSideMenuOpen(false)}
      />

      {/* Side Menu */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: sideMenuOpen ? 0 : '-420px',
        width: '420px',
        height: '100vh',
        background: theme === 'midnight-black' ? 'rgba(26, 26, 26, 0.95)' : 
                   theme === 'cotton-candy-glow' ? 'rgba(62, 140, 185, 0.95)' :
                   'rgba(63, 3, 74, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 999,
        overflowY: 'auto',
        padding: '25px',
        boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.3)',
        transition: 'right 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        transform: sideMenuOpen ? 'translateX(0) scale(1)' : 'translateX(30px) scale(0.95)',
        opacity: sideMenuOpen ? 1 : 0.8
      }}>
        {/* Header with Close Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '1.8rem',
            fontWeight: 'bold',
            color: getTextColor()
          }}>
            Settings
          </h2>
          <button
            onClick={() => setSideMenuOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: getTextColor(),
              cursor: 'pointer',
              padding: '10px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Users Section */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{
            marginBottom: '15px',
            fontSize: '1.1rem',
            fontWeight: '600',
            color: getTextColor(),
            opacity: 0.9
          }}>
            Users
          </h3>
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: getTextColor(),
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease'
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
                  borderRadius: '10px',
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
                      padding: '10px 16px',
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
                background: deleteConfirmState ? '#e74c3c' : 'rgba(108, 117, 125, 0.8)',
                color: 'white',
                border: 'none',
                padding: '12px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                width: '100%',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
            >
              {deleteConfirmState ? 'Confirm Delete?' : 'Delete Current User'}
            </button>
          </div>
        </div>

        {/* Test Duration */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{
            marginBottom: '15px',
            fontSize: '1.1rem',
            fontWeight: '600',
            color: getTextColor(),
            opacity: 0.9
          }}>
            Test Duration
          </h3>
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: getTextColor(),
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease'
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
                  borderRadius: '10px',
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
                      padding: '10px 16px',
                      background: duration === option.value ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
                    }}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {showCustomDuration && (
              <div style={{ marginTop: '15px' }}>
                <CustomDurationSlider
                  value={duration}
                  onChange={(value) => setDuration(value)}
                  theme={theme}
                />
              </div>
            )}
          </div>
        </div>

        {/* Theme Selection */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{
            marginBottom: '15px',
            fontSize: '1.1rem',
            fontWeight: '600',
            color: getTextColor(),
            opacity: 0.9
          }}>
            Theme
          </h3>
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: getTextColor(),
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {themeOptions.find(t => t.id === theme)?.name || 'Select Theme'}
                  <ChevronDown size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                style={{
                  background: getGlassBackground(),
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  color: getTextColor(),
                  zIndex: 1002
                }}
              >
                {themeOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.id}
                    onClick={() => applyTheme(option.id)}
                    style={{
                      cursor: 'pointer',
                      padding: '10px 16px',
                      background: theme === option.id ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
                    }}
                  >
                    {option.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Font Settings */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{
            marginBottom: '15px',
            fontSize: '1.1rem',
            fontWeight: '600',
            color: getTextColor(),
            opacity: 0.9
          }}>
            Font Settings
          </h3>
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '10px', 
                color: getTextColor(),
                fontSize: '0.95rem'
              }}>
                Font Size: {fontSize}%
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: getTextColor(),
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {fontSize}%
                    <ChevronDown size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  style={{
                    background: getGlassBackground(),
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    color: getTextColor(),
                    zIndex: 1002,
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}
                >
                  {fontSizeOptions.map((size) => (
                    <DropdownMenuItem
                      key={size}
                      onClick={() => setFontSize(size)}
                      style={{
                        cursor: 'pointer',
                        padding: '10px 16px',
                        background: fontSize === size ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
                      }}
                    >
                      {size}%
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '10px', 
                color: getTextColor(),
                fontSize: '0.95rem'
              }}>
                Font Style
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: getTextColor(),
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {fontStyleOptions.find(f => f.id === fontStyle)?.name || 'Select Font'}
                    <ChevronDown size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  style={{
                    background: getGlassBackground(),
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    color: getTextColor(),
                    zIndex: 1002
                  }}
                >
                  {fontStyleOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.id}
                      onClick={() => setFontStyle(option.id)}
                      style={{
                        cursor: 'pointer',
                        padding: '10px 16px',
                        background: fontStyle === option.id ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
                      }}
                    >
                      {option.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Sound Effects */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{
            marginBottom: '15px',
            fontSize: '1.1rem',
            fontWeight: '600',
            color: getTextColor(),
            opacity: 0.9
          }}>
            Sound Effects
          </h3>
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: getTextColor(),
              fontSize: '0.95rem'
            }}>
              <label style={{ color: 'inherit' }}>
                Enable typing sounds
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center'
              }}>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                  style={{
                    '--switch-thumb': getSwitchThemeColor(),
                    '--switch-track': soundEnabled ? getSwitchThemeColor() : 'rgba(255, 255, 255, 0.3)'
                  } as React.CSSProperties}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <button
            onClick={handleHistoryClick}
            style={{
              background: getButtonColor(),
              color: 'white',
              border: 'none',
              padding: '15px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              width: '100%',
              marginBottom: '15px',
              transition: 'all 0.3s ease'
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
              padding: '15px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              width: '100%',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
          >
            Contact Developer
          </button>
        </div>
      </div>
    </>
  );
};
