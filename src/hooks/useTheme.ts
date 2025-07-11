
import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState<string>('cosmic-nebula');

  useEffect(() => {
    const savedTheme = localStorage.getItem('typing-theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const themes = ['cosmic-nebula', 'midnight-black', 'cotton-candy-glow'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
    localStorage.setItem('typing-theme', nextTheme);
  };

  return { theme, toggleTheme };
};
