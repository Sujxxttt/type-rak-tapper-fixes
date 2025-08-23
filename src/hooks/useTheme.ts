
import { useState, useEffect } from 'react';

export interface Theme {
  name: string;
  background: string;
  cursor: string;
}

export const useTheme = () => {
  const [theme, setTheme] = useState<string>('cosmic-nebula');

  const themes: Record<string, Theme> = {
    'cosmic-nebula': {
      name: 'Cosmic Nebula',
      background: 'linear-gradient(135deg, hsl(279, 89%, 13%), hsl(206, 94%, 28%))',
      cursor: 'cursor-blue'
    },
    'midnight-black': {
      name: 'Midnight Black',
      background: 'hsl(0, 0%, 4%)',
      cursor: 'cursor-white'
    },
    'cotton-candy-glow': {
      name: 'Cotton Candy Glow',
      background: 'linear-gradient(135deg, hsl(193, 89%, 51%), hsl(216, 89%, 66%))',
      cursor: 'cursor-pink'
    }
  };

  const getThemeColor = () => {
    return themes[theme]?.background || themes['cosmic-nebula'].background;
  };

  const getButtonColor = () => {
    switch (theme) {
      case 'midnight-black':
        return 'rgba(197, 89, 247, 0.3)';
      case 'cotton-candy-glow':
        return 'rgba(252, 3, 223, 0.3)';
      default:
        return 'rgba(177, 9, 214, 0.3)';
    }
  };

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    document.body.className = `theme-${newTheme}`;
  };

  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  return {
    theme,
    themes,
    getThemeColor,
    getButtonColor,
    changeTheme
  };
};
