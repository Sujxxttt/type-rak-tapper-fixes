
import React, { useState, useEffect } from 'react';
import { TypingTest } from '../components/TypingTest';
import { StatsDisplay } from '../components/StatsDisplay';
import { SideMenu } from '../components/SideMenu';
import { TestNameMenu } from '../components/TestNameMenu';
import { Introduction } from '../components/Introduction';
import { HistoryPage } from '../components/HistoryPage';
import { Toast } from '../components/Toast';
import { useTypingGame } from '../hooks/useTypingGame';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSoundEffects } from '../hooks/useSoundEffects';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<'greeting' | 'typing' | 'history'>('greeting');
  const [currentTest, setCurrentTest] = useState<string>('1 Minute');
  const [theme, setTheme] = useState<string>('cosmic-nebula');
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false);
  const [showReturnConfirm, setShowReturnConfirm] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(100);
  const [fontStyle, setFontStyle] = useState<string>('inter');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const [usersList, setUsersList] = useLocalStorage<string[]>('typingTestUsers', []);
  const [currentActiveUser, setCurrentActiveUser] = useLocalStorage<string>('activeUser', '');
  const [message, setMessage] = useState<string | null>(null);
  const [deleteConfirmState, setDeleteConfirmState] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(60);
  const [showTestNameMenu, setShowTestNameMenu] = useState<boolean>(false);
  const [newTestName, setNewTestName] = useState<string>('');
  const [showIntroduction, setShowIntroduction] = useState<boolean>(false);
  const [continueTestMode, setContinueTestMode] = useState<boolean>(false);
  const [extraChars, setExtraChars] = useState<string[]>([]);

  const messageTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Use the typing game hook and sound effects
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
    textFlowRef,
    generateWords,
    renderText,
    startTimer,
    resetTest,
    extendText,
    getCurrentWPM,
    getCurrentErrorRate
  } = useTypingGame();

  const { playKeyboardSound, playErrorSound } = useSoundEffects(soundEnabled);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const showMessage = (msg: string) => {
    setMessage(msg);
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
    messageTimeoutRef.current = setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const closeToast = () => {
    setMessage(null);
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
  };

  const applyTheme = (themeName: string) => {
    const body = document.body;
    body.className = '';
    body.classList.add(themeName);
    setTheme(themeName);
  };

  const getButtonColor = () => {
    switch (theme) {
      case 'midnight-black': return '#6c757d';
      case 'cotton-candy-glow': return '#ff1fbc';
      default: return '#21b1ff';
    }
  };

  const switchUser = (username: string) => {
    setCurrentActiveUser(username);
    showMessage(`Switched to user: ${username}`);
  };

  const handleDeleteUser = () => {
    if (!deleteConfirmState && currentActiveUser) {
      setDeleteConfirmState(true);
      setTimeout(() => {
        setDeleteConfirmState(false);
      }, 3000);
      return;
    }

    if (currentActiveUser) {
      const updatedUsers = usersList.filter(user => user !== currentActiveUser);
      setUsersList(updatedUsers);
      
      if (updatedUsers.length > 0) {
        setCurrentActiveUser(updatedUsers[0]);
        showMessage(`Deleted user and switched to: ${updatedUsers[0]}`);
      } else {
        setCurrentActiveUser('');
        showMessage('User deleted. Please create a new user.');
      }
    }
    setDeleteConfirmState(false);
  };

  const handleHistoryClick = () => {
    if (currentActiveUser) {
      setCurrentScreen('history');
      setSideMenuOpen(false);
    } else {
      showMessage('Please select or create a user first.');
    }
  };

  const handleContactMe = () => {
    window.open('mailto:contact@example.com', '_blank');
  };

  const startNewTest = (testName?: string) => {
    const nameToUse = testName || currentTest;
    setCurrentTest(nameToUse);
    
    resetTest();
    setExtraChars([]);
    setShowReturnConfirm(false);
    setContinueTestMode(false);

    // Generate text and render it immediately
    const textToUse = generateWords(100);
    console.log('Generated text for new test:', textToUse.substring(0, 50) + '...');
    
    // Use a longer timeout to ensure the component is properly mounted
    setTimeout(() => {
      console.log('Attempting to render text, ref available:', !!textFlowRef.current);
      renderText(textToUse, textFlowRef.current);
    }, 500);
  };

  const continueTest = (testName?: string) => {
    if (testName) {
      startNewTest(testName);
    } else {
      const extendedText = extendText();
      renderText(extendedText, textFlowRef.current);
    }
    setContinueTestMode(true);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!testActive) return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    const key = e.key;
    if (key === 'Escape') {
      setShowReturnConfirm(true);
      return;
    }

    if (pos >= chars.length) return;

    const currentChar = chars[pos];
    const isCorrect = key === testText[pos];

    setActualTypedCount(prev => prev + 1);

    if (isCorrect) {
      playKeyboardSound(); // Play keyboard sound for correct character
      currentChar.classList.add('correct');
      setCorrectCharacters(prev => prev + 1);
      setPos(prev => prev + 1);
      
      if (pos + 1 >= chars.length * 0.8) {
        const extendedText = extendText();
        renderText(extendedText, textFlowRef.current);
      }
    } else {
      playErrorSound(); // Play error sound for incorrect character
      if (lastErrorPos !== pos) {
        setTotalErrors(prev => prev + 1);
        setLastErrorPos(pos);
      }
      currentChar.classList.add('incorrect');
      
      if (key.length === 1) {
        const extraSpan = document.createElement('span');
        extraSpan.textContent = key;
        extraSpan.className = 'char extra';
        extraSpan.style.color = '#e74c3c';
        extraSpan.style.backgroundColor = 'rgba(231, 76, 60, 0.2)';
        currentChar.parentNode?.insertBefore(extraSpan, currentChar.nextSibling);
        setExtraChars(prev => [...prev, key]);
      }
    }
  };

  const handleTestStart = () => {
    if (!currentActiveUser) {
      showMessage('Please enter your name first.');
      return;
    }

    if (!testText) {
      showMessage('Please wait for text to load.');
      return;
    }

    setTestActive(true);
    setGameOver(false);
    
    startTimer(duration, () => {
      setTestActive(false);
      setGameOver(true);
      
      const finalWPM = getCurrentWPM();
      const accuracy = Math.round(((actualTypedCount - totalErrors) / actualTypedCount) * 100) || 0;
      
      const result = {
        wpm: finalWPM,
        accuracy: accuracy,
        duration: duration,
        date: new Date().toISOString(),
        testName: currentTest
      };
      
      const userResults = JSON.parse(localStorage.getItem(`typingResults_${currentActiveUser}`) || '[]');
      userResults.push(result);
      localStorage.setItem(`typingResults_${currentActiveUser}`, JSON.stringify(userResults));
      
      showMessage(`Test completed! WPM: ${finalWPM}, Accuracy: ${accuracy}%`);
    });
  };

  const getAllTestHistory = () => {
    const allHistory: any[] = [];
    usersList.forEach(user => {
      const userResults = JSON.parse(localStorage.getItem(`typingResults_${user}`) || '[]');
      userResults.forEach((result: any) => {
        allHistory.push({
          ...result,
          user: user,
          name: result.testName || 'Unnamed Test',
          date: result.date,
          wpm: result.wpm,
          errorRate: 100 - result.accuracy,
          score: Math.round(result.wpm * (result.accuracy / 100)),
          time: result.duration
        });
      });
    });
    return allHistory;
  };

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Inter', sans-serif"
    }}>
      <SideMenu
        sideMenuOpen={sideMenuOpen}
        setSideMenuOpen={setSideMenuOpen}
        usersList={usersList}
        currentActiveUser={currentActiveUser}
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

      {currentScreen === 'greeting' && (
        <div style={{
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '2rem'
          }}>
            TypingTest
          </h1>
          
          <div style={{
            background: theme === 'cotton-candy-glow' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '2rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            width: '100%',
            maxWidth: '400px'
          }}>
            <input
              type="text"
              placeholder="Enter your name to begin"
              value={currentActiveUser}
              onChange={(e) => {
                const newName = e.target.value;
                setCurrentActiveUser(newName);
                if (newName && !usersList.includes(newName)) {
                  setUsersList(prev => [...prev, newName]);
                }
              }}
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1.2rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: theme === 'cotton-candy-glow' ? '#333' : 'white',
                outline: 'none',
                marginBottom: '1rem'
              }}
            />
            
            <button
              onClick={() => {
                if (currentActiveUser) {
                  setCurrentScreen('typing');
                  startNewTest();
                } else {
                  showMessage('Please enter your name first.');
                }
              }}
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1.2rem',
                backgroundColor: getButtonColor(),
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Start Typing Test
            </button>
          </div>
        </div>
      )}

      {currentScreen === 'typing' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '90%',
            maxWidth: '1000px',
            marginBottom: '2rem'
          }}>
            <button
              onClick={() => setCurrentScreen('greeting')}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: theme === 'cotton-candy-glow' ? '#333' : 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              ← Back to Home
            </button>

            <button
              onClick={() => setSideMenuOpen(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: theme === 'cotton-candy-glow' ? '#333' : 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Settings ⚙️
            </button>
          </div>

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
            textFlowRef={textFlowRef}
          />

          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '2rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {!testActive && !gameOver && (
              <button
                onClick={handleTestStart}
                style={{
                  background: getButtonColor(),
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}
              >
                Start Test
              </button>
            )}

            {testActive && (
              <button
                onClick={() => setShowReturnConfirm(true)}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1.1rem'
                }}
              >
                End Test
              </button>
            )}

            {gameOver && (
              <>
                <button
                  onClick={() => {
                    resetTest();
                    setExtraChars([]);
                    setShowReturnConfirm(false);
                    const textToUse = generateWords(100);
                    setTimeout(() => {
                      renderText(textToUse, textFlowRef.current);
                    }, 500);
                  }}
                  style={{
                    background: getButtonColor(),
                    color: 'white',
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}
                >
                  Try Again
                </button>
                
                <button
                  onClick={() => setCurrentScreen('greeting')}
                  style={{
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1.1rem'
                  }}
                >
                  Back to Home
                </button>
              </>
            )}
          </div>

          {showReturnConfirm && (
            <div style={{
              position: 'fixed',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: theme === 'cotton-candy-glow' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(30, 30, 60, 0.95)',
                padding: '2rem',
                borderRadius: '12px',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: theme === 'cotton-candy-glow' ? '#333' : 'white'
              }}>
                <p style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>
                  Are you sure you want to end the test?
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button
                    onClick={() => {
                      setTestActive(false);
                      setGameOver(true);
                      setShowReturnConfirm(false);
                      if (timerRef.current) {
                        clearInterval(timerRef.current);
                      }
                    }}
                    style={{
                      background: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Yes, End Test
                  </button>
                  <button
                    onClick={() => setShowReturnConfirm(false)}
                    style={{
                      background: '#6c757d',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {currentScreen === 'history' && (
        <HistoryPage
          allTestHistory={getAllTestHistory()}
          theme={theme}
          onBack={() => setCurrentScreen('greeting')}
          getButtonColor={getButtonColor}
        />
      )}

      <TestNameMenu
        showTestNameMenu={showTestNameMenu}
        newTestName={newTestName}
        setNewTestName={setNewTestName}
        onConfirm={() => {
          if (newTestName.trim()) {
            startNewTest(newTestName.trim());
            setShowTestNameMenu(false);
            setNewTestName('');
            setCurrentScreen('typing');
          }
        }}
        onCancel={() => {
          setShowTestNameMenu(false);
          setNewTestName('');
        }}
        getButtonColor={getButtonColor}
      />

      {showIntroduction && (
        <Introduction onComplete={() => setShowIntroduction(false)} />
      )}

      <Toast message={message} onClose={closeToast} />

      <footer style={{
        marginTop: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
        gap: '2rem',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setShowIntroduction(true)}
          style={{
            background: 'none',
            border: 'none',
            color: theme === 'cotton-candy-glow' ? '#333' : 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          How to use
        </button>
        
        <button
          onClick={() => setShowTestNameMenu(true)}
          style={{
            background: 'none',
            border: 'none',
            color: theme === 'cotton-candy-glow' ? '#333' : 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Change test
        </button>
      </footer>
    </div>
  );
};

export default Index;
