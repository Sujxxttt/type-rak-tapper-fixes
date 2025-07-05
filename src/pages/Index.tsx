import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TypingTest } from '../components/TypingTest';
import { Introduction } from '../components/Introduction';
import { GlassSidebar } from '../components/GlassSidebar';
import { AchievementNotification } from '../components/AchievementNotification';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { useAchievements } from '../hooks/useAchievements';

interface TestResult {
  wpm: number;
  accuracy: number;
  duration: number;
  date: string;
}

export default function Index() {
  const [showIntroduction, setShowIntroduction] = useState(true);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [usersList, setUsersList] = useState<string[]>([]);
  const [currentActiveUser, setCurrentActiveUser] = useState<string>('default');
  const [deleteConfirmState, setDeleteConfirmState] = useState(false);
  const [duration, setDuration] = useState(60);
  const [theme, setTheme] = useLocalStorage('theme', 'cosmic-nebula');
  const [fontSize, setFontSize] = useLocalStorage('fontSize', 100);
  const [fontStyle, setFontStyle] = useLocalStorage('fontStyle', 'inter');
  const [soundEnabled, setSoundEnabled] = useLocalStorage('soundEnabled', true);
  const [backgroundMusicEnabled, setBackgroundMusicEnabled] = useLocalStorage('backgroundMusicEnabled', true);
  const [musicVolume, setMusicVolume] = useLocalStorage('musicVolume', 50);
  const [hasMusic, setHasMusic] = useState(false);
  const navigate = useNavigate();
  const [testResults, setTestResults] = useLocalStorage<TestResult[]>(`testResults-${currentActiveUser}`, []);
  const { playMusic, stopMusic, isPlaying, hasMusic } = useBackgroundMusic(backgroundMusicEnabled, musicVolume);
  const { achievements, notification, checkAchievements, dismissNotification } = useAchievements(currentActiveUser);

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsersList(JSON.parse(storedUsers));
    } else {
      localStorage.setItem('users', JSON.stringify(['default']));
      setUsersList(['default']);
    }

    const storedActiveUser = localStorage.getItem('activeUser') || 'default';
    setCurrentActiveUser(storedActiveUser);

    // Check if music file exists
    fetch('./music/ambient-piano.mp3')
      .then(response => {
        setHasMusic(response.ok);
      })
      .catch(() => {
        setHasMusic(false);
      });

    // Event listener for navigating to create user
    const handleNavigateToCreateUser = () => {
      navigate('/create-user');
    };

    // Event listener for navigating to achievements
    const handleNavigateToAchievements = () => {
      navigate('/achievements');
    };

    window.addEventListener('navigateToCreateUser', handleNavigateToCreateUser);
    window.addEventListener('navigateToAchievements', handleNavigateToAchievements);

    return () => {
      window.removeEventListener('navigateToCreateUser', handleNavigateToCreateUser);
      window.removeEventListener('navigateToAchievements', handleNavigateToAchievements);
    };
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem('activeUser', currentActiveUser);
    setTestResults(JSON.parse(localStorage.getItem(`testResults-${currentActiveUser}`) || '[]'));
  }, [currentActiveUser, setTestResults]);

  useEffect(() => {
    if (backgroundMusicEnabled && hasMusic) {
      playMusic();
    } else {
      stopMusic();
    }
  }, [backgroundMusicEnabled, playMusic, stopMusic, hasMusic]);

  useEffect(() => {
    if (isPlaying) {
      playMusic();
    }
  }, [musicVolume, isPlaying, playMusic]);

  const switchUser = (username: string) => {
    setCurrentActiveUser(username);
    localStorage.setItem('activeUser', username);
    setSideMenuOpen(false);
  };

  const handleHistoryClick = () => {
    navigate('/history');
    setSideMenuOpen(false);
  };

  const handleContactMe = () => {
    navigate('/contact');
    setSideMenuOpen(false);
  };

  const handleDeleteUser = () => {
    if (deleteConfirmState) {
      if (usersList.length <= 1) {
        alert('Cannot delete the last user.');
        setDeleteConfirmState(false);
        return;
      }

      const updatedUsers = usersList.filter(user => user !== currentActiveUser);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsersList(updatedUsers);

      const newUser = updatedUsers[0] || 'default';
      switchUser(newUser);

      localStorage.removeItem(`testResults-${currentActiveUser}`);
      setDeleteConfirmState(false);
      setSideMenuOpen(false);
    } else {
      setDeleteConfirmState(true);
    }
  };

  const applyTheme = (selectedTheme: string) => {
    setTheme(selectedTheme);
  };

  const handleTestComplete = useCallback((wpm: number, accuracy: number) => {
    const newResult: TestResult = {
      wpm,
      accuracy,
      duration,
      date: new Date().toLocaleDateString()
    };

    setTestResults(prevResults => {
      const updatedResults = [...prevResults, newResult];
      localStorage.setItem(`testResults-${currentActiveUser}`, JSON.stringify(updatedResults));
      return updatedResults;
    });

    checkAchievements(wpm, duration);
  }, [currentActiveUser, duration, setTestResults, checkAchievements]);

  const getButtonColor = () => {
    switch (theme) {
      case 'cosmic-nebula':
        return '#f364f0';
      case 'midnight-black':
        return '#c559f7';
      case 'cotton-candy-glow':
        return '#ff59e8';
      default:
        return '#c454f0';
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ease-in-out ${
      theme === 'cosmic-nebula' ? 'theme-cosmic-nebula cursor-blue' :
      theme === 'midnight-black' ? 'theme-midnight-black cursor-white' :
      'theme-cotton-candy-glow cursor-pink'
    }`}>
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-white">TypeRak</h1>
        </div>
        
        <button
          onClick={() => setSideMenuOpen(true)}
          className="p-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        {showIntroduction ? (
          <Introduction 
            onComplete={() => setShowIntroduction(false)}
            theme={theme}
          />
        ) : (
          <TypingTest 
            duration={duration}
            theme={theme}
            fontSize={fontSize}
            fontStyle={fontStyle}
            soundEnabled={soundEnabled}
            onTestComplete={handleTestComplete}
          />
        )}
      </div>

      {/* Glass Sidebar */}
      <GlassSidebar
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
      />

      {/* Achievement Notification */}
      <AchievementNotification
        notification={notification}
        onDismiss={dismissNotification}
        theme={theme}
      />
    </div>
  );
}
