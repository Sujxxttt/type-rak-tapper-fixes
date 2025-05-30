import React, { useState, useEffect, useRef, useCallback } from 'react';

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

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const textFlowRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);

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
    if (storedTests) {
      setTestResults(JSON.parse(storedTests));
    } else {
      setTestResults([]);
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

  // Cheat code system
  useEffect(() => {
    const handleCheatCode = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === 'Backspace' && testActive) {
        e.preventDefault();
        setDuration(prev => prev + 30);
        showToast("Cheat activated: +30 seconds!");
      }
    };

    document.addEventListener('keydown', handleCheatCode);
    return () => document.removeEventListener('keydown', handleCheatCode);
  }, [testActive]);

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
    
    textFlowRef.current.innerHTML = "";
    const newChars: HTMLElement[] = [];
    const frag = document.createDocumentFragment();
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = char;
      frag.appendChild(span);
      newChars.push(span);
    }
    
    textFlowRef.current.appendChild(frag);
    setChars(newChars);
  };

  const adjustCaretPosition = () => {
    if (!caretRef.current || !chars || chars.length === 0 || pos >= chars.length) return;
    
    const currentChar = chars[pos];
    if (!currentChar) return;
    
    const charRect = currentChar.getBoundingClientRect();
    const displayRect = textFlowRef.current?.getBoundingClientRect();
    
    if (displayRect) {
      caretRef.current.style.left = `${charRect.left - displayRect.left}px`;
      caretRef.current.style.top = `${charRect.bottom - displayRect.top - 2}px`;
    }
  };

  const updateStats = () => {
    const mins = Math.max(elapsed / 60, 1 / 60);
    const correctSigns = typedCharacters.filter((char, index) => char === chars[index]?.textContent).length;
    const speed = Math.round(Math.max(0, (correctSigns / 5) / mins));
    const accuracyValue = typedCharacters.length > 0 ? ((correctSigns / typedCharacters.length) * 100).toFixed(2) : "0.00";
    
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
    
    // Save test results
    const mins = Math.max(elapsed / 60, 1 / 60);
    const correctSigns = typedCharacters.filter((char, index) => char === chars[index]?.textContent).length;
    const speed = Math.round(Math.max(0, (correctSigns / 5) / mins));
    const accuracyValue = typedCharacters.length > 0 ? ((correctSigns / typedCharacters.length) * 100) : 0;
    
    const testResult = {
      name: currentTestName,
      date: new Date().toISOString(),
      wpm: speed,
      accuracy: parseFloat(accuracyValue.toFixed(2)),
      errors: totalErrors,
      time: elapsed,
      characters: typedCharacters.length
    };
    
    const newResults = [...testResults, testResult];
    setTestResults(newResults);
    localStorage.setItem(`typeRakTests-${currentActiveUser}`, JSON.stringify(newResults));
    
    setCurrentScreen('results');
  };

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (currentScreen !== 'typing' || gameOver) return;
    
    e.preventDefault();
    
    if (!testActive && e.key.length === 1 && pos < chars.length) {
      startTimer();
      setTestActive(true);
    }
    
    if (!testActive) return;
    
    const expectedChar = chars[pos]?.textContent;
    const typedChar = e.key;
    
    if (typedChar === "Backspace") {
      if (pos > 0) {
        setPos(prev => prev - 1);
        setTypedCharacters(prev => prev.slice(0, -1));
        chars[pos - 1]?.classList.remove("correct", "incorrect");
      }
    } else if (typedChar && typedChar.length === 1) {
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
  }, [currentScreen, gameOver, testActive, pos, chars, typedCharacters, duration]);

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
    
    setTimeout(() => {
      const textToUse = generateWords(100);
      renderText(textToUse);
      adjustCaretPosition();
    }, 100);
  };

  const continueLastTest = () => {
    if (testResults.length > 0) {
      const lastTest = testResults[testResults.length - 1];
      startNewTest(`${lastTest.name} (Continued)`);
    }
  };

  const applyTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("typeRakTheme", newTheme);
  };

  const showToast = (msg: string, isError = false) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
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

  const getAverageStats = () => {
    if (testResults.length === 0) return null;
    
    const avgWpm = Math.round(testResults.reduce((sum, test) => sum + test.wpm, 0) / testResults.length);
    const avgAccuracy = (testResults.reduce((sum, test) => sum + test.accuracy, 0) / testResults.length).toFixed(2);
    const totalTests = testResults.length;
    
    return { avgWpm, avgAccuracy, totalTests };
  };

  // Get theme-specific button colors
  const getButtonColor = () => {
    switch (theme) {
      case 'cosmic-nebula':
        return '#b20ff7';
      case 'midnight-black':
        return '#6a0dad';
      case 'cotton-candy-glow':
        return '#fa02fa';
      default:
        return '#b20ff7';
    }
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
              TypeRak
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
              <label htmlFor="user-select" style={{ marginRight: '10px', fontSize: '0.9rem' }}>User:</label>
              <select 
                id="user-select"
                value={currentActiveUser}
                onChange={(e) => switchUser(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#fff',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  minWidth: '120px'
                }}
              >
                {usersList.map(user => (
                  <option key={user} value={user} style={{ background: 'rgba(0,0,0,0.9)', color: '#fff' }}>
                    {user}
                  </option>
                ))}
              </select>
              <button 
                onClick={() => setCurrentScreen('create-user')}
                style={{
                  background: getButtonColor(),
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginLeft: '10px'
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
              background: 'rgba(255, 255, 255, 0.1)',
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
            <h2 style={{ marginBottom: '1rem' }}>Welcome to TypeRak!</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              {usersList.length === 0 ? "No users found. Create one below to get started." : "Please select or create a user to begin."}
            </p>
            {usersList.length === 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
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
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              backdropFilter: 'blur(5px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '30px',
              maxWidth: '400px'
            }}>
              <label style={{ display: 'block', marginBottom: '10px' }}>Enter Username:</label>
              <input 
                type="text" 
                id="new-username-input"
                placeholder="New username"
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <label style={{ display: 'block', marginBottom: '10px' }}>Confirm Username:</label>
              <input 
                type="text" 
                id="confirm-username-input"
                placeholder="Confirm username"
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
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
                  background: getButtonColor(),
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginRight: '10px'
                }}
              >
                Create User
              </button>
              <button 
                onClick={() => setCurrentScreen(usersList.length > 0 ? 'dashboard' : 'greeting')}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer'
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
                  onClick={continueLastTest}
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
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getButtonColor() }}>{averageStats.avgAccuracy}%</div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Avg Accuracy</div>
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
                  {testResults.slice(-10).reverse().map((test, index) => (
                    <div key={index} style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '10px',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{test.name}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                          {new Date(test.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div>{test.wpm} WPM | {test.accuracy}% Accuracy</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                          {test.errors} errors | {Math.floor(test.time / 60)}:{(test.time % 60).toString().padStart(2, '0')}
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
              width: '90%',
              maxWidth: '1200px',
              background: theme === 'cotton-candy-glow' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
              borderRadius: '6px',
              overflow: 'hidden',
              marginBottom: '1.5rem',
              padding: '1rem',
              minHeight: '80px'
            }}>
              <div style={{
                position: 'relative',
                whiteSpace: 'nowrap',
                fontSize: '1.35em',
                lineHeight: '1.6',
                letterSpacing: '0.05em'
              }}>
                <div ref={textFlowRef} style={{ display: 'inline-block' }}></div>
              </div>
              <div 
                ref={caretRef}
                style={{
                  position: 'absolute',
                  height: '1.4em',
                  width: '2px',
                  background: theme === 'midnight-black' ? '#ae1ee3' : 
                             theme === 'cotton-candy-glow' ? '#ff1fbc' : '#21b1ff',
                  animation: 'blinkCaret 0.8s infinite step-end'
                }}
              ></div>
            </div>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem',
              width: '90%',
              maxWidth: '900px',
              margin: '1rem auto'
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
                  {Math.round(Math.max(0, (typedCharacters.filter((char, index) => char === chars[index]?.textContent).length / 5) / Math.max(elapsed / 60, 1 / 60)))} WPM
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
                <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.25rem' }}>Accuracy:</span>
                <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                  {typedCharacters.length > 0 ? ((typedCharacters.filter((char, index) => char === chars[index]?.textContent).length / typedCharacters.length) * 100).toFixed(2) : "0.00"}%
                </span>
              </div>
            </div>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button 
                onClick={() => {
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
            </div>
          </div>
        )}

        {currentScreen === 'results' && (
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
              <span>850</span>
              <span style={{ fontSize: '0.5em', opacity: 0.8, marginLeft: '5px' }}>/ 1000</span>
            </div>
            
            <div style={{
              fontSize: '1.5em',
              marginBottom: '2rem',
              textAlign: 'center',
              color: theme === 'cotton-candy-glow' ? '#333' : 'white'
            }}>
              Excellent! Impressive Speed and Accuracy!
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
                  onClick={() => window.open('mailto:rakshankumaraa@gmail.com', '_blank')}
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
            top: '50px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            zIndex: 2000,
            fontSize: '0.9rem',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            {message}
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
          zIndex: 5
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
