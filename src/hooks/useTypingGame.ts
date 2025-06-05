
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
  const textFlowRef = useRef<HTMLDivElement>(null);
  const usedWordsRef = useRef<string[]>([]);
  const generatedTextRef = useRef<string>('');
  const wordListUsedRef = useRef<boolean>(false);

  const wordList = [
    "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "and", "runs",
    "through", "forest", "with", "great", "speed", "while", "being", "chased", "by",
    "hunter", "who", "wants", "catch", "for", "his", "dinner", "but", "fox", "too",
    "smart", "fast", "escape", "from", "danger", "using", "its", "natural", "instincts",
    "survival", "skills", "that", "have", "been", "developed", "over", "many", "years",
    "evolution", "making", "one", "most", "cunning", "animals", "in", "animal", "kingdom",
    "able", "outsmart", "even", "most", "experienced", "hunters", "with", "ease", "grace",
    "amazing", "wonderful", "beautiful", "fantastic", "incredible", "awesome", "brilliant",
    "excellent", "perfect", "outstanding", "remarkable", "stunning", "magnificent", "spectacular",
    "powerful", "strong", "mighty", "fierce", "brave", "bold", "confident", "determined",
    "focused", "dedicated", "passionate", "creative", "innovative", "intelligent", "wise",
    "clever", "skilled", "talented", "gifted", "capable", "efficient", "effective", "successful"
  ];

  const generateWords = (count: number): string => {
    let generatedText = "";
    let availableWords = [...wordList];
    
    if (wordListUsedRef.current) {
      availableWords = [...wordList];
      usedWordsRef.current = [];
      wordListUsedRef.current = false;
    }
    
    for (let i = 0; i < count; i++) {
      if (availableWords.length === 0) {
        wordListUsedRef.current = true;
        availableWords = [...wordList];
        usedWordsRef.current = [];
      }
      
      const randomIndex = Math.floor(Math.random() * availableWords.length);
      const selectedWord = availableWords[randomIndex];
      availableWords.splice(randomIndex, 1);
      usedWordsRef.current.push(selectedWord);
      
      generatedText += selectedWord;
      if (i < count - 1) {
        generatedText += " ";
      }
    }
    
    generatedTextRef.current = generatedText;
    return generatedText;
  };

  const extendText = () => {
    const additionalWords = generateWords(50);
    generatedTextRef.current += " " + additionalWords;
    return generatedTextRef.current;
  };

  const renderText = (text: string) => {
    const textFlowElement = document.getElementById('text-flow');
    if (!textFlowElement) {
      console.log('Text flow element not found');
      return;
    }
    
    setTestText(text);
    textFlowElement.innerHTML = "";
    const newChars: HTMLElement[] = [];
    const frag = document.createDocumentFragment();
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = char === " " ? "\u00A0" : char;
      frag.appendChild(span);
      newChars.push(span);
    }
    
    textFlowElement.appendChild(frag);
    setChars(newChars);
    console.log('Text rendered. Length:', text.length, 'First few chars:', text.substring(0, 20));
  };

  const startTimer = useCallback((duration: number, onComplete: () => void) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setElapsed(prev => {
        const newElapsed = prev + 1;
        if (newElapsed >= duration) {
          clearInterval(timerRef.current!);
          onComplete();
        }
        return newElapsed;
      });
    }, 1000);
  }, []);

  const resetTest = () => {
    console.log('Resetting test');
    setGameOver(false);
    setTestActive(false);
    setElapsed(0);
    setPos(0);
    setTotalErrors(0);
    setCorrectCharacters(0);
    setActualTypedCount(0);
    setLastErrorPos(-1);
    usedWordsRef.current = [];
    generatedTextRef.current = '';
    wordListUsedRef.current = false;
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Clear all character styling
    const allChars = document.querySelectorAll('.char');
    allChars.forEach(char => {
      char.classList.remove('correct', 'incorrect', 'extra');
    });
    
    // Clear extra characters
    const extraCharsContainer = document.getElementById('extra-chars');
    if (extraCharsContainer) {
      extraCharsContainer.innerHTML = '';
    }
  };

  const getCurrentWPM = () => {
    if (elapsed === 0) return 0;
    const minutes = elapsed / 60;
    return Math.round((correctCharacters / 5) / minutes);
  };

  const getCurrentErrorRate = () => {
    if (actualTypedCount === 0) return 0;
    return Math.round((totalErrors / actualTypedCount) * 100 * 100) / 100;
  };

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
    textFlowRef,
    generateWords,
    renderText,
    startTimer,
    resetTest,
    extendText,
    getCurrentWPM,
    getCurrentErrorRate
  };
};
