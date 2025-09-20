
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
import { MusicPlayer } from './MusicPlayer';

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
  onNavigate: (screen: string) => void;
  onNavigateHome: () => void;
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
  onNavigate,
  onNavigateHome,
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
  const sideMenuRef = useRef<HTMLDivElement>(null);
  const [showCustomDuration, setShowCustomDuration] = useState(false);
  const [cursorStyle, setCursorStyle] = useState(localStorage.getItem('typeRakCursor') || 'void-black');

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

  

  const getFontFamilyString = (font: string) => {
    switch (font) {
      case 'work-sans': return "'Work Sans', sans-serif";
      case 'outfit': return "'Outfit', sans-serif";
      case 'libre-baskerville': return "'Libre Baskerville', serif";
      case 'sniglet': return "'Sniglet', cursive";
      case 'codystar': return "'Codystar', cursive";
      case 'pacifico': return "'Pacifico', cursive";
      case 'simple-day': return "'Simple Day', cursive";
      default: return "'Work Sans', sans-serif";
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
    if (duration === 30) return '30 seconds';
    if (duration === 60) return '1 minute';
    if (duration === 120) return '2 minutes';
    if (duration === 180) return '3 minutes';
    if (duration === 300) return '5 minutes';
    if (duration === 600) return '10 minutes';
    if (duration === 1800) return '30 minutes';
    if (duration === 3600) return '60 minutes';
    return `${duration} seconds`;
  };

  const handleCursorChange = (cursor: string) => {
    setCursorStyle(cursor);
    localStorage.setItem('typeRakCursor', cursor);
    
    document.body.className = document.body.className.replace(/cursor-\S+/g, '').trim();
    document.body.classList.add(`cursor-${cursor}`);
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
    { value: 'void-black', label: 'Void Black' },
    { value: 'snow-fall', label: 'Snow Fall' },
    { value: 'mystic-purple', label: 'Mystic Purple' },
    { value: 'glacier-blue', label: 'Glacier Blue' },
    { value: 'sunset-orange', label: 'Sunset Orange' },
    { value: 'dark-clouds', label: 'Dark Clouds' }
  ];

  const handleCheckThisOut = () => {
    window.open('https://raktherock.github.io/Rak/', '_blank');
    setSideMenuOpen(false);
  };

  return (
    <>
      {sideMenuOpen && (
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
      )}
      
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
          transform: sideMenuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          pointerEvents: sideMenuOpen ? 'auto' : 'none',
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

        {/* Home Button */}
        <div 
          onClick={() => {
            setSideMenuOpen(false);
            onNavigateHome();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            cursor: 'pointer',
            marginBottom: '20px',
            transition: 'all 0.3s ease'
          }}
          className="hover:bg-white/15"
        >
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(45deg, #b109d6, #0c6dc2)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            🏠
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '2px' }}>
              Home
            </div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>
              Mode Selection
            </div>
          </div>
        </div>

        <h3 style={{ marginBottom: '2rem', paddingTop: '1rem', fontSize: '2rem', fontWeight: '700' }}>Settings</h3>

        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '600', opacity: 0.8 }}>User:</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button style={dropdownTriggerStyle}>
                <span>{currentActiveUser || 'Select User'}</span>
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
              <DropdownMenuRadioGroup value={showCustomDuration ? 'custom' : String(duration)} onValueChange={handleDurationChange}>
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
              <CustomDurationSlider value={duration} onChange={setDuration} theme={theme} />
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
                  {['work-sans', 'outfit', 'libre-baskerville', 'sniglet', 'codystar', 'pacifico', 'simple-day'].map(font => (
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
                <span style={{ textTransform: 'capitalize' }}>{cursors.find(c => c.value === cursorStyle)?.label || 'Void Black'}</span>
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
              <DropdownMenuRadioGroup value={theme} onValueChange={applyTheme}>
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
        </div>

        <MusicPlayer 
          enabled={backgroundMusicEnabled} 
          volume={musicVolume} 
          setVolume={setMusicVolume}
          getButtonColor={getButtonColor}
        />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button onClick={handleHistoryClick} style={{...dropdownTriggerStyle, justifyContent: 'center' }}>View Test History</button>
          <button onClick={handleContactMe} style={{...dropdownTriggerStyle, justifyContent: 'center' }}>Contact Me</button>
          <button onClick={handleCheckThisOut} style={{...dropdownTriggerStyle, justifyContent: 'center' }}>Check this out</button>
          
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <button 
              onClick={() => {
                onNavigate('privacy');
                setSideMenuOpen(false);
              }}
              style={{...dropdownTriggerStyle, justifyContent: 'center', marginBottom: '0.5rem' }}
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => {
                onNavigate('credits');
                setSideMenuOpen(false);
              }}
              style={{...dropdownTriggerStyle, justifyContent: 'center', marginBottom: '0.5rem' }}
            >
              Credits
            </button>
            <button 
              onClick={() => {
                onNavigate('about');
                setSideMenuOpen(false);
              }}
              style={{...dropdownTriggerStyle, justifyContent: 'center' }}
            >
              About Me
            </button>
          </div>
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
