
import React from 'react';
import { Font } from '../types';

interface SettingsProps {
  theme: string;
  fontFamily: Font;
  onSettingsChange: (settings: { theme: string; fontFamily: Font }) => void;
  musicEnabled: boolean;
  onMusicToggle: () => void;
  musicVolume: number;
  onVolumeChange: (volume: number) => void;
  username: string;
  onUsernameChange: (username: string) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  getButtonColor: () => string;
  hasMusic: boolean;
  isPlaying: boolean;
}

export const Settings: React.FC<SettingsProps> = ({
  theme,
  fontFamily,
  onSettingsChange,
  musicEnabled,
  onMusicToggle,
  musicVolume,
  onVolumeChange,
  username,
  onUsernameChange,
  isLoggedIn,
  onLogin,
  onLogout,
  getButtonColor,
  hasMusic,
  isPlaying
}) => {
  const themes = [
    { id: 'cosmic-nebula', name: 'Cosmic Nebula' },
    { id: 'midnight-black', name: 'Midnight Black' },
    { id: 'cotton-candy-glow', name: 'Cotton Candy Glow' }
  ];

  const fonts: { id: Font; name: string }[] = [
    { id: 'Roboto Mono', name: 'Roboto Mono' },
    { id: 'Fira Code', name: 'Fira Code' },
    { id: 'Source Code Pro', name: 'Source Code Pro' }
  ];

  return (
    <div style={{
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '30px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: 'white'
    }}>
      <h2 style={{ marginBottom: '30px' }}>Settings</h2>
      
      <div style={{ marginBottom: '25px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontSize: '16px' }}>
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '6px',
            color: 'white',
            fontSize: '14px'
          }}
        />
      </div>

      <div style={{ marginBottom: '25px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontSize: '16px' }}>
          Theme
        </label>
        <select
          value={theme}
          onChange={(e) => onSettingsChange({ theme: e.target.value, fontFamily })}
          style={{
            width: '100%',
            padding: '10px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '6px',
            color: 'white',
            fontSize: '14px'
          }}
        >
          {themes.map(t => (
            <option key={t.id} value={t.id} style={{ background: '#333' }}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '25px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontSize: '16px' }}>
          Font
        </label>
        <select
          value={fontFamily}
          onChange={(e) => onSettingsChange({ theme, fontFamily: e.target.value as Font })}
          style={{
            width: '100%',
            padding: '10px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '6px',
            color: 'white',
            fontSize: '14px'
          }}
        >
          {fonts.map(f => (
            <option key={f.id} value={f.id} style={{ background: '#333' }}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '25px' }}>
        <label style={{ display: 'flex', alignItems: 'center', fontSize: '16px' }}>
          <input
            type="checkbox"
            checked={musicEnabled}
            onChange={onMusicToggle}
            style={{ marginRight: '10px' }}
          />
          Enable Background Music
        </label>
        {musicEnabled && (
          <div style={{ marginTop: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
              Volume: {musicVolume}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={musicVolume}
              onChange={(e) => onVolumeChange(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center' }}>
        {!isLoggedIn ? (
          <button
            onClick={onLogin}
            style={{
              padding: '12px 24px',
              background: getButtonColor(),
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        ) : (
          <button
            onClick={onLogout}
            style={{
              padding: '12px 24px',
              background: 'rgba(255, 0, 0, 0.6)',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};
