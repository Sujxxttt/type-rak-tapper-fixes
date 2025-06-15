
import React, { useState, useRef, useEffect } from 'react';
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
  const sideMenuRef = useRef<HTMLDivElement>(null);
  const [showCustomDuration, setShowCustomDuration] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sideMenuRef.current && !sideMenuRef.current.contains(event.target as Node)) {
        // Also check if the click is outside any dropdown content
        const dropdowns = document.querySelectorAll('[data-radix-popper-content-wrapper]');
        let isClickInsideDropdown = false;
        dropdowns.forEach(dropdown => {
          if (dropdown.contains(event.target as Node)) {
            isClickInsideDropdown = true;
          }
        });
        if (!isClickInsideDropdown) {
          setSideMenuOpen(false);
        }
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

  const handleDurationChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomDuration(true);
    } else {
      setShowCustomDuration(false);
      setDuration(Number(value));
    }
  };

  const getDurationLabel = () => {
    if (showCustomDuration) return 'Custom';
    if (duration === 60) return '1 minute';
    if (duration === 120) return '2 minutes';
    if (duration === 300) return '5 minutes';
    if (duration === 600) return '10 minutes';
    if (duration === 1800) return '30 minutes';
    if (duration === 3600) return '1 Hour';
    return `${duration} seconds`;
  };

  const dropdownContentStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: theme === 'cotton-candy-glow' ? '#333' : 'white',
    borderRadius: '8px',
    zIndex: 1001
  };

  const dropdownTriggerStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    background: 'rgba(255, 255, 255, 0.1)',
    color: theme === 'cotton-candy-glow' ? '#333' : 'white',
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  return (
    <>
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
      
      <div
        ref={sideMenuRef}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '350px',
          height: '100vh',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
          zIndex: 999,
          padding: '20px',
          overflowY: 'auto',
          color: theme === 'cotton-candy-glow' ? '#333' : 'white',
          animation: sideMenuOpen ? 'slideInRight 0.2s ease-out' : 'slideOutRight 0.2s ease-out forwards'
        }}
      >
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

        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>Test Duration:</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button style={dropdownTriggerStyle}>
                <span>{getDurationLabel()}</span>
                <span>▼</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent style={dropdownContentStyle} className="w-[310px]">
              <DropdownMenuRadioGroup value={showCustomDuration ? 'custom' : String(duration)} onValueChange={handleDurationChange}>
                <DropdownMenuRadioItem value="30">30 seconds</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="60">1 minute</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="120">2 minutes</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="300">5 minutes</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="600">10 minutes</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="1800">30 minutes</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="3600">1 Hour</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="custom">Custom</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {showCustomDuration && (
            <div style={{ marginTop: '10px' }}>
              <CustomDurationSlider value={duration} onChange={setDuration} theme={theme} />
            </div>
          )}
        </div>

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
              <DropdownMenuRadioGroup value={String(fontSize)} onValueChange={val => setFontSize(Number(val))}>
                {[80, 100, 120, 150, 200].map(size => (
                  <DropdownMenuRadioItem key={size} value={String(size)}>{size}%</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>Font Style:</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button style={dropdownTriggerStyle}>
                <span style={{ fontFamily: getFontFamilyString(fontStyle), textTransform: 'capitalize' }}>{fontStyle.replace(/-/g, ' ')}</span>
                <span>▼</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent style={dropdownContentStyle} className="w-[310px]">
              <DropdownMenuRadioGroup value={fontStyle} onValueChange={setFontStyle}>
                {['inter', 'roboto', 'open-sans', 'lato', 'source-sans-pro', 'dancing-script', 'pacifico'].map(font => (
                  <DropdownMenuRadioItem key={font} value={font} style={{ fontFamily: getFontFamilyString(font), textTransform: 'capitalize'}}>{font.replace(/-/g, ' ')}</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
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
              <DropdownMenuRadioGroup value={theme} onValueChange={applyTheme}>
                <DropdownMenuRadioItem value='cosmic-nebula'>Cosmic Nebula</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value='midnight-black'>Midnight Black</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value='cotton-candy-glow'>Cotton Candy Glow</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

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
              style={{
                color: theme === 'cotton-candy-glow' ? '#333' : 'white',
              }}
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button onClick={handleHistoryClick} style={{...dropdownTriggerStyle, justifyContent: 'center' }}>View Test History</button>
          <button onClick={handleContactMe} style={{...dropdownTriggerStyle, justifyContent: 'center' }}>Contact Me</button>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .DropdownMenuContent[data-state="open"] { animation: fadeIn 0.1s ease-out, scale-in 0.1s ease-out; }
        .DropdownMenuContent[data-state="closed"] { animation: fade-out 0.1s ease-in, scale-out 0.1s ease-in; }
      `}</style>
    </>
  );
};
