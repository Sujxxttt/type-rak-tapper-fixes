import React, { useState, useEffect, useRef } from 'react';

interface TypingTestProps {
  theme: string;
  customDuration: number;
  fontSize: number;
  fontStyle: string;
  onTestComplete: (wpm: number, errorRate: number, duration: number, errors: number) => void;
  playSound: (type: 'keyboard' | 'error' | 'complete') => void;
  getButtonColor: () => string;
}

export const TypingTest: React.FC<TypingTestProps> = ({
  theme,
  customDuration,
  fontSize,
  fontStyle,
  onTestComplete,
  playSound,
  getButtonColor
}) => {
  const [testText, setTestText] = useState('');
  const [pos, setPos] = useState(0);
  const [chars, setChars] = useState<HTMLElement[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(customDuration);
  const [errors, setErrors] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const textFlowRef = useRef<HTMLDivElement>(null);

  // Generate random text
  useEffect(() => {
    const words = [
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
    ];
    
    const generateText = () => {
      const textLength = Math.max(200, customDuration * 5); // Ensure enough text
      let text = '';
      for (let i = 0; i < textLength; i++) {
        text += words[Math.floor(Math.random() * words.length)] + ' ';
      }
      return text.trim();
    };

    setTestText(generateText());
    setPos(0);
    setIsStarted(false);
    setTimeLeft(customDuration);
    setErrors(0);
    setCorrectChars(0);
  }, [customDuration]);

  // Create character spans
  useEffect(() => {
    if (textFlowRef.current && testText) {
      textFlowRef.current.innerHTML = '';
      const charElements: HTMLElement[] = [];
      
      for (let i = 0; i < testText.length; i++) {
        const span = document.createElement('span');
        span.textContent = testText[i];
        span.style.position = 'relative';
        textFlowRef.current.appendChild(span);
        charElements.push(span);
      }
      
      setChars(charElements);
    }
  }, [testText]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isStarted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Test completed
            const wpm = Math.round((correctChars / 5) / ((customDuration - 0) / 60));
            const errorRate = correctChars > 0 ? (errors / (correctChars + errors)) * 100 : 0;
            onTestComplete(wpm, errorRate, customDuration, errors);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isStarted, timeLeft, correctChars, errors, customDuration, onTestComplete]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (timeLeft <= 0 || pos >= testText.length) return;

      if (!isStarted) {
        setIsStarted(true);
      }

      if (e.key === testText[pos]) {
        // Correct character
        chars[pos]?.classList.add('correct');
        chars[pos]?.classList.remove('error');
        setCorrectChars(prev => prev + 1);
        setPos(prev => prev + 1);
        playSound('keyboard');
      } else if (e.key.length === 1) {
        // Incorrect character (only count printable characters)
        chars[pos]?.classList.add('error');
        chars[pos]?.classList.remove('correct');
        setErrors(prev => prev + 1);
        setPos(prev => prev + 1);
        playSound('error');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [pos, testText, chars, isStarted, timeLeft, playSound]);

  // Scroll to current position
  useEffect(() => {
    if (chars.length > 0 && pos < chars.length && textFlowRef.current) {
      const currentChar = chars[pos];
      const container = textFlowRef.current;
      
      if (currentChar) {
        const charLeft = currentChar.offsetLeft;
        const containerWidth = container.clientWidth;
        const scrollLeft = Math.max(0, charLeft - containerWidth / 2);
        
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [pos, chars]);

  // Add cursor to current character
  useEffect(() => {
    // Remove cursor from all characters
    chars.forEach(char => char.classList.remove('cursor'));
    
    // Add cursor to current character
    if (chars[pos]) {
      chars[pos].classList.add('cursor');
    }
  }, [pos, chars]);

  const getFontFamily = () => {
    switch (fontStyle) {
      case 'roboto': return "'Roboto', sans-serif";
      case 'open-sans': return "'Open Sans', sans-serif";
      case 'lato': return "'Lato', sans-serif";
      case 'source-sans-pro': return "'Source Sans Pro', sans-serif";
      case 'inter': return "'Inter', sans-serif";
      case 'dancing-script': return "'Dancing Script', cursive";
      case 'pacifico': return "'Pacifico', cursive";
      default: return "'Inter', sans-serif";
    }
  };

  const resetTest = () => {
    setPos(0);
    setIsStarted(false);
    setTimeLeft(customDuration);
    setErrors(0);
    setCorrectChars(0);
    chars.forEach(char => {
      char.classList.remove('correct', 'error', 'cursor');
    });
    if (chars[0]) {
      chars[0].classList.add('cursor');
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '1040px',
      margin: '3rem auto 2rem auto',
      padding: '1.5rem',
      background: theme === 'cotton-candy-glow' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      position: 'relative',
      fontSize: `${fontSize}%`,
      fontFamily: getFontFamily(),
      lineHeight: '1.4',
      letterSpacing: '0.02em',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        color: 'white'
      }}>
        <div>Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
        <button
          onClick={resetTest}
          style={{
            background: getButtonColor(),
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Reset
        </button>
      </div>
      
      <div
        ref={textFlowRef}
        style={{
          color: 'white',
          outline: 'none',
          fontSize: 'inherit',
          fontFamily: 'inherit',
          lineHeight: 'inherit',
          letterSpacing: 'inherit',
          userSelect: 'none',
          cursor: 'text',
          height: '120px',
          overflowX: 'auto',
          overflowY: 'hidden',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollBehavior: 'smooth',
        }}
        tabIndex={0}
      />
      
      <style>{`
        .correct { color: #4ade80 !important; }
        .error { color: #ef4444 !important; background-color: rgba(239, 68, 68, 0.2) !important; }
        .cursor::after {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background-color: #60a5fa;
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};
