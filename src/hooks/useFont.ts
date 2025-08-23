
import { useState } from 'react';
import { Font } from '../types';

export const useFont = () => {
  const [fontFamily, setFontFamily] = useState<Font>('Roboto Mono');

  return {
    fontFamily,
    setFontFamily
  };
};
