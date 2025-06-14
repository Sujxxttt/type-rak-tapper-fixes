
import { useState, useRef, useCallback } from 'react';

export const useTypingGame = () => {
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [testActive, setTestActive] = useState<boolean>(false);
  const [elapsed, setElapsed] = useState<number>(0);
  const [pos, setPos] = useState<number>(0);
  const [chars, setChars] = useState<HTMLElement[]>([]);
  const [testText, setTestText] = useState<string>('');
  const [correctCharacters, setCorrectCharacters] = useState<number>(0);
  const [totalErrors, setTotalErrors] = useState<number>(0);
  const [actualTypedCount, setActualTypedCount] = useState<number>(0);
  const [lastErrorPos, setLastErrorPos] = useState<number>(-1);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const commonWords = [
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'is', 'was', 'are', 'been', 'has', 'had', 'were', 'said', 'each', 'which', 'where', 'did', 'very', 'what', 'why', 'how'
  ];

  const generateWords = useCallback((wordCount: number = 50): string => {
    console.log('Generating words with count:', wordCount);
    const words = [];
    for (let i = 0; i < wordCount; i++) {
      const randomWord = commonWords[Math.floor(Math.random() * commonWords.length)];
      words.push(randomWord);
    }
    const generatedText = words.join(' ');
    console.log('Generated text:', generatedText.substring(0, 100) + '...');
    return generatedText;
  }, []);

  const renderText = useCallback((text: string) => {
    console.log('Rendering text with length:', text.length);
    setTestText(text);
    
    const textFlow = document.getElementById('text-flow');
    if (!textFlow) {
      console.log('Text flow element not found, retrying...');
      setTimeout(() => renderText(text), 100);
      return;
    }

    textFlow.innerHTML = '';
    const charElements: HTMLElement[] = [];

    for (let i = 0; i < text.length; i++) {
      const span = document.createElement('span');
      span.textContent = text[i];
      span.className = 'char';
      span.id = `char-${i}`;
      textFlow.appendChild(span);
      charElements.push(span);
    }

    setChars(charElements);
    console.log('Rendered', charElements.length, 'characters');
  }, []);

  const startTimer = useCallback((duration: number, onComplete: () => void) => {
    console.log('Starting timer for duration:', duration);
    setElapsed(0);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setElapsed(prev => {
        const newElapsed = prev + 1;
        console.log('Timer elapsed:', newElapsed);
        if (newElapsed >= duration) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          onComplete();
        }
        return newElapsed;
      });
    }, 1000);
  }, []);

  const resetTest = useCallback(() => {
    console.log('Resetting test');
    setGameOver(false);
    setTestActive(false);
    setElapsed(0);
    setPos(0);
    setCorrectCharacters(0);
    setTotalErrors(0);
    setActualTypedCount(0);
    setLastErrorPos(-1);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Clear text flow
    const textFlow = document.getElementById('text-flow');
    if (textFlow) {
      textFlow.innerHTML = '';
    }
    setChars([]);
    setTestText('');
  }, []);

  const extendText = useCallback((): string => {
    console.log('Extending text');
    const newWords = generateWords(50);
    const extendedText = testText + ' ' + newWords;
    setTestText(extendedText);
    return extendedText;
  }, [testText, generateWords]);

  const getCurrentWPM = useCallback((): number => {
    if (elapsed === 0) return 0;
    const minutes = elapsed / 60;
    return Math.round((correctCharacters / 5) / minutes);
  }, [correctCharacters, elapsed]);

  const getCurrentErrorRate = useCallback((): number => {
    if (actualTypedCount === 0) return 0;
    return (totalErrors / actualTypedCount) * 100;
  }, [totalErrors, actualTypedCount]);

  return {
    gameOver,
    setGameOver,
    testActive,
    setTestActive,
    elapsed,
    setElapsed,
    pos,
    setPos,
    chars,
    testText,
    correctCharacters,
    setCorrectCharacters,
    totalErrors,
    setTotalErrors,
    actualTypedCount,
    setActualTypedCount,
    lastErrorPos,
    setLastErrorPos,
    timerRef,
    generateWords,
    renderText,
    startTimer,
    resetTest,
    extendText,
    getCurrentWPM,
    getCurrentErrorRate
  };
};
