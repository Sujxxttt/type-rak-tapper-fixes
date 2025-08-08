import React, { useState, useEffect, useRef } from 'react';
import { TypingTest } from '../components/TypingTest';
import { StatsDisplay } from '../components/StatsDisplay';
import { Introduction } from '../components/Introduction';
import { SideMenu } from '../components/SideMenu';
import { AchievementNotification } from '../components/AchievementNotification';
import { AchievementsPage } from '../components/AchievementsPage';
import { HistoryPage } from '../components/HistoryPage';
import { EasterEggPage } from '../components/EasterEggPage';
import { MusicUploadPage } from '../components/MusicUploadPage';
import { useAchievements } from '../hooks/useAchievements';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { Toast } from '../components/Toast';

export default function Index() {
  const [wpm, setWpm] = useState(0);
  const [errorRate, setErrorRate] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [errors, setErrors] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem('typeRakTheme') || 'cosmic-nebula');
  const [username, setUsername] = useState(() => localStorage.getItem('typeRakUsername') || '');
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState('main');
  const [showIntroduction, setShowIntroduction] = useState(() => !localStorage.getItem('typeRakIntroductionSeen'));
  const [musicEnabled, setMusicEnabled] = useState(() => localStorage.getItem('typeRakMusicEnabled') === 'true');
  const [musicVolume, setMusicVolume] = useState(() => parseInt(localStorage.getItem('typeRakMusicVolume') || '50'));
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('typeRakSoundEnabled') === 'true');
  const [soundVolume, setSoundVolume] = useState(() => parseInt(localStorage.getItem('typeRakSoundVolume') || '50'));
  const [customDuration, setCustomDuration] = useState(() => parseInt(localStorage.getItem('typeRakCustomDuration') || '60'));
  const [fontSize, setFontSize] = useState(() => parseInt(localStorage.getItem('typeRakFontSize') || '100'));
  const [fontStyle, setFontStyle] = useState(() => localStorage.getItem('typeRakFontStyle') || 'inter');
  const [cursorStyle, setCursorStyle] = useState(() => localStorage.getItem('typeRakCursorStyle') || 'blue');
  const [deleteConfirmState, setDeleteConfirmState] = useState({ show: false, callback: null });
  const [usersList, setUsersList] = useState([]);
  const [currentActiveUser, setCurrentActiveUser] = useState('');
  const [toast, setToast] = useState<{message: string} | null>(null);
  const [easterEggUnlocked, setEasterEggUnlocked] = useState(false);
  const [cheatUsageCount, setCheatUsageCount] = useState(() => parseInt(localStorage.getItem(`typeRakCheatCount-${username}`) || '0'));
  const [downArrowCount, setDownArrowCount] = useState(0);
  const [showEasterEggButton, setShowEasterEggButton] = useState(false);
  const [allTestHistory, setAllTestHistory] = useState([]);

  const containerRef = useRef(null);
  
  const { achievements, recentAchievement, checkAchievements, closeAchievementNotification, getUnlockedCount } = useAchievements(username);
  const { isPlaying: isMusicPlaying, hasMusic } = useBackgroundMusic(musicEnabled, musicVolume);
  const { playSound } = useSoundEffects(soundEnabled, soundVolume);

  useEffect(() => {
    const newClass = `theme-${theme} cursor-${cursorStyle}`;
    document.body.className = newClass;
    localStorage.setItem('typeRakTheme', theme);
  }, [theme, cursorStyle]);

  useEffect(() => {
    localStorage.setItem('typeRakUsername', username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem('typeRakMusicEnabled', musicEnabled.toString());
  }, [musicEnabled]);

  useEffect(() => {
    localStorage.setItem('typeRakMusicVolume', musicVolume.toString());
  }, [musicVolume]);

  useEffect(() => {
    localStorage.setItem('typeRakSoundEnabled', soundEnabled.toString());
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('typeRakSoundVolume', soundVolume.toString());
  }, [soundVolume]);

  useEffect(() => {
    localStorage.setItem('typeRakCustomDuration', customDuration.toString());
  }, [customDuration]);

  useEffect(() => {
    localStorage.setItem('typeRakFontSize', fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('typeRakFontStyle', fontStyle);
  }, [fontStyle]);

  useEffect(() => {
    localStorage.setItem('typeRakCursorStyle', cursorStyle);
  }, [cursorStyle]);

  useEffect(() => {
    localStorage.setItem(`typeRakCheatCount-${username}`, cheatUsageCount.toString());
  }, [cheatUsageCount, username]);

  // Cheat code detection
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.altKey && event.key === 'Backspace') {
        event.preventDefault();
        const newCount = cheatUsageCount + 1;
        setCheatUsageCount(newCount);
        
        setToast({ message: 'Cheat activated! Test completed.' });
        
        const stats = {
          wpm: 0,
          errorRate: 0,
          duration: 0,
          testsCompleted: parseInt(localStorage.getItem(`typeRakTestsCompleted-${username}`) || '0') + 1,
          perfectTests: parseInt(localStorage.getItem(`typeRakPerfectTests-${username}`) || '0'),
          unlockedAchievements: getUnlockedCount(),
          dailyTypingTime: parseInt(localStorage.getItem(`typeRakDailyTime-${username}-${new Date().toDateString()}`) || '0'),
          dailyStreak: parseInt(localStorage.getItem(`typeRakDailyStreak-${username}`) || '0'),
          cleanSessions: parseInt(localStorage.getItem(`typeRakCleanSessions-${username}`) || '0'),
          daysSinceLastVisit: 0,
          cheatUsageCount: newCount,
          totalVisitedDays: parseInt(localStorage.getItem(`typeRakTotalVisitedDays-${username}`) || '0'),
          daysSinceFirstLogin: Math.floor((Date.now() - parseInt(localStorage.getItem(`typeRakFirstLogin-${username}`) || Date.now().toString())) / (1000 * 60 * 60 * 24))
        };
        
        checkAchievements(stats);
        console.log('Cheat activated - test should complete');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cheatUsageCount, username, checkAchievements, getUnlockedCount]);

  // Down arrow and scroll detection for easter egg
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown' && !canScroll()) {
        const newCount = downArrowCount + 1;
        setDownArrowCount(newCount);
        if (newCount >= 5 && !showEasterEggButton) {
          setShowEasterEggButton(true);
        }
      } else {
        setDownArrowCount(0);
      }
    };

    const handleScroll = () => {
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10) {
        const newCount = downArrowCount + 1;
        setDownArrowCount(newCount);
        if (newCount >= 5 && !showEasterEggButton) {
          setShowEasterEggButton(true);
        }
      } else {
        setDownArrowCount(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [downArrowCount, showEasterEggButton]);

  const canScroll = () => {
    return document.documentElement.scrollHeight > window.innerHeight;
  };

  const getThemeGradient = () => {
    switch (theme) {
      case 'cosmic-nebula':
        return 'linear-gradient(135deg, #400354, #03568c)';
      case 'midnight-black':
        return '#0a0a0a';
      case 'cotton-candy-glow':
        return 'linear-gradient(135deg, #ff69b4 0%, #ff1493 25%, #da70d6 50%, #ba55d3 75%, #9370db 100%)';
      default:
        return 'linear-gradient(135deg, #400354, #03568c)';
    }
  };

  const getButtonColor = () => {
    switch (theme) {
      case 'midnight-black':
        return 'rgba(197, 89, 247, 0.21)';
      case 'cotton-candy-glow':
        return 'rgba(252, 3, 223, 0.21)';
      default:
        return 'rgba(177, 9, 214, 0.21)';
    }
  };

  const handleTestComplete = (wpm: number, errorRate: number, duration: number, errors: number) => {
    playSound('complete');
    
    const currentTests = parseInt(localStorage.getItem(`typeRakTestsCompleted-${username}`) || '0') + 1;
    const currentPerfect = parseInt(localStorage.getItem(`typeRakPerfectTests-${username}`) || '0') + (errorRate === 0 ? 1 : 0);
    const todayKey = `typeRakDailyTime-${username}-${new Date().toDateString()}`;
    const currentDailyTime = parseInt(localStorage.getItem(todayKey) || '0') + (duration / 60);
    
    localStorage.setItem(`typeRakTestsCompleted-${username}`, currentTests.toString());
    localStorage.setItem(`typeRakPerfectTests-${username}`, currentPerfect.toString());
    localStorage.setItem(todayKey, currentDailyTime.toString());
    
    // Update total visited days
    const visitedDaysKey = `typeRakTotalVisitedDays-${username}`;
    const lastVisitKey = `typeRakLastVisit-${username}`;
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem(lastVisitKey);
    
    if (lastVisit !== today) {
      const totalDays = parseInt(localStorage.getItem(visitedDaysKey) || '0') + 1;
      localStorage.setItem(visitedDaysKey, totalDays.toString());
      localStorage.setItem(lastVisitKey, today);
    }
    
    if (!localStorage.getItem(`typeRakFirstLogin-${username}`)) {
      localStorage.setItem(`typeRakFirstLogin-${username}`, Date.now().toString());
    }

    const stats = {
      wpm,
      errorRate,
      duration,
      testsCompleted: currentTests,
      perfectTests: currentPerfect,
      unlockedAchievements: getUnlockedCount(),
      dailyTypingTime: currentDailyTime,
      dailyStreak: parseInt(localStorage.getItem(`typeRakDailyStreak-${username}`) || '0'),
      cleanSessions: parseInt(localStorage.getItem(`typeRakCleanSessions-${username}`) || '0'),
      daysSinceLastVisit: 0,
      cheatUsageCount,
      totalVisitedDays: parseInt(localStorage.getItem(visitedDaysKey) || '0'),
      daysSinceFirstLogin: Math.floor((Date.now() - parseInt(localStorage.getItem(`typeRakFirstLogin-${username}`) || Date.now().toString())) / (1000 * 60 * 60 * 24))
    };

    checkAchievements(stats);
  };

  const handleEasterEggAccess = () => {
    if (!easterEggUnlocked) {
      setEasterEggUnlocked(true);
      const stats = {
        wpm: 0,
        errorRate: 0,
        duration: 0,
        testsCompleted: parseInt(localStorage.getItem(`typeRakTestsCompleted-${username}`) || '0'),
        perfectTests: parseInt(localStorage.getItem(`typeRakPerfectTests-${username}`) || '0'),
        unlockedAchievements: getUnlockedCount(),
        dailyTypingTime: parseInt(localStorage.getItem(`typeRakDailyTime-${username}-${new Date().toDateString()}`) || '0'),
        dailyStreak: parseInt(localStorage.getItem(`typeRakDailyStreak-${username}`) || '0'),
        cleanSessions: parseInt(localStorage.getItem(`typeRakCleanSessions-${username}`) || '0'),
        daysSinceLastVisit: 0,
        cheatUsageCount,
        totalVisitedDays: parseInt(localStorage.getItem(`typeRakTotalVisitedDays-${username}`) || '0'),
        daysSinceFirstLogin: Math.floor((Date.now() - parseInt(localStorage.getItem(`typeRakFirstLogin-${username}`) || Date.now().toString())) / (1000 * 60 * 60 * 24)),
        easterEggFound: true
      };
      checkAchievements(stats);
    }
    setCurrentView('easter-egg');
  };

  const handleShowAchievements = () => setCurrentView('achievements');
  const handleShowHistory = () => setCurrentView('history');
  const handleMusicUploadClick = () => setCurrentView('music-upload');
  const handleBackToDashboard = () => setCurrentView('main');
  const handleDeleteConfirm = (callback: any) => setDeleteConfirmState({ show: true, callback });
  const handleDeleteCancel = () => setDeleteConfirmState({ show: false, callback: null });
  const handleDeleteExecute = () => {
    if (deleteConfirmState.callback) {
      deleteConfirmState.callback();
    }
    setDeleteConfirmState({ show: false, callback: null });
  };
  const handleToastClose = () => setToast(null);

  if (showIntroduction) {
    return (
      <Introduction 
        onComplete={() => {
          setShowIntroduction(false);
          localStorage.setItem('typeRakIntroductionSeen', 'true');
        }} 
        theme={theme}
      />
    );
  }

  if (currentView === 'achievements') {
    return (
      <AchievementsPage
        achievements={achievements}
        onBack={handleBackToDashboard}
        theme={theme}
        getButtonColor={getButtonColor}
        username={username}
      />
    );
  }

  if (currentView === 'history') {
    return (
      <HistoryPage
        allTestHistory={allTestHistory}
        onBack={handleBackToDashboard}
        theme={theme}
        getButtonColor={getButtonColor}
      />
    );
  }

  if (currentView === 'easter-egg') {
    return (
      <EasterEggPage
        theme={theme}
        onGoBack={handleBackToDashboard}
      />
    );
  }

  if (currentView === 'music-upload') {
    return (
      <MusicUploadPage
        onBack={handleBackToDashboard}
        theme={theme}
        getButtonColor={getButtonColor}
      />
    );
  }

  return (
    <div 
      ref={containerRef}
      style={{
        minHeight: '100vh',
        background: getThemeGradient(),
        transition: 'background 0.5s ease-in-out',
        position: 'relative'
      }}
      className={`cursor-${cursorStyle}`}
    >
      <SideMenu
        theme={theme}
        setTheme={setTheme}
        username={username}
        setUsername={setUsername}
        sideMenuOpen={sideMenuOpen}
        setSideMenuOpen={setSideMenuOpen}
        musicEnabled={musicEnabled}
        setMusicEnabled={setMusicEnabled}
        musicVolume={musicVolume}
        setMusicVolume={setMusicVolume}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        soundVolume={soundVolume}
        setSoundVolume={setSoundVolume}
        customDuration={customDuration}
        setCustomDuration={setCustomDuration}
        fontSize={fontSize}
        setFontSize={setFontSize}
        fontStyle={fontStyle}
        setFontStyle={setFontStyle}
        cursorStyle={cursorStyle}
        setCursorStyle={setCursorStyle}
        deleteConfirmState={deleteConfirmState.show}
        onDeleteConfirm={handleDeleteConfirm}
        onDeleteCancel={handleDeleteCancel}
        onDeleteExecute={handleDeleteExecute}
        usersList={usersList}
        setUsersList={setUsersList}
        currentActiveUser={currentActiveUser}
        setCurrentActiveUser={setCurrentActiveUser}
        onAchievementsClick={handleShowAchievements}
        onHistoryClick={handleShowHistory}
        onMusicUploadClick={handleMusicUploadClick}
      />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        color: 'white'
      }}>
        <StatsDisplay 
          elapsed={0}
          correctSigns={0}
          totalErrors={0}
          currentErrorRate={0}
          theme={theme}
          unlockedAchievements={getUnlockedCount()}
          totalAchievements={achievements.length}
        />
        
        <TypingTest 
          theme={theme}
          customDuration={customDuration}
          fontSize={fontSize}
          fontStyle={fontStyle}
          onTestComplete={handleTestComplete}
          playSound={playSound}
          getButtonColor={getButtonColor}
        />
      </div>

      {showEasterEggButton && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000
        }}>
          <button
            onClick={handleEasterEggAccess}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '10px 20px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
          >
            Unlock Curiosity
          </button>
        </div>
      )}

      {recentAchievement && (
        <AchievementNotification
          achievement={recentAchievement}
          onClose={closeAchievementNotification}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          onClose={handleToastClose}
        />
      )}
    </div>
  );
}
