import React, { useState, useEffect, useRef } from 'react';
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
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [durationDropdownOpen, setDurationDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [fontSizeDropdownOpen, setFontSizeDropdownOpen] = useState(false);
  const [fontStyleDropdownOpen, setFontStyleDropdownOpen] = useState(false);
  
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sideMenuOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
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

  const getSidebarBackground = () => {
    if (theme === 'cosmic-nebula') {
      return 'linear-gradient(135deg, rgba(12, 12, 30, 0.5), rgba(26, 26, 62, 0.5), rgba(45, 27, 78, 0.5))';
    } else if (theme === 'midnight-black') {
      return 'rgba(30, 30, 30, 0.5)';
    } else if (theme === 'cotton-candy-glow') {
      return 'rgba(255, 182, 193, 0.5)';
    }
    return 'linear-gradient(135deg, rgba(12, 12, 30, 0.5), rgba(26, 26, 62, 0.5), rgba(45, 27, 78, 0.5))';
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
    { value: 30, label: "30 seconds" },
    { value: 60, label: "1 minute" },
    { value: 120, label: "2 minutes" },
    { value: 300, label: "5 minutes" },
    { value: 600, label: "10 minutes" }
  ];

  const themeOptions = [
    { value: 'cosmic-nebula', label: 'Cosmic Nebula' },
    { value: 'midnight-black', label: 'Midnight Black' },
    { value: 'cotton-candy-glow', label: 'Cotton Candy Glow' }
  ];

  const fontSizeOptions = [
    { value: 80, label: 'Very Small' },
    { value: 100, label: 'Small' },
    { value: 120, label: 'Normal' },
    { value: 140, label: 'Large' },
    { value: 160, label: 'Very Large' }
  ];

  const fontStyleOptions = [
    { value: 'inter', label: 'Inter' },
    { value: 'roboto', label: 'Roboto' },
    { value: 'open-sans', label: 'Open Sans' },
    { value: 'lato', label: 'Lato' },
    { value: 'source-sans', label: 'Source Sans Pro' },
    { value: 'dancing-script', label: 'Dancing Script' },
    { value: 'pacifico', label: 'Pacifico' }
  ];

  if (!sideMenuOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(5px)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div 
        ref={sidebarRef}
        style={{
          width: '400px',
          background: getSidebarBackground(),
          backdropFilter: 'blur(20px)',
          padding: '2rem',
          overflowY: 'auto',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transform: sideMenuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          animation: 'slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '1rem'
        }}>
          <h2 style={{
            color: getTextColor(),
            fontSize: '1.5rem',
            fontWeight: '600',
            margin: 0
          }}>
            Settings
          </h2>
          <button 
            onClick={() => setSideMenuOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: getTextColor(),
              padding: '8px',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Settings Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* User Selection */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <label style={{
              display: 'block',
              marginBottom: '0.75rem',
              color: getTextColor(),
              fontSize: '0.95rem',
              fontWeight: '500'
            }}>
              Current User:
            </label>
            <DropdownMenu open={userDropdownOpen} onOpenChange={setUserDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: getTextColor(),
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}>
                  <span>{currentActiveUser}</span>
                  <ChevronDown size={16} style={{
                    transform: userDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                style={{
                  background: getSidebarBackground(),
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  minWidth: '200px',
                  zIndex: 1001
                }}
              >
                {usersList.map((user) => (
                  <DropdownMenuItem
                    key={user}
                    onClick={() => switchUser(user)}
                    style={{
                      color: getTextColor(),
                      padding: '0.75rem',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {user}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <button 
              onClick={handleDeleteUser}
              style={{
                width: '100%',
                marginTop: '0.75rem',
                padding: '0.75rem',
                background: deleteConfirmState ? 'rgba(220, 53, 69, 0.8)' : 'rgba(220, 53, 69, 0.6)',
                border: '1px solid rgba(220, 53, 69, 0.8)',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.9rem',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!deleteConfirmState) {
                  e.currentTarget.style.background = 'rgba(220, 53, 69, 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (!deleteConfirmState) {
                  e.currentTarget.style.background = 'rgba(220, 53, 69, 0.6)';
                }
              }}
            >
              {deleteConfirmState ? 'Confirm Delete?' : 'Delete Current User'}
            </button>
          </div>

          {/* Test Duration */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <label style={{
              display: 'block',
              marginBottom: '0.75rem',
              color: getTextColor(),
              fontSize: '0.95rem',
              fontWeight: '500'
            }}>
              Test Duration:
            </label>
            <DropdownMenu open={durationDropdownOpen} onOpenChange={setDurationDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: getTextColor(),
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}>
                  <span>{durationOptions.find(opt => opt.value === duration)?.label || `${duration} seconds`}</span>
                  <ChevronDown size={16} style={{
                    transform: durationDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                style={{
                  background: getSidebarBackground(),
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  minWidth: '200px',
                  zIndex: 1001
                }}
              >
                {durationOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setDuration(option.value)}
                    style={{
                      color: getTextColor(),
                      padding: '0.75rem',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Theme Selection */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <label style={{
              display: 'block',
              marginBottom: '0.75rem',
              color: getTextColor(),
              fontSize: '0.95rem',
              fontWeight: '500'
            }}>
              Theme:
            </label>
            <DropdownMenu open={themeDropdownOpen} onOpenChange={setThemeDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: getTextColor(),
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}>
                  <span>{themeOptions.find(opt => opt.value === theme)?.label || theme}</span>
                  <ChevronDown size={16} style={{
                    transform: themeDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                style={{
                  background: getSidebarBackground(),
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  minWidth: '200px',
                  zIndex: 1001
                }}
              >
                {themeOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => applyTheme(option.value)}
                    style={{
                      color: getTextColor(),
                      padding: '0.75rem',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Font Size */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <label style={{
              display: 'block',
              marginBottom: '0.75rem',
              color: getTextColor(),
              fontSize: '0.95rem',
              fontWeight: '500'
            }}>
              Font Size:
            </label>
            <DropdownMenu open={fontSizeDropdownOpen} onOpenChange={setFontSizeDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: getTextColor(),
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}>
                  <span>{fontSizeOptions.find(opt => opt.value === fontSize)?.label || `${fontSize}%`}</span>
                  <ChevronDown size={16} style={{
                    transform: fontSizeDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                style={{
                  background: getSidebarBackground(),
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  minWidth: '200px',
                  zIndex: 1001
                }}
              >
                {fontSizeOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setFontSize(option.value)}
                    style={{
                      color: getTextColor(),
                      padding: '0.75rem',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Font Style */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <label style={{
              display: 'block',
              marginBottom: '0.75rem',
              color: getTextColor(),
              fontSize: '0.95rem',
              fontWeight: '500'
            }}>
              Font Style:
            </label>
            <DropdownMenu open={fontStyleDropdownOpen} onOpenChange={setFontStyleDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: getTextColor(),
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}>
                  <span>{fontStyleOptions.find(opt => opt.value === fontStyle)?.label || fontStyle}</span>
                  <ChevronDown size={16} style={{
                    transform: fontStyleDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                style={{
                  background: getSidebarBackground(),
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  minWidth: '200px',
                  zIndex: 1001
                }}
              >
                {fontStyleOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setFontStyle(option.value)}
                    style={{
                      color: getTextColor(),
                      padding: '0.75rem',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Sound Effects Toggle */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1rem',
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

        {/* Action Buttons */}
        <div style={{ 
          marginTop: '2rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.75rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '1.5rem'
        }}>
          <button 
            onClick={handleHistoryClick}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: getTextColor(),
              cursor: 'pointer',
              fontSize: '0.95rem',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            View History
          </button>
          <button 
            onClick={handleContactMe}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: getTextColor(),
              cursor: 'pointer',
              fontSize: '0.95rem',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            Contact Me
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
