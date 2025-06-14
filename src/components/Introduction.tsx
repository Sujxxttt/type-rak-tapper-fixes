
import React, { useState } from 'react';

interface IntroductionProps {
  onCreateUser: (username: string) => void;
  theme: string;
}

export const Introduction: React.FC<IntroductionProps> = ({ onCreateUser, theme }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onCreateUser(username.trim());
    }
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'cosmic-nebula':
        return {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          titleColor: 'linear-gradient(90deg, #c454f0 0%, #7d54f0 100%)'
        };
      case 'midnight-black':
        return {
          background: 'linear-gradient(135deg, #2c3e50 0%, #000000 100%)',
          titleColor: 'linear-gradient(90deg, #c559f7 0%, #7f59f7 100%)'
        };
      case 'cotton-candy-glow':
        return {
          background: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 50%, #fd79a8 100%)',
          titleColor: 'linear-gradient(90deg, #ff59e8 0%, #ff52a8 100%)'
        };
      default:
        return {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          titleColor: 'linear-gradient(90deg, #c454f0 0%, #7d54f0 100%)'
        };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: themeStyles.background,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
    >
      <h1 
        style={{
          backgroundImage: themeStyles.titleColor,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
          fontSize: '4rem',
          fontWeight: 700,
          marginBottom: '2rem',
          textAlign: 'center'
        }}
      >
        TypeWave
      </h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          style={{
            padding: '12px 20px',
            borderRadius: '25px',
            border: 'none',
            fontSize: '1.1rem',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.9)',
            color: '#333',
            outline: 'none',
            minWidth: '250px'
          }}
        />
        <button
          type="submit"
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            padding: '12px 30px',
            borderRadius: '25px',
            fontSize: '1.1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Start Typing
        </button>
      </form>
    </div>
  );
};
