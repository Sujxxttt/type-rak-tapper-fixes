
import { useState, useEffect, useCallback } from 'react';

const TEXTS = [
  "The quick brown fox jumps over the lazy dog near the riverbank where children play happily.",
  "Technology has revolutionized the way we communicate and interact with each other in modern society.",
  "Mountains rise majestically against the horizon while clouds drift peacefully across the azure sky.",
  "Programming requires patience, practice, and persistence to master the art of creating elegant solutions.",
  "Music has the power to transcend boundaries and connect people from different cultures and backgrounds."
];

export const useTypingGame = () => {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [testActive, setTestActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errorPositions, setErrorPositions] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);

  const generateText = useCallback(() => {
    const randomText = TEXTS[Math.floor(Math.random() * TEXTS.length)];
    setText(randomText);
  }, []);

  const calculateStats = useCallback(() => {
    if (!startTime || userInput.length === 0) {
      setWpm(0);
      setAccuracy(100);
      return;
    }

    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // minutes
    const wordsTyped = userInput.trim().split(' ').length;
    const calculatedWpm = Math.round(wordsTyped / timeElapsed);

    let correctChars = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === text[i]) {
        correctChars++;
      }
    }

    const calculatedAccuracy = userInput.length > 0 ? 
      Math.round((correctChars / userInput.length) * 100) : 100;

    setWpm(calculatedWpm);
    setAccuracy(calculatedAccuracy);
  }, [userInput, text, startTime]);

  const startTest = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true);
      setTestActive(true);
      setStartTime(Date.now());
      generateText();
      setTimeLeft(60);
    }
  }, [gameStarted, generateText]);

  const endTest = useCallback(() => {
    setGameOver(true);
    setTestActive(false);
  }, []);

  const resetTest = useCallback(() => {
    setUserInput('');
    setCurrentIndex(0);
    setCurrentWordIndex(0);
    setGameStarted(false);
    setGameOver(false);
    setTestActive(false);
    setTimeLeft(60);
    setWpm(0);
    setAccuracy(100);
    setErrorPositions([]);
    setStartTime(null);
    generateText();
  }, [generateText]);

  const addCheatTime = useCallback(() => {
    if (testActive && timeLeft > 0) {
      setTimeLeft(prev => Math.min(prev + 10, 60));
    }
  }, [testActive, timeLeft]);

  const handleInputChange = useCallback((value: string) => {
    if (!gameStarted) {
      startTest();
    }

    setUserInput(value);

    // Update current index
    setCurrentIndex(value.length);

    // Calculate current word index
    const words = text.split(' ');
    let charCount = 0;
    let wordIndex = 0;

    for (let i = 0; i < words.length; i++) {
      if (charCount + words[i].length >= value.length) {
        wordIndex = i;
        break;
      }
      charCount += words[i].length + 1; // +1 for space
    }

    setCurrentWordIndex(wordIndex);

    // Track errors
    const errors: number[] = [];
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== text[i]) {
        errors.push(i);
      }
    }
    setErrorPositions(errors);

    // Check if test is complete
    if (value === text) {
      endTest();
    }
  }, [gameStarted, startTest, text, endTest]);

  const handleKeyPress = useCallback((key: string) => {
    if (key === 'Escape') {
      resetTest();
    }
  }, [resetTest]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (testActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [testActive, timeLeft, endTest]);

  // Calculate stats effect
  useEffect(() => {
    if (gameStarted) {
      calculateStats();
    }
  }, [userInput, gameStarted, calculateStats]);

  // Initialize text on mount
  useEffect(() => {
    generateText();
  }, [generateText]);

  return {
    text,
    userInput,
    currentIndex,
    currentWordIndex,
    gameStarted,
    gameOver,
    setGameOver,
    testActive,
    setTestActive,
    timeLeft,
    wpm,
    accuracy,
    errorPositions,
    handleInputChange,
    handleKeyPress,
    startTest,
    endTest,
    resetTest,
    addCheatTime
  };
};
