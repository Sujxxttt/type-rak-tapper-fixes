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
  theme: string;
  setTheme: (theme: string) => void;
  username: string;
  setUsername: (username: string) => void;
  sideMenuOpen: boolean;
  setSideMenuOpen: (open: boolean) => void;
  musicEnabled: boolean;
  setMusicEnabled: (enabled: boolean) => void;
  musicVolume: number;
  setMusicVolume: (volume: number) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  soundVolume: number;
  setSoundVolume: (volume: number) => void;
  customDuration: number;
  setCustomDuration: (duration: number) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  fontStyle: string;
  setFontStyle: (style: string) => void;
  cursorStyle: string;
  setCursorStyle: (style: string) => void;
  deleteConfirmState: boolean;
  onDeleteConfirm: (callback: any) => void;
  onDeleteCancel: () => void;
  onDeleteExecute: () => void;
  usersList: string[];
  setUsersList: (users: string[]) => void;
  currentActiveUser: string;
  setCurrentActiveUser: (user: string) => void;
  onAchievementsClick: () => void;
  onHistoryClick: () => void;
  onMusicUploadClick: () => void;
  hasMusic: boolean;
}

export const SideMenu: React.FC<SideMenuProps> = ({
  theme,
  setTheme,
  username,
  setUsername,
  sideMenuOpen,
  setSideMenuOpen,
  musicEnabled,
  setMusicEnabled,
  musicVolume,
  setMusicVolume,
  soundEnabled,
  setSoundEnabled,
  soundVolume,
  setSoundVolume,
  customDuration,
  setCustomDuration,
  fontSize,
  setFontSize,
  fontStyle,
  setFontStyle,
  cursorStyle,
  setCursorStyle,
  deleteConfirmState,
  onDeleteConfirm,
  onDeleteCancel,
  onDeleteExecute,
  usersList,
  setUsersList,
  currentActiveUser,
  setCurrentActiveUser,
  onAchievementsClick,
  onHistoryClick,
  onMusicUploadClick,
  hasMusic
}) => {
  const sideMenuRef = useRef<HTMLDivElement>(null);
  const [showCustomDuration, setShowCustomDuration] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sideMenuRef.current && !sideMenuRef.current.contains(event.target as Node)) {
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
      setCustomDuration(Number(value));
    }
  };

  const getDurationLabel = () => {
    if (showCustomDuration) return 'Custom';
    if (customDuration === 30) return '30 seconds';
    if (customDuration === 60) return '1 minute';
    if (customDuration === 120) return '2 minutes';
    if (customDuration === 180) return '3 minutes';
    if (customDuration === 300) return '5 minutes';
    if (customDuration === 600) return '10 minutes';
    if (customDuration === 1800) return '30 minutes';
    if (customDuration === 3600) return '60 minutes';
    return `${customDuration} seconds`;
  };

  const handleCursorChange = (cursor: string) => {
    setCursorStyle(cursor);
    localStorage.setItem('typeRakCursorStyle', cursor);
    
    document.body.className = document.body.className.replace(/cursor-\S+/g, '').trim();
    document.body.classList.add(`cursor-${cursor}`);
  };

  const getButtonColor = () => {
    switch (theme) {
      case 'midnight-black':
        return 'rgba(197, 89, 247, 0.21)';
      case 'cotton-candy-glow':
        return 'rgba(252, 3, 223, 0.21)';
      default:
        return 'rgba(177, 9, 214, 0.21)';
    }
  };

  const dropdownContentStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(25px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: 'white',
    borderRadius: '15px',
    zIndex: 1003,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    maxHeight: '300px',
    overflowY: 'auto'
  };

  const dropdownTriggerStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '15px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    background: 'rgba(255, 255, 255, 0.08)',
    color: 'white',
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(15px)'
  };

  const fontSizes = [80, 90, 100, 110, 120, 130, 140, 150, 175, 200];
  
  const cursors = [
    { value: 'blue', label: 'Arrow Cursor (Blue)' },
    { value: 'black', label: 'Arrow Cursor (Black)' },
    { value: 'pink', label: 'Arrow Cursor (Pink)' },
    { value: 'white', label: 'Arrow Cursor (White)' }
  ];

  const handleCheckThisOut = () => {
    window.open('https://raktherock.github.io/Rak/', '_blank');
    setSideMenuOpen(false);
  };

  const handleDeleteUser = () => {
    if (deleteConfirmState) {
      onDeleteExecute();
    } else {
      onDeleteConfirm(() => {
        // Delete user logic would go here
        console.log('Deleting user:', currentActiveUser);
      });
    }
  };

  const switchUser = (user: string) => {
    setCurrentActiveUser(user);
    setUsername(user);
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
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 998,
          animation: 'fadeIn 0.2s ease-out'
        }}
      />
      
      <div
        ref={sideMenuRef}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '380px',
          height: '100vh',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(25px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '15px 0 0 15px',
          zIndex: 999,
          padding: '20px',
          overflowY: 'auto',
          color: 'white',
          animation: sideMenuOpen ? 'slideInRight 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'slideOutRight 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards',
          boxShadow: '0 0 50px rgba(0, 0, 0, 0.3)'
        }}
      >
        <button 
          onClick={() => setSideMenuOpen(false)}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            color: 'white',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)'
          }}
        >
          <X size={20} />
        </button>

        <h3 style={{ marginBottom: '2rem', paddingTop: '1rem', fontSize: '2rem', fontWeight: '700' }}>Settings</h3>

        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '600', opacity: 0.8 }}>User:</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button style={dropdownTriggerStyle}>
                <span>{currentActiveUser || username || 'Select User'}</span>
                <span>▼</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent style={dropdownContentStyle} className="w-[340px]" side="top">
              <DropdownMenuRadioGroup value={currentActiveUser} onValueChange={switchUser}>
                {usersList.map(user => (
                  <DropdownMenuRadioItem key={user} value={user}>{user}</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {currentActiveUser && (
             <button onClick={handleDeleteUser} style={{ 
               width: '100%', 
               marginTop: '10px', 
               padding: '12px 16px', 
               borderRadius: '15px', 
               border: 'none', 
               background: deleteConfirmState ? 'rgba(220, 38, 38, 0.8)' : 'rgba(239, 68, 68, 0.7)', 
               color: 'white', 
               cursor: 'pointer', 
               transition: 'background-color 0.2s',
               backdropFilter: 'blur(15px)',
               fontSize: '0.9rem'
             }}>
               {deleteConfirmState ? 'Confirm Delete' : `Delete ${currentActiveUser}`}
             </button>
          )}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '600', opacity: 0.8 }}>Test Duration:</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button style={dropdownTriggerStyle}>
                <span>{getDurationLabel()}</span>
                <span>▼</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent style={dropdownContentStyle} className="w-[340px]" side="top">
              <DropdownMenuRadioGroup value={showCustomDuration ? 'custom' : String(customDuration)} onValueChange={handleDurationChange}>
                <DropdownMenuRadioItem value="30">30 seconds</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="60">1 minute</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="120">2 minutes</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="180">3 minutes</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="300">5 minutes</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="600">10 minutes</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="1800">30 minutes</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="3600">60 minutes</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="custom">Custom</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {showCustomDuration && (
            <div style={{ marginTop: '10px' }}>
              <CustomDurationSlider value={customDuration} onChange={setCustomDuration} theme={theme} />
            </div>
          )}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '600', opacity: 0.8 }}>Font Settings:</h4>
          
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '0.7rem', marginBottom: '6px', display: 'block', opacity: 0.7 }}>Font Size:</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button style={dropdownTriggerStyle}>
                  <span>{fontSize}%</span>
                  <span>▼</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent style={dropdownContentStyle} className="w-[340px]" side="top">
                <DropdownMenuRadioGroup value={String(fontSize)} onValueChange={val => setFontSize(Number(val))}>
                  {fontSizes.map(size => (
                    <DropdownMenuRadioItem key={size} value={String(size)}>{size}%</DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <label style={{ fontSize: '0.7rem', marginBottom: '6px', display: 'block', opacity: 0.7 }}>Font Style:</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button style={dropdownTriggerStyle}>
                  <span style={{ fontFamily: getFontFamilyString(fontStyle), textTransform: 'capitalize' }}>{fontStyle.replace(/-/g, ' ')}</span>
                  <span>▼</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent style={dropdownContentStyle} className="w-[340px]" side="top">
                <DropdownMenuRadioGroup value={fontStyle} onValueChange={setFontStyle}>
                  {['inter', 'roboto', 'open-sans', 'lato', 'source-sans-pro', 'dancing-script', 'pacifico'].map(font => (
                    <DropdownMenuRadioItem key={font} value={font} style={{ fontFamily: getFontFamilyString(font), textTransform: 'capitalize'}}>{font.replace(/-/g, ' ')}</DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '600', opacity: 0.8 }}>Cursor Style:</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button style={dropdownTriggerStyle}>
                <span style={{ textTransform: 'capitalize' }}>{cursors.find(c => c.value === cursorStyle)?.label || 'Arrow Cursor (Blue)'}</span>
                <span>▼</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent style={dropdownContentStyle} className="w-[340px]" side="top">
              <DropdownMenuRadioGroup value={cursorStyle} onValueChange={handleCursorChange}>
                {cursors.map(cursor => (
                  <DropdownMenuRadioItem key={cursor.value} value={cursor.value}>
                    {cursor.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '600', opacity: 0.8 }}>Theme:</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button style={dropdownTriggerStyle}>
                <span style={{textTransform: 'capitalize'}}>{theme.replace(/-/g, ' ')}</span>
                <span>▼</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent style={dropdownContentStyle} className="w-[340px]" side="top">
              <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                <DropdownMenuRadioItem value='cosmic-nebula'>Cosmic Nebula</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value='midnight-black'>Midnight Black</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value='cotton-candy-glow'>Cotton Candy Glow</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '600', opacity: 0.8 }}>Sound Effects:</h4>
          <div style={{ 
            '--switch-checked-color': getButtonColor(),
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            background: 'rgba(255, 255, 255, 0.08)', 
            padding: '12px 16px', 
            borderRadius: '15px',
            fontSize: '0.9rem',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          } as React.CSSProperties}>
            <span>{soundEnabled ? 'Enabled' : 'Disabled'}</span>
            <Switch 
              checked={soundEnabled} 
              onCheckedChange={setSoundEnabled}
              className="data-[state=checked]:bg-[--switch-checked-color]"
            />
          </div>
          {soundEnabled && (
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.08)', 
              padding: '12px 16px', 
              borderRadius: '15px',
              fontSize: '0.9rem',
              marginTop: '12px',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <label style={{ fontSize: '0.7rem', marginBottom: '8px', display: 'block', opacity: 0.7 }}>Volume: {soundVolume}%</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={soundVolume} 
                onChange={(e) => setSoundVolume(Number(e.target.value))}
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
          )}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '600', opacity: 0.8 }}>Background Music:</h4>
          <div style={{ 
            '--switch-checked-color': getButtonColor(),
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            background: 'rgba(255, 255, 255, 0.08)', 
            padding: '12px 16px', 
            borderRadius: '15px',
            fontSize: '0.9rem',
            marginBottom: '12px',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          } as React.CSSProperties}>
            <span>{musicEnabled ? 'Enabled' : 'Disabled'}</span>
            <Switch 
              checked={musicEnabled} 
              onCheckedChange={setMusicEnabled}
              className="data-[state=checked]:bg-[--switch-checked-color]"
            />
          </div>
          {musicEnabled && (
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.08)', 
              padding: '12px 16px', 
              borderRadius: '15px',
              fontSize: '0.9rem',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <label style={{ fontSize: '0.7rem', marginBottom: '8px', display: 'block', opacity: 0.7 }}>Volume: {musicVolume}%</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={musicVolume} 
                onChange={(e) => setMusicVolume(Number(e.target.value))}
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
          )}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button onClick={onHistoryClick} style={{...dropdownTriggerStyle, justifyContent: 'center' }}>View Test History</button>
          <button onClick={onAchievementsClick} style={{...dropdownTriggerStyle, justifyContent: 'center' }}>View Achievements</button>
          <button onClick={onMusicUploadClick} style={{...dropdownTriggerStyle, justifyContent: 'center' }}>Upload Music</button>
          <button onClick={handleCheckThisOut} style={{...dropdownTriggerStyle, justifyContent: 'center' }}>Check this out</button>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0.8; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0.8; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        /* Glass-style scrollbar */
        div::-webkit-scrollbar {
          width: 8px;
        }
        div::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          backdrop-filter: blur(10px);
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </>
  );
};
