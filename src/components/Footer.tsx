
import React from 'react';

interface FooterProps {
  theme: string;
  onShowIntroduction: () => void;
  onShowTestNameMenu: () => void;
  onShowHistory: () => void;
  onContactMe: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  theme,
  onShowIntroduction,
  onShowTestNameMenu,
  onShowHistory,
  onContactMe
}) => {
  const getTextColor = () => {
    return theme === 'cotton-candy-glow' ? '#333' : 'rgba(255, 255, 255, 0.7)';
  };

  const linkStyle = {
    background: 'none',
    border: 'none',
    color: getTextColor(),
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '0.9rem'
  };

  return (
    <footer style={{
      marginTop: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      gap: '2rem',
      flexWrap: 'wrap'
    }}>
      <button onClick={onShowIntroduction} style={linkStyle}>
        How to use
      </button>
      
      <button onClick={onShowTestNameMenu} style={linkStyle}>
        Change test
      </button>

      <button onClick={onShowHistory} style={linkStyle}>
        View history
      </button>

      <button onClick={onContactMe} style={linkStyle}>
        Contact me
      </button>

      <button 
        onClick={() => window.open('https://github.com', '_blank')}
        style={linkStyle}
      >
        GitHub
      </button>

      <button 
        onClick={() => window.open('https://docs.lovable.dev', '_blank')}
        style={linkStyle}
      >
        Documentation
      </button>
    </footer>
  );
};
