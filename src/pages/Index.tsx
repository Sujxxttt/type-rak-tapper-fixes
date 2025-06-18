import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GetServerSideProps } from 'next';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Settings } from 'lucide-react';
import { SideMenu } from '@/components/SideMenu';
import { Introduction } from '@/components/Introduction';
import { StatsDisplay } from '@/components/StatsDisplay';
import { useTypingGame } from '@/hooks/useTypingGame';
import { TypedTextPreview } from '@/components/TypedTextPreview';
import { EasterEggPage } from '@/components/EasterEggPage';
import { TestNameMenu } from '@/components/TestNameMenu';

interface TestHistory {
  date: string;
  wpm: number;
  errors: number;
  accuracy: number;
}

export default function Index() {
  const { data: session } = useSession();
  const router = useRouter();

  const [showIntroduction, setShowIntroduction] = useState(true);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [historyPageOpen, setHistoryPageOpen] = useState(false);
  const [contactMe, setContactMe] = useState(false);
  const [usersList, setUsersList] = useState<string[]>([]);
  const [currentActiveUser, setCurrentActiveUser] = useState<string | null>(null);
  const [deleteConfirmState, setDeleteConfirmState] = useState(false);
  const [duration, setDuration] = useState<number>(60);
  const [theme, setTheme] = useState<string>('cosmic-nebula');
  const [fontSize, setFontSize] = useState<number>(100);
  const [fontStyle, setFontStyle] = useState<string>('inter');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const [scrollCount, setScrollCount] = useState(0);
  const [showScrollMessage, setShowScrollMessage] = useState('');
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const lastScrollTime = useRef(0);

  const scrollMessages = [
    'Trying something , huh',
    'well its working maybe you should try again',
    'Again please !!!'
  ];

  const textFlowRef = useRef<HTMLDivElement>(null);

  const {
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
    wasLastError,
    setWasLastError,
    cheatTimeAdded,
    timerRef,
    generateWords,
    renderText,
    startTimer,
    resetTest,
    extendText,
    getCurrentWPM,
    getCurrentErrorRate,
    addCheatTime
  } = useTypingGame();

  const getThemeBackground = () => {
    switch (theme) {
      case 'cosmic-nebula':
        return 'linear-gradient(135deg, #9509db 35%, #1c7ed4 100%)';
      case 'midnight-black':
        return '#000000';
      case 'cotton-candy-glow':
        return 'linear-gradient(45deg, #74d2f1, #69c8e8)';
      default:
        return 'linear-gradient(135deg, #9509db 35%, #1c7ed4 100%)';
    }
  };

  const getFontFamilyString = (font: string) => {
    switch (font) {
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

  const getButtonColor = () => {
    switch (theme) {
      case 'cosmic-nebula':
        return '#3c95fa';
      case 'midnight-black':
        return '#c559f7';
      case 'cotton-candy-glow':
        return '#ff52a8';
      default:
        return '#3c95fa';
    }
  };

  const applyTheme = (selectedTheme: string) => {
    setTheme(selectedTheme);
    localStorage.setItem("typeRakTheme", selectedTheme);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("typeRakTheme") || 'cosmic-nebula';
    setTheme(storedTheme);
  }, []);

  const startTest = () => {
    if (!testActive) {
      resetTest();
      const initialText = generateWords(50);
      renderText(initialText);
      setTestActive(true);
      setGameOver(false);
      setPos(0);
      setCorrectCharacters(0);
      setTotalErrors(0);
      setActualTypedCount(0);
      setWasLastError(false);
      startTimer(duration + cheatTimeAdded);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (gameOver || !testActive) return;

    // Cheat code: Ctrl + Alt + Backspace
    if (event.ctrlKey && event.altKey && event.key === 'Backspace') {
      event.preventDefault();
      setElapsed(prev => prev + 30);
      return;
    }

    if (event.key === 'Shift' || event.key === 'CapsLock' || event.key === 'Tab') {
      return;
    }

    if (pos < chars.length) {
      setActualTypedCount(prev => prev + 1);
      const char = chars[pos];

      if (event.key === char.textContent) {
        char.classList.add('correct');
        setCorrectCharacters(prev => prev + 1);
        setWasLastError(false);
      } else {
        char.classList.add('incorrect');
        setTotalErrors(prev => prev + 1);
        setWasLastError(true);
      }

      setPos(prev => prev + 1);

      if (pos === chars.length - 10 && chars.length < 800) {
        const extendedText = extendText();
        renderText(extendedText);
      }

      if (pos >= chars.length - 1) {
        setTestActive(false);
        setGameOver(true);
        clearInterval(timerRef.current as NodeJS.Timeout);
        timerRef.current = null;
      }
    } else {
      if (event.key === 'Backspace') {
        return;
      }
      setActualTypedCount(prev => prev + 1);
      setTotalErrors(prev => prev + 1);
      setWasLastError(true);
      const span = document.createElement("span");
      span.className = "char extra incorrect";
      span.textContent = event.key === " " ? "\u00A0" : event.key;
      textFlowRef?.current?.appendChild(span);
      setChars(prev => [...prev, span]);
      setPos(prev => prev + 1);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (testActive || showEasterEgg) return;
      
      const now = Date.now();
      if (now - lastScrollTime.current < 1000) return; // Throttle scrolling
      
      lastScrollTime.current = now;
      
      if (scrollCount < 3) {
        setShowScrollMessage(scrollMessages[scrollCount]);
        setScrollCount(prev => prev + 1);
        
        setTimeout(() => {
          setShowScrollMessage('');
        }, 2000);
      } else if (scrollCount === 3) {
        setShowEasterEgg(true);
        setScrollCount(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [gameOver, testActive, pos, chars, elapsed, showEasterEgg, scrollCount]);

  useEffect(() => {
    if (elapsed >= duration + cheatTimeAdded && testActive) {
      setTestActive(false);
      setGameOver(true);
      clearInterval(timerRef.current as NodeJS.Timeout);
      timerRef.current = null;
    }
  }, [elapsed, duration, testActive, cheatTimeAdded]);

  useEffect(() => {
    if (!session) return;

    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUsersList(data.users);
      } catch (error) {
        console.error("Could not fetch users:", error);
        toast.error('Failed to load users. Please try again.');
      }
    };

    fetchUsers();
  }, [session]);

  const switchUser = (username: string) => {
    setCurrentActiveUser(username);
  };

  const handleCreateUser = async (username: string) => {
    if (!session) return;

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsersList(data.users);
      setCurrentActiveUser(username);
      toast.success('User created successfully!');
    } catch (error) {
      console.error("Could not create user:", error);
      toast.error('Failed to create user. Please try again.');
    }
  };

  const handleDeleteUser = async () => {
    if (!currentActiveUser) return;

    if (!deleteConfirmState) {
      setDeleteConfirmState(true);
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: currentActiveUser }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsersList(data.users);
      setCurrentActiveUser(null);
      setDeleteConfirmState(false);
      toast.success('User deleted successfully!');
    } catch (error) {
      console.error("Could not delete user:", error);
      toast.error('Failed to delete user. Please try again.');
    }
  };

  const handleHistoryClick = () => {
    setSideMenuOpen(false);
    setHistoryPageOpen(true);
  };

  const handleContactMe = () => {
    setSideMenuOpen(false);
    setContactMe(true);
  };

  if (showEasterEgg) {
    return (
      <EasterEggPage 
        theme={theme} 
        onGoBack={() => setShowEasterEgg(false)} 
      />
    );
  }

  if (showIntroduction) {
    return <Introduction onComplete={() => setShowIntroduction(false)} />;
  }

  if (historyPageOpen) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: getThemeBackground(),
        color: theme === 'cotton-candy-glow' ? '#333' : 'white',
        padding: '20px',
        zIndex: 10000,
        overflowY: 'auto'
      }}>
        <h2>Test History</h2>
        <button onClick={() => setHistoryPageOpen(false)} style={{ marginTop: '10px', padding: '8px 12px', borderRadius: '4px', border: 'none', background: getButtonColor(), color: 'white', cursor: 'pointer' }}>Back to Game</button>
        <p>This feature is under development. Please check back later!</p>
      </div>
    );
  }

  if (contactMe) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: getThemeBackground(),
        color: theme === 'cotton-candy-glow' ? '#333' : 'white',
        padding: '20px',
        zIndex: 10000,
        overflowY: 'auto'
      }}>
        <h2>Contact Me</h2>
        <button onClick={() => setContactMe(false)} style={{ marginTop: '10px', padding: '8px 12px', borderRadius: '4px', border: 'none', background: getButtonColor(), color: 'white', cursor: 'pointer' }}>Back to Game</button>
        <p>This feature is under development. Please check back later!</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: getThemeBackground(),
      transition: 'background 0.5s ease',
      fontFamily: getFontFamilyString(fontStyle),
      position: 'relative'
    }}>
      <SideMenu
        sideMenuOpen={sideMenuOpen}
        setSideMenuOpen={setSideMenuOpen}
        usersList={usersList}
        currentActiveUser={currentActiveUser || ''}
        switchUser={switchUser}
        handleDeleteUser={handleDeleteUser}
        deleteConfirmState={deleteConfirmState}
        duration={duration}
        setDuration={setDuration}
        theme={theme}
        applyTheme={applyTheme}
        handleHistoryClick={handleHistoryClick}
        handleContactMe={handleContactMe}
        getButtonColor={getButtonColor}
        fontSize={fontSize}
        setFontSize={setFontSize}
        fontStyle={fontStyle}
        setFontStyle={setFontStyle}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {showScrollMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          padding: '10px 20px',
          color: 'white',
          fontSize: '0.9rem',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          {showScrollMessage}
        </div>
      )}

      {/* Title */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '1rem 2rem',
        position: 'relative'
      }}>
        <Introduction onComplete={() => setShowIntroduction(false)} />
        
        <button
          onClick={() => setSideMenuOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '50%',
            transition: 'background-color 0.3s ease',
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 1000
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Settings size={24} />
        </button>
      </div>

      {/* Main content with updated positioning */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '2rem',
        paddingTop: '4rem', // Moved content down by 2cm
        minHeight: 'calc(100vh - 4rem)' 
      }}>
        <TestNameMenu 
          usersList={usersList}
          currentActiveUser={currentActiveUser || ''}
          switchUser={switchUser}
          handleCreateUser={handleCreateUser}
        />

        {/* Text flow container with smooth animations */}
        <div style={{ 
          width: '90%', 
          maxWidth: '1000px', 
          margin: '2rem auto',
          position: 'relative'
        }}>
          <div
            id="text-flow"
            ref={textFlowRef}
            style={{
              fontSize: `${fontSize}%`,
              lineHeight: '2.2',
              padding: '2rem',
              background: theme === 'cotton-candy-glow' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              borderRadius: '12px',
              color: theme === 'cotton-candy-glow' ? '#333' : 'white',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              minHeight: '200px',
              fontFamily: getFontFamilyString(fontStyle),
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)', // Extra smooth transitions
              wordSpacing: '0.1em',
              letterSpacing: '0.02em'
            }}
          />
        </div>

        {/* Stats Display */}
        {testActive && (
          <StatsDisplay 
            elapsed={elapsed}
            correctSigns={correctCharacters}
            totalErrors={totalErrors}
            currentErrorRate={getCurrentErrorRate()}
            theme={theme}
          />
        )}

        {/* Start/Restart button */}
        <div style={{ margin: '2rem 0', textAlign: 'center' }}>
          <button
            onClick={gameOver ? resetTest : startTest}
            style={{
              padding: '12px 24px',
              fontSize: '0.9rem', // 10% smaller
              fontWeight: 'bold',
              color: 'white',
              background: getButtonColor(),
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
          >
            {gameOver ? 'Restart Test' : (testActive ? 'Test in Progress...' : 'Press any key to start the test')}
          </button>
        </div>

        {gameOver && (
          <TypedTextPreview
            typedText={testText.substring(0, pos)}
            originalText={testText}
            theme={theme}
            onClose={resetTest}
          />
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
