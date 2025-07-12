import React, { useState, useEffect, useRef } from 'react';
import { Introduction } from '../components/Introduction';
import { TypingTest } from '../components/TypingTest';
import { StatsDisplay } from '../components/StatsDisplay';
import { SideMenu } from '../components/SideMenu';
import { HistoryPage } from '../components/HistoryPage';
import { AchievementsPage } from '../components/AchievementsPage';
import { TestNameMenu } from '../components/TestNameMenu';
import { AchievementNotification } from '../components/AchievementNotification';
import { Toast } from '../components/Toast';
import { useTypingGame } from '../hooks/useTypingGame';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { useAchievements } from '../hooks/useAchievements';

const Index = () => {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [usersList, setUsersList] = useState<string[]>([]);
  const [currentActiveUser, setCurrentActiveUser] = useState('');
  const [deleteConfirmState, setDeleteConfirmState] = useState(false);
  const [duration, setDuration] = useState(60);
  const [theme, setTheme] = useState(localStorage.getItem('typeRakTheme') || 'cosmic-nebula');
  const [fontSize, setFontSize] = useState(Number(localStorage.getItem('typeRakFontSize')) || 100);
  const [fontStyle, setFontStyle] = useState(localStorage.getItem('typeRakFontStyle') || 'inter');
  const [soundEnabled, setSoundEnabled] = useState(localStorage.getItem('typeRakSoundEnabled') === 'true' || false);
  const [backgroundMusicEnabled, setBackgroundMusicEnabled] = useState(localStorage.getItem('typeRakBackgroundMusicEnabled') === 'true' || false);
  const [musicVolume, setMusicVolume] = useState(Number(localStorage.getItem('typeRakMusicVolume')) || 50);
  const [showTestNameMenu, setShowTestNameMenu] = useState(false);
  const [newTestName, setNewTestName] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const typingTestRef = useRef<HTMLDivElement>(null);

  const typingGame = useTypingGame();
  const { playKeyboardSound, playErrorSound } = useSoundEffects(soundEnabled);
  const { isPlaying: isBackgroundMusicPlaying, hasMusic } = useBackgroundMusic(backgroundMusicEnabled, musicVolume);
  const { achievements, recentAchievement, checkAchievements, closeAchievementNotification, getUnlockedCount } = useAchievements(currentActiveUser);

  useEffect(() => {
    document.body.className = document.body.className.replace(/cursor-\S+/g, '').trim();
    document.body.classList.add(`cursor-${localStorage.getItem('typeRakCursor') || 'blue'}`);
  }, []);

  useEffect(() => {
    const savedUsers = localStorage.getItem('typeRakUsers');
    if (savedUsers) {
      setUsersList(JSON.parse(savedUsers));
    }
    const lastActiveUser = localStorage.getItem('typeRakLastActiveUser');
    if (lastActiveUser) {
      setCurrentActiveUser(lastActiveUser);
    }
  }, []);

  useEffect(() => {
    if (typingGame.gameOver) {
      const stats = {
        wpm: typingGame.getCurrentWPM(),
        errorRate: typingGame.getCurrentErrorRate(),
        duration,
        testsCompleted: Number(localStorage.getItem(`typeRakTestsCompleted-${currentActiveUser}`) || 0) + 1,
        perfectTests: Number(localStorage.getItem(`typeRakPerfectTests-${currentActiveUser}`) || 0) + (typingGame.getCurrentErrorRate() === 0 ? 1 : 0),
        unlockedAchievements: getUnlockedCount(),
        dailyTypingTime: Number(localStorage.getItem(`typeRakDailyTypingTime-${currentActiveUser}`) || 0) + (duration / 60),
        dailyStreak: Number(localStorage.getItem(`typeRakDailyStreak-${currentActiveUser}`) || 0),
        cleanSessions: Number(localStorage.getItem(`typeRakCleanSessions-${currentActiveUser}`) || 0),
        daysSinceLastVisit: Number(localStorage.getItem(`typeRakDaysSinceLastVisit-${currentActiveUser}`) || 0)
      };
      checkAchievements(stats);

      localStorage.setItem(`typeRakTestsCompleted-${currentActiveUser}`, String(stats.testsCompleted));
      localStorage.setItem(`typeRakPerfectTests-${currentActiveUser}`, String(stats.perfectTests));

      const today = new Date().toLocaleDateString();
      const lastPlayedDate = localStorage.getItem(`typeRakLastPlayedDate-${currentActiveUser}`);

      if (lastPlayedDate !== today) {
        localStorage.setItem(`typeRakDailyTypingTime-${currentActiveUser}`, String(duration / 60));
        localStorage.setItem(`typeRakLastPlayedDate-${currentActiveUser}`, today);

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayDateString = yesterday.toLocaleDateString();

        if (lastPlayedDate === yesterdayDateString) {
          localStorage.setItem(`typeRakDailyStreak-${currentActiveUser}`, String(stats.dailyStreak + 1));
        } else {
          localStorage.setItem(`typeRakDailyStreak-${currentActiveUser}`, '1');
        }

        const daysSinceLastVisit = lastPlayedDate ? (new Date(today).getTime() - new Date(lastPlayedDate).getTime()) / (1000 * 3600 * 24) : 0;
        localStorage.setItem(`typeRakDaysSinceLastVisit-${currentActiveUser}`, String(daysSinceLastVisit));
      } else {
        localStorage.setItem(`typeRakDailyTypingTime-${currentActiveUser}`, String(Number(localStorage.getItem(`typeRakDailyTypingTime-${currentActiveUser}`) || 0) + (duration / 60)));
      }
    }
  }, [typingGame.gameOver, currentActiveUser, checkAchievements, getUnlockedCount, duration]);

  useEffect(() => {
    localStorage.setItem('typeRakTheme', theme);
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('typeRakFontSize', String(fontSize));
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('typeRakFontStyle', fontStyle);
  }, [fontStyle]);

  useEffect(() => {
    localStorage.setItem('typeRakSoundEnabled', String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('typeRakBackgroundMusicEnabled', String(backgroundMusicEnabled));
  }, [backgroundMusicEnabled]);

  useEffect(() => {
    localStorage.setItem('typeRakMusicVolume', String(musicVolume));
  }, [musicVolume]);

  const handleIntroductionComplete = () => {
    // Introduction completion logic if needed
    console.log('Introduction completed');
  };

  const switchUser = (username: string) => {
    setCurrentActiveUser(username);
    localStorage.setItem('typeRakLastActiveUser', username);
    setToast({ message: `Switched to user: ${username}`, type: 'success' });
  };

  const handleCreateNewUser = (newUsername: string) => {
    if (usersList.includes(newUsername)) {
      setToast({ message: 'Username already exists. Please choose a different one.', type: 'error' });
      return;
    }

    const updatedUsersList = [...usersList, newUsername];
    setUsersList(updatedUsersList);
    localStorage.setItem('typeRakUsers', JSON.stringify(updatedUsersList));
    switchUser(newUsername);
    setToast({ message: `User "${newUsername}" created and activated!`, type: 'success' });
  };

  const handleDeleteUser = () => {
    if (deleteConfirmState) {
      const updatedUsersList = usersList.filter(user => user !== currentActiveUser);
      setUsersList(updatedUsersList);
      localStorage.setItem('typeRakUsers', JSON.stringify(updatedUsersList));
      localStorage.removeItem(`typeRakTestsCompleted-${currentActiveUser}`);
      localStorage.removeItem(`typeRakPerfectTests-${currentActiveUser}`);
      localStorage.removeItem(`typeRakDailyTypingTime-${currentActiveUser}`);
      localStorage.removeItem(`typeRakDailyStreak-${currentActiveUser}`);
      localStorage.removeItem(`typeRakLastPlayedDate-${currentActiveUser}`);
      localStorage.removeItem(`typeRakDaysSinceLastVisit-${currentActiveUser}`);
      localStorage.removeItem(`typeRakAchievements-${currentActiveUser}`);
      localStorage.removeItem('typeRakLastActiveUser');
      setCurrentActiveUser('');
      setToast({ message: `User "${currentActiveUser}" deleted!`, type: 'info' });
      setDeleteConfirmState(false);
    } else {
      setDeleteConfirmState(true);
    }
  };

  const applyTheme = (selectedTheme: string) => {
    setTheme(selectedTheme);
  };

  const handleHistoryClick = () => {
    setSideMenuOpen(false);
    setHistoryOpen(true);
  };

  const handleAchievementsClick = () => {
    setSideMenuOpen(false);
    setAchievementsOpen(true);
  };

  const handleContactMe = () => {
    window.open('mailto:raktherock@gmail.com', '_blank');
  };

  const getButtonColor = () => {
    switch (theme) {
      case 'cosmic-nebula': return '#a3b18a';
      case 'midnight-black': return '#f0ead6';
      case 'cotton-candy-glow': return '#fbcfe8';
      default: return '#a3b18a';
    }
  };

  const getFontFamilyString = (font: string) => {
    switch (font) {
      case 'roboto': return "'Roboto', sans-serif";
      case 'open-sans': return "'Open Sans', sans-serif";
      case 'lato': return "'Lato', sans-serif";
      case 'source-sans-pro': return "'Source Sans Pro', sans-serif";
      case 'inter': return "'Inter', sans-serif";
      case 'dancing-script': return "'Dancing Script', cursive";
      case 'pacifico': return "'Pacifico', cursive";
      default: return "'Inter', sans-serif";
    }
  };

  const handleTestNameConfirm = () => {
    if (newTestName.trim()) {
      // Handle test name confirmation
      setShowTestNameMenu(false);
      setNewTestName('');
    }
  };

  const handleTestNameCancel = () => {
    setShowTestNameMenu(false);
    setNewTestName('');
  };

  return (
    <div className="min-h-screen text-foreground font-sans transition-all duration-300 ease-in-out" style={{ fontFamily: getFontFamilyString(fontStyle), fontSize: `${fontSize}%` }}>
      <Toast message={toast?.message || ''} type={toast?.type || 'info'} onClose={() => setToast(null)} show={!!toast} />
      {recentAchievement && (
        <AchievementNotification
          title={recentAchievement.name}
          description={recentAchievement.subtitle}
          onClose={closeAchievementNotification}
          theme={theme}
        />
      )}

      <header className="flex items-center justify-between p-4 border-b border-muted">
        <div className="flex items-center gap-2">
          <button onClick={() => setSideMenuOpen(true)} className="p-2 rounded-md hover:bg-accent">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
          </button>
          <h1 className="text-2xl font-bold" style={{
            background: 'linear-gradient(135deg, #c471f2 0%, #f76cc6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>TypeRak</h1>
        </div>
        <TestNameMenu 
          showTestNameMenu={showTestNameMenu}
          newTestName={newTestName}
          setNewTestName={setNewTestName}
          onConfirm={handleTestNameConfirm}
          onCancel={handleTestNameCancel}
          getButtonColor={getButtonColor}
        />
        <StatsDisplay 
          elapsed={typingGame.elapsed}
          correctSigns={typingGame.correctCharacters}
          totalErrors={typingGame.totalErrors}
          currentErrorRate={typingGame.getCurrentErrorRate()}
          theme={theme}
        />
      </header>

      <main className="container mx-auto p-4 flex flex-col md:flex-row gap-4">
        <div className="md:w-3/4">
          <Introduction 
            onComplete={handleIntroductionComplete}
            gameOver={typingGame.gameOver}
            testActive={typingGame.testActive}
            resetTest={typingGame.resetTest}
            getUnlockedCount={getUnlockedCount}
            handleAchievementsClick={handleAchievementsClick}
          />
          <div ref={typingTestRef} className="typing-test-container">
            <TypingTest
              testText={typingGame.testText}
              pos={typingGame.pos}
              chars={typingGame.chars}
              theme={theme}
              onKeyDown={(e: KeyboardEvent) => {
                // Handle key press logic here
                if (!typingGame.testActive && !typingGame.gameOver) {
                  typingGame.setTestActive(true);
                  typingGame.startTimer(duration);
                  typingGame.renderText(typingGame.generateWords(200));
                }
                
                // Play sound effects
                playKeyboardSound();
              }}
              fontSize={fontSize}
              fontStyle={fontStyle}
            />
          </div>
        </div>
        <div className="md:w-1/4">
          <div className="bg-card p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Settings</h2>
            <p>Adjust your typing test settings here.</p>
          </div>
        </div>
      </main>

      {historyOpen && <HistoryPage onClose={() => setHistoryOpen(false)} />}
      {achievementsOpen && (
        <AchievementsPage
          achievements={achievements}
          onClose={() => setAchievementsOpen(false)}
          theme={theme}
        />
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
      />
    </div>
  );
};

export default Index;
