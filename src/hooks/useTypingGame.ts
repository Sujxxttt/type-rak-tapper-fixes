
import { useState, useRef, useCallback } from 'react';

export const useTypingGame = () => {
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [testActive, setTestActive] = useState<boolean>(false);
  const [elapsed, setElapsed] = useState<number>(0);
  const [pos, setPos] = useState<number>(0);
  const [chars, setChars] = useState<HTMLElement[]>([]);
  const [typedCharacters, setTypedCharacters] = useState<string[]>([]);
  const [totalErrors, setTotalErrors] = useState<number>(0);
  const [testText, setTestText] = useState<string>('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const textFlowRef = useRef<HTMLDivElement>(null);
  const usedWordsRef = useRef<string[]>([]);

  const wordList = [
    "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "and", "runs",
    "through", "forest", "with", "great", "speed", "while", "being", "chased", "by",
    "hunter", "who", "wants", "catch", "for", "his", "dinner", "but", "fox", "too",
    "smart", "fast", "escape", "from", "danger", "using", "its", "natural", "instincts",
    "survival", "skills", "that", "have", "been", "developed", "over", "many", "years",
    "evolution", "making", "one", "most", "cunning", "animals", "in", "animal", "kingdom",
    "able", "outsmart", "even", "most", "experienced", "hunters", "with", "ease", "grace"
  ];

  const generateWords = (count: number): string => {
    let generatedText = "";
    const availableWords = [...wordList];
    
    for (let i = 0; i < count; i++) {
      if (availableWords.length === 0) {
        // Reset when all words are used
        availableWords.push(...wordList);
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
    return generatedText;
  };

  const renderText = (text: string) => {
    // Find the text flow element by ID instead of using ref
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
    console.log('Text rendered:', text.substring(0, 50) + '...');
  };

  const startTimer = useCallback((duration: number, onComplete: () => void) => {
    timerRef.current = setInterval(() => {
      setElapsed(prev => {
        const newElapsed = prev + 1;
        if (newElapsed >= duration) {
          onComplete();
        }
        return newElapsed;
      });
    }, 1000);
  }, []);

  const resetTest = () => {
    setGameOver(false);
    setTestActive(false);
    setElapsed(0);
    setPos(0);
    setTotalErrors(0);
    setTypedCharacters([]);
    usedWordsRef.current = [];
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
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
    setChars,
    typedCharacters,
    setTypedCharacters,
    totalErrors,
    setTotalErrors,
    testText,
    setTestText,
    timerRef,
    textFlowRef,
    generateWords,
    renderText,
    startTimer,
    resetTest
  };
};
