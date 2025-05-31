import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

const Index: React.FC = () => {
  // Word list for typing test
  const wordList = [
    "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "and", "runs",
    "through", "forest", "with", "great", "speed", "while", "being", "chased", "by",
    "hunter", "who", "wants", "catch", "for", "his", "dinner", "but", "fox", "too",
    "smart", "fast", "escape", "from", "danger", "using", "its", "natural", "instincts",
    "survival", "skills", "that", "have", "been", "developed", "over", "many", "years",
    "evolution", "making", "one", "most", "cunning", "animals", "in", "animal", "kingdom",
    "able", "outsmart", "even", "most", "experienced", "hunters", "with", "ease", "grace"
  ];

  // Global state variables
  const [usersList, setUsersList] = useState<string[]>([]);
  const [currentActiveUser, setCurrentActiveUser] = useState<string>('');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [allTestHistory, setAllTestHistory] = useState<any[]>([]);
  const [lastTestText, setLastTestText] = useState<string>('');
  const [currentTestName, setCurrentTestName] = useState<string>('');
  const [deleteConfirmState, setDeleteConfirmState] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [testActive, setTestActive] = useState<boolean>(false);
  const [elapsed, setElapsed] = useState<number>(0);
  const [duration, setDuration] = useState<number>(60);
  const [pos, setPos] = useState<number>(0);
  const [chars, setChars] = useState<HTMLElement[]>([]);
  const [typedCharacters, setTypedCharacters] = useState<string[]>([]);
  const [totalErrors, setTotalErrors] = useState<number>(0);
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false);
  const [currentScreen, setCurrentScreen] = useState<string>('greeting');
  const [theme, setTheme] = useState<string>('cosmic-nebula');
  const [message, setMessage] = useState<string>('');
  const [showTestNameMenu, setShowTestNameMenu] = useState<boolean>(false);
  const [newTestName, setNewTestName] = useState<string>('');
  const [showReturnConfirm, setShowReturnConfirm] = useState<boolean>(false);
  const [highlightFooter, setHighlightFooter] = useState<boolean>(false);
  const [lastTestResult, setLastTestResult] = useState<any>(null);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [continueTestMode, setContinueTestMode] = useState<boolean>(false);
  const [testText, setTestText] = useState<string>('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const textFlowRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load users from localStorage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem("typeRakUsersList");
    const storedActiveUser = localStorage.getItem("typeRakActiveUser");
    const storedTheme = localStorage.getItem("typeRakTheme");
    const storedDuration = localStorage.getItem("typeRakDuration");

    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      setUsersList(users);
      
      if (storedActiveUser && users.includes(storedActiveUser)) {
        setCurrentActiveUser(storedActiveUser);
        setCurrentScreen('dashboard');
        loadUserTests(storedActiveUser);
      } else if (users.length > 0) {
        setCurrentActiveUser(users[0]);
        setCurrentScreen('dashboard');
        loadUserTests(users[0]);
      }
    }

    if (storedTheme) setTheme(storedTheme);
    if (storedDuration) setDuration(parseInt(storedDuration, 10));
  }, []);

  // Load user tests
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

  // Apply theme to body
  useEffect(() => {
    document.body.className = '';
    if (theme === 'midnight-black') {
      document.body.classList.add('midnight-black');
    } else if (theme === 'cotton-candy-glow') {
      document.body.classList.add('cotton-candy-glow');
    }
  }, [theme]);

  // Cheat code system - fixed to add 30 seconds to current time
  useEffect(() => {
    const handleCheatCode = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === 'Backspace' && testActive) {
        e.preventDefault();
        setElapsed(prev => {
          const newElapsed = prev + 30;
          if (newElapsed >= duration) {
            // If adding 30 seconds exceeds duration, end the test
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

  // Helper functions
  const generateWords = (count: number): string => {
    let generatedText = "";
    for (let i = 0; i < count; i++) {
      generatedText += wordList[Math.floor(Math.random() * wordList.length)];
      if (i < count - 1) {
        generatedText += " ";
      }
    }
    return generatedText;
  };

  const renderText = (text: string) => {
    if (!textFlowRef.current) return;
    
    setTestText(text);
    textFlowRef.current.innerHTML = "";
    const newChars: HTMLElement[] = [];
    const frag = document.createDocumentFragment();
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = char === " " ? "\u00A0" : char;
      frag.appendChild(span);
      newChars.push(span);
    }
    
    textFlowRef.current.appendChild(frag);
    setChars(newChars);
  };

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

  const updateStats = () => {
    adjustCaretPosition();
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setElapsed(prev => {
        const newElapsed = prev + 1;
        if (newElapsed >= duration) {
          endTest();
        }
        return newElapsed;
      });
    }, 1000);
  };

  const endTest = () => {
    if (gameOver) return;
    setGameOver(true);
    setTestActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Calculate stats
    const mins = Math.max(elapsed / 60, 1 / 60);
    const correctSigns = typedCharacters.filter((char, index) => char === testText[index]).length;
    const speed = Math.round(Math.max(0, (correctSigns / 5) / mins));
    const totalSigns = typedCharacters.length;
    const errorRate = totalSigns > 0 ? ((totalErrors / totalSigns) * 100) : 0;
    
    // Calculate score (WPM * (100 - Error Rate) / 100 * 10)
    const score = Math.round(speed * ((100 - errorRate) / 100) * 10);
    
    const testResult = {
      name: currentTestName,
      date: new Date().toISOString(),
      wpm: speed,
      errorRate: parseFloat(errorRate.toFixed(2)),
      errors: totalErrors,
      time: elapsed,
      characters: typedCharacters.length,
      correctChars: correctSigns,
      score: score
    };
    
    setLastTestResult(testResult);
    
    // Update history
    const newHistory = [...allTestHistory, testResult];
    setAllTestHistory(newHistory);
    localStorage.setItem(`typeRakHistory-${currentActiveUser}`, JSON.stringify(newHistory));
    
    // Update grouped results
    const existingTestIndex = testResults.findIndex(test => test.name === currentTestName);
    let newResults;
    
    if (existingTestIndex >= 0) {
      // Update existing test with average
      const existingTest = testResults[existingTestIndex];
      const testHistory = newHistory.filter(t => t.name === currentTestName);
      const avgWpm = Math.round(testHistory.reduce((sum, t) => sum + t.wpm, 0) / testHistory.length);
      const avgErrorRate = (testHistory.reduce((sum, t) => sum + t.errorRate, 0) / testHistory.length);
      const avgScore = Math.round(testHistory.reduce((sum, t) => sum + t.score, 0) / testHistory.length);
      const totalTime = testHistory.reduce((sum, t) => sum + t.time, 0);
      
      newResults = [...testResults];
      newResults[existingTestIndex] = {
        ...existingTest,
        wpm: avgWpm,
        errorRate: parseFloat(avgErrorRate.toFixed(2)),
        score: avgScore,
        testCount: testHistory.length,
        lastDate: testResult.date,
        totalTime: totalTime
      };
    } else {
      // Add new test
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

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (currentScreen !== 'typing' || gameOver) return;
    
    // Ignore backspace for typing (except for cheat code)
    if (e.key === "Backspace" && !(e.ctrlKey && e.altKey)) {
      e.preventDefault();
      return;
    }
    
    e.preventDefault();
    
    if (!testActive && e.key.length === 1 && pos < chars.length) {
      startTimer();
      setTestActive(true);
    }
    
    if (!testActive) return;
    
    const expectedChar = testText[pos];
    const typedChar = e.key;
    
    if (typedChar && typedChar.length === 1) {
      setTypedCharacters(prev => [...prev, typedChar]);
      if (expectedChar === typedChar) {
        chars[pos]?.classList.add("correct");
        setPos(prev => prev + 1);
      } else {
        chars[pos]?.classList.add("incorrect");
        setTotalErrors(prev => prev + 1);
        setPos(prev => prev + 1);
      }
      
      if (pos + 1 >= chars.length) {
        endTest();
      }
    }
    
    updateStats();
  }, [currentScreen, gameOver, testActive, pos, chars, typedCharacters, duration, testText]);

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKey]);

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
    localStorage.setItem("typeRakUsersList", JSON.stringify(newUsers));
    localStorage.setItem("typeRakActiveUser", username);
    setTestResults([]);
    setAllTestHistory([]);
    setCurrentScreen('dashboard');
    showToast(`User "${username}" created successfully!`);
    return true;
  };

  const switchUser = (username: string) => {
    setCurrentActiveUser(username);
    localStorage.setItem("typeRakActiveUser", username);
    loadUserTests(username);
    setDeleteConfirmState(false);
  };

  const startNewTest = (testName: string) => {
    setCurrentTestName(testName);
    setCurrentScreen('typing');
    setGameOver(false);
    setTestActive(false);
    setElapsed(0);
    setPos(0);
    setTotalErrors(0);
    setTypedCharacters([]);
    setShowReturnConfirm(false);
    setContinueTestMode(false);
    
    setTimeout(() => {
      const textToUse = generateWords(100);
      renderText(textToUse);
      adjustCaretPosition();
    }, 100);
  };

  const continueTest = (testName?: string) => {
    if (testName) {
      startNewTest(testName);
    } else {
      setContinueTestMode(true);
    }
  };

  const applyTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("typeRakTheme", newTheme);
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
    localStorage.setItem("typeRakUsersList", JSON.stringify(newUsers));
    localStorage.removeItem(`typeRakTests-${userToDelete}`);
    localStorage.removeItem(`typeRakHistory-${userToDelete}`);
    localStorage.removeItem(`typeRakLastTest-${userToDelete}`);
    
    setDeleteConfirmState(false);
    
    if (newUsers.length > 0) {
      setCurrentActiveUser(newUsers[0]);
      localStorage.setItem("typeRakActiveUser", newUsers[0]);
      loadUserTests(newUsers[0]);
      setCurrentScreen('dashboard');
    } else {
      setCurrentActiveUser('');
      localStorage.removeItem("typeRakActiveUser");
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
    
    // Abort test and return to dashboard
    setGameOver(false);
    setTestActive(false);
    setElapsed(0);
    setPos(0);
    setTotalErrors(0);
    setTypedCharacters([]);
    setShowReturnConfirm(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCurrentScreen('dashboard');
  };

  const handleContactMe = () => {
    setSideMenuOpen(false);
    setHighlightFooter(true);
    setTimeout(() => setHighlightFooter(false), 2000);
  };

  const handleHistoryClick = () => {
    if (currentScreen === 'typing' && testActive) {
      showToast("This will abort the current test. Confirm to continue.", true);
      setTimeout(() => {
        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Confirm';
        confirmButton.style.background = '#e74c3c';
        confirmButton.style.color = 'white';
        confirmButton.style.border = 'none';
        confirmButton.style.padding = '8px 16px';
        confirmButton.style.borderRadius = '4px';
        confirmButton.style.cursor = 'pointer';
        confirmButton.onclick = () => {
          setGameOver(false);
          setTestActive(false);
          setElapsed(0);
          setPos(0);
          setTotalErrors(0);
          setTypedCharacters([]);
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setCurrentScreen('history');
        };
      }, 100);
    } else {
      setCurrentScreen('history');
    }
  };

  const getAverageStats = () => {
    if (testResults.length === 0) return null;
    
    const avgWpm = Math.round(testResults.reduce((sum, test) => sum + test.wpm, 0) / testResults.length);
    const avgErrorRate = (testResults.reduce((sum, test) => sum + test.errorRate, 0) / testResults.length).toFixed(2);
    const avgScore = Math.round(testResults.reduce((sum, test) => sum + test.score, 0) / testResults.length);
    const totalTests = testResults.reduce((sum, test) => sum + (test.testCount || 1), 0);
    
    return { avgWpm, avgErrorRate, avgScore, totalTests };
  };

  // Get theme-specific button colors (adjusted)
  const getButtonColor = () => {
    switch (theme) {
      case 'cosmic-nebula':
        return '#8f0cc4'; // 20% darker than #b20ff7
      case 'midnight-black':
        return '#6a0dad'; // Keep as is
      case 'cotton-candy-glow':
        return '#af01af'; // 30% darker than #fa02fa
      default:
        return '#8f0cc4';
    }
  };

  // Get current correct characters including spaces
  const getCorrectSigns = () => {
    return typedCharacters.filter((char, index) => char === testText[index]).length;
  };

  // Get current error rate
  const getCurrentErrorRate = () => {
    const totalSigns = typedCharacters.length;
    return totalSigns > 0 ? ((totalErrors / totalSigns) * 100) : 0;
  };

  const averageStats = getAverageStats();

  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
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
              backgroundImage: theme === 'midnight-black' ? 'linear-gradient(90deg, #c559f7 0%, #7f59f7 100%)' :
                              theme === 'cotton-candy-glow' ? 'linear-gradient(90deg, #ff59e8 0%, #ff52a8 100%)' :
                              'linear-gradient(90deg, #c454f0 0%, #7d54f0 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
              fontSize: '2.5rem',
              fontWeight: 700,
              margin: 0
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
              <span style={{ marginRight: '10px', fontSize: '0.95rem' }}>User: {currentActiveUser}</span>
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
        {showTestNameMenu && (
          <>
            <div 
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.4)',
                zIndex: 999
              }}
              onClick={() => setShowTestNameMenu(false)}
            />
            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '30px',
              zIndex: 1000,
              minWidth: '400px'
            }}>
              <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Create New Test</h3>
              <input
                type="text"
                value={newTestName}
                onChange={(e) => setNewTestName(e.target.value)}
                placeholder="Enter test name..."
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '1rem',
                  backdropFilter: 'blur(10px)'
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleConfirmTestName()}
                autoFocus
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleConfirmTestName}
                  style={{
                    flex: 1,
                    background: getButtonColor(),
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  Start Test
                </button>
                <button
                  onClick={() => setShowTestNameMenu(false)}
                  style={{
                    flex: 1,
                    background: 'rgba(108, 117, 125, 0.8)',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}

        {/* History Modal */}
        {showHistory && (
          <>
            <div 
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.4)',
                zIndex: 999
              }}
              onClick={() => setShowHistory(false)}
            />
            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '30px',
              zIndex: 1000,
              width: '80%',
              maxWidth: '800px',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Test History</h3>
                <button 
                  onClick={() => setShowHistory(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontSize: '1.5rem',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>
              {allTestHistory.length === 0 ? (
                <p>No test history available.</p>
              ) : (
                <div>
                  {allTestHistory.slice().reverse().map((test, index) => (
                    <div key={index} style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '15px',
                      borderRadius: '8px',
                      marginBottom: '10px',
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                      gap: '15px',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{test.name}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                          {new Date(test.date).toLocaleString()}
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 'bold' }}>{test.wpm}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>WPM</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 'bold' }}>{test.errorRate}%</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Error Rate</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 'bold' }}>{test.score}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Score</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 'bold' }}>{Math.floor(test.time / 60)}:{(test.time % 60).toString().padStart(2, '0')}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Time</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

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
                  fontSize: '1rem'
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
              minHeight: '150px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                position: 'relative',
                fontSize: '1.65em',
                lineHeight: '1.8',
                letterSpacing: '0.05em',
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

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem',
              width: '90%',
              maxWidth: '1000px',
              margin: '1rem auto',
              marginBottom: '4rem'
            }}>
              <div style={{
                background: theme === 'cotton-candy-glow' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                padding: '0.8rem 1.2rem',
                borderRadius: '6px',
                textAlign: 'center',
                color: theme === 'cotton-candy-glow' ? '#333' : 'white',
                flexGrow: 1,
                flexBasis: '150px',
                minWidth: '120px'
              }}>
                <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.25rem' }}>Time:</span>
                <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                  {String(Math.floor(elapsed / 60)).padStart(2, "0")}:{String(elapsed % 60).padStart(2, "0")}
                </span>
              </div>
              <div style={{
                background: theme === 'cotton-candy-glow' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                padding: '0.8rem 1.2rem',
                borderRadius: '6px',
                textAlign: 'center',
                color: theme === 'cotton-candy-glow' ? '#333' : 'white',
                flexGrow: 1,
                flexBasis: '150px',
                minWidth: '120px'
              }}>
                <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.25rem' }}>Speed:</span>
                <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                  {Math.round(Math.max(0, (getCorrectSigns() / 5) / Math.max(elapsed / 60, 1 / 60)))} WPM
                </span>
              </div>
              <div style={{
                background: theme === 'cotton-candy-glow' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                padding: '0.8rem 1.2rem',
                borderRadius: '6px',
                textAlign: 'center',
                color: theme === 'cotton-candy-glow' ? '#333' : 'white',
                flexGrow: 1,
                flexBasis: '150px',
                minWidth: '120px'
              }}>
                <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.25rem' }}>Errors:</span>
                <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{totalErrors}</span>
              </div>
              <div style={{
                background: theme === 'cotton-candy-glow' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                padding: '0.8rem 1.2rem',
                borderRadius: '6px',
                textAlign: 'center',
                color: theme === 'cotton-candy-glow' ? '#333' : 'white',
                flexGrow: 1,
                flexBasis: '150px',
                minWidth: '120px'
              }}>
                <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.25rem' }}>Error Rate:</span>
                <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                  {getCurrentErrorRate().toFixed(2)}%
                </span>
              </div>
              <div style={{
                background: theme === 'cotton-candy-glow' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                padding: '0.8rem 1.2rem',
                borderRadius: '6px',
                textAlign: 'center',
                color: theme === 'cotton-candy-glow' ? '#333' : 'white',
                flexGrow: 1,
                flexBasis: '150px',
                minWidth: '120px'
              }}>
                <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.25rem' }}>Signs:</span>
                <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{getCorrectSigns()}</span>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <button 
                onClick={() => {
                  setGameOver(false);
                  setTestActive(false);
                  setElapsed(0);
                  setPos(0);
                  setTotalErrors(0);
                  setTypedCharacters([]);
                  setShowReturnConfirm(false);
                  if (timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                  }
                  setTimeout(() => {
                    const textToUse = generateWords(100);
                    renderText(textToUse);
                    adjustCaretPosition();
                  }, 100);
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
                onClick={() => setShowHistory(true)}
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

            {/* Return to Dashboard button - positioned in bottom right */}
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

            {/* Test Stats */}
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
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px 0',
            flex: 1
          }}>
            <div style={{
              width: '90%',
              maxWidth: '800px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '30px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Test History</h2>
                <button 
                  onClick={() => setCurrentScreen('dashboard')}
                  style={{
                    background: getButtonColor(),
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Back to Dashboard
                </button>
              </div>
              {allTestHistory.length === 0 ? (
                <p>No test history available.</p>
              ) : (
                <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                  {allTestHistory.slice().reverse().map((test, index) => (
                    <div key={index} style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '15px',
                      borderRadius: '8px',
                      marginBottom: '10px',
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                      gap: '15px',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{test.name}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                          {new Date(test.date).toLocaleString()}
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 'bold' }}>{test.wpm}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>WPM</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 'bold' }}>{test.errorRate}%</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Error Rate</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 'bold' }}>{test.score}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Score</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 'bold' }}>{Math.floor(test.time / 60)}:{(test.time % 60).toString().padStart(2, '0')}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Time</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Side Menu */}
        {sideMenuOpen && (
          <>
            <div 
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.4)',
                zIndex: 999
              }}
              onClick={() => setSideMenuOpen(false)}
            ></div>
            <div style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '300px',
              height: '100%',
              background: 'rgba(30, 35, 45, 0.7)',
              backdropFilter: 'blur(20px)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '1.5rem',
              zIndex: 1000,
              color: '#e0e0e0',
              overflowY: 'auto'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                paddingBottom: '1rem'
              }}>
                <h2>Settings</h2>
                <button 
                  onClick={() => setSideMenuOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#cccccc',
                    fontSize: '1.8rem',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>

              {/* User Selection Section */}
              <div style={{ margin: '1.5rem 0' }}>
                <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.95em', color: '#d0d0d0' }}>
                  Select User:
                </label>
                <select 
                  value={currentActiveUser}
                  onChange={(e) => switchUser(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    marginBottom: '10px'
                  }}
                >
                  {usersList.map(user => (
                    <option key={user} value={user} style={{ background: 'rgba(0,0,0,0.9)' }}>
                      {user}
                    </option>
                  ))}
                </select>
                <button 
                  onClick={handleDeleteUser}
                  style={{
                    backgroundColor: deleteConfirmState ? '#e74c3c' : '#c0392b',
                    color: 'white',
                    border: 'none',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    width: '100%'
                  }}
                >
                  {deleteConfirmState ? 'Confirm Delete?' : 'Delete Current User'}
                </button>
              </div>

              <div style={{ margin: '1.5rem 0' }}>
                <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.95em', color: '#d0d0d0' }}>
                  Test Duration:
                </label>
                <select 
                  value={duration}
                  onChange={(e) => {
                    const newDuration = parseInt(e.target.value, 10);
                    setDuration(newDuration);
                    localStorage.setItem("typeRakDuration", newDuration.toString());
                  }}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <option value="30" style={{ background: 'rgba(0,0,0,0.9)' }}>30 Seconds</option>
                  <option value="60" style={{ background: 'rgba(0,0,0,0.9)' }}>1 Minute</option>
                  <option value="120" style={{ background: 'rgba(0,0,0,0.9)' }}>2 Minutes</option>
                  <option value="180" style={{ background: 'rgba(0,0,0,0.9)' }}>3 Minutes</option>
                  <option value="300" style={{ background: 'rgba(0,0,0,0.9)' }}>5 Minutes</option>
                  <option value="600" style={{ background: 'rgba(0,0,0,0.9)' }}>10 Minutes</option>
                  <option value="1200" style={{ background: 'rgba(0,0,0,0.9)' }}>20 Minutes</option>
                  <option value="1800" style={{ background: 'rgba(0,0,0,0.9)' }}>30 Minutes</option>
                  <option value="3600" style={{ background: 'rgba(0,0,0,0.9)' }}>60 Minutes</option>
                </select>
              </div>

              <div style={{ margin: '1.5rem 0' }}>
                <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.95em', color: '#d0d0d0' }}>
                  Theme:
                </label>
                <select 
                  value={theme}
                  onChange={(e) => applyTheme(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <option value="cosmic-nebula" style={{ background: 'rgba(0,0,0,0.9)' }}>Cosmic Nebula</option>
                  <option value="midnight-black" style={{ background: 'rgba(0,0,0,0.9)' }}>Midnight Black</option>
                  <option value="cotton-candy-glow" style={{ background: 'rgba(0,0,0,0.9)' }}>Cotton Candy Glow</option>
                </select>
              </div>

              <div style={{ margin: '1.5rem 0' }}>
                <button
                  onClick={() => {
                    setSideMenuOpen(false);
                    setShowHistory(true);
                  }}
                  style={{
                    width: '100%',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    marginBottom: '10px'
                  }}
                >
                  History
                </button>
              </div>

              <div style={{ margin: '1.5rem 0' }}>
                <button
                  onClick={() => window.open('https://www.reddit.com/user/Rak_the_rock', '_blank')}
                  style={{
                    width: '100%',
                    backgroundColor: getButtonColor(),
                    color: 'white',
                    border: 'none',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    marginBottom: '10px'
                  }}
                >
                  About Me
                </button>
                <button
                  onClick={handleContactMe}
                  style={{
                    width: '100%',
                    backgroundColor: getButtonColor(),
                    color: 'white',
                    border: 'none',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    marginBottom: '10px'
                  }}
                >
                  Contact Me
                </button>
                <button
                  onClick={() => window.open('https://github.com/Raktherock', '_blank')}
                  style={{
                    width: '100%',
                    backgroundColor: getButtonColor(),
                    color: 'white',
                    border: 'none',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    marginBottom: '10px'
                  }}
                >
                  Check This Out
                </button>
              </div>
            </div>
          </>
        )}

        {/* Toast Message */}
        {message && (
          <div style={{
            position: 'fixed',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '12px 24px 12px 24px',
            borderRadius: '12px',
            zIndex: 2000,
            fontSize: '0.9rem',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ flex: 1 }}>{message}</span>
            <button
              onClick={closeToast}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '0',
                marginLeft: '12px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>
        )}

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
        @keyframes blinkCaret {
          50% { opacity: 0; }
        }
        
        .char {
          display: inline-block;
          color: ${theme === 'midnight-black' ? '#f0f0f0' : theme === 'cotton-candy-glow' ? '#555' : '#f5e9f1'};
          transition: color 0.15s ease-in-out;
          padding: 0;
          margin: 0;
        }
        
        .char.correct {
          color: ${theme === 'midnight-black' ? '#ae1ee3' : theme === 'cotton-candy-glow' ? '#ff1fbc' : '#21b1ff'} !important;
        }
        
        .char.incorrect {
          color: #ff1c14 !important;
          background-color: rgba(255, 28, 20, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Index;
