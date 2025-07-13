import { useState, useEffect, useCallback, useRef } from 'react';

interface TypingGameState {
  userInput: string;
  currentIndex: number;
  wpm: number;
  accuracy: number;
  timeLeft: number;
  gameStarted: boolean;
  gameOver: boolean;
  startTime: number | null;
  currentWordIndex: number;
  errorPositions: number[];
  correctChars: number;
  totalChars: number;
  cheatUsages: number;
}

export const useTypingGame = (
  text: string,
  duration: number,
  onComplete: (wpm: number, accuracy: number, timeLeft: number) => void
) => {
  const [state, setState] = useState<TypingGameState>({
    userInput: '',
    currentIndex: 0,
    wpm: 0,
    accuracy: 100,
    timeLeft: duration,
    gameStarted: false,
    gameOver: false,
    startTime: null,
    currentWordIndex: 0,
    errorPositions: [],
    correctChars: 0,
    totalChars: 0,
    cheatUsages: 0
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const calculateStats = useCallback(() => {
    const now = Date.now();
    const timeElapsed = state.startTime ? (now - state.startTime) / 1000 / 60 : 0;
    
    if (timeElapsed > 0) {
      const wordsTyped = state.correctChars / 5;
      const wpm = Math.round(wordsTyped / timeElapsed);
      const accuracy = state.totalChars > 0 ? Math.round((state.correctChars / state.totalChars) * 100) : 100;
      
      setState(prev => ({ ...prev, wpm, accuracy }));
    }
  }, [state.startTime, state.correctChars, state.totalChars]);

  const updateCurrentWordIndex = useCallback(() => {
    const words = text.split(' ');
    let charCount = 0;
    let wordIndex = 0;
    
    for (let i = 0; i < words.length; i++) {
      charCount += words[i].length + (i < words.length - 1 ? 1 : 0);
      if (charCount > state.currentIndex) {
        wordIndex = i;
        break;
      }
    }
    
    setState(prev => ({ ...prev, currentWordIndex: wordIndex }));
  }, [text, state.currentIndex]);

  useEffect(() => {
    if (state.gameStarted && !state.gameOver && state.timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setState(prev => {
          const newTimeLeft = prev.timeLeft - 1;
          if (newTimeLeft <= 0) {
            onComplete(prev.wpm, prev.accuracy, 0);
            return { ...prev, timeLeft: 0, gameOver: true };
          }
          return { ...prev, timeLeft: newTimeLeft };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.gameStarted, state.gameOver, state.timeLeft, onComplete]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  useEffect(() => {
    updateCurrentWordIndex();
  }, [updateCurrentWordIndex]);

  const startGame = () => {
    setState(prev => ({
      ...prev,
      gameStarted: true,
      startTime: Date.now()
    }));
  };

  const resetGame = () => {
    setState({
      userInput: '',
      currentIndex: 0,
      wpm: 0,
      accuracy: 100,
      timeLeft: duration,
      gameStarted: false,
      gameOver: false,
      startTime: null,
      currentWordIndex: 0,
      errorPositions: [],
      correctChars: 0,
      totalChars: 0,
      cheatUsages: 0
    });
  };

  const handleInputChange = (value: string) => {
    if (!state.gameStarted || state.gameOver) return;
    
    setState(prev => {
      const newState = { ...prev, userInput: value };
      
      // Calculate progress
      const correctChars = Math.min(value.length, text.length);
      let correct = 0;
      const errors: number[] = [];
      
      for (let i = 0; i < correctChars; i++) {
        if (value[i] === text[i]) {
          correct++;
        } else {
          errors.push(i);
        }
      }
      
      newState.correctChars = correct;
      newState.totalChars = value.length;
      newState.currentIndex = value.length;
      newState.errorPositions = errors;
      
      // Check if test is complete
      if (value === text) {
        newState.gameOver = true;
        setTimeout(() => {
          onComplete(newState.wpm, newState.accuracy, newState.timeLeft);
        }, 100);
      }
      
      return newState;
    });
  };

  const handleKeyPress = (key: string) => {
    // Handle special keys if needed
  };

  const addCheatTime = () => {
    setState(prev => ({
      ...prev,
      timeLeft: prev.timeLeft + 10,
      cheatUsages: prev.cheatUsages + 1
    }));
  };

  return {
    ...state,
    startGame,
    resetGame,
    handleInputChange,
    handleKeyPress,
    addCheatTime
  };
};
