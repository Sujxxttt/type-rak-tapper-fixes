
import React, { useState, useEffect, useRef } from 'react';
import { useTimer } from 'react-timer-hook';
import { useQuery } from '@tanstack/react-query';
import { fetchLeaderboard, fetchHistory } from '../api';
import { formatTime, getRandomText } from '../utils';
import { useTheme } from '../hooks/useTheme';
import { useUsername } from '../hooks/useUsername';
import { useAchievements } from '../hooks/useAchievements';

import { TypingText } from '../components/TypingText';
import { HistoryTable } from '../components/HistoryTable';
import { Introduction } from '../components/Introduction';
import { StatsDisplay } from '../components/StatsDisplay';
import { SideMenu } from '../components/SideMenu';
import { TestNameMenu } from '../components/TestNameMenu';
import { CustomDurationSlider } from '../components/CustomDurationSlider';
import { HistoryPage } from '../components/HistoryPage';
import { EasterEggPage } from '../components/EasterEggPage';
import { AchievementsPage } from '../components/AchievementsPage';
import { AchievementNotification } from '../components/AchievementNotification';
import { TypedTextPreview } from '../components/TypedTextPreview';
import { EasterEggConfirmation } from '../components/EasterEggConfirmation';
import { AchievementBox } from '../components/AchievementBox';

interface HistoryEntry {
  wpm: number;
  errorRate: number;
  date: string;
}

interface LeaderboardEntry {
  username: string;
  wpm: number;
}

const initialText = getRandomText('short');
const testNames = ['short', 'medium', 'long'];

const Index = () => {
  const [testDuration, setTestDuration] = useState<number>(1);
  const [selectedTest, setSelectedTest] = useState<string>('short');
  const [currentText, setCurrentText] = useState<string>(initialText);
  const [typedText, setTypedText] = useState<string>('');
  const [testActive, setTestActive] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [wpm, setWpm] = useState<number>(0);
  const [errorRate, setErrorRate] = useState<number>(0);
  const [showTypedTextPreview, setShowTypedTextPreview] = useState(false);
  const [showIntroduction, setShowIntroduction] = useState(true);
  const [showEasterEggConfirmation, setShowEasterEggConfirmation] = useState(false);
  const [currentPage, setCurrentPage] = useState('typing');
  
  const { theme, toggleTheme } = useTheme();
  const { username, setUsername } = useUsername();
  const { achievements, recentAchievement, checkAchievements, closeAchievementNotification, getUnlockedCount } = useAchievements(username);

  const { data: leaderboardData } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboard,
  });
  
  const { data: historyData } = useQuery({
    queryKey: ['history', username],
    queryFn: () => fetchHistory(username),
  });

  const timerExpiry = new Date();
  timerExpiry.setSeconds(timerExpiry.getSeconds() + (testDuration * 60));
  const { seconds, minutes, isRunning, start, pause, resume, restart } = useTimer({
    expiryTimestamp: timerExpiry,
    onExpire: () => handleTestComplete()
  });

  // Scroll detection for easter egg
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      if (scrollPosition >= documentHeight - 10 && currentPage === 'typing' && !showEasterEggConfirmation) {
        setShowEasterEggConfirmation(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage, showEasterEggConfirmation]);

  useEffect(() => {
    setCurrentText(getRandomText(selectedTest));
  }, [selectedTest]);

  useEffect(() => {
    if (minutes === 0 && seconds === 0 && testActive) {
      handleTestComplete();
    }
  }, [minutes, seconds, testActive]);

  const handleTestComplete = () => {
    if (testActive) {
      setTestActive(false);
      pause();
      
      const elapsedTimeInMinutes = (testDuration * 60 - (minutes * 60 + seconds)) / 60;
      const wordsTyped = typedText.split(' ').length;
      const calculatedWpm = Math.round(wordsTyped / elapsedTimeInMinutes);
      const errors = Array.from(typedText).reduce((acc, char, index) => {
        return acc + (char !== currentText[index] ? 1 : 0);
      }, 0);
      const calculatedErrorRate = ((errors / typedText.length) * 100) || 0;

      setWpm(calculatedWpm);
      setErrorRate(calculatedErrorRate);
      setShowResults(true);

      // Check achievements
      const stats = {
        wpm: calculatedWpm,
        errorRate: calculatedErrorRate,
        duration: elapsedTimeInMinutes,
        testsCompleted: (Array.isArray(historyData) ? historyData.length : 0) + 1,
        perfectTests: calculatedErrorRate === 0 ? 1 : 0,
        unlockedAchievements: getUnlockedCount(),
        dailyTypingTime: elapsedTimeInMinutes,
        dailyStreak: 1,
        cleanSessions: 1,
        daysSinceLastVisit: 0
      };
      
      checkAchievements(stats);
    }
  };

  const getBackgroundStyle = () => {
    switch (theme) {
      case 'midnight-black':
        return {
          background: '#0a0a0a',
          color: 'white'
        };
      case 'cotton-candy-glow':
        return {
          background: 'linear-gradient(135deg, #12cff3, #5ab2f7)',
          color: 'white'
        };
      case 'cosmic-nebula':
      default:
        return {
          background: 'linear-gradient(45deg, #400354, #03568c)',
          color: 'white'
        };
    }
  };

  const getButtonColor = () => {
    switch (theme) {
      case 'midnight-black':
        return '#c559f7';
      case 'cotton-candy-glow':
        return '#ff59e8';
      case 'cosmic-nebula':
      default:
        return '#b109d6';
    }
  };

  if (showIntroduction) {
    return (
      <Introduction
        onComplete={() => setShowIntroduction(false)}
        theme={theme}
        currentTheme={theme}
      />
    );
  }

  if (currentPage === 'history') {
    return (
      <HistoryPage
        allTestHistory={Array.isArray(historyData) ? historyData.slice(-10) : []}
        onBack={() => setCurrentPage('typing')}
        theme={theme}
        getButtonColor={getButtonColor}
      />
    );
  }

  if (currentPage === 'easter-egg') {
    return (
      <EasterEggPage
        onGoBack={() => setCurrentPage('typing')}
        theme={theme}
      />
    );
  }

  if (currentPage === 'achievements') {
    return (
      <AchievementsPage
        achievements={achievements}
        onBack={() => setCurrentPage('typing')}
        theme={theme}
        getButtonColor={getButtonColor}
      />
    );
  }

  return (
    <div style={{
      ...getBackgroundStyle(),
      minHeight: '100vh',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1
          onClick={() => setShowIntroduction(true)}
          style={{
            backgroundImage: theme === 'midnight-black' ? 
              'linear-gradient(90deg, #c559f7 0%, #7f59f7 100%)' :
              theme === 'cotton-candy-glow' ?
              'linear-gradient(90deg, #fc03df 0%, #ff3be8 100%)' :
              'linear-gradient(45deg, #b109d6 0%, #0c6dc2 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '2.5rem',
            fontWeight: 700,
            margin: 0,
            cursor: 'pointer'
          }}
        >
          TypeWave
        </h1>
        <SideMenu
          theme={theme}
          toggleTheme={toggleTheme}
          onShowHistory={() => setCurrentPage('history')}
          username={username}
          onUsernameChange={setUsername}
        />
      </div>

      {/* Dashboard Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <StatsDisplay
          bestWpm={Array.isArray(historyData) && historyData.length > 0 ? Math.max(...historyData.map((h: any) => h.wpm)) : 0}
          testsCompleted={Array.isArray(historyData) ? historyData.length : 0}
          avgErrorRate={Array.isArray(historyData) && historyData.length > 0 ? historyData.reduce((acc: number, h: any) => acc + h.errorRate, 0) / historyData.length : 0}
          theme={theme}
        />
        
        <AchievementBox
          unlockedCount={getUnlockedCount()}
          totalCount={achievements.length}
          onClick={() => setCurrentPage('achievements')}
          theme={theme}
        />
      </div>

      {/* Test Configuration */}
      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        <TestNameMenu
          showTestNameMenu={false}
          newTestName={selectedTest}
          setNewTestName={setSelectedTest}
          onConfirm={() => {}}
          onCancel={() => {}}
          getButtonColor={getButtonColor}
        />
        <CustomDurationSlider
          value={testDuration}
          onChange={setTestDuration}
          theme={theme}
        />
      </div>

      {/* Typing Area */}
      <TypingText
        text={currentText}
        typedText={typedText}
        onTypedTextChange={setTypedText}
        onTestStart={() => {
          setTestActive(true);
          start();
        }}
        theme={theme}
        testActive={testActive}
        showResults={showResults}
        wpm={wpm}
        errorRate={errorRate}
        timeLeft={minutes * 60 + seconds}
        onRestart={() => {
          setTestActive(false);
          setShowResults(false);
          setTypedText('');
          setCurrentText(getRandomText(selectedTest));
          const newExpiry = new Date();
          newExpiry.setSeconds(newExpiry.getSeconds() + (testDuration * 60));
          restart(newExpiry);
        }}
        onShowTypedText={() => setShowTypedTextPreview(true)}
      />

      {/* Recent History */}
      {Array.isArray(historyData) && historyData.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ 
            fontSize: '1.5rem', 
            marginBottom: '20px',
            color: 'white'
          }}>
            Recent Tests
          </h3>
          <HistoryTable 
            history={historyData.slice(-5)}
            theme={theme}
          />
        </div>
      )}

      {/* Modals and Notifications */}
      {showTypedTextPreview && (
        <TypedTextPreview
          typedText={typedText}
          originalText={currentText}
          theme={theme}
          onClose={() => setShowTypedTextPreview(false)}
        />
      )}

      {showEasterEggConfirmation && (
        <EasterEggConfirmation
          isOpen={showEasterEggConfirmation}
          onConfirm={() => {
            setShowEasterEggConfirmation(false);
            setCurrentPage('easter-egg');
          }}
          onClose={() => setShowEasterEggConfirmation(false)}
          theme={theme}
        />
      )}

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
