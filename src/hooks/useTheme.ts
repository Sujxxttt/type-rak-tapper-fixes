
import { useState } from 'react';

export type Theme = 'cosmic-nebula' | 'midnight-black' | 'cotton-candy-glow';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('cosmic-nebula');

  const getBackgroundGradient = () => {
    switch (theme) {
      case 'cosmic-nebula':
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'midnight-black':
        return 'linear-gradient(135deg, #2c3e50 0%, #000000 100%)';
      case 'cotton-candy-glow':
        return 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)';
      default:
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  };

  const getButtonColor = () => {
    switch (theme) {
      case 'cosmic-nebula':
        return 'rgba(180, 9, 214, 0.8)';
      case 'midnight-black':
        return 'rgba(197, 89, 247, 0.8)';
      case 'cotton-candy-glow':
        return 'rgba(255, 89, 232, 0.8)';
      default:
        return 'rgba(180, 9, 214, 0.8)';
    }
  };

  return {
    theme,
    setTheme,
    getBackgroundGradient,
    getButtonColor
  };
};
