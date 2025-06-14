import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTypingGame } from '../hooks/useTypingGame';
import { Introduction } from '../components/Introduction';
import { TestNameMenu } from '../components/TestNameMenu';
import { TypingTest } from '../components/TypingTest';
import { StatsDisplay } from '../components/StatsDisplay';
import { SideMenu } from '../components/SideMenu';
import { HistoryPage } from '../components/HistoryPage';
import { Toast } from '../components/Toast';

interface TestResult {
  date: string;
  wpm: number;
  accuracy: number;
  duration: number;
  errors: number;
}

const Index = () => {
  // State declarations
  const [username, setUsername] = useState<string>('');
  const [history, setHistory] = useState<TestResult[]>([]);

  // localStorage hooks
  const [currentUser, setCurrentUser] = useLocalStorage<string>('currentUser', '');
  const [usersList, setUsersList] = useLocalStorage<string[]>('usersList', []);
  const [theme, setTheme] = useLocalStorage<string>('theme', 'cosmic-nebula');
  const [duration, setDuration] = useLocalStorage<number>('duration', 60);
  const [showWelcome, setShowWelcome] = useLocalStorage<boolean>('showWelcome', true);
  const [fontSize, setFontSize] = useLocalStorage<number>('fontSize', 100);
  const [fontStyle, setFontStyle] = useLocalStorage<string>('fontStyle', 'inter');
  
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [deleteConfirmState, setDeleteConfirmState] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [lastErrorPosition, setLastErrorPosition] = useState(-1);

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
    lastErrorPos,
    setLastErrorPos,
    timerRef,
    generateWords,
    renderText,
    startTimer,
    resetTest,
    extendText,
    getCurrentWPM,
    getCurrentErrorRate
  } = useTypingGame();

  // Apply theme to document body immediately
  const applyTheme = useCallback((themeName: string) => {
    setTheme(themeName);
    const root = document.documentElement;
    const body = document.body;
    
    let backgroundStyle = '';
    switch (themeName) {
      case 'cosmic-nebula':
        backgroundStyle = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        break;
      case 'midnight-black':
        backgroundStyle = 'linear-gradient(135deg, #2c3e50 0%, #000000 100%)';
        break;
      case 'cotton-candy-glow':
        backgroundStyle = 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 50%, #fd79a8 100%)';
        break;
      default:
        backgroundStyle = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
    
    root.style.background = backgroundStyle;
    body.style.background = backgroundStyle;
    body.style.minHeight = '100vh';
  }, [setTheme]);

  // Apply theme on component mount and when theme changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser);
      const storedHistory = localStorage.getItem(`history_${currentUser}`);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (username) {
      localStorage.setItem('currentUser', username);
    }
  }, [username]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleCreateUser = () => {
    if (username && !usersList.includes(username)) {
      const newUsersList = [...usersList, username];
      setUsersList(newUsersList);
      setCurrentUser(username);
      setShowWelcome(false);
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    console.log('Key pressed:', e.key, 'Test active:', testActive, 'Game over:', gameOver);
    
    // Handle cheat code: Ctrl + Alt + Backspace
    if (e.ctrlKey && e.altKey && e.key === 'Backspace') {
      console.log('Cheat code activated - ending test');
      e.preventDefault();
      if (testActive && !gameOver) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setGameOver(true);
        setTestActive(false);
        handleTestEnd();
      }
      return;
    }

    if (!testActive || gameOver || !testText || pos >= testText.length) return;

    const expectedChar = testText[pos];
    const typedChar = e.key;

    console.log('Processing character:', typedChar, 'Expected:', expectedChar);

    if (typedChar === expectedChar) {
      // Correct character
      if (chars[pos]) {
        chars[pos].style.backgroundColor = 'transparent';
        chars[pos].style.color = theme === 'cotton-candy-glow' ? '#22c55e' : '#4ade80';
      }
      
      setPos(prev => prev + 1);
      setCorrectCharacters(prev => {
        const newCount = prev + 1;
        console.log('Correct characters:', newCount);
        return newCount;
      });
      setActualTypedCount(prev => {
        const newCount = prev + 1;
        console.log('Total typed count:', newCount);
        return newCount;
      });
      
      // Reset last error position since we typed correctly
      setLastErrorPosition(-1);

      // Check if we need to extend text
      if (pos >= testText.length - 50) {
        const newText = extendText();
        renderText(newText);
      }
    } else {
      // Error - only count if it's not a consecutive error at the same position
      if (lastErrorPosition !== pos) {
        setTotalErrors(prev => {
          const newCount = prev + 1;
          console.log('Total errors:', newCount);
          return newCount;
        });
        setLastErrorPosition(pos);
      }
      
      setActualTypedCount(prev => {
        const newCount = prev + 1;
        console.log('Total typed count:', newCount);
        return newCount;
      });

      // Show error mark next to character
      if (chars[pos]) {
        chars[pos].style.backgroundColor = theme === 'cotton-candy-glow' ? '#ef4444' : '#f87171';
        chars[pos].style.color = 'white';
        
        // Add error indicator to the left of the character
        const existingError = chars[pos].querySelector('.error-indicator');
        if (!existingError) {
          const errorIndicator = document.createElement('span');
          errorIndicator.className = 'error-indicator';
          errorIndicator.textContent = '×';
          errorIndicator.style.cssText = `
            position: absolute;
            left: -15px;
            top: 0;
            color: ${theme === 'cotton-candy-glow' ? '#ef4444' : '#f87171'};
            font-weight: bold;
            font-size: 1.2em;
            z-index: 10;
          `;
          chars[pos].style.position = 'relative';
          chars[pos].appendChild(errorIndicator);
        }
      }
    }

    // Update cursor position
    if (pos < chars.length - 1) {
      const nextChar = chars[pos + 1] || chars[pos];
      if (nextChar) {
        const rect = nextChar.getBoundingClientRect();
        const cursor = document.getElementById('typing-cursor');
        if (cursor) {
          cursor.style.left = `${rect.left}px`;
          cursor.style.top = `${rect.top}px`;
        }
      }
    }
  }, [testActive, gameOver, testText, pos, chars, theme, correctCharacters, totalErrors, actualTypedCount, lastErrorPosition, timerRef, extendText, renderText, setPos, setCorrectCharacters, setTotalErrors, setActualTypedCount, setLastErrorPosition, setGameOver, setTestActive]);

  const handleTestEnd = useCallback(() => {
    console.log('Test ended with stats:', {
      correctChars: correctCharacters,
      totalTyped: actualTypedCount,
      totalErrors: totalErrors,
      speed: getCurrentWPM(),
      errorRate: getCurrentErrorRate(),
      score: Math.max(0, getCurrentWPM() - totalErrors),
      elapsed: elapsed
    });

    if (currentUser && correctCharacters > 0) {
      const accuracy = actualTypedCount > 0 ? ((correctCharacters / actualTypedCount) * 100) : 0;
      const result: TestResult = {
        date: new Date().toISOString(),
        wpm: getCurrentWPM(),
        accuracy: Math.round(accuracy * 100) / 100,
        duration: elapsed,
        errors: totalErrors
      };

      const existingHistory = JSON.parse(localStorage.getItem(`history_${currentUser}`) || '[]');
      const newHistory = [result, ...existingHistory].slice(0, 50);
      localStorage.setItem(`history_${currentUser}`, JSON.stringify(newHistory));
    }
  }, [currentUser, correctCharacters, actualTypedCount, totalErrors, elapsed, getCurrentWPM, getCurrentErrorRate]);

  const startTest = useCallback(() => {
    console.log('Starting test');
    const words = generateWords(100);
    renderText(words);
    setTestActive(true);
    setGameOver(false);
    setElapsed(0);
    setPos(0);
    setCorrectCharacters(0);
    setTotalErrors(0);
    setActualTypedCount(0);
    setLastErrorPos(-1);
    setLastErrorPosition(-1);
    
    // Clear any existing error indicators
    setTimeout(() => {
      const errorIndicators = document.querySelectorAll('.error-indicator');
      errorIndicators.forEach(indicator => indicator.remove());
    }, 100);

    startTimer(duration, () => {
      setGameOver(true);
      setTestActive(false);
      handleTestEnd();
    });
  }, [duration, generateWords, renderText, setTestActive, setGameOver, setElapsed, setPos, setCorrectCharacters, setTotalErrors, setActualTypedCount, setLastErrorPos, startTimer, handleTestEnd]);

  const getButtonColor = useCallback(() => {
    switch (theme) {
      case 'cosmic-nebula': return '#667eea';
      case 'midnight-black': return '#34495e';
      case 'cotton-candy-glow': return '#fd79a8';
      default: return '#667eea';
    }
  }, [theme]);

  const switchUser = useCallback((username: string) => {
    if (username !== currentUser) {
      setCurrentUser(username);
      resetTest();
      setShowToast(true);
      setToastMessage(`Switched to ${username}`);
      setTimeout(() => setShowToast(false), 3000);
    }
  }, [currentUser, setCurrentUser, resetTest]);

  const handleDeleteUser = useCallback(() => {
    if (!deleteConfirmState) {
      setDeleteConfirmState(true);
      setTimeout(() => setDeleteConfirmState(false), 3000);
    } else {
      if (currentUser) {
        const newUsersList = usersList.filter(user => user !== currentUser);
        setUsersList(newUsersList);
        localStorage.removeItem(`history_${currentUser}`);
        
        if (newUsersList.length > 0) {
          setCurrentUser(newUsersList[0]);
        } else {
          setCurrentUser('');
        }
        
        setDeleteConfirmState(false);
        setShowToast(true);
        setToastMessage('User deleted successfully');
        setTimeout(() => setShowToast(false), 3000);
        resetTest();
      }
    }
  }, [deleteConfirmState, currentUser, usersList, setUsersList, setCurrentUser, resetTest]);

  const handleHistoryClick = useCallback(() => {
    setShowHistory(true);
    setSideMenuOpen(false);
  }, []);

  const handleContactMe = useCallback(() => {
    window.open('https://github.com/yourusername', '_blank');
  }, []);

  if (showHistory) {
    return (
      <HistoryPage
        currentUser={currentUser}
        onBack={() => setShowHistory(false)}
        theme={theme}
      />
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      position: 'relative', 
      overflow: 'hidden',
      background: 'inherit'
    }}>
      {showWelcome && !currentUser && (
        <Introduction
          onCreateUser={(username: string) => {
            if (!usersList.includes(username)) {
              const newUsersList = [...usersList, username];
              setUsersList(newUsersList);
              setCurrentUser(username);
            } else {
              setCurrentUser(username);
            }
            setShowWelcome(false);
          }}
          theme={theme}
        />
      )}

      {(!showWelcome || currentUser) && (
        <>
          <TestNameMenu
            currentUser={currentUser}
            onOpenSideMenu={() => setSideMenuOpen(true)}
            theme={theme}
          />

          <StatsDisplay
            elapsed={elapsed}
            correctSigns={correctCharacters}
            totalErrors={totalErrors}
            currentErrorRate={getCurrentErrorRate()}
            theme={theme}
          />

          <TypingTest
            testText={testText}
            pos={pos}
            chars={chars}
            theme={theme}
            onKeyDown={handleKeyDown}
            fontSize={fontSize}
            fontStyle={fontStyle}
          />

          <div style={{
            position: 'fixed',
            bottom: '50px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100
          }}>
            {!testActive && !gameOver && (
              <button
                onClick={startTest}
                style={{
                  background: getButtonColor(),
                  color: 'white',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '25px',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  transform: 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Start Test
              </button>
            )}

            {(testActive || gameOver) && (
              <button
                onClick={resetTest}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '25px',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  transform: 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Reset Test
              </button>
            )}
          </div>

          <SideMenu
            sideMenuOpen={sideMenuOpen}
            setSideMenuOpen={setSideMenuOpen}
            usersList={usersList}
            currentActiveUser={currentUser}
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
          />

          {showToast && (
            <Toast
              message={toastMessage}
              onClose={() => setShowToast(false)}
              theme={theme}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Index;
