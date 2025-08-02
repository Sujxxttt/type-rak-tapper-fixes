
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import { TypingTest } from '../components/TypingTest';
import { StatsDisplay } from '../components/StatsDisplay';
import { SideMenu } from '../components/SideMenu';
import { Introduction } from '../components/Introduction';
import { AchievementsPage } from '../components/AchievementsPage';
import { HistoryPage } from '../components/HistoryPage';
import { EasterEggPage } from '../components/EasterEggPage';
import { AchievementNotification } from '../components/AchievementNotification';
import { useAchievements, AchievementStats } from '../hooks/useAchievements';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { MusicPlayer } from '../components/MusicPlayer';

const TYPING_DURATIONS = [15, 30, 60, 120];

const Index = () => {
  const [cookies, setCookie] = useCookies([
    'theme', 'username', 'musicEnabled', 'musicVolume', 'firstTime', 
    'testsCompleted', 'totalVisitedDays', 'daysSinceFirstLogin', 'firstTimeEasterEgg'
  ]);

  const [theme, setTheme] = useState<string>(cookies.theme || 'cosmic-nebula');
  const [username, setUsername] = useState<string>(cookies.username || '');
  const [musicEnabled, setMusicEnabled] = useState<boolean>(cookies.musicEnabled !== false);
  const [musicVolume, setMusicVolume] = useState<number>(cookies.musicVolume || 50);
  const [showIntro, setShowIntro] = useState<boolean>(cookies.firstTime !== false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<string>('typing');
  const [showAchievements, setShowAchievements] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showEasterEgg, setShowEasterEgg] = useState<boolean>(false);
  const [currentDuration, setCurrentDuration] = useState<number>(TYPING_DURATIONS[1]);
  const [showUnlockCuriosity, setShowUnlockCuriosity] = useState<boolean>(false);
  const [scrollCount, setScrollCount] = useState<number>(0);
  const [fontSize, setFontSize] = useState<number>(100);
  const [fontStyle, setFontStyle] = useState<string>('inter');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [deleteConfirmState, setDeleteConfirmState] = useState<boolean>(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { isPlaying, hasMusic } = useBackgroundMusic(musicEnabled, musicVolume);
  const { playKeyboardSound, playErrorSound } = useSoundEffects();

  // Get today's date for tracking
  const today = new Date().toDateString();
  const [lastVisitDate, setLastVisitDate] = useState<string>(localStorage.getItem(`lastVisitDate-${username}`) || '');
  const [totalVisitedDays, setTotalVisitedDays] = useState<number>(parseInt(localStorage.getItem(`totalVisitedDays-${username}`) || '0'));
  const [firstLoginDate, setFirstLoginDate] = useState<string>(localStorage.getItem(`firstLoginDate-${username}`) || '');
  const [dailyTypingTime, setDailyTypingTime] = useState<number>(parseInt(localStorage.getItem(`dailyTypingTime-${username}-${today}`) || '0'));
  const [dailyStreak, setDailyStreak] = useState<number>(parseInt(localStorage.getItem(`dailyStreak-${username}`) || '0'));
  const [cheatUsageCount, setCheatUsageCount] = useState<number>(parseInt(localStorage.getItem(`cheatUsageCount-${username}`) || '0'));

  // Mock users list - you may want to implement proper user management
  const [usersList, setUsersList] = useState<string[]>([username].filter(Boolean));

  const {
    achievements,
    recentAchievement,
    checkAchievements,
    closeAchievementNotification,
    getUnlockedCount
  } = useAchievements(username);

  // Track daily visits and streaks
  useEffect(() => {
    if (username && lastVisitDate !== today) {
      // Update total visited days
      const newTotalDays = totalVisitedDays + 1;
      setTotalVisitedDays(newTotalDays);
      localStorage.setItem(`totalVisitedDays-${username}`, newTotalDays.toString());
      
      // Set first login date if not set
      if (!firstLoginDate) {
        setFirstLoginDate(today);
        localStorage.setItem(`firstLoginDate-${username}`, today);
      }
      
      // Update last visit date
      setLastVisitDate(today);
      localStorage.setItem(`lastVisitDate-${username}`, today);
      
      // Calculate streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toDateString();
      
      if (lastVisitDate === yesterdayString) {
        const newStreak = dailyStreak + 1;
        setDailyStreak(newStreak);
        localStorage.setItem(`dailyStreak-${username}`, newStreak.toString());
      } else if (lastVisitDate !== '') {
        // Streak broken
        setDailyStreak(1);
        localStorage.setItem(`dailyStreak-${username}`, '1');
      } else {
        // First visit
        setDailyStreak(1);
        localStorage.setItem(`dailyStreak-${username}`, '1');
      }
    }
  }, [username]);

  // Update users list when username changes
  useEffect(() => {
    if (username && !usersList.includes(username)) {
      setUsersList(prev => [...prev, username]);
    }
  }, [username]);

  // Track daily typing time
  const addTypingTime = useCallback((minutes: number) => {
    const newTime = dailyTypingTime + minutes;
    setDailyTypingTime(newTime);
    localStorage.setItem(`dailyTypingTime-${username}-${today}`, newTime.toString());
  }, [dailyTypingTime, username, today]);

  // Reset daily typing time at midnight
  useEffect(() => {
    const resetDailyTime = () => {
      setDailyTypingTime(0);
      localStorage.removeItem(`dailyTypingTime-${username}-${today}`);
    };
    
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    const timeout = setTimeout(resetDailyTime, msUntilMidnight);
    
    return () => clearTimeout(timeout);
  }, [username, today]);

  const testsCompleted = parseInt(cookies.testsCompleted || '0');

  const setTestsCompleted = (count: number) => {
    setCookie('testsCompleted', count.toString(), { path: '/' });
  };

  useEffect(() => {
    if (cookies.theme) {
      setTheme(cookies.theme);
    }
    if (cookies.username) {
      setUsername(cookies.username);
    }
    if (cookies.musicEnabled !== undefined) {
      setMusicEnabled(cookies.musicEnabled !== 'false');
    }
      if (cookies.musicVolume) {
          setMusicVolume(parseInt(cookies.musicVolume));
      }
  }, [cookies.theme, cookies.username, cookies.musicEnabled, cookies.musicVolume]);

  useEffect(() => {
    setCookie('theme', theme, { path: '/' });
    setCookie('username', username, { path: '/' });
    setCookie('musicEnabled', musicEnabled, { path: '/' });
    setCookie('musicVolume', musicVolume, { path: '/' });
    setCookie('testsCompleted', testsCompleted.toString(), { path: '/' });
  }, [theme, username, musicEnabled, musicVolume, testsCompleted, setCookie]);

  useEffect(() => {
    document.body.className = `theme-${theme}`;
    
    // Apply cursor theme
    const cursorClass = theme === 'cosmic-nebula' ? 'cursor-blue' : 
                       theme === 'midnight-black' ? 'cursor-white' : 
                       'cursor-pink';
    document.body.classList.add(cursorClass);
    
    return () => {
      document.body.classList.remove('cursor-blue', 'cursor-white', 'cursor-pink', 'cursor-black');
    };
  }, [theme]);

  // Cheat code detection
  useEffect(() => {
    const handleCheatCode = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.altKey && event.key === 'Backspace') {
        event.preventDefault();
        const newCount = cheatUsageCount + 1;
        setCheatUsageCount(newCount);
        localStorage.setItem(`cheatUsageCount-${username}`, newCount.toString());
        
        // Add 30 seconds to current test if typing test is active
        const typingTestElement = document.querySelector('[data-testid="typing-test"]');
        if (typingTestElement) {
          const event = new CustomEvent('addCheatTime');
          typingTestElement.dispatchEvent(event);
        }
        
        // Check cheat achievements
        checkCheatAchievements(newCount);
      }
    };

    document.addEventListener('keydown', handleCheatCode);
    return () => document.removeEventListener('keydown', handleCheatCode);
  }, [cheatUsageCount, username]);

  const checkCheatAchievements = (count: number) => {
    const stats: AchievementStats = {
      wpm: 0,
      errorRate: 0,
      duration: 0,
      testsCompleted,
      perfectTests: 0,
      unlockedAchievements: getUnlockedCount(),
      dailyTypingTime,
      dailyStreak,
      cleanSessions: 0,
      daysSinceLastVisit: 0,
      cheatUsageCount: count
    };
    checkAchievements(stats);
  };

  // Scroll detection for easter egg
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      
      if (isAtBottom) {
        setScrollCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 5) {
            setShowUnlockCuriosity(true);
            return 0;
          }
          return newCount;
        });
      }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        const container = containerRef.current;
        if (!container) return;
        
        const { scrollTop, scrollHeight, clientHeight } = container;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
        
        if (isAtBottom) {
          setScrollCount(prev => {
            const newCount = prev + 1;
            if (newCount >= 5) {
              setShowUnlockCuriosity(true);
              return 0;
            }
            return newCount;
          });
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const handleUnlockCuriosity = () => {
    setShowUnlockCuriosity(false);
    setScrollCount(0);
    
    // Check easter egg achievement
    if (!cookies.firstTimeEasterEgg) {
      setCookie('firstTimeEasterEgg', 'true', { path: '/' });
      const stats: AchievementStats = {
        wpm: 0,
        errorRate: 0,
        duration: 0,
        testsCompleted,
        perfectTests: 0,
        unlockedAchievements: getUnlockedCount(),
        dailyTypingTime,
        dailyStreak,
        cleanSessions: 0,
        daysSinceLastVisit: 0,
        firstTimeEasterEgg: true
      };
      checkAchievements(stats);
    }
    
    setShowEasterEgg(true);
  };

  const getButtonColor = () => {
    switch (theme) {
      case 'midnight-black':
        return 'rgba(197, 89, 247, 0.21)'; // 30% more transparent
      case 'cotton-candy-glow':
        return 'rgba(252, 3, 223, 0.21)'; // 30% more transparent
      default:
        return 'rgba(177, 9, 214, 0.21)'; // 30% more transparent
    }
  };

  const handleTestComplete = (stats: { wpm: number; errorRate: number; duration: number; perfectTest: boolean }) => {
    const newTestCount = testsCompleted + 1;
    setTestsCompleted(newTestCount);
    
    // Add typing time
    addTypingTime(stats.duration);
    
    // Calculate days since first login
    const daysSinceFirstLogin = firstLoginDate ? 
      Math.floor((new Date().getTime() - new Date(firstLoginDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    
    const achievementStats: AchievementStats = {
      wpm: stats.wpm,
      errorRate: stats.errorRate,
      duration: stats.duration,
      testsCompleted: newTestCount,
      perfectTests: stats.perfectTest ? 1 : 0,
      unlockedAchievements: getUnlockedCount(),
      dailyTypingTime,
      dailyStreak,
      cleanSessions: 0,
      daysSinceLastVisit: 0,
      daysSinceFirstLogin,
      totalVisitedDays
    };
    
    checkAchievements(achievementStats);
    playKeyboardSound();
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
    setCookie('firstTime', 'false', { path: '/' });
  };

  const switchUser = (newUsername: string) => {
    setUsername(newUsername);
  };

  const handleDeleteUser = () => {
    if (!deleteConfirmState) {
      setDeleteConfirmState(true);
      setTimeout(() => setDeleteConfirmState(false), 3000);
    } else {
      // Actually delete the user
      setUsersList(prev => prev.filter(u => u !== username));
      if (usersList.length > 1) {
        const remainingUsers = usersList.filter(u => u !== username);
        setUsername(remainingUsers[0]);
      } else {
        setUsername('');
      }
      setDeleteConfirmState(false);
    }
  };

  const applyTheme = (newTheme: string) => {
    setTheme(newTheme);
  };

  const handleContactMe = () => {
    // Implement contact functionality
    window.open('mailto:contact@example.com', '_blank');
  };

  if (showEasterEgg) {
    return <EasterEggPage theme={theme} onGoBack={() => setShowEasterEgg(false)} />;
  }

  if (showIntro) {
    return (
      <Introduction
        onComplete={handleIntroComplete}
        theme={theme}
      />
    );
  }

  if (showAchievements) {
    return (
      <AchievementsPage
        achievements={achievements}
        onBack={() => setShowAchievements(false)}
        theme={theme}
        getButtonColor={getButtonColor}
        username={username}
        testsCompleted={testsCompleted}
        totalVisitedDays={totalVisitedDays}
        dailyStreak={dailyStreak}
        daysSinceFirstLogin={firstLoginDate ? Math.floor((new Date().getTime() - new Date(firstLoginDate).getTime()) / (1000 * 60 * 60 * 24)) : 0}
        dailyTypingTime={dailyTypingTime}
        cheatUsageCount={cheatUsageCount}
      />
    );
  }

  if (showHistory) {
    return <HistoryPage 
      onBack={() => setShowHistory(false)} 
      allTestHistory={[]}
      theme={theme}
      getButtonColor={getButtonColor}
    />;
  }

  return (
    <div 
      ref={containerRef}
      style={{
        minHeight: '100vh',
        padding: '20px',
        color: 'white',
        overflow: 'auto'
      }}
    >
      <SideMenu
        sideMenuOpen={showMenu}
        setSideMenuOpen={setShowMenu}
        usersList={usersList}
        currentActiveUser={username}
        switchUser={switchUser}
        handleDeleteUser={handleDeleteUser}
        deleteConfirmState={deleteConfirmState}
        duration={currentDuration}
        setDuration={setCurrentDuration}
        theme={theme}
        applyTheme={applyTheme}
        handleHistoryClick={() => setShowHistory(true)}
        handleContactMe={handleContactMe}
        getButtonColor={getButtonColor}
        fontSize={fontSize}
        setFontSize={setFontSize}
        fontStyle={fontStyle}
        setFontStyle={setFontStyle}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        backgroundMusicEnabled={musicEnabled}
        setBackgroundMusicEnabled={setMusicEnabled}
        musicVolume={musicVolume}
        setMusicVolume={setMusicVolume}
        hasMusic={hasMusic}
        username={username}
        setUsername={setUsername}
        musicEnabled={musicEnabled}
        setMusicEnabled={setMusicEnabled}
        onAchievementsClick={() => setShowAchievements(true)}
        onHistoryClick={() => setShowHistory(true)}
        onMusicUploadClick={() => {}}
      />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '40px',
        maxWidth: '1200px',
        margin: '0 auto',
        paddingTop: '60px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
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
            TypeWave
          </h1>
        </div>

        <StatsDisplay 
          elapsed={0}
          correctSigns={0}
          totalErrors={0}
          currentErrorRate={0}
          theme={theme}
        />

        <TypingTest
          testText=""
          pos={0}
          chars={[]}
          theme={theme}
          onKeyDown={() => {}}
          fontSize={fontSize}
          fontStyle={fontStyle}
        />

        <MusicPlayer 
          theme={theme}
          getButtonColor={getButtonColor}
        />

        {showUnlockCuriosity && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000
          }}>
            <button
              onClick={handleUnlockCuriosity}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '12px 24px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
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

      {recentAchievement && (
        <AchievementNotification
          achievement={recentAchievement}
          onClose={closeAchievementNotification}
        />
      )}
    </div>
  );
};

export default Index;
