
import React, { useRef, useEffect } from 'react';
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
  const sideMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sideMenuOpen && sideMenuRef.current && !sideMenuRef.current.contains(event.target as Node)) {
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

  const handleOptionClick = (e: React.MouseEvent) => {
    // Stop propagation to prevent closing the sidebar when clicking options
    e.stopPropagation();
  };

  if (!sideMenuOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 998,
          animation: 'fadeIn 0.17s ease-out'
        }}
      />
      
      {/* Side Menu */}
      <div
        ref={sideMenuRef}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '350px',
          height: '100vh',
          background: theme === 'cotton-candy-glow' ? 
            'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15))' : 
            'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          zIndex: 999,
          padding: '20px',
          overflowY: 'auto',
          color: theme === 'cotton-candy-glow' ? '#333' : 'white',
          animation: sideMenuOpen ? 'slideInRight 0.17s ease-out' : 'slideOutRight 0.17s ease-out'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={() => setSideMenuOpen(false)}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            color: theme === 'cotton-candy-glow' ? '#333' : 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '5px'
          }}
        >
          <X size={24} />
        </button>

        <h3 style={{ marginBottom: '1.5rem', paddingTop: '1rem' }}>Settings</h3>

        {/* User Management */}
        <div style={{ marginBottom: '1.5rem' }} onClick={handleOptionClick}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>Users:</h4>
          {usersList.map(user => (
            <div key={user} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.5rem',
              background: user === currentActiveUser ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              marginBottom: '0.5rem'
            }}>
              <span>{user}</span>
              {user === currentActiveUser && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteUser();
                  }}
                  style={{
                    background: deleteConfirmState ? '#dc3545' : '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  {deleteConfirmState ? 'Confirm Delete' : 'Delete'}
                </button>
              )}
              {user !== currentActiveUser && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    switchUser(user);
                  }}
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
        </div>

        {/* Test Duration */}
        <div style={{ marginBottom: '1.5rem' }} onClick={handleOptionClick}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>Test Duration:</h4>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[15, 30, 60, 120].map(time => (
              <button 
                key={time}
                onClick={(e) => {
                  e.stopPropagation();
                  setDuration(time);
                }}
                style={{
                  background: duration === time ? getButtonColor() : 'rgba(255, 255, 255, 0.2)',
                  color: theme === 'cotton-candy-glow' ? '#333' : 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                {time}s
              </button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div style={{ marginBottom: '1.5rem' }} onClick={handleOptionClick}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>Font Size: {fontSize}%</h4>
          <input 
            type="range"
            min="80"
            max="200"
            value={fontSize}
            onChange={(e) => {
              e.stopPropagation();
              setFontSize(parseInt(e.target.value));
            }}
            style={{
              width: '100%',
              accentColor: getButtonColor()
            }}
          />
        </div>

        {/* Font Style */}
        <div style={{ marginBottom: '1.5rem' }} onClick={handleOptionClick}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>Font Style:</h4>
          <select 
            value={fontStyle}
            onChange={(e) => {
              e.stopPropagation();
              setFontStyle(e.target.value);
            }}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: theme === 'cotton-candy-glow' ? '#333' : 'white',
              backdropFilter: 'blur(10px)'
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

        {/* Sound Toggle */}
        <div style={{ marginBottom: '1.5rem' }} onClick={handleOptionClick}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>Sound Effects:</h4>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setSoundEnabled(!soundEnabled);
            }}
            style={{
              background: soundEnabled ? getButtonColor() : 'rgba(255, 255, 255, 0.2)',
              color: theme === 'cotton-candy-glow' ? '#333' : 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            {soundEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* Themes */}
        <div style={{ marginBottom: '1.5rem' }} onClick={handleOptionClick}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>Themes:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { key: 'cosmic-nebula', name: 'Cosmic Nebula' },
              { key: 'midnight-black', name: 'Midnight Black' },
              { key: 'cotton-candy-glow', name: 'Cotton Candy Glow' }
            ].map(themeOption => (
              <button 
                key={themeOption.key}
                onClick={(e) => {
                  e.stopPropagation();
                  applyTheme(themeOption.key);
                }}
                style={{
                  background: theme === themeOption.key ? getButtonColor() : 'rgba(255, 255, 255, 0.2)',
                  color: theme === 'cotton-candy-glow' ? '#333' : 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
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

        {/* Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleHistoryClick();
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: theme === 'cotton-candy-glow' ? '#333' : 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            View Test History
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleContactMe();
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: theme === 'cotton-candy-glow' ? '#333' : 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Contact Me
          </button>
        </div>
      </div>

      <style>{`
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
        
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};
