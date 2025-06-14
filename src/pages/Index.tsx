import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import { TypingTest } from '../components/TypingTest';
import { StatsDisplay } from '../components/StatsDisplay';
import { TestNameMenu } from '../components/TestNameMenu';
import { SideMenu } from '../components/SideMenu';
import { Toast } from '../components/Toast';
import { HistoryPage } from '../components/HistoryPage';
import { Introduction } from '../components/Introduction';
import { useTypingGame } from '../hooks/useTypingGame';
import { useLocalStorage } from '../hooks/useLocalStorage';

const Index: React.FC = () => {
  // Introduction state - show on every reload
  const [showIntroduction, setShowIntroduction] = useState(true);
  
  // Global state variables
  const [usersList, setUsersList] = useLocalStorage<string[]>("typeRakUsersList", []);
  const [currentActiveUser, setCurrentActiveUser] = useLocalStorage<string>("typeRakActiveUser", '');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [allTestHistory, setAllTestHistory] = useState<any[]>([]);
  const [currentTestName, setCurrentTestName] = useState<string>('');
  const [deleteConfirmState, setDeleteConfirmState] = useState<boolean>(false);
  const [duration, setDuration] = useLocalStorage<number>("typeRakDuration", 60);
  const [fontSize, setFontSize] = useLocalStorage<number>("typeRakFontSize", 120);
  const [fontStyle, setFontStyle] = useLocalStorage<string>("typeRakFontStyle", 'inter');
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false);
  const [currentScreen, setCurrentScreen] = useState<string>('greeting');
  const [theme, setTheme] = useLocalStorage<string>("typeRakTheme", 'cosmic-nebula');
  const [message, setMessage] = useState<string>('');
  const [showTestNameMenu, setShowTestNameMenu] = useState<boolean>(false);
  const [newTestName, setNewTestName] = useState<string>('');
  const [showReturnConfirm, setShowReturnConfirm] = useState<boolean>(false);
  const [highlightFooter, setHighlightFooter] = useState<boolean>(false);
  const [lastTestResult, setLastTestResult] = useState<any>(null);
  const [continueTestMode, setContinueTestMode] = useState<boolean>(false);
  const [extraChars, setExtraChars] = useState<string[]>([]);

  // ADD THIS STATE TO BUFFER THE GENERATED TEXT
  const [pendingTextToRender, setPendingTextToRender] = useState<string | null>(null);

  const messageTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Use the typing game hook
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

  // Show introduction on first load
  useEffect(() => {
    setShowIntroduction(false);
  }, []);

  const handleIntroComplete = () => {
    setShowIntroduction(false);
  };

  useEffect(() => {
    if (showIntroduction) return;
    
    if (usersList.length > 0) {
      if (currentActiveUser && usersList.includes(currentActiveUser)) {
        setCurrentScreen('dashboard');
        loadUserTests(currentActiveUser);
      } else {
        setCurrentActiveUser(usersList[0]);
        setCurrentScreen('dashboard');
        loadUserTests(usersList[0]);
      }
    }
  }, [usersList, currentActiveUser, showIntroduction]);

  const loadUserTests = (username: string) => {
    const storedTests = localStorage.getItem(`typeRakTests-${username}`);
    const storedHistory = localStorage.getItem(`typeRakHistory-${username}`);
    if (storedTests) {
      setTestResults(JSON.parse(storedTests));
    } else {
      setTestResults([]);
    }
    if (storedHistory) {
      setAllTestHistory(JSON.parse(storedHistory));
    } else {
      setAllTestHistory([]);
    }
  };

  useEffect(() => {
    document.body.className = '';
    if (theme === 'midnight-black') {
      document.body.classList.add('midnight-black');
    } else if (theme === 'cotton-candy-glow') {
      document.body.classList.add('cotton-candy-glow');
    }
  }, [theme]);

  useEffect(() => {
    const handleCheatCode = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === 'Backspace' && testActive) {
        e.preventDefault();
        setElapsed(prev => {
          const newElapsed = prev + 30;
          if (newElapsed >= duration) {
            setTimeout(endTest, 100);
          }
          return newElapsed;
        });
        showToast("Cheat activated: +30 seconds!");
      }
    };

    document.addEventListener('keydown', handleCheatCode);
    return () => document.removeEventListener('keydown', handleCheatCode);
  }, [testActive, duration]);

  const endTest = () => {
    if (gameOver) return;
    setGameOver(true);
    setTestActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    const correctChars = correctCharacters;
    const totalTyped = actualTypedCount;
    const mins = Math.max(elapsed / 60, 1 / 60);
    const speed = Math.round(Math.max(0, (correctChars / 5) / mins));
    const errorRate = totalTyped > 0 ? ((totalErrors / totalTyped) * 100) : 0;
    const score = Math.round(speed * ((100 - errorRate) / 100) * 10);
    
    console.log('Test ended with stats:', {
      correctChars,
      totalTyped,
      totalErrors,
      speed,
      errorRate,
      score,
      elapsed
    });
    
    const testResult = {
      name: currentTestName,
      date: new Date().toISOString(),
      wpm: speed,
      errorRate: parseFloat(errorRate.toFixed(2)),
      errors: totalErrors,
      time: elapsed,
      characters: totalTyped,
      correctChars: correctChars,
      score: score
    };
    
    setLastTestResult(testResult);
    
    const newHistory = [...allTestHistory, testResult];
    setAllTestHistory(newHistory);
    localStorage.setItem(`typeRakHistory-${currentActiveUser}`, JSON.stringify(newHistory));
    
    const existingTestIndex = testResults.findIndex(test => test.name === currentTestName);
    let newResults;
    
    if (existingTestIndex >= 0) {
      const testHistory = newHistory.filter(t => t.name === currentTestName);
      const avgWpm = Math.round(testHistory.reduce((sum, t) => sum + t.wpm, 0) / testHistory.length);
      const avgErrorRate = (testHistory.reduce((sum, t) => sum + t.errorRate, 0) / testHistory.length);
      const avgScore = Math.round(testHistory.reduce((sum, t) => sum + t.score, 0) / testHistory.length);
      const totalTime = testHistory.reduce((sum, t) => sum + t.time, 0);
      
      newResults = [...testResults];
      newResults[existingTestIndex] = {
        ...testResults[existingTestIndex],
        wpm: avgWpm,
        errorRate: parseFloat(avgErrorRate.toFixed(2)),
        score: avgScore,
        testCount: testHistory.length,
        lastDate: testResult.date,
        totalTime: totalTime
      };
    } else {
      newResults = [...testResults, {
        ...testResult,
        testCount: 1,
        lastDate: testResult.date,
        totalTime: testResult.time
      }];
    }
    
    setTestResults(newResults);
    localStorage.setItem(`typeRakTests-${currentActiveUser}`, JSON.stringify(newResults));
    
    setCurrentScreen('results');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    console.log('Key pressed:', e.key, 'Test active:', testActive, 'Game over:', gameOver);
    
    if (gameOver) return;

    // Disable backspace completely during active tests
    if (e.key === "Backspace") {
      e.preventDefault();
      return;
    }
    
    e.preventDefault();
    
    if (!testActive && e.key.length === 1 && pos < chars.length) {
      console.log('Starting test with first keypress');
      startTimer(duration, endTest);
      setTestActive(true);
    }
    
    if (!testActive) return;
    
    // Check if we need to extend text
    if (pos >= testText.length - 100) {
      const newText = extendText();
      renderText(newText);
    }
    
    const expectedChar = testText[pos];
    const typedChar = e.key;
    
    if (typedChar && typedChar.length === 1) {
      console.log('Processing character:', typedChar, 'Expected:', expectedChar);
      setActualTypedCount(prev => {
        const newCount = prev + 1;
        console.log('Total typed count:', newCount);
        return newCount;
      });
      
      if (expectedChar === typedChar) {
        // Correct character
        chars[pos]?.classList.remove("incorrect");
        chars[pos]?.classList.add("correct");
        setCorrectCharacters(prev => {
          const newCorrect = prev + 1;
          console.log('Correct characters:', newCorrect);
          return newCorrect;
        });
        setPos(prev => prev + 1);
        setLastErrorPos(-1);
      } else {
        // Incorrect character - only count as error if it's not consecutive to the last error
        if (lastErrorPos !== pos) {
          setTotalErrors(prev => {
            const newErrors = prev + 1;
            console.log('Total errors:', newErrors);
            return newErrors;
          });
          setLastErrorPos(pos);
        }
        chars[pos]?.classList.add("incorrect");
        // Still advance position to continue typing
        setPos(prev => prev + 1);
      }
    }
  };

  const createUser = (username: string) => {
    if (!username.trim()) {
      showToast("Please enter a username.", true);
      return false;
    }
    if (usersList.includes(username)) {
      showToast("User already exists. Try a different name.", true);
      return false;
    }
    
    const newUsers = [...usersList, username];
    setUsersList(newUsers);
    setCurrentActiveUser(username);
    setTestResults([]);
    setAllTestHistory([]);
    setCurrentScreen('dashboard');
    showToast(`User "${username}" created successfully!`);
    return true;
  };

  const switchUser = (username: string) => {
    setCurrentActiveUser(username);
    loadUserTests(username);
    setDeleteConfirmState(false);
  };

  const startNewTest = (testName: string) => {
    console.log('Starting new test:', testName);
    setCurrentTestName(testName);
    setCurrentScreen('typing');
    resetTest();
    setShowReturnConfirm(false);
    setContinueTestMode(false);

    // Instead of using setTimeout with renderText, set the pending text
    const textToUse = generateWords(100);
    setPendingTextToRender(textToUse);
    // Do not call renderText here!
  };

  // ADD THIS useEffect TO CALL renderText AFTER TypingTest is mounted
  const textFlowRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentScreen !== 'typing') return;
    if (pendingTextToRender && textFlowRef.current) {
      // Debug line to help diagnose text update issues
      console.log("About to renderText with:", pendingTextToRender, "ref:", textFlowRef.current);
      renderText(pendingTextToRender, textFlowRef.current);
      setPendingTextToRender(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScreen, pendingTextToRender, textFlowRef.current]);
  
  const continueTest = (testName?: string) => {
    if (testName) {
      startNewTest(testName);
    } else {
      setContinueTestMode(true);
    }
  };

  const applyTheme = (newTheme: string) => {
    setTheme(newTheme);
  };

  const showToast = (msg: string, isError = false) => {
    setMessage(msg);
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
    messageTimeoutRef.current = setTimeout(() => setMessage(''), 5000);
  };

  const closeToast = () => {
    setMessage('');
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
  };

  const handleDeleteUser = () => {
    if (!deleteConfirmState) {
      setDeleteConfirmState(true);
      return;
    }
    
    const userToDelete = currentActiveUser;
    const newUsers = usersList.filter(u => u !== userToDelete);
    setUsersList(newUsers);
    localStorage.removeItem(`typeRakTests-${userToDelete}`);
    localStorage.removeItem(`typeRakHistory-${userToDelete}`);
    localStorage.removeItem(`typeRakLastTest-${userToDelete}`);
    
    setDeleteConfirmState(false);
    
    if (newUsers.length > 0) {
      setCurrentActiveUser(newUsers[0]);
      loadUserTests(newUsers[0]);
      setCurrentScreen('dashboard');
    } else {
      setCurrentActiveUser('');
      setCurrentScreen('greeting');
    }
    showToast(`User "${userToDelete}" deleted.`);
  };

  const handleCreateTestClick = () => {
    setShowTestNameMenu(true);
    setNewTestName('');
  };

  const handleConfirmTestName = () => {
    if (!newTestName.trim()) {
      showToast("Please enter a test name.", true);
      return;
    }
    setShowTestNameMenu(false);
    startNewTest(newTestName);
  };

  const handleReturnToDashboard = () => {
    if (!showReturnConfirm) {
      setShowReturnConfirm(true);
      return;
    }
    
    resetTest();
    setExtraChars([]);
    setShowReturnConfirm(false);
    setCurrentScreen('dashboard');
  };

  const handleContactMe = () => {
    setSideMenuOpen(false);
    setHighlightFooter(true);
    setTimeout(() => setHighlightFooter(false), 2000);
  };

  const handleHistoryClick = () => {
    if (currentScreen === 'typing' && testActive) {
      showToast("This will abort the current test.", true);
      setTimeout(() => {
        setShowReturnConfirm(true);
      }, 100);
    } else {
      setCurrentScreen('history');
    }
  };

  const confirmAbortAndGoToHistory = () => {
    resetTest();
    setExtraChars([]);
    setShowReturnConfirm(false);
    setCurrentScreen('history');
  };

  const getAverageStats = () => {
    if (testResults.length === 0) return null;
    
    const avgWpm = Math.round(testResults.reduce((sum, test) => sum + test.wpm, 0) / testResults.length);
    const avgErrorRate = (testResults.reduce((sum, test) => sum + test.errorRate, 0) / testResults.length).toFixed(2);
    const avgScore = Math.round(testResults.reduce((sum, test) => sum + test.score, 0) / testResults.length);
    const totalTests = testResults.reduce((sum, test) => sum + (test.testCount || 1), 0);
    const totalTime = testResults.reduce((sum, test) => sum + (test.totalTime || 0), 0);
    
    return { avgWpm, avgErrorRate, avgScore, totalTests, totalTime };
  };

  const getButtonColor = () => {
    switch (theme) {
      case 'cosmic-nebula':
        return '#8f0cc4';
      case 'midnight-black':
        return '#6a0dad';
      case 'cotton-candy-glow':
        return '#af01af';
      default:
        return '#8f0cc4';
    }
  };

  const averageStats = getAverageStats();

  // Show introduction first - always
  if (showIntroduction) {
    return <Introduction onComplete={handleIntroComplete} />;
  }

  const getTitleGradient = () => {
    if (theme === 'cosmic-nebula') {
      return 'linear-gradient(90deg, #f364f0 0%, #cd64f0 100%)'; // 20% brighter
    } else if (theme === 'midnight-black') {
      return 'linear-gradient(90deg, #c559f7 0%, #7f59f7 100%)';
    } else if (theme === 'cotton-candy-glow') {
      return 'linear-gradient(90deg, #ff59e8 0%, #ff52a8 100%)';
    }
    return 'linear-gradient(90deg, #c454f0 0%, #7d54f0 100%)';
  };

  return (
    <div style={{
      fontFamily: fontStyle === 'roboto' ? "'Roboto', sans-serif" :
                  fontStyle === 'open-sans' ? "'Open Sans', sans-serif" :
                  fontStyle === 'lato' ? "'Lato', sans-serif" :
                  fontStyle === 'source-sans' ? "'Source Sans Pro', sans-serif" :
                  fontStyle === 'dancing-script' ? "'Dancing Script', cursive" :
                  fontStyle === 'pacifico' ? "'Pacifico', cursive" :
                  "'Inter', sans-serif",
      fontSize: '112.5%',
      color: 'white',
      background: theme === 'midnight-black' ? '#000000' : 
                 theme === 'cotton-candy-glow' ? 'linear-gradient(45deg, #3e8cb9, #2f739d)' :
                 'linear-gradient(45deg, #3f034a, #004a7a)',
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '20px',
        position: 'relative'
      }}>
        {/* Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          zIndex: 10
        }}>
          <div>
            <h1 style={{
              backgroundImage: getTitleGradient(),
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
              fontSize: '2.5rem',
              fontWeight: 700,
              margin: 0,
              fontFamily: "'Inter', sans-serif"
            }}>
              TypeWave
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginRight: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '5px 15px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <span style={{ marginRight: '10px', fontSize: '1.15rem' }}>User: {currentActiveUser}</span>
              <button 
                onClick={() => setCurrentScreen('create-user')}
                style={{
                  background: 'transparent',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginLeft: '10px',
                  fontSize: '1.26rem'
                }}
              >
                +
              </button>
            </div>
            <button 
              onClick={() => setSideMenuOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '5px'
              }}
            >
              ☰
            </button>
          </div>
        </header>

        {/* Test Name Menu */}
        <TestNameMenu
          showTestNameMenu={showTestNameMenu}
          newTestName={newTestName}
          setNewTestName={setNewTestName}
          onConfirm={handleConfirmTestName}
          onCancel={() => setShowTestNameMenu(false)}
          getButtonColor={getButtonColor}
        />

        {/* Main Content Areas */}
        {currentScreen === 'greeting' && (
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px 0',
            flex: 1
          }}>
            <h2 style={{ marginBottom: '1rem' }}>Welcome to TypeWave!</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              {usersList.length === 0 ? "No users found. Create one below to get started." : "Please select or create a user to begin."}
            </p>
            {usersList.length === 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '20px',
                maxWidth: '400px'
              }}>
                <label style={{ display: 'block', marginBottom: '10px' }}>Enter username:</label>
                <input 
                  type="text" 
                  id="greeting-new-user-input"
                  placeholder="New username"
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '15px',
                    borderRadius: '4px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <button 
                  onClick={() => {
                    const input = document.getElementById('greeting-new-user-input') as HTMLInputElement;
                    if (input) createUser(input.value);
                  }}
                  style={{
                    width: '100%',
                    background: getButtonColor(),
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  Create User & Start
                </button>
              </div>
            )}
          </div>
        )}

        {currentScreen === 'create-user' && (
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px 0',
            flex: 1
          }}>
            <h2 style={{ marginBottom: '1rem' }}>Create New User</h2>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '30px',
              maxWidth: '400px'
            }}>
              <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.95em', color: '#d0d0d0' }}>
                Enter Username:
              </label>
              <input 
                type="text" 
                id="new-username-input"
                placeholder="New username"
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.95em', color: '#d0d0d0' }}>
                Confirm Username:
              </label>
              <input 
                type="text" 
                id="confirm-username-input"
                placeholder="Confirm username"
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <button 
                onClick={() => {
                  const input1 = document.getElementById('new-username-input') as HTMLInputElement;
                  const input2 = document.getElementById('confirm-username-input') as HTMLInputElement;
                  if (input1 && input2 && input1.value === input2.value) {
                    createUser(input1.value);
                  } else {
                    showToast("Usernames do not match.", true);
                  }
                }}
                style={{
                  width: '100%',
                  background: getButtonColor(),
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  marginBottom: '10px'
                }}
              >
                Create User
              </button>
              <button 
                onClick={() => setCurrentScreen(usersList.length > 0 ? 'dashboard' : 'greeting')}
                style={{
                  width: '100%',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {currentScreen === 'dashboard' && currentActiveUser && (
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px 0',
            flex: 1
          }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <button 
                onClick={handleCreateTestClick}
                style={{
                  background: getButtonColor(),
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Create New Test
              </button>
              {testResults.length > 0 && (
                <button 
                  onClick={() => continueTest()}
                  style={{
                    background: getButtonColor(),
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  Continue Test
                </button>
              )}
            </div>

            {averageStats && (
              <div style={{
                width: '100%',
                maxWidth: '700px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '20px',
                marginBottom: '20px'
              }}>
                <h3 style={{ marginBottom: '15px', textAlign: 'center' }}>Your Average Performance</h3>
                <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getButtonColor() }}>{averageStats.avgWpm}</div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Avg WPM</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getButtonColor() }}>{averageStats.avgErrorRate}%</div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Avg Error Rate</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getButtonColor() }}>{averageStats.avgScore}</div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Avg Score</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getButtonColor() }}>{averageStats.totalTests}</div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Total Tests</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getButtonColor() }}>
                      {Math.floor((averageStats.totalTime || 0) / 60)}:{((averageStats.totalTime || 0) % 60).toString().padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Time</div>
                  </div>
                </div>
              </div>
            )}

            <div style={{
              width: '100%',
              maxWidth: '700px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '15px'
            }}>
              <h3 style={{ marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '8px' }}>
                Your Previous Tests:
              </h3>
              {testResults.length === 0 ? (
                <p>No tests recorded yet.</p>
              ) : (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {testResults.map((test, index) => (
                    <div 
                      key={index} 
                      style={{
                        background: continueTestMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                        padding: '10px',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: continueTestMode ? 'pointer' : 'default',
                        border: continueTestMode ? '1px solid rgba(255, 255, 255, 0.3)' : 'none'
                      }}
                      onClick={() => continueTestMode && continueTest(test.name)}
                    >
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{test.name}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                          {test.testCount > 1 ? `${test.testCount} tests completed` : '1 test completed'} | Last: {new Date(test.lastDate).toLocaleDateString()}
                        </div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                          Time: {Math.floor((test.totalTime || 0) / 60)}:{((test.totalTime || 0) % 60).toString().padStart(2, '0')}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div>{test.wpm} WPM | {test.errorRate}% Error Rate | Score: {test.score}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                          Average Stats
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {currentScreen === 'typing' && (
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px 0',
            flex: 1
          }}>
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

            <StatsDisplay
              elapsed={elapsed}
              correctSigns={correctCharacters}
              totalErrors={totalErrors}
              currentErrorRate={getCurrentErrorRate()}
              theme={theme}
            />

            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <button 
                onClick={() => {
                  resetTest();
                  setExtraChars([]);
                  setShowReturnConfirm(false);
                  // Instead of setTimeout, do same as startNewTest
                  const textToUse = generateWords(100);
                  setPendingTextToRender(textToUse);
                }}
                style={{
                  background: getButtonColor(),
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Restart Current Test
              </button>
              <button 
                onClick={handleHistoryClick}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                History
              </button>
            </div>

            <div style={{
              position: 'fixed',
              bottom: '120px',
              right: '20px',
              zIndex: 100
            }}>
              <button 
                onClick={handleReturnToDashboard}
                style={{
                  background: showReturnConfirm ? '#e74c3c' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                {showReturnConfirm ? 'Confirm Return?' : 'Return to Dashboard'}
              </button>
            </div>
          </div>
        )}

        {currentScreen === 'results' && lastTestResult && (
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px 0',
            flex: 1
          }}>
            <div style={{
              fontSize: '3em',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              color: theme === 'cotton-candy-glow' ? '#333' : 'white',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.5em', opacity: 0.8, marginRight: '5px' }}>Score:</span>
              <span>{lastTestResult.score}</span>
              <span style={{ fontSize: '0.5em', opacity: 0.8, marginLeft: '5px' }}>/ 1000</span>
            </div>
            
            <div style={{
              fontSize: '1.5em',
              marginBottom: '2rem',
              textAlign: 'center',
              color: theme === 'cotton-candy-glow' ? '#333' : 'white'
            }}>
              {lastTestResult.score >= 800 ? "Excellent! Impressive Speed and Low Error Rate!" :
               lastTestResult.score >= 600 ? "Great job! Keep practicing!" :
               lastTestResult.score >= 400 ? "Good work! Room for improvement!" :
               "Keep practicing! You'll get better!"}
            </div>

            <div style={{
              width: '100%',
              maxWidth: '700px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '20px',
              marginBottom: '2rem'
            }}>
              <h3 style={{ marginBottom: '15px', textAlign: 'center' }}>Test Results</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', textAlign: 'center', marginBottom: '15px' }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getButtonColor() }}>{lastTestResult.wpm}</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>WPM</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getButtonColor() }}>{lastTestResult.errorRate}%</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Error Rate</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getButtonColor() }}>{lastTestResult.score}</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Score</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getButtonColor() }}>{lastTestResult.errors}</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Total Errors</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getButtonColor() }}>{lastTestResult.correctChars}</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Correct Signs</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getButtonColor() }}>
                    {Math.floor(lastTestResult.time / 60)}:{(lastTestResult.time % 60).toString().padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Time Taken</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button 
                onClick={() => setCurrentScreen('dashboard')}
                style={{
                  background: getButtonColor(),
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Back to Test Dashboard
              </button>
            </div>
          </div>
        )}

        {currentScreen === 'history' && (
          <HistoryPage
            allTestHistory={allTestHistory}
            theme={theme}
            onBack={() => setCurrentScreen('dashboard')}
            getButtonColor={getButtonColor}
          />
        )}

        {/* Side Menu */}
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
        />

        {/* Toast Message */}
        <Toast message={message} onClose={closeToast} />

        {/* Footer */}
        <footer style={{
          marginTop: 'auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '1.5rem',
          padding: '1.5rem 0',
          zIndex: 5,
          background: highlightFooter ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
          borderRadius: highlightFooter ? '12px' : '0',
          transition: 'all 0.3s ease',
          border: highlightFooter ? '1px solid rgba(255, 255, 255, 0.3)' : 'none'
        }}>
          <a 
            href="https://www.reddit.com/user/Rak_the_rock" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontSize: '0.9rem',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLElement;
              target.style.color = theme === 'midnight-black' ? '#c559f7' : 
                                   theme === 'cotton-candy-glow' ? '#ff59e8' : '#c454f0';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLElement;
              target.style.color = 'white';
            }}
          >
            Reddit
          </a>
          <a 
            href="https://github.com/Raktherock" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontSize: '0.9rem',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLElement;
              target.style.color = theme === 'midnight-black' ? '#c559f7' : 
                                   theme === 'cotton-candy-glow' ? '#ff59e8' : '#c454f0';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLElement;
              target.style.color = 'white';
            }}
          >
            GitHub
          </a>
          <a 
            href="https://t.me/RakshanKumaraa" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontSize: '0.9rem',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLElement;
              target.style.color = theme === 'midnight-black' ? '#c559f7' : 
                                   theme === 'cotton-candy-glow' ? '#ff59e8' : '#c454f0';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLElement;
              target.style.color = 'white';
            }}
          >
            Telegram
          </a>
          <a 
            href="https://www.linkedin.com/in/rakshan-kumaraa-140049365/" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontSize: '0.9rem',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLElement;
              target.style.color = theme === 'midnight-black' ? '#c559f7' : 
                                   theme === 'cotton-candy-glow' ? '#ff59e8' : '#c454f0';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLElement;
              target.style.color = 'white';
            }}
          >
            LinkedIn
          </a>
          <a 
            href="https://wa.me/916369314244" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontSize: '0.9rem',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLElement;
              target.style.color = theme === 'midnight-black' ? '#c559f7' : 
                                   theme === 'cotton-candy-glow' ? '#ff59e8' : '#c454f0';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLElement;
              target.style.color = 'white';
            }}
          >
            WhatsApp
          </a>
          <a 
            href="mailto:rakshankumaraa@gmail.com" 
            style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontSize: '0.9rem',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLElement;
              target.style.color = theme === 'midnight-black' ? '#c559f7' : 
                                   theme === 'cotton-candy-glow' ? '#ff59e8' : '#c454f0';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLElement;
              target.style.color = 'white';
            }}
          >
            Gmail
          </a>
        </footer>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Open+Sans:wght@300;400;500;700&family=Lato:wght@300;400;700&family=Source+Sans+Pro:wght@300;400;600;700&family=Inter:wght@300;400;500;600;700&family=Dancing+Script:wght@400;500;600;700&family=Pacifico:wght@400&display=swap');

        @keyframes blinkCaret {
          50% { opacity: 0; }
        }
        
        .char {
          display: inline-block;
          color: ${theme === 'midnight-black' ? '#f0f0f0' : theme === 'cotton-candy-glow' ? '#555' : '#f5e9f1'};
          transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;
          padding: 0 1px;
          margin: 0;
          letter-spacing: 0.01em;
          position: relative;
        }
        
        .char.correct {
          color: ${theme === 'midnight-black' ? '#ae1ee3' : theme === 'cotton-candy-glow' ? '#ff1fbc' : '#21b1ff'} !important;
        }
        
        .char.incorrect {
          color: #ff1c14 !important;
          background-color: rgba(255, 28, 20, 0.3);
          border-radius: 2px;
        }
        
        .extra {
          color: #ff4444 !important;
          background-color: rgba(255, 68, 68, 0.2);
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default Index;
