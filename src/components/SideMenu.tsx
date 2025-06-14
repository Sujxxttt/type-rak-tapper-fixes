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
  // New: Add "show" state for smooth open/close animation
  const [show, setShow] = useState(sideMenuOpen);

  // Track menu open/close so we can animate out smoothly
  React.useEffect(() => {
    if (sideMenuOpen) {
      setShow(true);
    } else {
      // Wait for animation before hiding sidebar
      const timeout = setTimeout(() => setShow(false), 350);
      return () => clearTimeout(timeout);
    }
  }, [sideMenuOpen]);

  // Animate sidebar and backdrop using Tailwind and conditional classes
  if (!show && !sideMenuOpen) return null;

  const backdropVisible = sideMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none';
  const sidebarVisible = sideMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0';

  const getGlassBackground = () => {
    // Even more transparency for better effect
    if (theme === 'midnight-black') {
      return 'rgba(20, 20, 20, 0.38)';
    } else if (theme === 'cotton-candy-glow') {
      return 'rgba(255, 255, 255, 0.11)';
    }
    return 'rgba(30, 30, 60, 0.38)';
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
        className={`fixed top-0 left-0 w-full h-full z-[1000] transition-opacity duration-300 ease-in-out ${backdropVisible}`}
        style={{
          background: 'rgba(0,0,0,0.44)',
          backdropFilter: 'blur(4px)'
        }}
        onClick={() => setSideMenuOpen(false)}
      />

      {/* Side Menu */}
      <div
        className={`fixed top-0 right-0 w-[400px] max-w-[90vw] h-full z-[1001] p-5 overflow-y-auto transition-all duration-350 ease-in-out ${sidebarVisible}`}
        style={{
          background: getGlassBackground(),
          backdropFilter: 'blur(24px)',
          borderLeft: '1px solid rgba(255,255,255,0.18)',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.28)',
          color: getTextColor(),
        }}
      >
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

        {/* Font Size */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{
            marginBottom: '15px',
            fontSize: '1.1rem',
            fontWeight: '600',
            opacity: 0.9
          }}>
            Font Size
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
                  {fontSize}%
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
                {fontSizeOptions.map((size) => (
                  <DropdownMenuItem
                    key={size}
                    onClick={() => setFontSize(size)}
                    style={{
                      cursor: 'pointer',
                      padding: '8px 12px',
                      background: fontSize === size ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
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
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{
            marginBottom: '15px',
            fontSize: '1.1rem',
            fontWeight: '600',
            opacity: 0.9
          }}>
            Font Style
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
                  {fontStyleOptions.find(f => f.id === fontStyle)?.name || 'Inter'}
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
                {fontStyleOptions.map((font) => (
                  <DropdownMenuItem
                    key={font.id}
                    onClick={() => setFontStyle(font.id)}
                    style={{
                      cursor: 'pointer',
                      padding: '8px 12px',
                      background: fontStyle === font.id ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
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
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{
            marginBottom: '15px',
            fontSize: '1.1rem',
            fontWeight: '600',
            opacity: 0.9
          }}>
            Theme
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
                  {themeOptions.find(t => t.id === theme)?.name || 'Cosmic Nebula'}
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
                {themeOptions.map((themeOption) => (
                  <DropdownMenuItem
                    key={themeOption.id}
                    onClick={() => applyTheme(themeOption.id)}
                    style={{
                      cursor: 'pointer',
                      padding: '8px 12px',
                      background: theme === themeOption.id ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
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
    </>
  );
};
