
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
  const [showCustomDuration, setShowCustomDuration] = useState(false);

  if (!sideMenuOpen) return null;

  // Glass translucent styling
  const getGlassBackground = () => {
    return 'rgba(255, 255, 255, 0.08)';
  };

  const getTextColor = () => {
    return theme === 'cotton-candy-glow' ? '#1a365d' : '#fff';
  };

  const getBorderColor = () => {
    return 'rgba(255, 255, 255, 0.12)';
  };

  const getCardBackground = () => {
    return 'rgba(255, 255, 255, 0.06)';
  };

  const getCardBorder = () => {
    return '1px solid rgba(255, 255, 255, 0.08)';
  };

  const getDropdownBackground = () => {
    return 'rgba(255, 255, 255, 0.1)';
  };

  const getDropdownBorder = () => {
    return '1px solid rgba(255, 255, 255, 0.15)';
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
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000
        }}
        onClick={() => setSideMenuOpen(false)}
      />

      {/* Side Menu */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '420px',
          maxWidth: '90vw',
          height: '100vh',
          background: getGlassBackground(),
          backdropFilter: 'blur(24px)',
          border: `1px solid ${getBorderColor()}`,
          borderRight: 'none',
          zIndex: 1001,
          padding: '24px',
          overflowY: 'auto',
          color: getTextColor(),
          boxShadow: '-20px 0 40px rgba(0, 0, 0, 0.15)'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          paddingBottom: '16px',
          borderBottom: `1px solid ${getBorderColor()}`
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
              padding: '10px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Users Section */}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{
            marginBottom: '16px',
            fontSize: '1.1rem',
            fontWeight: '600',
            opacity: 0.9
          }}>
            Users
          </h3>
          <div style={{
            background: getCardBackground(),
            borderRadius: '16px',
            padding: '18px',
            border: getCardBorder(),
            backdropFilter: 'blur(12px)'
          }}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: getDropdownBorder(),
                    background: getDropdownBackground(),
                    color: getTextColor(),
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  {currentActiveUser || 'Select User'}
                  <ChevronDown size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                style={{
                  background: getGlassBackground(),
                  backdropFilter: 'blur(24px)',
                  border: getBorderColor(),
                  borderRadius: '12px',
                  color: getTextColor(),
                  zIndex: 1002,
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
                }}
              >
                {usersList.map((user) => (
                  <DropdownMenuItem
                    key={user}
                    onClick={() => switchUser(user)}
                    style={{
                      cursor: 'pointer',
                      padding: '10px 16px',
                      background: user === currentActiveUser ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                      borderRadius: '6px',
                      margin: '2px'
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
                padding: '10px 18px',
                borderRadius: '10px',
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
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{
            marginBottom: '16px',
            fontSize: '1.1rem',
            fontWeight: '600',
            opacity: 0.9
          }}>
            Test Duration
          </h3>
          <div style={{
            background: getCardBackground(),
            borderRadius: '16px',
            padding: '18px',
            border: getCardBorder(),
            backdropFilter: 'blur(12px)'
          }}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: getDropdownBorder(),
                    background: getDropdownBackground(),
                    color: getTextColor(),
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  {getCurrentDurationLabel()}
                  <ChevronDown size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                style={{
                  background: getGlassBackground(),
                  backdropFilter: 'blur(24px)',
                  border: getBorderColor(),
                  borderRadius: '12px',
                  color: getTextColor(),
                  zIndex: 1002,
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
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
                      background: duration === option.value ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                      borderRadius: '6px',
                      margin: '2px'
                    }}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {showCustomDuration && (
              <div style={{ marginTop: '12px' }}>
                <CustomDurationSlider
                  value={duration}
                  onChange={(value) => setDuration(value)}
                  theme={theme}
                />
              </div>
            )}
          </div>
        </div>

        {/* Font Size */}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{
            marginBottom: '16px',
            fontSize: '1.1rem',
            fontWeight: '600',
            opacity: 0.9
          }}>
            Font Size
          </h3>
          <div style={{
            background: getCardBackground(),
            borderRadius: '16px',
            padding: '18px',
            border: getCardBorder(),
            backdropFilter: 'blur(12px)'
          }}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: getDropdownBorder(),
                    background: getDropdownBackground(),
                    color: getTextColor(),
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  {fontSize}%
                  <ChevronDown size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                style={{
                  background: getGlassBackground(),
                  backdropFilter: 'blur(24px)',
                  border: getBorderColor(),
                  borderRadius: '12px',
                  color: getTextColor(),
                  zIndex: 1002,
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
                }}
              >
                {fontSizeOptions.map((size) => (
                  <DropdownMenuItem
                    key={size}
                    onClick={() => setFontSize(size)}
                    style={{
                      cursor: 'pointer',
                      padding: '10px 16px',
                      background: fontSize === size ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                      borderRadius: '6px',
                      margin: '2px'
                    }}
                  >
                    {size}%
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Font Style */}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{
            marginBottom: '16px',
            fontSize: '1.1rem',
            fontWeight: '600',
            opacity: 0.9
          }}>
            Font Style
          </h3>
          <div style={{
            background: getCardBackground(),
            borderRadius: '16px',
            padding: '18px',
            border: getCardBorder(),
            backdropFilter: 'blur(12px)'
          }}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: getDropdownBorder(),
                    background: getDropdownBackground(),
                    color: getTextColor(),
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  {fontStyleOptions.find(f => f.id === fontStyle)?.name || 'Inter'}
                  <ChevronDown size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                style={{
                  background: getGlassBackground(),
                  backdropFilter: 'blur(24px)',
                  border: getBorderColor(),
                  borderRadius: '12px',
                  color: getTextColor(),
                  zIndex: 1002,
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
                }}
              >
                {fontStyleOptions.map((font) => (
                  <DropdownMenuItem
                    key={font.id}
                    onClick={() => setFontStyle(font.id)}
                    style={{
                      cursor: 'pointer',
                      padding: '10px 16px',
                      background: fontStyle === font.id ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                      borderRadius: '6px',
                      margin: '2px',
                      fontFamily: getFontFamily(font.id)
                    }}
                  >
                    {font.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Theme */}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{
            marginBottom: '16px',
            fontSize: '1.1rem',
            fontWeight: '600',
            opacity: 0.9
          }}>
            Theme
          </h3>
          <div style={{
            background: getCardBackground(),
            borderRadius: '16px',
            padding: '18px',
            border: getCardBorder(),
            backdropFilter: 'blur(12px)'
          }}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: getDropdownBorder(),
                    background: getDropdownBackground(),
                    color: getTextColor(),
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  {themeOptions.find(t => t.id === theme)?.name || 'Cosmic Nebula'}
                  <ChevronDown size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                style={{
                  background: getGlassBackground(),
                  backdropFilter: 'blur(24px)',
                  border: getBorderColor(),
                  borderRadius: '12px',
                  color: getTextColor(),
                  zIndex: 1002,
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
                }}
              >
                {themeOptions.map((themeOption) => (
                  <DropdownMenuItem
                    key={themeOption.id}
                    onClick={() => applyTheme(themeOption.id)}
                    style={{
                      cursor: 'pointer',
                      padding: '10px 16px',
                      background: theme === themeOption.id ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                      borderRadius: '6px',
                      margin: '2px'
                    }}
                  >
                    {themeOption.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Actions */}
        <div style={{
          background: getCardBackground(),
          borderRadius: '16px',
          padding: '18px',
          border: getCardBorder(),
          backdropFilter: 'blur(12px)'
        }}>
          <button
            onClick={handleHistoryClick}
            style={{
              background: getButtonColor(),
              color: 'white',
              border: 'none',
              padding: '14px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              width: '100%',
              marginBottom: '12px'
            }}
          >
            View History
          </button>
          <button
            onClick={handleContactMe}
            style={{
              background: getDropdownBackground(),
              color: getTextColor(),
              border: getDropdownBorder(),
              padding: '14px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              width: '100%'
            }}
          >
            Contact Developer
          </button>
        </div>
      </div>
    </>
  );
};
