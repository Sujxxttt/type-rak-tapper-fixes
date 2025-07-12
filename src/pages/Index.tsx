
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Settings, Trophy, History, Volume2 } from 'lucide-react';
import { useTypingGame } from '../hooks/useTypingGame';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { useAchievements } from '../hooks/useAchievements';
import { TypingTest } from '../components/TypingTest';
import { StatsDisplay } from '../components/StatsDisplay';
import { SideMenu } from '../components/SideMenu';
import { Introduction } from '../components/Introduction';
import { HistoryPage } from '../components/HistoryPage';
import { AchievementsPage } from '../components/AchievementsPage';
import { EasterEggPage } from '../components/EasterEggPage';
import { MusicUploadPage } from '../components/MusicUploadPage';
import { AchievementNotification } from '../components/AchievementNotification';
import { Toast } from '../components/Toast';

const Index = () => {
  // State declarations and initial setup
  const [currentPage, setCurrentPage] = useState<'main' | 'history' | 'achievements' | 'easter-egg' | 'music-upload'>('main');
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [currentActiveUser, setCurrentActiveUser] = useState('');
  const [usersList] = useLocalStorage('typeRakUsers', ['Guest']);
  const [deleteConfirmState, setDeleteConfirmState] = useState(false);
  const [duration, setDuration] = useLocalStorage('typeRakDuration', 60);
  const [theme, setTheme] = useLocalStorage('typeRakTheme', 'cosmic-nebula');
  const [fontSize, setFontSize] = useLocalStorage('typeRakFontSize', 100);
  const [fontStyle, setFontStyle] = useLocalStorage('typeRakFontStyle', 'inter');
  const [soundEnabled, setSoundEnabled] = useLocalStorage('typeRakSounds', true);
  const [backgroundMusicEnabled, setBackgroundMusicEnabled] = useLocalStorage('typeRakBackgroundMusic', false);
  const [musicVolume, setMusicVolume] = useLocalStorage('typeRakMusicVolume', 50);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; show: boolean } | null>(null);
  const [cheatUsageCount, setCheatUsageCount] = useLocalStorage('typeRakCheatUsage', 0);
  const [easterEggVisited, setEasterEggVisited] = useLocalStorage('typeRakEasterEggVisited', false);
  const [downArrowCount, setDownArrowCount] = useState(0);
  const [showUnlockCuriosity, setShowUnlockCuriosity] = useState(false);
  const downArrowTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { achievements, recentAchievement, checkAchievements, closeAchievementNotification, getUnlockedCount } = useAchievements(currentActiveUser);
  const { hasMusic } = useBackgroundMusic(backgroundMusicEnabled, musicVolume);
  const { playKeyboardSound, playErrorSound } = useSoundEffects(soundEnabled);

  const {
    text,
    userInput,
    currentIndex,
    wpm,
    accuracy,
    timeLeft,
    gameStarted,
    gameOver,
    testActive,
    resetTest,
    handleKeyPress,
    handleInputChange,
    startTest,
    endTest,
    currentWordIndex,
    errorPositions
  } = useTypingGame({
    duration,
    onComplete: () => {
      // Check achievements when test completes
      const stats = {
        wpm,
        errorRate: 100 - accuracy,
        duration,
        testsCompleted: parseInt(localStorage.getItem(`typeRakTestsCompleted-${currentActiveUser}`) || '0') + 1,
        perfectTests: accuracy === 100 ? parseInt(localStorage.getItem(`typeRakPerfectTests-${currentActiveUser}`) || '0') + 1 : parseInt(localStorage.getItem(`typeRakPerfectTests-${currentActiveUser}`) || '0'),
        unlockedAchievements: getUnlockedCount(),
        dailyTypingTime: parseInt(localStorage.getItem(`typeRakDailyTime-${new Date().toDateString()}`) || '0') + (duration / 60),
        dailyStreak: parseInt(localStorage.getItem(`typeRakDailyStreak-${currentActiveUser}`) || '0'),
        daysSinceLastVisit: 0,
        totalVisitDays: parseInt(localStorage.getItem(`typeRakTotalVisitDays-${currentActiveUser}`) || '0'),
        daysSinceFirstLogin: Math.floor((Date.now() - parseInt(localStorage.getItem(`typeRakFirstLogin-${currentActiveUser}`) || Date.now().toString())) / (1000 * 60 * 60 * 24)),
        cheatUsageCount,
        easterEggVisited
      };
      
      // Update localStorage
      localStorage.setItem(`typeRakTestsCompleted-${currentActiveUser}`, stats.testsCompleted.toString());
      if (accuracy === 100) {
        localStorage.setItem(`typeRakPerfectTests-${currentActiveUser}`, stats.perfectTests.toString());
      }
      localStorage.setItem(`typeRakDailyTime-${new Date().toDateString()}`, stats.dailyTypingTime.toString());
      
      checkAchievements(stats);
    }
  });

  // Apply theme on mount and when theme changes
  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  // Set initial user
  useEffect(() => {
    if (usersList.length > 0 && !currentActiveUser) {
      setCurrentActiveUser(usersList[0]);
    }
  }, [usersList, currentActiveUser]);

  // Cheat code detection (Ctrl+Alt+Backspace)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === 'Backspace') {
        e.preventDefault();
        if (testActive) {
          endTest();
          setCheatUsageCount(prev => prev + 1);
          
          // Check cheat achievements
          const stats = {
            wpm: 0,
            errorRate: 0,
            duration: 0,
            testsCompleted: 0,
            perfectTests: 0,
            unlockedAchievements: getUnlockedCount(),
            dailyTypingTime: 0,
            dailyStreak: 0,
            daysSinceLastVisit: 0,
            totalVisitDays: 0,
            daysSinceFirstLogin: 0,
            cheatUsageCount: cheatUsageCount + 1,
            easterEggVisited
          };
          checkAchievements(stats);
          
          setToast({
            message: 'Test skipped using cheat code!',
            type: 'info',
            show: true
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [testActive, endTest, cheatUsageCount, setCheatUsageCount, getUnlockedCount, checkAchievements, easterEggVisited]);

  // Down arrow detection for easter egg
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && !testActive && currentPage === 'main') {
        e.preventDefault();
        setDownArrowCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 5 && !showUnlockCuriosity) {
            setShowUnlockCuriosity(true);
          }
          return newCount;
        });

        // Reset counter after 2 seconds of no activity
        if (downArrowTimeoutRef.current) {
          clearTimeout(downArrowTimeoutRef.current);
        }
        downArrowTimeoutRef.current = setTimeout(() => {
          setDownArrowCount(0);
        }, 2000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (downArrowTimeoutRef.current) {
        clearTimeout(downArrowTimeoutRef.current);
      }
    };
  }, [testActive, currentPage, showUnlockCuriosity]);

  const switchUser = useCallback((username: string) => {
    setCurrentActiveUser(username);
    resetTest();
  }, [resetTest]);

  const handleDeleteUser = useCallback(() => {
    if (!deleteConfirmState) {
      setDeleteConfirmState(true);
      setTimeout(() => setDeleteConfirmState(false), 3000);
    } else {
      // Delete user logic would go here
      setToast({
        message: `User ${currentActiveUser} deleted successfully!`,
        type: 'success',
        show: true
      });
      setDeleteConfirmState(false);
    }
  }, [deleteConfirmState, currentActiveUser]);

  const applyTheme = useCallback((newTheme: string) => {
    setTheme(newTheme);
  }, [setTheme]);

  const getButtonColor = useCallback(() => {
    switch (theme) {
      case 'cosmic-nebula':
        return 'rgba(64, 3, 84, 0.8)';
      case 'midnight-black':
        return 'rgba(99, 89, 247, 0.8)';
      case 'cotton-candy-glow':
        return 'rgba(18, 207, 243, 0.8)';
      default:
        return 'rgba(64, 3, 84, 0.8)';
    }
  }, [theme]);

  const handleHistoryClick = useCallback(() => {
    setCurrentPage('history');
    setSideMenuOpen(false);
  }, []);

  const handleContactMe = useCallback(() => {
    window.open('mailto:contact@typerak.com', '_blank');
    setSideMenuOpen(false);
  }, []);

  const handleAchievementsClick = useCallback(() => {
    setCurrentPage('achievements');
  }, []);

  const handleEasterEggClick = useCallback(() => {
    if (!easterEggVisited) {
      setEasterEggVisited(true);
      const stats = {
        wpm: 0,
        errorRate: 0,
        duration: 0,
        testsCompleted: 0,
        perfectTests: 0,
        unlockedAchievements: getUnlockedCount(),
        dailyTypingTime: 0,
        dailyStreak: 0,
        daysSinceLastVisit: 0,
        totalVisitDays: 0,
        daysSinceFirstLogin: 0,
        cheatUsageCount,
        easterEggVisited: true
      };
      checkAchievements(stats);
    }
    setCurrentPage('easter-egg');
    setShowUnlockCuriosity(false);
    setDownArrowCount(0);
  }, [easterEggVisited, setEasterEggVisited, getUnlockedCount, cheatUsageCount, checkAchievements]);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  const onComplete = useCallback(() => {
    startTest();
  }, [startTest]);

  if (currentPage === 'history') {
    return <HistoryPage onBack={() => setCurrentPage('main')} />;
  }

  if (currentPage === 'achievements') {
    return (
      <AchievementsPage
        achievements={achievements}
        onBack={() => setCurrentPage('main')}
        theme={theme}
        getButtonColor={getButtonColor}
      />
    );
  }

  if (currentPage === 'easter-egg') {
    return <EasterEggPage theme={theme} onGoBack={() => setCurrentPage('main')} />;
  }

  if (currentPage === 'music-upload') {
    return <MusicUploadPage onBack={() => setCurrentPage('main')} />;
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      position: 'relative',
      fontFamily: fontStyle === 'roboto' ? "'Roboto', sans-serif" :
                  fontStyle === 'open-sans' ? "'Open Sans', sans-serif" :
                  fontStyle === 'lato' ? "'Lato', sans-serif" :
                  fontStyle === 'source-sans-pro' ? "'Source Sans Pro', sans-serif" :
                  fontStyle === 'dancing-script' ? "'Dancing Script', cursive" :
                  fontStyle === 'pacifico' ? "'Pacifico', cursive" :
                  "'Inter', sans-serif"
    }}>
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        gap: '10px',
        zIndex: 100
      }}>
        <button
          onClick={handleAchievementsClick}
          className="main-button"
          style={{
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Trophy size={20} />
        </button>
        <button
          onClick={() => setSideMenuOpen(true)}
          className="main-button"
          style={{
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Settings size={20} />
        </button>
      </div>

      <div style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: `${2.5 * (fontSize / 100)}rem`,
            fontWeight: 'bold',
            margin: 0,
            backgroundImage: theme === 'midnight-black' ? 
              'linear-gradient(90deg, #c559f7 0%, #7f59f7 100%)' :
              theme === 'cotton-candy-glow' ?
              'linear-gradient(90deg, #fc03df 0%, #ff3be8 100%)' :
              'linear-gradient(45deg, #b109d6 0%, #0c6dc2 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            TypeRak
          </h1>
          <p style={{
            fontSize: `${1.2 * (fontSize / 100)}rem`,
            opacity: 0.8,
            margin: '0.5rem 0 0 0'
          }}>
            Master the Art of Speed Typing
          </p>
        </div>

        {!gameStarted ? (
          <Introduction
            onComplete={onComplete}
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
              fontStyle={fontStyle}
            />
            
            <StatsDisplay
              elapsed={duration - timeLeft}
              correctSigns={currentIndex}
              totalErrors={errorPositions.size}
              currentErrorRate={((errorPositions.size / Math.max(currentIndex, 1)) * 100)}
              theme={theme}
            />
          </>
        )}
      </div>

      {/* Unlock Curiosity Button */}
      {showUnlockCuriosity && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100
        }}>
          <button
            onClick={handleEasterEggClick}
            className="glass-button"
          >
            Unlock Curiosity
          </button>
        </div>
      )}

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
        backgroundMusicEnabled={backgroundMusicEnabled}
        setBackgroundMusicEnabled={setBackgroundMusicEnabled}
        musicVolume={musicVolume}
        setMusicVolume={setMusicVolume}
        hasMusic={hasMusic}
        onMusicUploadClick={() => setCurrentPage('music-upload')}
      />

      {recentAchievement && (
        <AchievementNotification
          achievement={recentAchievement}
          onClose={closeAchievementNotification}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          onClose={closeToast}
        />
      )}
    </div>
  );
};

export default Index;
