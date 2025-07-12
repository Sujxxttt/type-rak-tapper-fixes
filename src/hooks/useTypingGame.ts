
import { useState, useRef, useCallback, useEffect } from 'react';

interface UseTypingGameProps {
  duration: number;
  onComplete: () => void;
}

export const useTypingGame = ({ duration, onComplete }: UseTypingGameProps) => {
  const [text, setText] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [testActive, setTestActive] = useState<boolean>(false);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [errorPositions, setErrorPositions] = useState<Set<number>>(new Set());
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const correctCharsRef = useRef<number>(0);
  const totalErrorsRef = useRef<number>(0);

  const wordList = [
    "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "and", "runs",
    "through", "forest", "with", "great", "speed", "while", "being", "chased", "by",
    "hunter", "who", "wants", "catch", "for", "his", "dinner", "but", "fox", "too",
    "smart", "fast", "escape", "from", "danger", "using", "its", "natural", "instincts",
    "survival", "skills", "that", "have", "been", "developed", "over", "many", "years",
    "evolution", "making", "one", "most", "cunning", "animals", "in", "animal", "kingdom",
    "able", "outsmart", "even", "most", "experienced", "hunters", "with", "ease", "grace"
  ];

  const generateText = useCallback(() => {
    const words = [];
    for (let i = 0; i < 100; i++) {
      words.push(wordList[Math.floor(Math.random() * wordList.length)]);
    }
    return words.join(' ');
  }, []);

  const startTest = useCallback(() => {
    const generatedText = generateText();
    setText(generatedText);
    setUserInput('');
    setCurrentIndex(0);
    setWpm(0);
    setAccuracy(100);
    setTimeLeft(duration);
    setGameStarted(true);
    setGameOver(false);
    setTestActive(true);
    setCurrentWordIndex(0);
    setErrorPositions(new Set());
    correctCharsRef.current = 0;
    totalErrorsRef.current = 0;
    startTimeRef.current = Date.now();

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [duration]);

  const endTest = useCallback(() => {
    setTestActive(false);
    setGameOver(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
    const calculatedWpm = Math.round((correctCharsRef.current / 5) / Math.max(elapsedMinutes, 1/60));
    const calculatedAccuracy = Math.round(((correctCharsRef.current) / Math.max(userInput.length, 1)) * 100);
    
    setWpm(calculatedWpm);
    setAccuracy(calculatedAccuracy);
    onComplete();
  }, [onComplete, userInput.length]);

  const resetTest = useCallback(() => {
    setGameStarted(false);
    setGameOver(false);
    setTestActive(false);
    setUserInput('');
    setCurrentIndex(0);
    setWpm(0);
    setAccuracy(100);
    setTimeLeft(duration);
    setCurrentWordIndex(0);
    setErrorPositions(new Set());
    setText('');
    correctCharsRef.current = 0;
    totalErrorsRef.current = 0;
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [duration]);

  const handleInputChange = useCallback((value: string) => {
    if (!testActive) return;
    
    setUserInput(value);
    setCurrentIndex(value.length);
    
    let correct = 0;
    let errors = 0;
    const newErrorPositions = new Set<number>();
    
    for (let i = 0; i < value.length; i++) {
      if (i < text.length && value[i] === text[i]) {
        correct++;
      } else {
        errors++;
        newErrorPositions.add(i);
      }
    }
    
    correctCharsRef.current = correct;
    totalErrorsRef.current = errors;
    setErrorPositions(newErrorPositions);
    
    // Update WPM in real-time
    const elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
    if (elapsedMinutes > 0) {
      const currentWpm = Math.round((correct / 5) / elapsedMinutes);
      setWpm(currentWpm);
    }
    
    // Update accuracy
    const currentAccuracy = value.length > 0 ? Math.round((correct / value.length) * 100) : 100;
    setAccuracy(currentAccuracy);
    
    // Update word index
    const wordsTyped = value.split(' ').length - 1;
    setCurrentWordIndex(wordsTyped);
  }, [testActive, text]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!testActive) return;
    
    // Handle backspace, space, and regular characters
    if (e.key.length === 1 || e.key === 'Backspace' || e.key === ' ') {
      // Key press handled by input change
    }
  }, [testActive]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    text,
    userInput,
    currentIndex,
    wpm,
    accuracy,
    timeLeft,
    gameStarted,
    gameOver,
    testActive,
    resetTest,
    handleKeyPress,
    handleInputChange,
    startTest,
    endTest,
    currentWordIndex,
    errorPositions
  };
};
