
import React, { useState } from 'react';

interface IntroductionProps {
  onCreateUser: (username: string) => void;
  theme: string;
}

export const Introduction: React.FC<IntroductionProps> = ({ onCreateUser, theme }) => {
  const [username, setUsername] = useState('');

  const themes = [
    {
      id: 'cosmic-nebula',
      background: 'linear-gradient(45deg, #3f034a, #004a7a)',
      titleGradient: 'linear-gradient(90deg, #c454f0 0%, #7d54f0 100%)'
    },
    {
      id: 'midnight-black',
      background: '#000000',
      titleGradient: 'linear-gradient(90deg, #c559f7 0%, #7f59f7 100%)'
    },
    {
      id: 'cotton-candy-glow',
      background: 'linear-gradient(45deg, #3e8cb9, #2f739d)',
      titleGradient: 'linear-gradient(90deg, #ff59e8 0%, #ff52a8 100%)'
    }
  ];

  const getDefaultTheme = () => {
    return theme || 'cosmic-nebula';
  };

  const getCurrentThemeData = () => {
    const defaultTheme = getDefaultTheme();
    return themes.find(t => t.id === defaultTheme) || themes[0];
  };

  const currentThemeData = getCurrentThemeData();

  const handleCreateUser = () => {
    if (username.trim()) {
      onCreateUser(username.trim());
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: currentThemeData.background,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        width: '100vw',
        height: '100vh'
      }}
    >
      <h1 
        style={{
          backgroundImage: currentThemeData.titleGradient,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
          fontSize: '5rem',
          fontWeight: 700,
          margin: 0,
          textAlign: 'center'
        }}
      >
        TypeWave
      </h1>
      
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          style={{
            padding: '15px 25px',
            fontSize: '1.2rem',
            borderRadius: '25px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            marginBottom: '20px',
            minWidth: '300px',
            textAlign: 'center'
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleCreateUser()}
        />
        <br />
        <button
          onClick={handleCreateUser}
          style={{
            padding: '15px 30px',
            fontSize: '1.1rem',
            borderRadius: '25px',
            border: 'none',
            background: currentThemeData.titleGradient,
            color: 'white',
            cursor: 'pointer',
            minWidth: '200px'
          }}
        >
          Start Typing
        </button>
      </div>
    </div>
  );
};
