import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, SkipForward, SkipBack, Upload, Music } from 'lucide-react';
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
import { useMusicPlayer } from '../hooks/useMusicPlayer';

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
  const sideMenuRef = useRef<HTMLDivElement>(null);
  const [showCustomDuration, setShowCustomDuration] = useState(false);
  const [cursorStyle, setCursorStyle] = useState(localStorage.getItem('typeRakCursor') || 'blue');
  const [musicEnabled, setMusicEnabled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isPlaying,
    currentTrack,
    currentTime,
    duration: trackDuration,
    play,
    pause,
    nextTrack,
    previousTrack,
    seek,
    uploadTrack,
    hasMusic: hasTracks
  } = useMusicPlayer(musicEnabled, musicVolume);

  useEffect(() => {
    if (musicEnabled) {
      play();
    } else {
      pause();
    }
  }, [musicEnabled]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      uploadTrack(file);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getDurationLabel = () => {
    if (showCustomDuration) return 'Custom';
    switch (duration) {
      case 30: return '30 seconds';
      case 60: return '1 minute';
      case 120: return '2 minutes';
      case 180: return '3 minutes';
      case 300: return '5 minutes';
      case 600: return '10 minutes';
      case 1800: return '30 minutes';
      case 3600: return '60 minutes';
      default: return `${duration} seconds`;
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

  const fontSizes = [75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130];

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

  const cursors = [
    { value: 'blue', label: 'Arrow Cursor (Blue)' },
    { value: 'black', label: 'Arrow Cursor (Black)' },
    { value: 'pink', label: 'Arrow Cursor (Pink)' },
    { value: 'white', label: 'Arrow Cursor (White)' }
  ];

  const handleCursorChange = (value: string) => {
    setCursorStyle(value);
    localStorage.setItem('typeRakCursor', value);
    document.body.className = document.body.className.replace(/cursor-\S+/g, '').trim();
    document.body.classList.add(`cursor-${value}`);
  };

  const handleCheckThisOut = () => {
    window.open('https://youtu.be/dQw4w9WgXcQ', '_blank');
  };

  const dropdownTriggerStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '15px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    background: 'rgba(255, 255, 255, 0.08)',
    color: 'white',
    textAlign: 'left' as const,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(15px)'
  };

  if (!sideMenuOpen) return null;

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

        {/* Music Player Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '600', opacity: 0.8 }}>Music Player:</h4>
          
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
              padding: '16px',
              borderRadius: '15px',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              marginBottom: '12px'
            }}>
              {/* Upload Button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  marginBottom: '12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                <Upload size={16} />
                Upload Music
              </button>

              {/* Current Track */}
              {currentTrack && (
                <div style={{ marginBottom: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: '4px' }}>Now Playing</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '500' }}>{currentTrack.name}</div>
                </div>
              )}

              {/* Progress Bar */}
              {currentTrack && (
                <div style={{ marginBottom: '12px' }}>
                  <input
                    type="range"
                    min="0"
                    max={trackDuration}
                    value={currentTime}
                    onChange={(e) => seek(Number(e.target.value))}
                    style={{
                      width: '100%',
                      height: '4px',
                      borderRadius: '2px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', opacity: 0.7, marginTop: '4px' }}>
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(trackDuration)}</span>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <button
                  onClick={previousTrack}
                  disabled={!hasTracks}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: hasTracks ? 'pointer' : 'not-allowed',
                    opacity: hasTracks ? 1 : 0.5
                  }}
                >
                  <SkipBack size={14} />
                </button>
                
                <button
                  onClick={isPlaying ? pause : play}
                  disabled={!hasTracks}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: hasTracks ? 'pointer' : 'not-allowed',
                    opacity: hasTracks ? 1 : 0.5
                  }}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
                
                <button
                  onClick={nextTrack}
                  disabled={!hasTracks}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: hasTracks ? 'pointer' : 'not-allowed',
                    opacity: hasTracks ? 1 : 0.5
                  }}
                >
                  <SkipForward size={14} />
                </button>
              </div>

              {/* Volume Control */}
              <div>
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
            </div>
          )}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '600', opacity: 0.8 }}>User:</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button style={dropdownTriggerStyle}>
                <span>{currentActiveUser || 'Select User'}</span>
                <span>▼</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'white',
              borderRadius: '15px',
              zIndex: 1003,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              maxHeight: '300px',
              overflowY: 'auto'
            }} className="w-[340px]" side="top">
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
            <DropdownMenuContent style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'white',
              borderRadius: '15px',
              zIndex: 1003,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              maxHeight: '300px',
              overflowY: 'auto'
            }} className="w-[340px]" side="top">
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
              <DropdownMenuContent style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(25px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: 'white',
                borderRadius: '15px',
                zIndex: 1003,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                maxHeight: '300px',
                overflowY: 'auto'
              }} className="w-[340px]" side="top">
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
              <DropdownMenuContent style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(25px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: 'white',
                borderRadius: '15px',
                zIndex: 1003,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                maxHeight: '300px',
                overflowY: 'auto'
              }} className="w-[340px]" side="top">
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
            <DropdownMenuContent style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'white',
              borderRadius: '15px',
              zIndex: 1003,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              maxHeight: '300px',
              overflowY: 'auto'
            }} className="w-[340px]" side="top">
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
            <DropdownMenuContent style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'white',
              borderRadius: '15px',
              zIndex: 1003,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              maxHeight: '300px',
              overflowY: 'auto'
            }} className="w-[340px]" side="top">
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

        {hasMusic && (
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
              <span>{backgroundMusicEnabled ? 'Enabled' : 'Disabled'}</span>
              <Switch 
                checked={backgroundMusicEnabled} 
                onCheckedChange={setBackgroundMusicEnabled}
                className="data-[state=checked]:bg-[--switch-checked-color]"
              />
            </div>
            {backgroundMusicEnabled && (
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
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button onClick={handleHistoryClick} style={{...dropdownTriggerStyle, justifyContent: 'center' }}>View Test History</button>
          <button onClick={handleContactMe} style={{...dropdownTriggerStyle, justifyContent: 'center' }}>Contact Me</button>
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
