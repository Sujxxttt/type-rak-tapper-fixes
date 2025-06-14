
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
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
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
          width: '400px',
          maxWidth: '90vw',
          height: '100vh',
          background: getGlassBackground(),
          backdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.3)',
          zIndex: 1001,
          padding: '20px',
          overflowY: 'auto',
          color: getTextColor(),
          transform: sideMenuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out'
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
            {usersList.map((user) => (
              <div
                key={user}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: user !== usersList[usersList.length - 1] ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                }}
              >
                <span style={{
                  fontWeight: user === currentActiveUser ? 'bold' : 'normal',
                  opacity: user === currentActiveUser ? 1 : 0.8
                }}>
                  {user} {user === currentActiveUser && '(Active)'}
                </span>
                {user !== currentActiveUser && (
                  <button
                    onClick={() => switchUser(user)}
                    style={{
                      background: getButtonColor(),
                      color: 'white',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    Switch
                  </button>
                )}
              </div>
            ))}
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
                marginTop: '10px',
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
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[15, 30, 60, 120].map((time) => (
                <button
                  key={time}
                  onClick={() => setDuration(time)}
                  style={{
                    background: duration === time ? getButtonColor() : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  {time}s
                </button>
              ))}
            </div>
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
            Font Size: {fontSize}%
          </h3>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '15px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <input
              type="range"
              min="80"
              max="200"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: 'rgba(255, 255, 255, 0.2)',
                outline: 'none',
                cursor: 'pointer'
              }}
            />
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
            <select
              value={fontStyle}
              onChange={(e) => setFontStyle(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: getTextColor(),
                cursor: 'pointer'
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: 'cosmic-nebula', name: 'Cosmic Nebula' },
                { id: 'midnight-black', name: 'Midnight Black' },
                { id: 'cotton-candy-glow', name: 'Cotton Candy Glow' }
              ].map((themeOption) => (
                <button
                  key={themeOption.id}
                  onClick={() => applyTheme(themeOption.id)}
                  style={{
                    background: theme === themeOption.id ? getButtonColor() : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    textAlign: 'left'
                  }}
                >
                  {themeOption.name}
                </button>
              ))}
            </div>
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
