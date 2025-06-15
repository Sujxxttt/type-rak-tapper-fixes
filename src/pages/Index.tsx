import React, { useState, useEffect } from 'react';
import { TypingTest } from '../components/TypingTest';
import { StatsDisplay } from '../components/StatsDisplay';
import { SideMenu } from '../components/SideMenu';
import { TestNameMenu } from '../components/TestNameMenu';
import { Introduction } from '../components/Introduction';
import { HistoryPage } from '../components/HistoryPage';
import { Toast } from '../components/Toast';
import { ResultsPage } from '../components/ResultsPage';
import { Footer } from '../components/Footer';
import { useTypingGame } from '../hooks/useTypingGame';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { Menu } from 'lucide-react';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<'greeting' | 'typing' | 'history' | 'results'>('greeting');
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

  // Test results for results page
  const [finalResults, setFinalResults] = useState({
    wpm: 0,
    accuracy: 0,
    totalErrors: 0,
    correctCharacters: 0
  });

  const messageTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Use the typing game hook and sound effects
  const {
    gameOver,
    setGameOver,
    testActive,
    setTestActive,
    elapsed,
    pos,
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

  // Initialize the test when switching to typing screen
  useEffect(() => {
    if (currentScreen === 'typing' && !testText) {
      console.log('Initializing typing test...');
      const initialText = generateWords(100);
      setTimeout(() => {
        renderText(initialText);
      }, 100);
    }
  }, [currentScreen, testText, generateWords, renderText]);

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
      case 'cosmic-nebula': return 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%)';
      case 'midnight-black': return 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)';
      case 'cotton-candy-glow': return 'linear-gradient(90deg, #f472b6 0%, #ec4899 100%)';
      default: return 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%)';
    }
  };

  const getTitleGradient = () => {
    switch (theme) {
      case 'cosmic-nebula': return 'linear-gradient(90deg, #e454f0 0%, #9d54f0 100%)';
      case 'midnight-black': return 'linear-gradient(90deg, #e559f7 0%, #9f59f7 100%)';
      case 'cotton-candy-glow': return 'linear-gradient(90deg, #ff59e8 0%, #ff52a8 100%)';
      default: return 'linear-gradient(90deg, #e454f0 0%, #9d54f0 100%)';
    }
  };

  const getTextColor = () => {
    return theme === 'cotton-candy-glow' ? '#333' : 'white';
  };

  const getGlassStyle = () => {
    let background = 'rgba(0, 0, 0, 0.1)';
    if (theme === 'cotton-candy-glow') {
      background = 'rgba(255, 255, 255, 0.2)';
    } else if (theme === 'midnight-black') {
      background = 'rgba(0, 0, 0, 0.1)';
    }

    return {
      background,
      borderRadius: '16px',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    };
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
    setShowReturnConfirm(false);
    setCurrentScreen('typing');

    const textToUse = generateWords(100);
    console.log('Generated text for new test:', textToUse.substring(0, 50) + '...');
    
    setTimeout(() => {
      console.log('Attempting to render text, ref available:', !!textFlowRef.current);
      renderText(textToUse);
    }, 100);
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
      playKeyboardSound();
      currentChar.classList.add('correct');
      setCorrectCharacters(prev => prev + 1);
      
      if (pos + 1 >= chars.length * 0.8) {
        const extendedText = extendText();
        renderText(extendedText);
      }
    } else {
      playErrorSound();
      if (lastErrorPos !== pos) {
        setTotalErrors(prev => prev + 1);
        setLastErrorPos(pos);
      }
      currentChar.classList.add('incorrect');
      
      if (key.length === 1) {
        const extraSpan = document.createElement('span');
        extraSpan.textContent = key;
        extraSpan.className = 'char extra';
        currentChar.parentNode?.insertBefore(extraSpan, currentChar.nextSibling);
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
      
      // Store final results for results page
      setFinalResults({
        wpm: finalWPM,
        accuracy: accuracy,
        totalErrors: totalErrors,
        correctCharacters: correctCharacters
      });
      
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
      
      // Switch to results screen
      setCurrentScreen('results');
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
      fontFamily: "'Inter', sans-serif",
      color: getTextColor()
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
          <button
            onClick={() => setSideMenuOpen(true)}
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              background: getButtonColor(),
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              zIndex: 999
            }}
          >
            <Menu size={20} color="white" />
          </button>

          <h1 style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            background: getTitleGradient(),
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '2rem'
          }}>
            TypingTest
          </h1>
          
          <div style={{
            ...getGlassStyle(),
            padding: '2rem',
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
              onKeyDown={(e) => {
                if (e.key === 'Enter' && currentActiveUser) {
                  setCurrentScreen('typing');
                  setTimeout(() => startNewTest(), 100);
                }
              }}
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1.2rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: getTextColor(),
                outline: 'none',
                marginBottom: '1rem'
              }}
            />
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
                ...getGlassStyle(),
                color: getTextColor(),
                border: 'none',
                padding: '0.5rem 1rem',
                cursor: 'pointer'
              }}
            >
              ← Back to Home
            </button>

            <button
              onClick={() => setSideMenuOpen(true)}
              style={{
                background: getButtonColor(),
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
              }}
            >
              <Menu size={20} color="white" />
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

          {!testActive && !gameOver && (
            <div style={{
              marginTop: '2rem',
              textAlign: 'center'
            }}>
              <p style={{
                fontSize: '1.2rem',
                marginBottom: '1rem',
                opacity: 0.8
              }}>
                Click here or start typing to begin the test
              </p>
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
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                }}
              >
                Click to Start
              </button>
            </div>
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
                fontSize: '1.1rem',
                marginTop: '2rem'
              }}
            >
              End Test
            </button>
          )}

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
                ...getGlassStyle(),
                padding: '2rem',
                textAlign: 'center',
                color: getTextColor()
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
                      setCurrentScreen('results');
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

      {currentScreen === 'results' && (
        <ResultsPage
          wpm={finalResults.wpm}
          accuracy={finalResults.accuracy}
          totalErrors={finalResults.totalErrors}
          correctCharacters={finalResults.correctCharacters}
          duration={duration}
          theme={theme}
          onTryAgain={() => {
            resetTest();
            setCurrentScreen('typing');
            setTimeout(() => {
              const textToUse = generateWords(100);
              renderText(textToUse);
            }, 100);
          }}
          onBackHome={() => setCurrentScreen('greeting')}
          getButtonColor={getButtonColor}
        />
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

      {currentScreen !== 'results' && currentScreen !== 'history' && (
        <Footer
          theme={theme}
          onShowIntroduction={() => setShowIntroduction(true)}
          onShowTestNameMenu={() => setShowTestNameMenu(true)}
          onShowHistory={handleHistoryClick}
          onContactMe={handleContactMe}
        />
      )}
    </div>
  );
};

export default Index;
