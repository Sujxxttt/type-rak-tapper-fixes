import React, { useRef, useEffect } from 'react';

interface TypingTestProps {
  testText: string;
  pos: number;
  chars: HTMLElement[];
  theme: string;
  onKeyDown: (e: KeyboardEvent) => void;
  fontSize: number;
  fontStyle: string;
}

export const TypingTest: React.FC<TypingTestProps> = ({
  testText,
  pos,
  chars,
  theme,
  onKeyDown,
  fontSize,
  fontStyle
}) => {
  const textFlowRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      onKeyDown(e);
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onKeyDown]);

  useEffect(() => {
    adjustCaretPosition();
  }, [pos, chars, fontSize]);

  const adjustCaretPosition = () => {
    if (!caretRef.current || !chars || chars.length === 0 || !textFlowRef.current || !containerRef.current) {
      return;
    }
    
    const container = containerRef.current;
    const textFlow = textFlowRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.width / 2;
    
    if (pos < testText.length && chars[pos]) {
      const currentChar = chars[pos];
      const charRect = currentChar.getBoundingClientRect();
      const textFlowRect = textFlow.getBoundingClientRect();
      
      // Calculate how much to move the text to keep current character centered
      const charOffsetFromTextStart = charRect.left - textFlowRect.left;
      const desiredTextLeft = containerCenter - charOffsetFromTextStart - (charRect.width / 2);
      const currentTextLeft = textFlowRect.left - containerRect.left;
      const translateAmount = desiredTextLeft - currentTextLeft;
      
      // Apply smooth transform with reduced frequency of updates
      const currentTransform = textFlow.style.transform;
      const currentTranslateMatch = currentTransform.match(/translateX\(([^)]+)\)/);
      const currentTranslateX = currentTranslateMatch ? parseFloat(currentTranslateMatch[1]) : 0;
      const newTranslateX = currentTranslateX + translateAmount;
      
      // Only update if the change is significant enough (reduces jitter)
      if (Math.abs(translateAmount) > 2) {
        textFlow.style.transform = `translateX(${newTranslateX}px)`;
        textFlow.style.transition = 'transform 0.15s ease-out';
      }
      
      // Position caret at center
      caretRef.current.style.left = `${containerCenter - (charRect.width / 2)}px`;
      caretRef.current.style.top = `${charRect.bottom - containerRect.top + 6}px`;
      caretRef.current.style.display = 'block';
      caretRef.current.style.width = `${Math.max(charRect.width, 2)}px`;
    } else {
      caretRef.current.style.display = 'none';
    }
  };

  const getCaretColor = () => {
    switch (theme) {
      case 'midnight-black':
        return 'linear-gradient(90deg, #e559f7 0%, #9f59f7 100%)';
      case 'cotton-candy-glow':
        return 'linear-gradient(90deg, #ff59e8 0%, #ff52a8 100%)';
      default:
        return 'linear-gradient(90deg, #e454f0 0%, #9d54f0 100%)';
    }
  };

  const getFontFamily = () => {
    switch (fontStyle) {
      case 'roboto': return "'Roboto', sans-serif";
      case 'open-sans': return "'Open Sans', sans-serif";
      case 'lato': return "'Lato', sans-serif";
      case 'source-sans': return "'Source Sans Pro', sans-serif";
      case 'inter': return "'Inter', sans-serif";
      case 'dancing-script': return "'Dancing Script', cursive";
      case 'pacifico': return "'Pacifico', cursive";
      default: return "'Inter', sans-serif";
    }
  };

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        width: '95%',
        maxWidth: '1400px',
        background: theme === 'cotton-candy-glow' 
          ? 'rgba(255, 255, 255, 0.15)' 
          : 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px)',
        borderRadius: '20px',
        overflow: 'hidden',
        marginBottom: '3rem',
        marginTop: '4rem',
        padding: '3rem',
        minHeight: '180px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}
    >
      <div style={{
        position: 'relative',
        fontSize: `${fontSize}%`,
        lineHeight: '1.6',
        letterSpacing: '0.02em',
        width: '100%',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        fontFamily: getFontFamily()
      }}>
        <div 
          ref={textFlowRef} 
          id="text-flow"
          style={{ 
            display: 'inline-block',
            color: theme === 'cotton-candy-glow' ? '#333' : '#fff',
            fontWeight: '500',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            willChange: 'transform'
          }}
        >
          {/* Text will be rendered here by useTypingGame hook */}
        </div>
      </div>
      <div 
        ref={caretRef}
        style={{
          position: 'absolute',
          height: '3px',
          background: getCaretColor(),
          zIndex: 10,
          borderRadius: '2px',
          boxShadow: '0 0 12px rgba(0,0,0,0.4)',
          display: 'none',
          animation: 'blinkCaret 1s infinite'
        }}
      />
    </div>
  );
};
