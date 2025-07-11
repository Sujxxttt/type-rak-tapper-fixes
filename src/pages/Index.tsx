import React, { useState, useEffect, useRef } from 'react';
import { Settings, Trophy } from 'lucide-react';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { TypingTest } from '../components/TypingTest';
import { StatsDisplay } from '../components/StatsDisplay';
import { SideMenu } from '../components/SideMenu';
import { HistoryPage } from '../components/HistoryPage';
import { AchievementsPage } from '../components/AchievementsPage';
import { EasterEggPage } from '../components/EasterEggPage';
import { TestNameMenu } from '../components/TestNameMenu';
import { CustomDurationSlider } from '../components/CustomDurationSlider';
import { AchievementNotification } from '../components/AchievementNotification';
import { useAchievements } from '../hooks/useAchievements';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { useTypingGame } from '../hooks/useTypingGame';
import { Toast } from '../components/Toast';

const Index = () => {
  const [currentView, setCurrentView] = useState('main');
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('typeRakTheme') || 'cosmic-nebula');
  const [username, setUsername] = useState(localStorage.getItem('typeRakUsername') || '');
  const [duration, setDuration] = useState(Number(localStorage.getItem('typeRakDuration')) || 60);
  const [selectedTest, setSelectedTest] = useState('random');
  const [fontSize, setFontSize] = useState(Number(localStorage.getItem('typeRakFontSize')) || 100);
  const [fontStyle, setFontStyle] = useState(localStorage.getItem('typeRakFontStyle') || 'inter');
  const [soundEnabled, setSoundEnabled] = useState(localStorage.getItem('typeRakSound') === 'true');
  const [backgroundMusicEnabled, setBackgroundMusicEnabled] = useState(localStorage.getItem('typeRakBackgroundMusic') === 'true');
  const [musicVolume, setMusicVolume] = useState(Number(localStorage.getItem('typeRakMusicVolume')) || 50);
  const [deleteConfirmState, setDeleteConfirmState] = useState(false);
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('typeRakUsers');
    return saved ? JSON.parse(saved) : [];
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { isPlaying: musicPlaying, hasMusic } = useBackgroundMusic(backgroundMusicEnabled, musicVolume);
  const { achievements, recentAchievement, checkAchievements, closeAchievementNotification, getUnlockedCount } = useAchievements(username);
  const { playSound } = useSoundEffects(soundEnabled);

  const {
    gameState,
    currentText,
    userInput,
    timeLeft,
    wpm,
    errorRate,
    correctChars,
    incorrectChars,
    totalChars,
    isActive,
    startGame,
    resetGame,
    handleInput,
    gameHistory
  } = useTypingGame(duration, selectedTest, playSound, checkAchievements, username);

  useEffect(() => {
    const savedUsers = localStorage.getItem('typeRakUsers');
    if (savedUsers) {
      setUsersList(JSON.parse(savedUsers));
    }
  }, []);

  useEffect(() => {
    if (usersList.length > 0) {
      localStorage.setItem('typeRakUsers', JSON.stringify(usersList));
    }
  }, [usersList]);

  useEffect(() => {
    localStorage.setItem('typeRakTheme', theme);
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('typeRakDuration', String(duration));
  }, [duration]);

  useEffect(() => {
    localStorage.setItem('typeRakFontSize', String(fontSize));
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('typeRakFontStyle', fontStyle);
  }, [fontStyle]);

  useEffect(() => {
    localStorage.setItem('typeRakSound', String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('typeRakBackgroundMusic', String(backgroundMusicEnabled));
  }, [backgroundMusicEnabled]);

  useEffect(() => {
    localStorage.setItem('typeRakMusicVolume', String(musicVolume));
  }, [musicVolume]);

  const applyTheme = (themeName: string) => {
    const themes = {
      'cosmic-nebula': {
        '--primary': '267 84% 81%',
        '--secondary': '267 84% 71%',
        '--accent': '267 84% 61%',
        '--background': '267 20% 10%',
        '--card': '267 20% 15%',
        '--muted': '267 20% 20%',
        '--border': '267 30% 25%'
      },
      'midnight-black': {
        '--primary': '280 100% 70%',
        '--secondary': '280 100% 60%',
        '--accent': '280 100% 50%',
        '--background': '0 0% 5%',
        '--card': '0 0% 10%',
        '--muted': '0 0% 15%',
        '--border': '0 0% 20%'
      },
      'cotton-candy-glow': {
        '--primary': '320 100% 70%',
        '--secondary': '320 100% 60%',
        '--accent': '320 100% 50%',
        '--background': '320 20% 10%',
        '--card': '320 20% 15%',
        '--muted': '320 20% 20%',
        '--border': '320 30% 25%'
      }
    };

    const themeColors = themes[themeName as keyof typeof themes];
    if (themeColors) {
      Object.keys(themeColors).forEach(key => {
        document.documentElement.style.setProperty(key, themeColors[key as keyof typeof themeColors]);
      });
    }
  };

  const getButtonColor = () => {
    switch (theme) {
      case 'midnight-black': return '#c559f7';
      case 'cotton-candy-glow': return '#ff59e8';
      case 'cosmic-nebula':
      default: return '#b109d6';
    }
  };

  const switchUser = (newUsername: string) => {
    setUsername(newUsername);
    localStorage.setItem('typeRakUsername', newUsername);
    resetGame();
  };

  const handleDeleteUser = () => {
    if (!deleteConfirmState) {
      setDeleteConfirmState(true);
      return;
    }

    const updatedUsers = usersList.filter(user => user !== username);
    setUsersList(updatedUsers);
    
    if (updatedUsers.length > 0) {
      switchUser(updatedUsers[0]);
    } else {
      setUsername('');
      localStorage.removeItem('typeRakUsername');
    }
    
    localStorage.removeItem(`typeRakHistory-${username}`);
    localStorage.removeItem(`typeRakAchievements-${username}`);
    
    setDeleteConfirmState(false);
    setToastMessage(`User "${username}" deleted successfully!`);
    setShowToast(true);
  };

  const handleUsernameChange = (newUsername: string) => {
    if (newUsername && !usersList.includes(newUsername)) {
      const updatedUsers = [...usersList, newUsername];
      setUsersList(updatedUsers);
      switchUser(newUsername);
      setToastMessage(`Welcome, ${newUsername}!`);
      setShowToast(true);
    }
  };

  const handleHistoryClick = () => {
    setCurrentView('history');
    setSideMenuOpen(false);
  };

  const handleAchievementsClick = () => {
    setCurrentView('achievements');
    setSideMenuOpen(false);
  };

  const handleContactMe = () => {
    window.open('mailto:rakthakur906@gmail.com', '_blank');
    setSideMenuOpen(false);
  };

  const navigateToEasterEgg = () => {
    setCurrentView('easter-egg');
  };

  const getUserStats = () => {
    if (!gameHistory || gameHistory.length === 0) {
      return { bestWpm: 0, testsCompleted: 0, avgErrorRate: 0 };
    }

    const bestWpm = Math.max(...gameHistory.map(g => g.wpm));
    const testsCompleted = gameHistory.length;
    const avgErrorRate = gameHistory.reduce((sum, g) => sum + g.errorRate, 0) / testsCompleted;

    return { bestWpm, testsCompleted, avgErrorRate };
  };

  const stats = getUserStats();

  if (currentView === 'history') {
    return (
      <HistoryPage
        gameHistory={gameHistory || []}
        onBack={() => setCurrentView('main')}
        theme={theme}
        getButtonColor={getButtonColor}
      />
    );
  }

  if (currentView === 'achievements') {
    return (
      <AchievementsPage
        achievements={achievements}
        onBack={() => setCurrentView('main')}
        theme={theme}
        getButtonColor={getButtonColor}
      />
    );
  }

  if (currentView === 'easter-egg') {
    return (
      <EasterEggPage onGoBack={() => setCurrentView('main')} theme={theme} />
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: `'${fontStyle}', sans-serif`,
      fontSize: `${fontSize}%`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        position: 'relative',
        zIndex: 100
      }}>
        <h1 onClick={navigateToEasterEgg} style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          margin: 0,
          cursor: 'pointer',
          userSelect: 'none',
          color: 'white',
          textShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
        }}>
          TypeRak
        </h1>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={handleAchievementsClick}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              color: 'white',
              width: '50px',
              height: '50px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              position: 'relative'
            }}
          >
            <Trophy size={24} />
            {getUnlockedCount() > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: getButtonColor(),
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 'bold'
              }}>
                {getUnlockedCount()}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setSideMenuOpen(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              color: 'white',
              width: '50px',
              height: '50px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Settings size={24} />
          </button>
        </div>
      </header>

      <SideMenu
        sideMenuOpen={sideMenuOpen}
        setSideMenuOpen={setSideMenuOpen}
        usersList={usersList}
        currentActiveUser={username}
        switchUser={switchUser}
        handleDeleteUser={handleDeleteUser}
        deleteConfirmState={deleteConfirmState}
        duration={duration}
        setDuration={setDuration}
        theme={theme}
        applyTheme={setTheme}
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

      <main style={{ flex: 1, padding: '2rem', position: 'relative', zIndex: 1 }}>
        <StatsDisplay
          bestWpm={stats.bestWpm}
          testsCompleted={stats.testsCompleted}
          avgErrorRate={stats.avgErrorRate}
          theme={theme}
        />

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          <TestNameMenu
            selectedTest={selectedTest}
            onTestChange={setSelectedTest}
            theme={theme}
          />
          <CustomDurationSlider
            value={duration}
            onChange={setDuration}
            theme={theme}
          />
        </div>

        <TypingTest
          gameState={gameState}
          currentText={currentText}
          userInput={userInput}
          timeLeft={timeLeft}
          wpm={wpm}
          errorRate={errorRate}
          correctChars={correctChars}
          incorrectChars={incorrectChars}
          totalChars={totalChars}
          isActive={isActive}
          onStart={startGame}
          onReset={resetGame}
          onInput={handleInput}
          theme={theme}
          username={username}
          onUsernameChange={handleUsernameChange}
          getButtonColor={getButtonColor}
        />
      </main>

      {recentAchievement && (
        <AchievementNotification
          achievement={recentAchievement}
          onClose={closeAchievementNotification}
        />
      )}

      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
          theme={theme}
        />
      )}
    </div>
  );
};

export default Index;
