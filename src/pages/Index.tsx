
import React, { useState, useEffect, useRef } from 'react';
import { TypingTest } from '../components/TypingTest';
import { StatsDisplay } from '../components/StatsDisplay';
import { SideMenu } from '../components/SideMenu';
import { HistoryPage } from '../components/HistoryPage';
import { AchievementsPage } from '../components/AchievementsPage';
import { EasterEggPage } from '../components/EasterEggPage';
import { Introduction } from '../components/Introduction';
import { AchievementNotification } from '../components/AchievementNotification';
import { Toast } from '../components/Toast';
import { useTypingGame } from '../hooks/useTypingGame';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { useAchievements } from '../hooks/useAchievements';
import { Button } from '../components/ui/button';

export default function Index() {
  const [theme, setTheme] = useLocalStorage('typeRakTheme', 'cosmic-nebula');
  const [username, setUsername] = useLocalStorage('typeRakUsername', '');
  const [fontSize, setFontSize] = useLocalStorage('typeRakFontSize', 20);
  const [cursorStyle, setCursorStyle] = useLocalStorage('typeRakCursorStyle', 'blue');
  const [soundEnabled, setSoundEnabled] = useLocalStorage('typeRakSoundEnabled', true);
  const [musicEnabled, setMusicEnabled] = useLocalStorage('typeRakMusicEnabled', false);
  const [musicVolume, setMusicVolume] = useLocalStorage('typeRakMusicVolume', 50);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showIntro, setShowIntro] = useState(!username);
  const [allTestHistory, setAllTestHistory] = useLocalStorage('typeRakAllHistory', []);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
  const [showToast, setShowToast] = useState(false);
  const [showEasterEggButton, setShowEasterEggButton] = useState(false);
  const [scrollCount, setScrollCount] = useState(0);
  const [cheatUsageCount, setCheatUsageCount] = useLocalStorage('typeRakCheatUsage', 0);
  const [totalVisitDays, setTotalVisitDays] = useLocalStorage('typeRakTotalVisitDays', 0);
  const [firstLoginDate, setFirstLoginDate] = useLocalStorage('typeRakFirstLoginDate', '');
  const [easterEggVisited, setEasterEggVisited] = useState(false);
  const [maxWPM, setMaxWPM] = useState(0);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const { playKeyboardSound, playErrorSound } = useSoundEffects(soundEnabled);
  const { isPlaying, hasMusic } = useBackgroundMusic(musicEnabled, musicVolume);

  const {
    gameOver,
    setGameOver,
    testActive,
    setTestActive,
    text,
    userInput,
    currentIndex,
    wpm,
    accuracy,
    timeLeft,
    gameStarted,
    handleKeyPress,
    handleInputChange,
    startTest,
    endTest,
    currentWordIndex,
    errorPositions,
    resetTest,
    addCheatTime
  } = useTypingGame();

  const {
    achievements,
    recentAchievement,
    checkAchievements,
    closeAchievementNotification,
    getUnlockedCount
  } = useAchievements(username);

  useEffect(() => {
    if (wpm > maxWPM) {
      setMaxWPM(wpm);
    }
  }, [wpm]);

  // Initialize first login date
  useEffect(() => {
    if (!firstLoginDate) {
      const today = new Date().toISOString().split('T')[0];
      setFirstLoginDate(today);
    }
  }, [setFirstLoginDate, firstLoginDate]);

  // Increment total visit days
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastVisit = localStorage.getItem(`lastVisit-${username}`);

    if (lastVisit !== today) {
      setTotalVisitDays(prev => prev + 1);
      localStorage.setItem(`lastVisit-${username}`, today);
    }
  }, [username, setTotalVisitDays]);

  const calculateDaysSinceFirstLogin = () => {
    if (!firstLoginDate) return 0;
    const today = new Date();
    const firstLogin = new Date(firstLoginDate);
    const diffInTime = today.getTime() - firstLogin.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
    return diffInDays;
  };

  const calculateDaysSinceLastVisit = () => {
    const lastVisit = localStorage.getItem(`lastVisit-${username}`);
    if (!lastVisit) return 0;
    const today = new Date();
    const lastVisitDate = new Date(lastVisit);
    const diffInTime = today.getTime() - lastVisitDate.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
    return diffInDays;
  };

  const handleComplete = () => {
    if (gameStarted && !gameOver) {
      const testData = {
        wpm,
        accuracy,
        duration: 60 - timeLeft,
        timestamp: new Date().toISOString(),
        theme,
        username
      };

      setAllTestHistory(prev => [testData, ...prev]);

      // Check achievements
      checkAchievements({
        wpm,
        errorRate: 100 - accuracy,
        duration: 60 - timeLeft,
        testsCompleted: allTestHistory.length + 1,
        perfectTests: accuracy === 100 ? 1 : 0,
        unlockedAchievements: getUnlockedCount(),
        dailyTypingTime: 0,
        dailyStreak: 0,
        cleanSessions: 0,
        daysSinceLastVisit: calculateDaysSinceLastVisit(),
        totalVisitDays,
        daysSinceFirstLogin: calculateDaysSinceFirstLogin(),
        cheatUsage: cheatUsageCount,
        maxWPM
      });

      endTest();
    }
  };

  const handleAchievementsClick = () => {
    setCurrentPage('achievements');
  };

  const handleHistoryClick = () => {
    setCurrentPage('history');
  };

  const handleEasterEggClick = () => {
    setCurrentPage('easter-egg');
    setEasterEggVisited(true);

    // Check for easter egg achievement
    checkAchievements({
      wpm: 0,
      errorRate: 0,
      duration: 0,
      testsCompleted: allTestHistory.length,
      perfectTests: 0,
      unlockedAchievements: getUnlockedCount(),
      dailyTypingTime: 0,
      dailyStreak: 0,
      cleanSessions: 0,
      daysSinceLastVisit: calculateDaysSinceLastVisit(),
      totalVisitDays,
      daysSinceFirstLogin: calculateDaysSinceFirstLogin(),
      cheatUsage: cheatUsageCount,
      easterEggVisited: true,
      maxWPM
    });
  };

  const getThemeClass = () => {
    switch (theme) {
      case 'cosmic-nebula': return 'theme-cosmic-nebula';
      case 'midnight-black': return 'theme-midnight-black';
      case 'cotton-candy-glow': return 'theme-cotton-candy-glow';
      default: return 'theme-cosmic-nebula';
    }
  };

  const getCursorClass = () => {
    switch (cursorStyle) {
      case 'blue': return 'cursor-blue';
      case 'black': return 'cursor-black';
      case 'pink': return 'cursor-pink';
      case 'white': return 'cursor-white';
      default: return 'cursor-blue';
    }
  };

  const getButtonColor = () => {
    switch (theme) {
      case 'cosmic-nebula': return 'rgba(64, 3, 84, 0.5)';
      case 'midnight-black': return 'rgba(139, 92, 246, 0.5)';
      case 'cotton-candy-glow': return 'rgba(18, 207, 243, 0.5)';
      default: return 'rgba(64, 3, 84, 0.5)';
    }
  };

  const showToastMessage = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  // Cheat code handling
  useEffect(() => {
    const handleCheatCode = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === 'Backspace') {
        e.preventDefault();
        if (testActive) {
          addCheatTime();
          const newCount = cheatUsageCount + 1;
          setCheatUsageCount(newCount);
          
          // Check for cheat achievements
          checkAchievements({
            wpm: 0,
            errorRate: 0,
            duration: 0,
            testsCompleted: allTestHistory.length,
            perfectTests: 0,
            unlockedAchievements: getUnlockedCount(),
            dailyTypingTime: 0,
            dailyStreak: 0,
            cleanSessions: 0,
            daysSinceLastVisit: calculateDaysSinceLastVisit(),
            totalVisitDays,
            daysSinceFirstLogin: calculateDaysSinceFirstLogin(),
            cheatUsage: newCount,
            maxWPM
          });
          
          showToastMessage('Cheat activated! +10 seconds', 'info');
        }
      }
    };

    document.addEventListener('keydown', handleCheatCode);
    return () => document.removeEventListener('keydown', handleCheatCode);
  }, [testActive, addCheatTime, cheatUsageCount, setCheatUsageCount, checkAchievements, allTestHistory.length, getUnlockedCount, totalVisitDays, calculateDaysSinceFirstLogin, calculateDaysSinceLastVisit, maxWPM]);

  // Scroll detection for easter egg
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setScrollCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 5) {
            setShowEasterEggButton(true);
            return 0;
          }
          return newCount;
        });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        
        if (scrollTop + clientHeight >= scrollHeight - 10) {
          setScrollCount(prev => {
            const newCount = prev + 1;
            if (newCount >= 5) {
              setShowEasterEggButton(true);
              return 0;
            }
          return newCount;
        });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (currentPage === 'history') {
    return (
      <div className={`min-h-screen ${getThemeClass()} ${getCursorClass()}`}>
        <HistoryPage
          onBack={() => setCurrentPage('dashboard')}
          allTestHistory={allTestHistory}
          theme={theme}
          getButtonColor={getButtonColor}
        />
      </div>
    );
  }

  if (currentPage === 'achievements') {
    return (
      <div className={`min-h-screen ${getThemeClass()} ${getCursorClass()}`}>
        <AchievementsPage
          achievements={achievements}
          onBack={() => setCurrentPage('dashboard')}
          theme={theme}
          getButtonColor={getButtonColor}
        />
      </div>
    );
  }

  if (currentPage === 'easter-egg') {
    return (
      <div className={`min-h-screen ${getThemeClass()} ${getCursorClass()}`}>
        <EasterEggPage
          onGoBack={() => setCurrentPage('dashboard')}
          theme={theme}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${getThemeClass()} ${getCursorClass()}`}>
      <div style={{
        display: 'flex',
        height: '100vh',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        {/* Sidebar */}
        <SideMenu
          sideMenuOpen={sideMenuOpen}
          setSideMenuOpen={setSideMenuOpen}
          usersList={[username].filter(Boolean)}
          currentActiveUser={username}
          switchUser={(user: string) => setUsername(user)}
          handleDeleteUser={() => setUsername('')}
          deleteConfirmState={false}
          duration={60}
          setDuration={() => {}}
          theme={theme}
          applyTheme={setTheme}
          handleHistoryClick={handleHistoryClick}
          handleContactMe={() => {}}
          getButtonColor={getButtonColor}
          fontSize={fontSize}
          setFontSize={setFontSize}
          fontStyle={'inter'}
          setFontStyle={() => {}}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          backgroundMusicEnabled={musicEnabled}
          setBackgroundMusicEnabled={setMusicEnabled}
          musicVolume={musicVolume}
          setMusicVolume={setMusicVolume}
          hasMusic={hasMusic}
        />

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          position: 'relative'
        }}>
          {showIntro ? (
            <Introduction
              onComplete={handleComplete}
            />
          ) : (
            <>
              <TypingTest
                testText={text}
                pos={currentIndex}
                chars={[]}
                theme={theme}
                onKeyDown={handleKeyPress}
                fontSize={fontSize}
                fontStyle={'inter'}
              />

              <StatsDisplay
                wpm={wpm}
                accuracy={accuracy}
                timeLeft={timeLeft}
                errors={errorPositions.length}
                theme={theme}
                onRestart={resetTest}
              />
            </>
          )}

          {/* Easter Egg Button */}
          {showEasterEggButton && (
            <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
              <Button
                onClick={handleEasterEggClick}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px'
                }}
              >
                Unlock Curiosity
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Achievement Notification */}
      {recentAchievement && (
        <AchievementNotification
          achievement={recentAchievement}
          onClose={closeAchievementNotification}
        />
      )}

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
