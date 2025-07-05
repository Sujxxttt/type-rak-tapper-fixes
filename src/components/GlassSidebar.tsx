
import React, { useState } from 'react';
import { X, ChevronDown, Settings, User, Clock, Volume2, VolumeX, Palette, Type, Music } from 'lucide-react';
import { CustomDurationSlider } from './CustomDurationSlider';

interface GlassSidebarProps {
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

export const GlassSidebar: React.FC<GlassSidebarProps> = ({
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
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [fontDropdownOpen, setFontDropdownOpen] = useState(false);
  const [fontSizeDropdownOpen, setFontSizeDropdownOpen] = useState(false);
  const [durationDropdownOpen, setDurationDropdownOpen] = useState(false);
  const [showCustomDuration, setShowCustomDuration] = useState(false);

  const predefinedDurations = [
    { label: '30 seconds', value: 30 },
    { label: '1 minute', value: 60 },
    { label: '2 minutes', value: 120 },
    { label: '3 minutes', value: 180 },
    { label: '5 minutes', value: 300 },
    { label: '10 minutes', value: 600 },
    { label: '30 minutes', value: 1800 },
    { label: '60 minutes', value: 3600 },
    { label: 'Custom', value: -1 }
  ];

  const fontOptions = [
    { name: 'Inter', value: 'inter', family: 'Inter, sans-serif' },
    { name: 'Roboto', value: 'roboto', family: 'Roboto, sans-serif' },
    { name: 'Open Sans', value: 'open-sans', family: 'Open Sans, sans-serif' },
    { name: 'Lato', value: 'lato', family: 'Lato, sans-serif' },
    { name: 'Source Sans Pro', value: 'source-sans-pro', family: 'Source Sans Pro, sans-serif' },
    { name: 'Dancing Script', value: 'dancing-script', family: 'Dancing Script, cursive' },
    { name: 'Pacifico', value: 'pacifico', family: 'Pacifico, cursive' }
  ];

  const fontSizeOptions = [80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180];

  const closeSideMenu = () => {
    setSideMenuOpen(false);
  };

  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px'
  };

  const dropdownStyle = {
    ...glassStyle,
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 1000,
    marginTop: '4px',
    maxHeight: '200px',
    overflowY: 'auto' as const
  };

  const getCurrentDurationLabel = () => {
    const found = predefinedDurations.find(d => d.value === duration);
    if (found && found.value !== -1) return found.label;
    
    if (duration < 60) return `${duration}s`;
    const minutes = Math.floor(duration / 60);
    const remainingSeconds = duration % 60;
    if (remainingSeconds === 0) return `${minutes}m`;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <>
      {/* Overlay */}
      {sideMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
          onClick={closeSideMenu}
        />
      )}
      
      <div 
        className={`fixed top-0 right-0 h-screen w-96 transition-transform duration-300 ease-in-out z-[1000] ${
          sideMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(25px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRight: 'none'
        }}
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* Close Button */}
          <button 
            onClick={closeSideMenu}
            className="absolute top-4 right-4 p-2 rounded-full transition-all duration-200"
            style={glassStyle}
          >
            <X size={20} className="text-white" />
          </button>

          <div className="space-y-6 mt-8">
            {/* User Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/90">
                <User size={16} />
                <span className="text-sm font-medium">User Management</span>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="w-full p-3 text-left text-white rounded-lg transition-all duration-200 flex items-center justify-between"
                  style={glassStyle}
                >
                  <span>{currentActiveUser}</span>
                  <ChevronDown size={16} className={`transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {userDropdownOpen && (
                  <div style={dropdownStyle}>
                    {usersList.map(user => (
                      <button
                        key={user}
                        onClick={() => {
                          switchUser(user);
                          setUserDropdownOpen(false);
                        }}
                        className="w-full p-3 text-left text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200"
                      >
                        {user}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setSideMenuOpen(false);
                  if (window.location.pathname === '/') {
                    const event = new CustomEvent('navigateToCreateUser');
                    window.dispatchEvent(event);
                  }
                }}
                className="w-full p-3 text-white rounded-lg transition-all duration-200"
                style={glassStyle}
              >
                Create New User
              </button>

              <button
                onClick={handleDeleteUser}
                className="w-full p-3 text-white rounded-lg transition-all duration-200"
                style={{
                  ...glassStyle,
                  background: deleteConfirmState ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)'
                }}
              >
                {deleteConfirmState ? 'Confirm Delete User?' : 'Delete Current User'}
              </button>
            </div>

            {/* Test Duration */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/90">
                <Clock size={16} />
                <span className="text-sm font-medium">Test Duration</span>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setDurationDropdownOpen(!durationDropdownOpen)}
                  className="w-full p-3 text-left text-white rounded-lg transition-all duration-200 flex items-center justify-between"
                  style={glassStyle}
                >
                  <span>{getCurrentDurationLabel()}</span>
                  <ChevronDown size={16} className={`transition-transform ${durationDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {durationDropdownOpen && (
                  <div style={dropdownStyle}>
                    {predefinedDurations.map(option => (
                      <button
                        key={option.label}
                        onClick={() => {
                          if (option.value === -1) {
                            setShowCustomDuration(true);
                          } else {
                            setDuration(option.value);
                            setShowCustomDuration(false);
                          }
                          setDurationDropdownOpen(false);
                        }}
                        className="w-full p-3 text-left text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {showCustomDuration && (
                <div style={glassStyle} className="p-4">
                  <CustomDurationSlider
                    value={duration}
                    onChange={setDuration}
                    theme={theme}
                  />
                </div>
              )}
            </div>

            {/* Theme */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/90">
                <Palette size={16} />
                <span className="text-sm font-medium">Theme</span>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                  className="w-full p-3 text-left text-white rounded-lg transition-all duration-200 flex items-center justify-between"
                  style={glassStyle}
                >
                  <span>{theme.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                  <ChevronDown size={16} className={`transition-transform ${themeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {themeDropdownOpen && (
                  <div style={dropdownStyle}>
                    {['cosmic-nebula', 'midnight-black', 'cotton-candy-glow'].map(t => (
                      <button
                        key={t}
                        onClick={() => {
                          applyTheme(t);
                          setThemeDropdownOpen(false);
                        }}
                        className="w-full p-3 text-left text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200"
                      >
                        {t.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Font Settings */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/90">
                <Type size={16} />
                <span className="text-sm font-medium">Font Settings</span>
              </div>
              
              {/* Font Style */}
              <div className="relative">
                <label className="block text-white/80 text-sm mb-2">Font Style</label>
                <button
                  onClick={() => setFontDropdownOpen(!fontDropdownOpen)}
                  className="w-full p-3 text-left text-white rounded-lg transition-all duration-200 flex items-center justify-between"
                  style={glassStyle}
                >
                  <span style={{ fontFamily: fontOptions.find(f => f.value === fontStyle)?.family }}>
                    {fontOptions.find(f => f.value === fontStyle)?.name}
                  </span>
                  <ChevronDown size={16} className={`transition-transform ${fontDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {fontDropdownOpen && (
                  <div style={dropdownStyle}>
                    {fontOptions.map(font => (
                      <button
                        key={font.value}
                        onClick={() => {
                          setFontStyle(font.value);
                          setFontDropdownOpen(false);
                        }}
                        className="w-full p-3 text-left text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200"
                        style={{ fontFamily: font.family }}
                      >
                        {font.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Font Size */}
              <div className="relative">
                <label className="block text-white/80 text-sm mb-2">Font Size</label>
                <button
                  onClick={() => setFontSizeDropdownOpen(!fontSizeDropdownOpen)}
                  className="w-full p-3 text-left text-white rounded-lg transition-all duration-200 flex items-center justify-between"
                  style={glassStyle}
                >
                  <span>{fontSize}%</span>
                  <ChevronDown size={16} className={`transition-transform ${fontSizeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {fontSizeDropdownOpen && (
                  <div style={dropdownStyle}>
                    {fontSizeOptions.map(size => (
                      <button
                        key={size}
                        onClick={() => {
                          setFontSize(size);
                          setFontSizeDropdownOpen(false);
                        }}
                        className="w-full p-3 text-left text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200"
                      >
                        {size}%
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sound Settings */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/90">
                <Volume2 size={16} />
                <span className="text-sm font-medium">Audio Settings</span>
              </div>
              
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="w-full p-3 text-white rounded-lg transition-all duration-200 flex items-center justify-between"
                style={glassStyle}
              >
                <span>Sound Effects</span>
                <div className="flex items-center gap-2">
                  {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  <span className="text-sm">{soundEnabled ? 'On' : 'Off'}</span>
                </div>
              </button>

              <button
                onClick={() => setBackgroundMusicEnabled(!backgroundMusicEnabled)}
                className="w-full p-3 text-white rounded-lg transition-all duration-200 flex items-center justify-between"
                style={glassStyle}
              >
                <span>Background Music</span>
                <div className="flex items-center gap-2">
                  <Music size={16} />
                  <span className="text-sm">{backgroundMusicEnabled ? 'On' : 'Off'}</span>
                </div>
              </button>

              {hasMusic && backgroundMusicEnabled && (
                <div style={glassStyle} className="p-4">
                  <label className="block text-white/80 text-sm mb-2">Music Volume: {musicVolume}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={musicVolume}
                    onChange={(e) => setMusicVolume(Number(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Menu Options */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/90">
                <Settings size={16} />
                <span className="text-sm font-medium">Menu</span>
              </div>
              
              <button
                onClick={() => {
                  handleHistoryClick();
                  setSideMenuOpen(false);
                }}
                className="w-full p-3 text-white rounded-lg transition-all duration-200 text-left"
                style={glassStyle}
              >
                📊 View Test History
              </button>

              <button
                onClick={() => {
                  setSideMenuOpen(false);
                  if (window.location.pathname === '/') {
                    const event = new CustomEvent('navigateToAchievements');
                    window.dispatchEvent(event);
                  }
                }}
                className="w-full p-3 rounded-lg transition-all duration-200 text-left"
                style={{
                  ...glassStyle,
                  background: 'rgba(255, 215, 0, 0.1)',
                  color: '#FFD700',
                  border: '1px solid rgba(255, 215, 0, 0.2)'
                }}
              >
                🏆 Achievements
              </button>

              <button
                onClick={() => {
                  handleContactMe();
                  setSideMenuOpen(false);
                }}
                className="w-full p-3 text-white rounded-lg transition-all duration-200 text-left"
                style={glassStyle}
              >
                📧 Contact Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
