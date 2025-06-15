
import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';

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

  if (!sideMenuOpen) return null;

  const getFontFamilyString = (font: string) => {
    switch (font) {
      case 'roboto': return "'Roboto', sans-serif";
      case 'open-sans': return "'Open Sans', sans-serif";
      case 'lato': return "'Lato', sans-serif";
      case 'source-sans-pro': return "'Source Sans Pro', sans-serif";
      case 'inter': return "'Inter', sans-serif";
      case 'dancing-script': return "'Dancing Script', cursive";
      case 'pacifico': return "'Pacifico', cursive";
      default: return "'Inter', sans-serif";
    }
  };

  const dropdownContentStyle: React.CSSProperties = {
    background: theme === 'cotton-candy-glow' ? 
      'rgba(255, 255, 255, 0.4)' : 
      'rgba(20, 20, 20, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: 'white',
    zIndex: 1001
  };

  const dropdownTriggerStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={() => setSideMenuOpen(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 998,
          animation: 'fadeIn 0.12s ease-out'
        }}
      />
      
      {/* Side Menu */}
      <div
        ref={sideMenuRef}
        onClick={(e) => e.stopPropagation()}
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
          borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
          zIndex: 999,
          padding: '20px',
          overflowY: 'auto',
          color: 'white',
          animation: sideMenuOpen ? 'slideInRight 0.12s ease-out' : 'slideOutRight 0.12s ease-out forwards'
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
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '5px'
          }}
        >
          <X size={24} />
        </button>

        <h3 style={{ marginBottom: '1.5rem', paddingTop: '1rem' }}>Settings</h3>

        {/* User Management */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>User:</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button style={dropdownTriggerStyle}>
                <span>{currentActiveUser || 'Select User'}</span>
                <span>▼</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent style={dropdownContentStyle} className="w-[310px]">
              <DropdownMenuLabel>Manage Users</DropdownMenuLabel>
              <DropdownMenuSeparator style={{ background: 'rgba(255,255,255,0.2)'}} />
              {usersList.map(user => (
                <DropdownMenuItem key={user} onSelect={(e) => e.preventDefault()} style={{ padding: '0.5rem', cursor: 'default' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span>{user}</span>
                    {user === currentActiveUser ? (
                      <button onClick={handleDeleteUser} style={{ background: deleteConfirmState ? '#dc3545' : '#6c757d', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                        {deleteConfirmState ? 'Confirm' : 'Delete'}
                      </button>
                    ) : (
                      <button onClick={() => switchUser(user)} style={{ background: getButtonColor(), color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                        Switch
                      </button>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Test Duration */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>Test Duration:</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button style={dropdownTriggerStyle}>
                <span>{duration} seconds</span>
                <span>▼</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent style={dropdownContentStyle} className="w-[310px]">
              <DropdownMenuLabel>Set Duration</DropdownMenuLabel>
              <DropdownMenuSeparator style={{ background: 'rgba(255,255,255,0.2)'}} />
              <DropdownMenuRadioGroup value={String(duration)} onValueChange={val => setDuration(Number(val))}>
                {[15, 30, 60, 120].map(time => (
                  <DropdownMenuRadioItem key={time} value={String(time)}>{time}s</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Font Size */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>Font Size:</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button style={dropdownTriggerStyle}>
                <span>{fontSize}%</span>
                <span>▼</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent style={dropdownContentStyle} className="w-[310px]">
              <DropdownMenuLabel>Set Font Size</DropdownMenuLabel>
              <DropdownMenuSeparator style={{ background: 'rgba(255,255,255,0.2)'}} />
              <DropdownMenuRadioGroup value={String(fontSize)} onValueChange={val => setFontSize(Number(val))}>
                {[80, 100, 120, 150, 200].map(size => (
                  <DropdownMenuRadioItem key={size} value={String(size)}>{size}%</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Font Style */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>Font Style:</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button style={dropdownTriggerStyle}>
                <span style={{ fontFamily: getFontFamilyString(fontStyle) }}>{fontStyle.replace(/-/g, ' ')}</span>
                <span>▼</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent style={dropdownContentStyle} className="w-[310px]">
              <DropdownMenuLabel>Select Font</DropdownMenuLabel>
              <DropdownMenuSeparator style={{ background: 'rgba(255,255,255,0.2)'}} />
              <DropdownMenuRadioGroup value={fontStyle} onValueChange={setFontStyle}>
                {['inter', 'roboto', 'open-sans', 'lato', 'source-sans-pro', 'dancing-script', 'pacifico'].map(font => (
                  <DropdownMenuRadioItem key={font} value={font} style={{ fontFamily: getFontFamilyString(font), textTransform: 'capitalize'}}>{font.replace(/-/g, ' ')}</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Sound Toggle */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>Sound Effects:</h4>
          <div style={{ 
            '--switch-checked-color': getButtonColor(),
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            background: 'rgba(255, 255, 255, 0.1)', 
            padding: '8px 12px', 
            borderRadius: '4px' 
          } as React.CSSProperties}>
            <span>{soundEnabled ? 'Enabled' : 'Disabled'}</span>
            <Switch 
              checked={soundEnabled} 
              onCheckedChange={setSoundEnabled}
              className="data-[state=checked]:bg-[--switch-checked-color]"
            />
          </div>
        </div>

        {/* Themes */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>Theme:</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button style={dropdownTriggerStyle}>
                <span style={{textTransform: 'capitalize'}}>{theme.replace(/-/g, ' ')}</span>
                <span>▼</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent style={dropdownContentStyle} className="w-[310px]">
              <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
              <DropdownMenuSeparator style={{ background: 'rgba(255,255,255,0.2)'}} />
              <DropdownMenuRadioGroup value={theme} onValueChange={applyTheme}>
                {[
                  { key: 'cosmic-nebula', name: 'Cosmic Nebula' },
                  { key: 'midnight-black', name: 'Midnight Black' },
                  { key: 'cotton-candy-glow', name: 'Cotton Candy Glow' }
                ].map(themeOption => (
                  <DropdownMenuRadioItem key={themeOption.key} value={themeOption.key}>{themeOption.name}</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            onClick={handleHistoryClick}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
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
            onClick={handleContactMe}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
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
