import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useTypingGame } from '../hooks/useTypingGame';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { useAchievements } from '../hooks/useAchievements';
import { useTheme } from '../hooks/useTheme';
import Confetti from 'react-confetti';
import { Trophy } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const Index = () => {
  const [start, setStart] = useState<boolean>(false);
  const [time, setTime] = useState<number>(60);
  const [typed, setTyped] = useState<string>('');
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'typing-test' | 'test-history' | 'settings' | 'achievements' | 'easter-egg'>('typing-test');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('');
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [showUsernameModal, setShowUsernameModal] = useState<boolean>(false);
  const [cookies, setCookie] = useCookies(['username']);
  const [showAchievementNotification, setShowAchievementNotification] = useState(false);

  const navigate = useNavigate();
  const errors = useRef<number>(0);
  const keysPressed = useRef<Set<string>>(new Set());
  const { theme, getThemeColor, getButtonColor } = useTheme();
  const { playKeyboardSound, playErrorSound } = useSoundEffects(soundEnabled);
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
  const { achievements, recentAchievement, checkAchievements, closeAchievementNotification, getUnlockedCount } = useAchievements(username);

  useEffect(() => {
    if (recentAchievement) {
      setShowAchievementNotification(true);
      const timer = setTimeout(() => {
        setShowAchievementNotification(false);
        closeAchievementNotification();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [recentAchievement, closeAchievementNotification]);

  useEffect(() => {
    const storedUsername = cookies.username;
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      setShowUsernameModal(true);
      setIsNewUser(true);
    }
  }, [cookies.username, setUsername]);

  useEffect(() => {
    if (time <= 0) {
      endTest();
    }
  }, [time]);

  useEffect(() => {
    if (testActive && !gameOver && time > 0) {
      const intervalId = setInterval(() => {
        setTime((prevTime) => Math.max(0, prevTime - 1));
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [testActive, gameOver, time]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameOver || !testActive) return;

    const key = e.key;
    if (keysPressed.current.has(key)) return;
    keysPressed.current.add(key);

    if (e.key === 'Shift') return;
    if (e.ctrlKey || e.altKey || e.metaKey) {
      addCheatTime();
      return;
    }

    setActualTypedCount((prev) => prev + 1);
    playKeyboardSound();

    if (pos < testText.length) {
      if (key === testText[pos]) {
        chars[pos].classList.add('correct');
        setCorrectCharacters((prev) => prev + 1);
        setPos((old) => old + 1);
        setWasLastError(false);
      } else {
        chars[pos].classList.add('incorrect');
        errors.current += 1;
        setTotalErrors(errors.current);
        setWasLastError(true);
        playErrorSound();
      }
    } else if (pos === testText.length && key === ' ') {
      extendText();
      renderText(extendText());
    }
  }, [gameOver, testActive, pos, testText, chars, playKeyboardSound, playErrorSound, renderText, extendText, addCheatTime, setCorrectCharacters]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysPressed.current.delete(e.key);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (pos === testText.length && testText.length > 0) {
      extendText();
      renderText(extendText());
    }
  }, [pos, testText, renderText, extendText]);

  const newTest = () => {
    console.log('Starting new test');
    setStart(false);
    setTime(0);
    errors.current = 0;
    resetKeys();
    clearTyped();
    setShowConfetti(false);
    
    // Generate new words
    const newWords = generateWords(250);
    console.log('Generated words:', newWords);
    renderText(newWords);
  };

  const startTest = () => {
    console.log('Starting test');
    setStart(true);
    setTestActive(true);
    setGameOver(false);
    setPos(0);
    setCorrectCharacters(0);
    setTotalErrors(0);
    setActualTypedCount(0);
    setWasLastError(false);
    setTime(60);
    startTimer(60);
  };

  const endTest = () => {
    console.log('Ending test');
    setTestActive(false);
    setGameOver(true);
    clearInterval(timerRef.current as NodeJS.Timeout);
    setShowConfetti(true);

    const wpm = getCurrentWPM();
    const errorRate = getCurrentErrorRate();
    const duration = elapsed;
    const testsCompleted = 1;
    const perfectTests = totalErrors === 0 ? 1 : 0;
    const unlockedAchievements = getUnlockedCount();
    const dailyTypingTime = elapsed / 60;
    const dailyStreak = 1;
    const cleanSessions = errorRate < 1 ? 1 : 0;
    const daysSinceLastVisit = 1;

    const stats = {
      wpm,
      errorRate,
      duration,
      testsCompleted,
      perfectTests,
      unlockedAchievements,
      dailyTypingTime,
      dailyStreak,
      cleanSessions,
      daysSinceLastVisit
    };

    checkAchievements(stats);
  };

  const resetKeys = () => {
    keysPressed.current.clear();
  };

  const clearTyped = () => {
    setTyped('');
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTyped(event.target.value);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNewTest = () => {
    newTest();
  };

  const handleUsernameSubmit = (name: string) => {
    setUsername(name);
    setCookie('username', name, { path: '/' });
    setShowUsernameModal(false);
  };

  const AchievementsPage = React.lazy(() => import('../components/AchievementsPage').then(module => ({ default: module.AchievementsPage })));
  const SettingsPage = React.lazy(() => import('../components/SettingsPage'));
  const TestHistoryPage = React.lazy(() => import('../components/TestHistoryPage'));
  const EasterEggPage = React.lazy(() =>
    import('../components/EasterEggPage').then(module => ({ default: module.EasterEggPage }))
  );

  let content;
  switch (currentView) {
    case 'typing-test':
      content = (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Typing Test</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleNewTest}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                New Test
              </button>
              {!testActive && !gameOver && (
                <button
                  onClick={startTest}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Start Test
                </button>
              )}
            </div>
          </div>
          <div
            id="text-flow"
            className="text-lg leading-relaxed"
          >
          </div>
          <textarea
            value={typed}
            onChange={handleTextChange}
            className="w-full h-32 p-4 border rounded focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Start typing here..."
            disabled={!testActive}
          />
          {gameOver && (
            <div className="mt-4">
              <p>WPM: {getCurrentWPM()}</p>
              <p>Error Rate: {getCurrentErrorRate().toFixed(2)}%</p>
            </div>
          )}
        </>
      );
      break;
    case 'test-history':
      content = (
        <React.Suspense fallback={<div>Loading History...</div>}>
          <TestHistoryPage />
        </React.Suspense>
      );
      break;
    case 'settings':
      content = (
        <React.Suspense fallback={<div>Loading Settings...</div>}>
          <SettingsPage
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            theme={theme}
            getThemeColor={getThemeColor}
            getButtonColor={getButtonColor}
          />
        </React.Suspense>
      );
      break;
    case 'achievements':
      content = (
        <React.Suspense fallback={<div>Loading Achievements...</div>}>
          <AchievementsPage
            achievements={achievements}
            onBack={() => setCurrentView('typing-test')}
            theme={theme}
            getButtonColor={getButtonColor}
          />
        </React.Suspense>
      );
      break;
    case 'easter-egg':
      content = (
        <React.Suspense fallback={<div>Loading Easter Egg...</div>}>
          <EasterEggPage theme={theme} onGoBack={() => setCurrentView('typing-test')} />
        </React.Suspense>
      );
      break;
    default:
      content = <div>Invalid view</div>;
      break;
  }

  return (
    <div className="min-h-screen bg-background py-6 flex flex-col justify-center sm:py-12">
      {showConfetti && <Confetti />}
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"
        />
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <button onClick={handleSidebarToggle}>
                <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {content}
            </div>
          </div>
        </div>
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {showUsernameModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Welcome!
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Please enter your username to continue.
                </p>
                <input
                  type="text"
                  className="mt-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Your Username"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const inputElement = e.target as HTMLInputElement;
                      handleUsernameSubmit(inputElement.value);
                    }
                  }}
                />
              </div>
              <div className="items-center px-4 py-3">
                <button
                  className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                  onClick={(e) => {
                    const inputElement = (e.target as HTMLButtonElement).parentElement?.parentElement?.querySelector('input') as HTMLInputElement;
                    handleUsernameSubmit(inputElement.value);
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAchievementNotification && recentAchievement && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden achievement-glow">
          <div className="p-4 achievement-bg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Trophy className="h-6 w-6 text-yellow-500" aria-hidden="true" />
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900">
                  Achievement Unlocked!
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {recentAchievement.name} - {recentAchievement.subtitle}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => setShowAchievementNotification(false)}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
