
import { useState } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState('cosmic-nebula');

  return {
    theme,
    setTheme
  };
};
