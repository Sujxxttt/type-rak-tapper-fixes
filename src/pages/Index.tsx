import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TypingTest } from '../components/TypingTest';
import { TestHistory } from '../components/TestHistory';
import { Settings } from '../components/Settings';
import { AchievementsPage } from '../components/AchievementsPage';
import { useKeyPress } from '../hooks/useKeyPress';
import { useTestWords } from '../hooks/useTestWords';
import { calculateWPM, calculateErrorPercentage } from '../utils/helpers';
import { Font } from '../types';
import { useFont } from '../hooks/useFont';
import { useTheme } from '../hooks/useTheme';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { useAchievements } from '../hooks/useAchievements';
import { EasterEggPage } from '../components/EasterEggPage';

interface TestResult {
  wpm: number;
  errorRate: number;
}

const IndexPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<'typing-test' | 'test-history' | 'settings' | 'achievements' | 'easter-egg'>('typing-test');
  const [testLength, setTestLength] = useState<number>(25);
  const [timeedTest, setTimeedTest] = useState<number>(60);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [username, setUsername] = useState<string>('Raktherock');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [musicEnabled, setMusicEnabled] = useState<boolean>(true);
  const [musicVolume, setMusicVolume] = useState<number>(50);
  const [firstVisit, setFirstVisit] = useState<boolean>(true);

  // Add state for curiosity button and tracking
  const [scrollAttempts, setScrollAttempts] = useState(0);
  const [showCuriosityButton, setShowCuriosityButton] = useState(false);
  const [cheatCodeUsed, setCheatCodeUsed] = useState(0);

  const { fontFamily, setFontFamily } = useFont();
  const { theme, setTheme } = useTheme();
  const { isPlaying, hasMusic } = useBackgroundMusic(musicEnabled, musicVolume);
  const { achievements, recentAchievement, checkAchievements, closeAchievementNotification, getUnlockedCount } = useAchievements(username);
  const { words, newTest } = useTestWords(testLength);
  const { typed, resetKeys, cursor, clearTyped, setTime, time, start, setStart, wordCount, errors, resetWordCount, resetErrors } = useKeyPress(words);

  useEffect(() => {
    const storedUsername = localStorage.getItem('typeRakUsername');
    if (storedUsername) {
      setUsername(storedUsername);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    const visited = localStorage.getItem('typeRakVisited');
    if (!visited) {
      setFirstVisit(true);
      localStorage.setItem('typeRakVisited', 'true');
    } else {
      setFirstVisit(false);
    }

    const storedTheme = localStorage.getItem('typeRakTheme') || 'cosmic-nebula';
    setTheme(storedTheme);

    const storedFont = localStorage.getItem('typeRakFont') || 'Roboto Mono';
    setFontFamily(storedFont as Font);

    const storedMusicEnabled = localStorage.getItem('typeRakMusicEnabled') === 'true';
    setMusicEnabled(storedMusicEnabled);

    const storedMusicVolume = localStorage.getItem('typeRakMusicVolume');
    if (storedMusicVolume) {
      setMusicVolume(parseInt(storedMusicVolume, 10));
    }
  }, [setFontFamily, setTheme]);

  useEffect(() => {
    if (time === 0 && start) {
      setStart(false);
      const wpm = calculateWPM(wordCount, time);
      const errorRate = calculateErrorPercentage(errors, typed);
      handleTestComplete(wpm, errorRate, time, errors);
    }
  }, [time, start, wordCount, errors, typed]);

  useEffect(() => {
    if (currentView === 'typing-test') {
      newTest();
      resetKeys();
      clearTyped();
      setTime(timeedTest);
      setStart(false);
      resetWordCount();
      resetErrors();
    }
  }, [currentView, newTest, resetKeys, clearTyped, setTime, timeedTest, resetWordCount, resetErrors]);

  const handleTestComplete = useCallback((wpm: number, errorRate: number, duration: number, errors: number) => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    const newTestResult = { wpm, errorRate };
    setTestHistory(prevHistory => [newTestResult, ...prevHistory]);

    localStorage.setItem('testHistory', JSON.stringify([newTestResult, ...testHistory]));

    checkAchievements({
      wpm,
      errorRate,
      duration,
      testsCompleted: testHistory.length + 1,
      perfectTests: testHistory.filter(t => t.errorRate === 0).length,
      unlockedAchievements: getUnlockedCount(),
      dailyTypingTime: 0,
      dailyStreak: 0,
      cleanSessions: 0,
      daysSinceLastVisit: 0,
      totalVisitedDays: 0,
      daysSinceFirstLogin: 0,
      cheatCodeUsed,
      maxWpmEver: Math.max(...testHistory.map(t => t.wpm), wpm),
      easterEggVisited: false
    });
  }, [testHistory, checkAchievements, getUnlockedCount, cheatCodeUsed]);

  const handleSettingsChange = (newSettings: { theme: string; fontFamily: Font }) => {
    setTheme(newSettings.theme);
    setFontFamily(newSettings.fontFamily);
    localStorage.setItem('typeRakTheme', newSettings.theme);
    localStorage.setItem('typeRakFont', newSettings.fontFamily);
  };

  const handleMusicToggle = () => {
    setMusicEnabled(prev => !prev);
    localStorage.setItem('typeRakMusicEnabled', (!musicEnabled).toString());
  };

  const handleVolumeChange = (newVolume: number) => {
    setMusicVolume(newVolume);
    localStorage.setItem('typeRakMusicVolume', newVolume.toString());
  };

  const handleUsernameChange = (newUsername: string) => {
    setUsername(newUsername);
    localStorage.setItem('typeRakUsername', newUsername);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const getButtonColor = () => {
    if (theme === 'cosmic-nebula') {
      return 'rgba(177, 9, 214, 0.6)';
    } else if (theme === 'midnight-black') {
      return 'rgba(197, 89, 247, 0.6)';
    } else if (theme === 'cotton-candy-glow') {
      return 'rgba(255, 92, 168, 0.6)';
    } else {
      return 'rgba(177, 9, 214, 0.6)';
    }
  };

  // Add cheat code effect
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.altKey && event.key === 'Backspace') {
        event.preventDefault();
        setCheatCodeUsed(prev => prev + 1);
        // Skip current test or complete it instantly
        if (currentView === 'typing-test') {
          // End the test immediately
          const testStats = {
            wpm: Math.floor(Math.random() * 50) + 30,
            errorRate: Math.floor(Math.random() * 5),
            duration: 60,
            errors: 0
          };
          
          handleTestComplete(testStats.wpm, testStats.errorRate, testStats.duration, testStats.errors);
          
          // Check for cheat code achievements
          checkAchievements({
            wpm: testStats.wpm,
            errorRate: testStats.errorRate,
            duration: testStats.duration,
            testsCompleted: testHistory.length + 1,
            perfectTests: testHistory.filter(t => t.errorRate === 0).length,
            unlockedAchievements: getUnlockedCount(),
            dailyTypingTime: 0,
            dailyStreak: 0,
            cleanSessions: 0,
            daysSinceLastVisit: 0,
            totalVisitedDays: 0,
            daysSinceFirstLogin: 0,
            cheatCodeUsed: cheatCodeUsed + 1,
            maxWpmEver: Math.max(...testHistory.map(t => t.wpm), testStats.wpm),
            easterEggVisited: false
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, testHistory, cheatCodeUsed, handleTestComplete, checkAchievements, getUnlockedCount]);

  // Add scroll detection for curiosity button
  useEffect(() => {
    const handleScroll = () => {
      const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
      if (isAtBottom && !showCuriosityButton) {
        setScrollAttempts(prev => {
          const newCount = prev + 1;
          if (newCount >= 5) {
            setShowCuriosityButton(true);
          }
          return newCount;
        });
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown' && !showCuriosityButton) {
        const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
        if (isAtBottom) {
          setScrollAttempts(prev => {
            const newCount = prev + 1;
            if (newCount >= 5) {
              setShowCuriosityButton(true);
            }
            return newCount;
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showCuriosityButton]);

const handleCuriosityClick = () => {
  // Mark easter egg as visited
  checkAchievements({
    wpm: 0,
    errorRate: 0,
    duration: 0,
    testsCompleted: testHistory.length,
    perfectTests: testHistory.filter(t => t.errorRate === 0).length,
    unlockedAchievements: getUnlockedCount(),
    dailyTypingTime: 0,
    dailyStreak: 0,
    cleanSessions: 0,
    daysSinceLastVisit: 0,
    totalVisitedDays: 0,
    daysSinceFirstLogin: 0,
    cheatCodeUsed,
    maxWpmEver: Math.max(...testHistory.map(t => t.wpm), 0),
    easterEggVisited: true
  });
  
  setCurrentView('easter-egg');
};

  const getFontFamily = () => {
    return fontFamily;
  };

  return (
    <div 
      className={`min-h-screen transition-all duration-300 ${
        theme === 'cosmic-nebula' ? 'theme-cosmic-nebula cursor-blue' :
        theme === 'midnight-black' ? 'theme-midnight-black cursor-white' :
        theme === 'cotton-candy-glow' ? 'theme-cotton-candy-glow cursor-pink' :
        'cursor-black'
      }`}
      style={{
        fontFamily: getFontFamily(),
        transition: 'background 0.3s ease-in-out'
      }}
    >
      <Sidebar
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        currentView={currentView}
        setCurrentView={setCurrentView}
        username={username}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        getButtonColor={getButtonColor}
      />

      <div
        className="main-content"
        style={{
          marginLeft: showSidebar ? '250px' : '0',
          padding: '20px',
          transition: 'margin-left 0.3s ease',
        }}
      >
        {currentView === 'typing-test' && (
          <TypingTest
            words={words}
            typed={typed}
            cursor={cursor}
            start={start}
            setStart={setStart}
            time={time}
            setTime={setTime}
            wordCount={wordCount}
            errors={errors}
            newTest={newTest}
            resetKeys={resetKeys}
            clearTyped={clearTyped}
            showConfetti={showConfetti}
            theme={theme}
            getButtonColor={getButtonColor}
          />
        )}

        {currentView === 'test-history' && (
          <TestHistory
            testHistory={testHistory}
            theme={theme}
            getButtonColor={getButtonColor}
          />
        )}

        {currentView === 'settings' && (
          <Settings
            theme={theme}
            fontFamily={fontFamily}
            onSettingsChange={handleSettingsChange}
            musicEnabled={musicEnabled}
            onMusicToggle={handleMusicToggle}
            musicVolume={musicVolume}
            onVolumeChange={handleVolumeChange}
            username={username}
            onUsernameChange={handleUsernameChange}
            isLoggedIn={isLoggedIn}
            onLogin={handleLogin}
            onLogout={handleLogout}
            getButtonColor={getButtonColor}
            hasMusic={hasMusic}
            isPlaying={isPlaying}
          />
        )}

        {currentView === 'achievements' && (
          <AchievementsPage
            achievements={achievements}
            onBack={() => setCurrentView('typing-test')}
            theme={theme}
            getButtonColor={getButtonColor}
            username={username}
          />
        )}

        {currentView === 'easter-egg' && (
          <EasterEggPage
            theme={theme}
            onGoBack={() => setCurrentView('typing-test')}
          />
        )}
      </div>

      {/* Curiosity Button */}
      {showCuriosityButton && currentView === 'typing-test' && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000
        }}>
          <button
            onClick={handleCuriosityClick}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '10px 20px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              opacity: '0.7 !important'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            Unlock Curiosity
          </button>
        </div>
      )}
    </div>
  );
};

export default IndexPage;
