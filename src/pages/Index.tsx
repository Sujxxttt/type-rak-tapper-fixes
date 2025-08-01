
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useToast } from "@/components/ui/use-toast"
import { useTypingGame } from '../hooks/useTypingGame';
import { useAchievements } from '../hooks/useAchievements';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { Introduction } from '../components/Introduction';
import TypingArea from '../components/TypingArea';
import GameOver from '../components/GameOver';
import { SideMenu } from '../components/SideMenu';
import { AchievementsPage } from '../components/AchievementsPage';
import EasterEgg from '../components/EasterEgg';
import { MusicUploadPage } from '../components/MusicUploadPage';

const Index = () => {
  const [cookies, setCookie] = useCookies(['username', 'theme', 'musicEnabled', 'musicVolume', 'firstTime', 'totalVisitedDays', 'daysSinceFirstLogin', 'firstTimeEasterEgg', 'testsCompleted']);
  const navigate = useNavigate();
  const { toast } = useToast()

  // States
  const [text, setText] = useState<string>("The quick brown fox jumps over the lazy dog. This is a sample text for the typing test.");
  const [duration, setDuration] = useState<number>(60);
  const [currentView, setCurrentView] = useState<'main' | 'achievements' | 'easterEgg' | 'musicUpload'>('main');
  const [easterEggUnlocked, setEasterEggUnlocked] = useState(false);
  const [scrollCount, setScrollCount] = useState(0);
  const [showUnlockButton, setShowUnlockButton] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [maxWpmAchieved, setMaxWpmAchieved] = useState(0);

  // Username state and effect
  const [username, setUsername] = useState<string>(() => {
    return cookies.username || '';
  });

  useEffect(() => {
    if (username) {
      setCookie('username', username, { path: '/' });
    }
  }, [username, setCookie]);

  // Theme state and effect
  const [theme, setTheme] = useState<string>(() => {
    return cookies.theme || 'default';
  });

  useEffect(() => {
    setCookie('theme', theme, { path: '/' });
  }, [theme, setCookie]);

  // Music state and effects
  const [musicEnabled, setMusicEnabled] = useState<boolean>(() => {
    const cookieValue = cookies.musicEnabled;
    return cookieValue !== undefined ? cookieValue === 'true' : true;
  });
  const [musicVolume, setMusicVolume] = useState<number>(() => {
    const cookieValue = cookies.musicVolume;
    return cookieValue !== undefined ? parseInt(cookieValue, 10) : 50;
  });

  useEffect(() => {
    setCookie('musicEnabled', String(musicEnabled), { path: '/' });
  }, [musicEnabled, setCookie]);

  useEffect(() => {
    setCookie('musicVolume', String(musicVolume), { path: '/' });
  }, [musicVolume, setCookie]);

  const { isPlaying, hasMusic } = useBackgroundMusic(musicEnabled, musicVolume);

  // Typing game hook
  const onComplete = useCallback((wpm: number, accuracy: number, timeLeft: number) => {
    toast({
      title: "Test Complete",
      description: `WPM: ${wpm}, Accuracy: ${accuracy.toFixed(2)}%, Time Left: ${timeLeft}s`,
    })
    if (wpm > maxWpmAchieved) {
      setMaxWpmAchieved(wpm);
    }
  }, [toast, maxWpmAchieved]);

  const {
    userInput,
    currentIndex,
    wpm,
    accuracy,
    timeLeft,
    gameStarted,
    gameOver,
    startGame,
    resetGame,
    handleInputChange,
    handleKeyPress,
    addCheatTime,
    cheatUsages
  } = useTypingGame(text, duration, onComplete);

  // Achievements hook
  const {
    achievements,
    recentAchievement,
    checkAchievements,
    closeAchievementNotification,
    getUnlockedCount
  } = useAchievements(username);

  // First time visit logic
  useEffect(() => {
    const visitedDays = parseInt(cookies.totalVisitedDays || '0', 10);
    setCookie('totalVisitedDays', String(visitedDays + 1), { path: '/' });

    if (!cookies.firstTime) {
      setCookie('firstTime', 'true', { path: '/' });
      setCookie('daysSinceFirstLogin', String(1), { path: '/' });
    } else {
      const firstLogin = parseInt(cookies.daysSinceFirstLogin || '1', 10);
      setCookie('daysSinceFirstLogin', String(firstLogin + 1), { path: '/' });
    }
  }, [setCookie, cookies.totalVisitedDays, cookies.firstTime, cookies.daysSinceFirstLogin]);

  // Easter egg logic
  const handleScrollOrArrowKey = useCallback(() => {
    if (document.documentElement.scrollTop === 0) {
      setScrollCount(prevCount => prevCount + 1);
    }
  }, []);

  useEffect(() => {
    if (scrollCount >= 5) {
      setShowUnlockButton(true);
    }
  }, [scrollCount]);

  const unlockEasterEgg = () => {
    setEasterEggUnlocked(true);
    setCurrentView('easterEgg');
    setShowUnlockButton(false);
    setScrollCount(0);
    if (!cookies.firstTimeEasterEgg) {
      setCookie('firstTimeEasterEgg', 'true', { path: '/' });
    }
  };

  // Cheat code
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.altKey && event.key === 'Backspace') {
        addCheatTime();
        toast({
          title: "Cheat Code Activated",
          description: "+10 seconds! (Don't tell anyone)",
        })
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [addCheatTime, toast]);

  // Achievement checking
  useEffect(() => {
    if (gameOver) {
      const totalVisitedDays = parseInt(cookies.totalVisitedDays || '0', 10);
      const daysSinceFirstLogin = parseInt(cookies.daysSinceFirstLogin || '1', 10);
      const daysSinceLastVisit = parseInt(cookies.daysSinceFirstLogin || '1', 10);
      const testsCompleted = parseInt(cookies.testsCompleted || '0', 10);
      checkAchievements({
        wpm,
        errorRate: 100 - accuracy,
        duration,
        testsCompleted: testsCompleted + 1,
        perfectTests: 0, // Needs actual implementation
        unlockedAchievements: getUnlockedCount(),
        dailyTypingTime: 60, // Needs actual implementation
        dailyStreak: 1, // Needs actual implementation
        cleanSessions: 0, // Needs actual implementation
        daysSinceLastVisit: daysSinceLastVisit,
        cheatUsages: cheatUsages,
        totalVisitedDays: totalVisitedDays,
        daysSinceFirstLogin: daysSinceFirstLogin,
        maxWpmAchieved: maxWpmAchieved,
        dailyTypingMinutes: 60,
        firstTimeEasterEgg: cookies.firstTimeEasterEgg === 'true'
      });
      setCookie('testsCompleted', String(testsCompleted + 1), { path: '/' });
    }
  }, [gameOver, wpm, accuracy, duration, checkAchievements, getUnlockedCount, setCookie, cookies, cheatUsages, maxWpmAchieved]);

  const getButtonColor = () => {
    switch (theme) {
      case 'cosmic-nebula':
        return 'rgba(64, 3, 84, 0.7)';
      case 'midnight-black':
        return 'rgba(30, 30, 30, 0.7)';
      case 'cotton-candy-glow':
        return 'rgba(18, 207, 243, 0.7)';
      default:
        return 'rgba(255, 255, 255, 0.7)';
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleKeyPressWrapper = (event: React.KeyboardEvent) => {
    handleKeyPress(event.key);
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 ease-in-out ${
        theme === 'cosmic-nebula' ? 'theme-cosmic-nebula cursor-blue' :
        theme === 'midnight-black' ? 'theme-midnight-black cursor-white' :
        theme === 'cotton-candy-glow' ? 'theme-cotton-candy-glow cursor-pink' :
        'bg-background cursor-black'
      }`}
    >
      <SideMenu
        sideMenuOpen={isSidebarOpen}
        setSideMenuOpen={setIsSidebarOpen}
        usersList={[username].filter(Boolean)}
        currentActiveUser={username}
        switchUser={setUsername}
        handleDeleteUser={() => {}}
        deleteConfirmState={false}
        duration={duration}
        setDuration={setDuration}
        theme={theme}
        applyTheme={setTheme}
        handleHistoryClick={() => {}}
        handleContactMe={() => {}}
        getButtonColor={getButtonColor}
        fontSize={100}
        setFontSize={() => {}}
        fontStyle="inter"
        setFontStyle={() => {}}
        soundEnabled={true}
        setSoundEnabled={() => {}}
        backgroundMusicEnabled={musicEnabled}
        setBackgroundMusicEnabled={setMusicEnabled}
        musicVolume={musicVolume}
        setMusicVolume={setMusicVolume}
        hasMusic={hasMusic}
      />

      <div className="flex-1 flex flex-col">
        {currentView === 'main' && (
          <>
            {!gameStarted && !gameOver && (
              <Introduction
                onComplete={startGame}
              />
            )}

            {gameStarted && !gameOver && (
              <TypingArea
                text={text}
                userInput={userInput}
                currentIndex={currentIndex}
                wpm={wpm}
                accuracy={accuracy}
                timeLeft={timeLeft}
                handleInputChange={handleInputChange}
                handleKeyPress={handleKeyPressWrapper}
              />
            )}

            {gameOver && (
              <GameOver
                wpm={wpm}
                accuracy={accuracy}
                timeLeft={timeLeft}
                onRestart={resetGame}
              />
            )}
          </>
        )}

        {currentView === 'achievements' && (
          <AchievementsPage
            achievements={achievements}
            onBack={() => setCurrentView('main')}
            theme={theme}
            getButtonColor={getButtonColor}
          />
        )}

        {currentView === 'easterEgg' && (
          <EasterEgg onBack={() => setCurrentView('main')} theme={theme} getButtonColor={getButtonColor} />
        )}

        {currentView === 'musicUpload' && (
          <MusicUploadPage onBack={() => setCurrentView('main')} theme={theme} getButtonColor={getButtonColor} />
        )}
      </div>

      {recentAchievement && (
        <div
          className="fixed bottom-5 right-5 bg-green-600 text-white p-4 rounded-md shadow-lg achievement-glow"
          style={{ zIndex: 1000 }}
        >
          <h3 className="font-bold text-lg">{recentAchievement.name}</h3>
          <p className="text-sm">{recentAchievement.subtitle}</p>
          <p className="text-xs">WPM: {recentAchievement.wpm}</p>
          <button onClick={closeAchievementNotification} className="mt-2 text-white underline">
            Close
          </button>
        </div>
      )}

      {showUnlockButton && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2">
          <button
            onClick={unlockEasterEgg}
            className="bg-white bg-opacity-10 backdrop-blur-md text-white px-4 py-2 rounded-lg border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-200"
          >
            Unlock Curiosity
          </button>
        </div>
      )}
    </div>
  );
};

export default Index;
