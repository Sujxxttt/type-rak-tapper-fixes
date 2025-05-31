import React, { useRef, useEffect } from 'react';

interface TypingTestProps {
  testText: string;
  pos: number;
  chars: HTMLElement[];
  theme: string;
  onKeyDown: (e: KeyboardEvent) => void;
}

export const TypingTest: React.FC<TypingTestProps> = ({
  testText,
  pos,
  chars,
  theme,
  onKeyDown
}) => {
  const textFlowRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  useEffect(() => {
    adjustCaretPosition();
  }, [pos, chars]);

  const adjustCaretPosition = () => {
    if (!caretRef.current || !chars || chars.length === 0 || !textFlowRef.current) return;
    
    const containerRect = textFlowRef.current.getBoundingClientRect();
    const containerCenter = containerRect.width / 2;
    
    if (pos < chars.length) {
      const currentChar = chars[pos];
      const charRect = currentChar.getBoundingClientRect();
      
      // Calculate offset to keep caret in center
      const charCenter = charRect.left + charRect.width / 2 - containerRect.left;
      const offset = containerCenter - charCenter;
      
      // Apply offset to all characters
      textFlowRef.current.style.transform = `translateX(${offset}px)`;
      
      // Position caret in center
      caretRef.current.style.left = `${containerCenter - 1}px`;
      caretRef.current.style.top = `${charRect.top - containerRect.top}px`;
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '95%',
      maxWidth: '1400px',
      background: theme === 'cotton-candy-glow' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
      borderRadius: '12px',
      overflow: 'hidden',
      marginBottom: '4rem',
      marginTop: '4rem',
      padding: '3rem',
      minHeight: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        position: 'relative',
        fontSize: '1.82em',
        lineHeight: '1.8',
        letterSpacing: '0.03em',
        width: '100%',
        textAlign: 'center'
      }}>
        <div ref={textFlowRef} style={{ 
          display: 'inline-block',
          transition: 'transform 0.1s ease'
        }}></div>
      </div>
      <div 
        ref={caretRef}
        style={{
          position: 'absolute',
          height: '1.6em',
          width: '2px',
          background: theme === 'midnight-black' ? 'linear-gradient(90deg, #c559f7 0%, #7f59f7 100%)' : 
                     theme === 'cotton-candy-glow' ? 'linear-gradient(90deg, #ff59e8 0%, #ff52a8 100%)' :
                     'linear-gradient(90deg, #c454f0 0%, #7d54f0 100%)',
          animation: 'blinkCaret 0.8s infinite step-end',
          fontWeight: 'bold'
        }}
      >_</div>
    </div>
  );
};
