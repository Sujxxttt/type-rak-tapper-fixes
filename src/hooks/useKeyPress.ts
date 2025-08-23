
import { useState, useEffect, useCallback } from 'react';

export const useKeyPress = (words: string[]) => {
  const [typed, setTyped] = useState('');
  const [cursor, setCursor] = useState(0);
  const [time, setTime] = useState(60);
  const [start, setStart] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [errors, setErrors] = useState(0);

  const resetKeys = useCallback(() => {
    setTyped('');
    setCursor(0);
    setWordCount(0);
    setErrors(0);
  }, []);

  const clearTyped = useCallback(() => {
    setTyped('');
    setCursor(0);
  }, []);

  const resetWordCount = useCallback(() => {
    setWordCount(0);
  }, []);

  const resetErrors = useCallback(() => {
    setErrors(0);
  }, []);

  useEffect(() => {
    if (!start || time === 0) return;

    const timer = setInterval(() => {
      setTime(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [start, time]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!start) return;

      if (e.key.length === 1) {
        const currentText = words.join(' ');
        const nextChar = currentText[cursor];
        
        if (e.key === nextChar) {
          setTyped(prev => prev + e.key);
          setCursor(prev => prev + 1);
          if (e.key === ' ') {
            setWordCount(prev => prev + 1);
          }
        } else {
          setErrors(prev => prev + 1);
        }
      } else if (e.key === 'Backspace' && cursor > 0) {
        setTyped(prev => prev.slice(0, -1));
        setCursor(prev => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [start, cursor, words]);

  return {
    typed,
    cursor,
    time,
    setTime,
    start,
    setStart,
    wordCount,
    errors,
    resetKeys,
    clearTyped,
    resetWordCount,
    resetErrors
  };
};
