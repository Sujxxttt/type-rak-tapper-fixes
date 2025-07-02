import React from 'react';
import { X } from 'lucide-react';

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
  backgroundMusicEnabled: boolean;
  setBackgroundMusicEnabled: (enabled: boolean) => void;
  musicVolume: number;
  setMusicVolume: (volume: number) => void;
  hasMusic: boolean;
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
  setSoundEnabled,
  backgroundMusicEnabled,
  setBackgroundMusicEnabled,
  musicVolume,
  setMusicVolume,
  hasMusic
}) => {
  const closeSideMenu = () => {
    setSideMenuOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      {sideMenuOpen && <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.6)',
        zIndex: 1000,
        backdropFilter: 'blur(5px)'
      }} onClick={closeSideMenu}></div>}
      
      <div style={{
        position: 'fixed',
        top: 0,
        right: sideMenuOpen ? 0 : '-400px',
        width: '400px',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(20px)',
        transition: 'right 0.3s ease-in-out',
        zIndex: 1001,
        overflowY: 'auto',
        padding: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* Close Button */}
        <button onClick={closeSideMenu} style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '1.5rem',
          cursor: 'pointer'
        }}>
          <X size={24} />
        </button>

        {/* User Section */}
        <div style={{
          marginBottom: '2rem'
        }}>
          <h3 style={{
            color: 'white',
            marginBottom: '1rem',
            fontSize: '1.1rem'
          }}>User Management</h3>
          <div style={{
            marginBottom: '1rem'
          }}>
            <label style={{
              color: 'white',
              display: 'block',
              marginBottom: '0.5rem'
            }}>Current User: {currentActiveUser}</label>
            <select value={currentActiveUser} onChange={(e) => switchUser(e.target.value)} style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              marginBottom: '0.5rem'
            }}>
              {usersList.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
            <button onClick={() => {
              setSideMenuOpen(false);
              if (window.location.pathname === '/') {
                const event = new CustomEvent('navigateToCreateUser');
                window.dispatchEvent(event);
              }
            }} style={{
              background: getButtonColor(),
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              width: '100%',
              marginBottom: '0.5rem'
            }}>
              Create New User
            </button>
          </div>
          <button onClick={handleDeleteUser} style={{
            background: deleteConfirmState ? 'rgba(231, 76, 60, 0.7)' : 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            width: '100%'
          }}>
            {deleteConfirmState ? 'Confirm Delete User?' : 'Delete Current User'}
          </button>
        </div>

        {/* Test Duration */}
        <div style={{
          marginBottom: '2rem'
        }}>
          <h3 style={{
            color: 'white',
            marginBottom: '1rem',
            fontSize: '1.1rem'
          }}>Test Duration</h3>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          />
        </div>

        {/* Theme Section */}
        <div style={{
          marginBottom: '2rem'
        }}>
          <h3 style={{
            color: 'white',
            marginBottom: '1rem',
            fontSize: '1.1rem'
          }}>Theme</h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            {['cosmic-nebula', 'midnight-black', 'cotton-candy-glow'].map(t => (
              <button
                key={t}
                onClick={() => applyTheme(t)}
                style={{
                  background: theme === t ? getButtonColor() : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  flex: '1 1 auto',
                  minWidth: '80px'
                }}
              >
                {t.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Font Settings */}
        <div style={{
          marginBottom: '2rem'
        }}>
          <h3 style={{
            color: 'white',
            marginBottom: '1rem',
            fontSize: '1.1rem'
          }}>Font Settings</h3>
          <div style={{
            marginBottom: '1rem'
          }}>
            <label style={{
              color: 'white',
              display: 'block',
              marginBottom: '0.5rem'
            }}>Font Size: {fontSize}%</label>
            <input
              type="range"
              min="80"
              max="180"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.1)'
              }}
            />
          </div>
          <div>
            <label style={{
              color: 'white',
              display: 'block',
              marginBottom: '0.5rem'
            }}>Font Style:</label>
            <select value={fontStyle} onChange={(e) => setFontStyle(e.target.value)} style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <option value="inter">Inter</option>
              <option value="roboto">Roboto</option>
              <option value="open-sans">Open Sans</option>
              <option value="lato">Lato</option>
              <option value="source-sans-pro">Source Sans Pro</option>
              <option value="dancing-script">Dancing Script</option>
              <option value="pacifico">Pacifico</option>
            </select>
          </div>
        </div>

        {/* Sound Settings */}
        <div style={{
          marginBottom: '2rem'
        }}>
          <h3 style={{
            color: 'white',
            marginBottom: '1rem',
            fontSize: '1.1rem'
          }}>Sound Effects</h3>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            color: 'white'
          }}>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              style={{
                marginRight: '0.5rem',
                cursor: 'pointer'
              }}
            />
            Enable Sound Effects
          </label>
        </div>

        {/* Background Music */}
        <div style={{
          marginBottom: '2rem'
        }}>
          <h3 style={{
            color: 'white',
            marginBottom: '1rem',
            fontSize: '1.1rem'
          }}>Background Music</h3>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            color: 'white'
          }}>
            <input
              type="checkbox"
              checked={backgroundMusicEnabled}
              onChange={(e) => setBackgroundMusicEnabled(e.target.checked)}
              style={{
                marginRight: '0.5rem',
                cursor: 'pointer'
              }}
            />
            Enable Background Music
          </label>
          {hasMusic && <div style={{
            marginTop: '1rem'
          }}>
            <label style={{
              color: 'white',
              display: 'block',
              marginBottom: '0.5rem'
            }}>Music Volume: {musicVolume}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={musicVolume}
              onChange={(e) => setMusicVolume(Number(e.target.value))}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.1)'
              }}
            />
          </div>}
        </div>

        {/* Menu Options */}
        <div style={{
          marginBottom: '2rem'
        }}>
          <h3 style={{
            color: 'white',
            marginBottom: '1rem',
            fontSize: '1.1rem'
          }}>Menu</h3>
          
          <button
            onClick={() => {
              handleHistoryClick();
              setSideMenuOpen(false);
            }}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              marginBottom: '10px',
              textAlign: 'left'
            }}
          >
            📊 View Test History
          </button>

          <button
            onClick={() => {
              // Navigate to achievements page
              setSideMenuOpen(false);
              // This will be handled by the parent component
              if (window.location.pathname === '/') {
                const event = new CustomEvent('navigateToAchievements');
                window.dispatchEvent(event);
              }
            }}
            style={{
              width: '100%',
              background: 'rgba(255, 215, 0, 0.2)',
              color: '#FFD700',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              padding: '12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              marginBottom: '10px',
              textAlign: 'left',
              fontWeight: '600'
            }}
          >
            🏆 Achievements
          </button>

          <button
            onClick={() => {
              handleContactMe();
              setSideMenuOpen(false);
            }}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              textAlign: 'left'
            }}
          >
            📧 Contact Me
          </button>
        </div>
      </div>
    </>
  );
};
