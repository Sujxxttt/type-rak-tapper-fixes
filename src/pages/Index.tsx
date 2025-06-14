import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTypingGame } from '../hooks/useTypingGame';
import { TypingTest } from '../components/TypingTest';
import { StatsDisplay } from '../components/StatsDisplay';
import { SideMenu } from '../components/SideMenu';
import { HistoryPage } from '../components/HistoryPage';
import { Introduction } from '../components/Introduction';
import { TestNameMenu } from '../components/TestNameMenu';
import { Toast } from '../components/Toast';
import { useLocalStorage } from '../hooks/useLocalStorage';

const Index = () => {
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showIntroduction, setShowIntroduction] = useState<boolean>(true);
  const [showNameMenu, setShowNameMenu] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [users, setUsers] = useLocalStorage<string[]>('users', []);
  const [currentActiveUser, setCurrentActiveUser] = useLocalStorage<string | null>('activeUser', null);
  const [deleteConfirmState, setDeleteConfirmState] = useState<boolean>(false);
  const [duration, setDuration] = useLocalStorage<number>('duration', 60);
  const [theme, setTheme] = useLocalStorage<string>('theme', 'cosmic-nebula');
  const [fontSize, setFontSize] = useLocalStorage<number>('fontSize', 100);
  const [fontStyle, setFontStyle] = useLocalStorage<string>('fontStyle', 'inter');
  const [extraChars, setExtraChars] = useState<string[]>([]);

  const themes: { [key: string]: { background: string; color: string } } = {
    'cosmic-nebula': { background: '#0F172A', color: '#E2E8F0' },
    'midnight-black': { background: '#1E1E1E', color: '#FFFFFF' },
    'cotton-candy-glow': { background: '#FFDBE9', color: '#333333' }
  };

  const {
    gameOver,
    setGameOver,
    testActive,
    setTestActive,
    elapsed,
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
  } = useTypingGame();

  const saveResults = useCallback(() => {
    if (!currentActiveUser) return;
    const newResult = {
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      wpm: getCurrentWPM(),
      errors: totalErrors,
      accuracy: Math.max(0, 100 - getCurrentErrorRate()),
      duration: elapsed
    };

    const existingHistory = localStorage.getItem(`${currentActiveUser}-history`);
    const history = existingHistory ? JSON.parse(existingHistory) : [];
    history.push(newResult);
    localStorage.setItem(`${currentActiveUser}-history`, JSON.stringify(history));
  }, [currentActiveUser, getCurrentWPM, totalErrors, getCurrentErrorRate, elapsed]);

  const createUser = useCallback((username: string) => {
    if (users.includes(username)) {
      setToast({ message: 'Username already exists.', type: 'error' });
      return false;
    }

    const updatedUsers = [...users, username];
    setUsers(updatedUsers);
    setCurrentActiveUser(username);
    setToast({ message: `User "${username}" created and activated.`, type: 'success' });
    return true;
  }, [users, setUsers, setCurrentActiveUser, setToast]);

  const switchUser = useCallback((username: string) => {
    setCurrentActiveUser(username);
    setToast({ message: `Switched to user "${username}".`, type: 'success' });
  }, [setCurrentActiveUser, setToast]);

  const applyTheme = useCallback((selectedTheme: string) => {
    setTheme(selectedTheme);
    setToast({ message: `Theme changed to "${selectedTheme.replace('-', ' ')}".`, type: 'success' });
  }, [setTheme, setToast]);

  const handleDeleteUser = useCallback(() => {
    if (deleteConfirmState) {
      if (!currentActiveUser) return;
      const updatedUsers = users.filter(user => user !== currentActiveUser);
      setUsers(updatedUsers);
      localStorage.removeItem(`${currentActiveUser}-history`);
      setCurrentActiveUser(updatedUsers.length > 0 ? updatedUsers[0] : null);
      setToast({ message: `User "${currentActiveUser}" deleted.`, type: 'success' });
      setDeleteConfirmState(false);
    } else {
      setDeleteConfirmState(true);
    }
  }, [users, currentActiveUser, setUsers, setCurrentActiveUser, setToast, deleteConfirmState]);

  const handleHistoryClick = () => {
    setShowHistory(true);
    setSideMenuOpen(false);
  };

  const handleContactMe = () => {
    window.open('https://www.linkedin.com/in/rakshan-kumaraa-140049365/', '_blank');
    setSideMenuOpen(false);
  };

  const getButtonColor = () => {
    switch (theme) {
      case 'midnight-black':
        return 'linear-gradient(135deg, #868686 0%, #3b3b3b 100%)';
      case 'cotton-candy-glow':
        return 'linear-gradient(135deg, #ffcce7 0%, #ff99c6 100%)';
      default:
        return 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)';
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameOver || showHistory || showIntroduction || showNameMenu) return;

    if (!testActive && e.key.length === 1) {
      setTestActive(true);
      startTimer(duration, () => {
        setGameOver(true);
        setTestActive(false);
        saveResults();
      });
    }

    if (!testActive) return;

    if (e.key === 'Escape') {
      resetTest();
      return;
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      return;
    }

    if (e.key.length === 1) {
      setActualTypedCount(prev => prev + 1);
      
      if (pos >= testText.length) {
        const newText = extendText();
        renderText(newText);
        return;
      }

      const expectedChar = testText[pos];
      const typedChar = e.key;

      if (typedChar === expectedChar) {
        if (chars[pos]) {
          chars[pos].classList.add('correct');
          chars[pos].classList.remove('incorrect');
        }
        setCorrectCharacters(prev => prev + 1);
        setPos(prev => prev + 1);
      } else {
        if (lastErrorPos !== pos) {
          setTotalErrors(prev => prev + 1);
          setLastErrorPos(pos);
        }
        
        if (chars[pos]) {
          chars[pos].classList.add('incorrect');
          chars[pos].classList.remove('correct');
        }
      }
    }
  }, [gameOver, showHistory, showIntroduction, showNameMenu, testActive, duration, startTimer, pos, testText, chars, lastErrorPos, setTestActive, setActualTypedCount, setCorrectCharacters, setPos, setTotalErrors, setLastErrorPos, extendText, renderText, resetTest, saveResults]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (textFlowRef.current) {
      textFlowRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const initialText = generateWords(250);
    renderText(initialText);
  }, []);

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: themes[theme].background,
        transition: 'all 0.3s ease',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <SideMenu
        sideMenuOpen={sideMenuOpen}
        setSideMenuOpen={setSideMenuOpen}
        usersList={users}
        currentActiveUser={currentActiveUser || 'Guest'}
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

      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        color: themes[theme].color,
        borderBottom: `1px solid ${theme === 'cotton-candy-glow' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'}`,
        position: 'relative',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>TypeWave</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: themes[theme].color,
              fontSize: '1.2rem',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '50%',
              transition: 'background-color 0.3s ease'
            }}
            onClick={() => setSideMenuOpen(true)}
          >
            ☰
          </button>
        </div>
      </header>

      <main style={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: 'calc(100vh - 6rem)'
      }}>
        {showIntroduction && <Introduction onClose={() => setShowIntroduction(false)} theme={theme} />}
        {showNameMenu && <TestNameMenu onCreate={createUser} onClose={() => setShowNameMenu(false)} />}
        {showHistory && (
          <HistoryPage
            username={currentActiveUser || 'Guest'}
            onClose={() => setShowHistory(false)}
            theme={theme}
          />
        )}

        {!showIntroduction && !showHistory && !currentActiveUser && (
          <div style={{
            textAlign: 'center',
            color: themes[theme].color,
            maxWidth: '800px',
            margin: '0 auto',
            padding: '2rem',
            background: theme === 'cotton-candy-glow' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
            borderRadius: '16px',
            marginBottom: '2rem'
          }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Welcome to TypeWave!</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
              To get started, please create a user profile. This will allow you to save your typing history and track your progress over time.
            </p>
            <button
              style={{
                background: getButtonColor(),
                color: 'white',
                border: 'none',
                padding: '0.8rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                marginTop: '1.5rem',
                transition: 'background-color 0.3s ease'
              }}
              onClick={() => setShowNameMenu(true)}
            >
              Create User Profile
            </button>
          </div>
        )}

        {currentActiveUser && !showIntroduction && !showHistory && (
          <>
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
              extraChars={extraChars}
            />
          </>
        )}
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Index;
