import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTypingGame } from '../hooks/useTypingGame';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { TypingTest } from '../components/TypingTest';
import { StatsDisplay } from '../components/StatsDisplay';
import { SideMenu } from '../components/SideMenu';
import { HistoryPage } from '../components/HistoryPage';
import { TypedTextPreview } from '../components/TypedTextPreview';
import { TestNameMenu } from '../components/TestNameMenu';
import { Introduction } from '../components/Introduction';
import { EasterEggPage } from '../components/EasterEggPage';
import { Toast } from '../components/Toast';
import { Settings, RotateCcw, Eye } from 'lucide-react';

export default function Index() {
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

  const [theme, setTheme] = useLocalStorage<string>("typeRakTheme", "cosmic-nebula");
  const [duration, setDuration] = useLocalStorage<number>("typeRakDuration", 60);
  const [fontSize, setFontSize] = useLocalStorage<number>("typeRakFontSize", 100);
  const [fontStyle, setFontStyle] = useLocalStorage<string>("typeRakFontStyle", "inter");
  const [soundEnabled, setSoundEnabled] = useLocalStorage<boolean>("typeRakSound", true);
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [showTestNameMenu, setShowTestNameMenu] = useState<boolean>(false);
  const [showIntroduction, setShowIntroduction] = useState<boolean>(true);
  const [showEasterEgg, setShowEasterEgg] = useState<boolean>(false);
  const [currentActiveUser, setCurrentActiveUser] = useLocalStorage<string>("typeRakActiveUser", "");
  const [usersList, setUsersList] = useLocalStorage<string[]>("typeRakUsersList", []);
  const [deleteConfirmState, setDeleteConfirmState] = useState<boolean>(false);
  const [typedTextForPreview, setTypedTextForPreview] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string>("");
  const [titleClickCount, setTitleClickCount] = useState<number>(0);
  const [scrollCount, setScrollCount] = useState<number>(0);
  const [toastQueue, setToastQueue] = useState<string[]>([]);

  const { playKeyboardSound, playErrorSound } = useSoundEffects(soundEnabled);

  const saveTestResult = (finalWPM: number, finalAccuracy: number, finalErrorRate: number) => {
    if (!currentActiveUser) return;
    
    const errorWeight = Math.max(0, 1 - (finalErrorRate / 100) * 2);
    const score = Math.round((finalWPM * finalAccuracy / 100) * errorWeight);
    
    const testResult = {
      date: new Date().toISOString(),
      wpm: finalWPM,
      accuracy: finalAccuracy,
      errorRate: finalErrorRate,
      duration: duration,
      score: Math.min(score, 1000)
    };

    const key = `typeRakHistory_${currentActiveUser}`;
    const existingHistory = JSON.parse(localStorage.getItem(key) || '[]');
    existingHistory.push(testResult);
    localStorage.setItem(key, JSON.stringify(existingHistory));
  };

  const applyTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("typeRakTheme", newTheme);
    
    const themeColors = {
      'cosmic-nebula': 'linear-gradient(135deg, #8B5CF6 35%, #3B82F6 65%)',
      'midnight-black': '#000000',
      'cotton-candy-glow': 'linear-gradient(45deg, #74d2f1, #69c8e8)'
    };
    
    document.body.style.background = themeColors[newTheme as keyof typeof themeColors] || themeColors['cosmic-nebula'];
  };

  const getButtonColor = () => {
    switch (theme) {
      case 'midnight-black': return '#ae1ee3';
      case 'cotton-candy-glow': return '#ff1fbc';
      default: return '#21b1ff';
    }
  };

  const switchUser = (username: string) => {
    setCurrentActiveUser(username);
    resetTest();
    setDeleteConfirmState(false);
  };

  const handleDeleteUser = () => {
    if (!deleteConfirmState) {
      setDeleteConfirmState(true);
      setTimeout(() => setDeleteConfirmState(false), 3000);
      return;
    }

    if (currentActiveUser) {
      const updatedUsersList = usersList.filter(user => user !== currentActiveUser);
      setUsersList(updatedUsersList);
      
      localStorage.removeItem(`typeRakHistory_${currentActiveUser}`);
      
      if (updatedUsersList.length > 0) {
        setCurrentActiveUser(updatedUsersList[0]);
      } else {
        setCurrentActiveUser("");
      }
      
      setDeleteConfirmState(false);
      resetTest();
    }
  };

  const handleHistoryClick = () => {
    setShowHistory(true);
    setSideMenuOpen(false);
  };

  const handleContactMe = () => {
    window.open('mailto:rakshanfromprotos@gmail.com?subject=TypeWave%20Contact', '_blank');
    setSideMenuOpen(false);
  };

  const showToast = (message: string) => {
    setToastQueue(prev => [...prev, message]);
  };

  useEffect(() => {
    if (toastQueue.length > 0 && !toastMessage) {
      setToastMessage(toastQueue[0]);
      setToastQueue(prev => prev.slice(1));
    }
  }, [toastQueue, toastMessage]);

  const handleTitleClick = () => {
    if (testActive) return;
    
    const newCount = titleClickCount + 1;
    setTitleClickCount(newCount);
    
    const messages = [
      "Keep clicking !!!",
      "Try again !!!", 
      "Once more ??"
    ];
    
    if (newCount <= 3) {
      showToast(messages[newCount - 1]);
    }
    
    if (newCount >= 4) {
      setShowIntroduction(true);
      setTitleClickCount(0);
    }
  };

  const handleScroll = useCallback(() => {
    if (testActive || showEasterEgg) return;
    
    const newScrollCount = scrollCount + 1;
    setScrollCount(newScrollCount);
    
    const scrollMessages = [
      "Trying something , huh",
      "well its working maybe you should try again",
      "Again please !!!"
    ];
    
    if (newScrollCount <= 3) {
      showToast(scrollMessages[newScrollCount - 1]);
    }
    
    if (newScrollCount >= 4) {
      setShowEasterEgg(true);
      setScrollCount(0);
    }
  }, [testActive, showEasterEgg, scrollCount]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const onScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 100);
    };
    
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timeoutId);
    };
  }, [handleScroll]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (showTestNameMenu || sideMenuOpen || showHistory || showPreview || showIntroduction || showEasterEgg) return;
    
    if (e.ctrlKey && e.key === 'r' && testActive) {
      e.preventDefault();
      addCheatTime();
      showToast("Cheat activated! +30 seconds");
      return;
    }

    if (gameOver) return;

    if (!testActive) {
      if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Space') {
        if (!currentActiveUser) {
          setShowTestNameMenu(true);
          return;
        }
        
        const initialText = generateWords(100);
        renderText(initialText);
        setTestActive(true);
        startTimer(duration);
        showToast("Test started! Good luck!");
        
        setTimeout(() => {
          const textFlowElement = document.getElementById('text-flow');
          if (textFlowElement) textFlowElement.focus();
        }, 100);
      }
      return;
    }

    e.preventDefault();
    playKeyboardSound();

    const currentChar = chars[pos];
    if (!currentChar) return;

    const expectedChar = testText[pos];
    let inputChar = e.key;

    if (e.key === 'Space') inputChar = ' ';

    setActualTypedCount(prev => prev + 1);
    setTypedTextForPreview(prev => prev + inputChar);

    if (inputChar === expectedChar) {
      currentChar.classList.add('correct');
      currentChar.classList.remove('incorrect');
      setCorrectCharacters(prev => prev + 1);
      setWasLastError(false);
    } else {
      if (!wasLastError) {
        setTotalErrors(prev => prev + 1);
        playErrorSound();
      }
      currentChar.classList.add('incorrect');
      currentChar.classList.remove('correct');
      setWasLastError(true);
    }

    const newPos = pos + 1;
    setPos(newPos);

    if (newPos >= testText.length - 50) {
      const extendedText = extendText();
      renderText(extendedText);
    }
  }, [
    pos, chars, testText, testActive, gameOver, wasLastError, currentActiveUser,
    showTestNameMenu, sideMenuOpen, showHistory, showPreview, showIntroduction, showEasterEgg,
    duration, playKeyboardSound, playErrorSound, renderText, generateWords, startTimer, extendText,
    setActualTypedCount, setTypedTextForPreview, setCorrectCharacters, setTotalErrors, 
    setWasLastError, setPos, setTestActive, addCheatTime
  ]);

  useEffect(() => {
    const adjustedElapsed = Math.max(0, elapsed - cheatTimeAdded);
    
    if (testActive && adjustedElapsed >= duration) {
      setTestActive(false);
      setGameOver(true);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      const finalWPM = getCurrentWPM();
      const finalAccuracy = actualTypedCount > 0 ? ((correctCharacters / actualTypedCount) * 100) : 0;
      const finalErrorRate = getCurrentErrorRate();
      
      saveTestResult(finalWPM, finalAccuracy, finalErrorRate);
      
      showToast(`Test completed! WPM: ${finalWPM}, Accuracy: ${finalAccuracy.toFixed(1)}%`);
    }
  }, [elapsed, cheatTimeAdded, duration, testActive, timerRef, getCurrentWPM, actualTypedCount, correctCharacters, getCurrentErrorRate, saveTestResult, setTestActive, setGameOver]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleRestartTest = () => {
    resetTest();
    setTypedTextForPreview("");
    showToast("Test reset! Press any key to start again.");
  };

  const handlePreviewClick = () => {
    setShowPreview(true);
  };

  if (showIntroduction) {
    return <Introduction onComplete={() => setShowIntroduction(false)} />;
  }

  if (showEasterEgg) {
    return <EasterEggPage theme={theme} onBack={() => setShowEasterEgg(false)} />;
  }

  if (showHistory) {
    return <HistoryPage onBack={() => setShowHistory(false)} username={currentActiveUser} theme={theme} />;
  }

  if (showTestNameMenu) {
    return (
      <TestNameMenu
        onSave={(username) => {
          setCurrentActiveUser(username);
          if (!usersList.includes(username)) {
            setUsersList([...usersList, username]);
          }
          setShowTestNameMenu(false);
        }}
        theme={theme}
        currentUsers={usersList}
      />
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      color: theme === 'cotton-candy-glow' ? '#333' : 'white',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        position: 'relative',
        zIndex: 100
      }}>
        <h1 
          onClick={handleTitleClick}
          style={{
            backgroundImage: theme === 'midnight-black' 
              ? 'linear-gradient(90deg, #c559f7 0%, #7f59f7 100%)'
              : theme === 'cotton-candy-glow'
              ? 'linear-gradient(90deg, #ff59e8 0%, #ff52a8 100%)'
              : 'linear-gradient(45deg, #a729f0 0%, #3c95fa 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
            fontSize: '2.5rem',
            fontWeight: 700,
            margin: 0,
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          TypeWave
        </h1>

        <button
          onClick={() => setSideMenuOpen(true)}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            color: 'white',
            padding: '0.75rem',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Settings size={24} />
        </button>
      </div>

      <div style={{ marginTop: '60px' }}>
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '2rem',
          flexWrap: 'wrap'
        }}>
          <StatsDisplay
            elapsed={elapsed}
            correctSigns={correctCharacters}
            totalErrors={totalErrors}
            currentErrorRate={getCurrentErrorRate()}
            theme={theme}
          />

          <button
            onClick={handleRestartTest}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              color: 'white',
              padding: '0.75rem 1.5rem',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <RotateCcw size={18} />
            Restart
          </button>

          <button
            onClick={handlePreviewClick}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              color: 'white',
              padding: '0.75rem 1.5rem',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Eye size={18} />
            Preview
          </button>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '3rem',
          color: theme === 'cotton-candy-glow' ? 'rgba(51, 51, 51, 0.7)' : 'rgba(255, 255, 255, 0.7)',
          fontSize: '0.9rem'
        }}>
          {!testActive && !gameOver && "Press any key to start the test"}
          {testActive && "Keep typing! Use Ctrl+R for cheat code"}
          {gameOver && "Test completed! Check your results above"}
        </div>
      </div>

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

      {showPreview && (
        <TypedTextPreview
          typedText={typedTextForPreview}
          originalText={testText.substring(0, typedTextForPreview.length)}
          theme={theme}
          onClose={() => setShowPreview(false)}
        />
      )}

      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage("")}
        />
      )}

      <style>{`
        body {
          margin: 0;
          padding: 0;
          background: ${theme === 'cosmic-nebula' 
            ? 'linear-gradient(135deg, #8B5CF6 35%, #3B82F6 65%)'
            : theme === 'midnight-black' 
            ? '#000000'
            : 'linear-gradient(45deg, #74d2f1, #69c8e8)'
          };
          min-height: 100vh;
          transition: background 0.3s ease;
        }
        
        .char {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 3px;
          padding: 0 1px;
        }
        
        .char.correct {
          color: ${theme === 'midnight-black' ? '#ae1ee3' : theme === 'cotton-candy-glow' ? '#ff1fbc' : '#21b1ff'};
          background-color: rgba(${theme === 'midnight-black' ? '174, 30, 227' : theme === 'cotton-candy-glow' ? '255, 31, 188' : '33, 177, 255'}, 0.1);
        }
        
        .char.incorrect {
          color: #ff1c14;
          background-color: rgba(255, 28, 20, 0.3);
        }
        
        #text-flow .char:nth-child(${pos + 1}) {
          background-color: rgba(255, 255, 255, 0.3);
          animation: blink 1s infinite;
        }
        
        @keyframes blink {
          0%, 50% { background-color: rgba(255, 255, 255, 0.3); }
          51%, 100% { background-color: transparent; }
        }
      `}</style>
    </div>
  );
}
