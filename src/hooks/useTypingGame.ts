
import { useState, useRef, useCallback } from 'react';

export const useTypingGame = () => {
  const [gameOver, setGameOver] = useState(false);
  const [testActive, setTestActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [pos, setPos] = useState(0);
  const [chars, setChars] = useState<HTMLElement[]>([]);
  const [testText, setTestText] = useState('');
  const [correctCharacters, setCorrectCharacters] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [actualTypedCount, setActualTypedCount] = useState(0);
  const [lastErrorPos, setLastErrorPos] = useState(-1);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const textFlowRef = useRef<HTMLDivElement>(null);

  const words = [
    "the", "of", "and", "a", "to", "in", "is", "you", "that", "it", "he", "was", "for", "on", "are", "as", "with",
    "his", "they", "I", "at", "be", "this", "have", "from", "or", "one", "had", "by", "word", "but", "not", "what",
    "all", "were", "we", "when", "your", "can", "said", "there", "each", "which", "she", "do", "how", "their", "if",
    "will", "up", "other", "about", "out", "many", "then", "them", "these", "so", "some", "her", "would", "make",
    "like", "into", "him", "has", "two", "more", "go", "no", "way", "could", "my", "than", "first", "been", "call",
    "who", "its", "now", "find", "long", "down", "day", "did", "get", "come", "made", "may", "part", "over", "new",
    "sound", "take", "only", "little", "work", "know", "place", "year", "live", "me", "back", "give", "most", "very",
    "after", "thing", "our", "just", "name", "good", "sentence", "man", "think", "say", "great", "where", "help",
    "through", "much", "before", "line", "right", "too", "mean", "old", "any", "same", "tell", "boy", "follow",
    "came", "want", "show", "also", "around", "form", "three", "small", "set", "put", "end", "why", "again", "turn",
    "here", "off", "went", "old", "number", "great", "tell", "men", "say", "small", "every", "found", "still",
    "between", "name", "should", "home", "big", "give", "air", "line", "set", "own", "under", "read", "last",
    "never", "us", "left", "end", "along", "while", "might", "next", "sound", "below", "saw", "something", "thought",
    "both", "few", "those", "always", "show", "large", "often", "together", "asked", "house", "don't", "world",
    "going", "want", "school", "important", "until", "form", "food", "keep", "children", "feet", "land", "side",
    "without", "boy", "once", "animal", "life", "enough", "took", "sometimes", "four", "head", "above", "kind",
    "began", "almost", "live", "page", "got", "earth", "need", "far", "hand", "high", "year", "mother", "light",
    "country", "father", "let", "night", "picture", "being", "study", "second", "book", "carry", "took", "science",
    "eat", "room", "friend", "began", "idea", "fish", "mountain", "north", "once", "base", "hear", "horse", "cut",
    "sure", "watch", "color", "face", "wood", "main", "enough", "plain", "girl", "usual", "young", "ready", "above",
    "ever", "red", "list", "though", "feel", "talk", "bird", "soon", "body", "dog", "family", "direct", "leave",
    "song", "measure", "door", "product", "black", "short", "numeral", "class", "wind", "question", "happen",
    "complete", "ship", "area", "half", "rock", "order", "fire", "south", "problem", "piece", "told", "knew",
    "pass", "since", "top", "whole", "king", "space", "heard", "best", "hour", "better", "during", "hundred",
    "five", "remember", "step", "early", "hold", "west", "ground", "interest", "reach", "fast", "verb", "sing",
    "listen", "six", "table", "travel", "less", "morning", "ten", "simple", "several", "vowel", "toward", "war",
    "lay", "against", "pattern", "slow", "center", "love", "person", "money", "serve", "appear", "road", "map",
    "rain", "rule", "govern", "pull", "cold", "notice", "voice", "unit", "power", "town", "fine", "certain", "fly",
    "fall", "lead", "cry", "dark", "machine", "note", "wait", "plan", "figure", "star", "box", "noun", "field",
    "rest", "correct", "able", "pound", "done", "beauty", "drive", "stood", "contain", "front", "teach", "week",
    "final", "gave", "green", "oh", "quick", "develop", "ocean", "warm", "free", "minute", "strong", "special",
    "mind", "behind", "clear", "tail", "produce", "fact", "street", "inch", "multiply", "nothing", "course", "stay",
    "wheel", "full", "force", "blue", "object", "decide", "surface", "deep", "moon", "island", "foot", "system",
    "busy", "test", "record", "boat", "common", "gold", "possible", "plane", "stead", "dry", "wonder", "laugh",
    "thousands", "ago", "ran", "check", "game", "shape", "equate", "miss", "brought", "heat", "snow", "tire",
    "bring", "yes", "distant", "fill", "east", "paint", "language", "among"
  ];

  const generateWords = useCallback((count: number) => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const selectedWords = shuffled.slice(0, count);
    const text = selectedWords.join(' ');
    setTestText(text);
    console.log('Generated text:', text.substring(0, 50) + '...');
    return text;
  }, []);

  const renderText = useCallback((text: string) => {
    console.log('renderText called with text length:', text.length);
    console.log('textFlowRef.current available:', !!textFlowRef.current);
    
    if (!textFlowRef.current) {
      console.log('Text flow element not found, retrying...');
      setTimeout(() => renderText(text), 100);
      return;
    }

    const textFlow = textFlowRef.current;
    textFlow.innerHTML = '';

    const newChars: HTMLElement[] = [];
    
    text.split('').forEach((char) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.className = 'char';
      span.style.color = 'inherit';
      span.style.backgroundColor = 'transparent';
      textFlow.appendChild(span);
      newChars.push(span);
    });

    setChars(newChars);
    console.log('Text rendered successfully, chars count:', newChars.length);

    // Focus the text flow element
    textFlow.focus();
  }, []);

  const startTimer = useCallback((duration: number, onComplete: () => void) => {
    setElapsed(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setElapsed((prev) => {
        const newElapsed = prev + 1;
        if (newElapsed >= duration) {
          clearInterval(timerRef.current!);
          onComplete();
          return duration;
        }
        return newElapsed;
      });
    }, 1000);
  }, []);

  const resetTest = useCallback(() => {
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

    // Clear all character styling
    chars.forEach(char => {
      char.classList.remove('correct', 'incorrect');
      char.style.backgroundColor = 'transparent';
    });

    // Remove extra characters
    if (textFlowRef.current) {
      const extraChars = textFlowRef.current.querySelectorAll('.extra');
      extraChars.forEach(char => char.remove());
    }
  }, [chars]);

  const extendText = useCallback(() => {
    const additionalWords = generateWords(50);
    const newText = testText + ' ' + additionalWords;
    setTestText(newText);
    return newText;
  }, [testText, generateWords]);

  const getCurrentWPM = useCallback(() => {
    if (elapsed === 0) return 0;
    const wordsTyped = correctCharacters / 5; // Standard: 5 characters = 1 word
    return Math.round((wordsTyped / elapsed) * 60);
  }, [correctCharacters, elapsed]);

  const getCurrentErrorRate = useCallback(() => {
    if (actualTypedCount === 0) return 0;
    return Math.round((totalErrors / actualTypedCount) * 100);
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
