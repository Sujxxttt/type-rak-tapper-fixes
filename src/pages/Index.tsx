import React, { useState, useEffect, useCallback } from 'react';
import { useStopwatch } from 'react-timer-hook';
import { useQuery } from '@tanstack/react-query';
import { fetchWPM, fetchHistory } from '../api';
import { calculateWPM, calculateErrorRate } from '../utils';
import { useTheme } from '../hooks/useTheme';
import { useUsername } from '../hooks/useUsername';
import { useAchievements } from '../hooks/useAchievements';
import { StatsDisplay } from '../components/StatsDisplay';
import { TypingText } from '../components/TypingText';
import { HistoryTable } from '../components/HistoryTable';
import { TypedTextPreview } from '../components/TypedTextPreview';
import { AchievementsPage } from '../components/AchievementsPage';
import { AchievementNotification } from '../components/AchievementNotification';
import { EasterEggPage } from '../components/EasterEggPage';
import { Trophy } from 'lucide-react';
import { EasterEggConfirmation } from '../components/EasterEggConfirmation';

const Index = () => {
  const [originalText, setOriginalText] = useState('');
  const [typedText, setTypedText] = useState('');
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'typing' | 'results' | 'history' | 'achievements' | 'easter-egg'>('dashboard');
  const [wpm, setWpm] = useState(0);
  const [errorRate, setErrorRate] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showEasterEggConfirmation, setShowEasterEggConfirmation] = useState(false);

  const { theme, getBackgroundGradient, getButtonColor } = useTheme();
  const { username } = useUsername();
  const {
    achievements,
    recentAchievement,
    checkAchievements,
    closeAchievementNotification,
    getUnlockedCount
  } = useAchievements(username);

  const {
    seconds,
    minutes,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: false });

  const { data: initialWPM } = useQuery({
    queryKey: ['wpm', username],
    queryFn: () => fetchWPM(username)
  });

  const { data: history } = useQuery({
    queryKey: ['history', username],
    queryFn: () => fetchHistory(username)
  });

  const [correctCharacters, setCorrectCharacters] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [testsCompleted, setTestsCompleted] = useState(0);
  const [perfectTests, setPerfectTests] = useState(0);
  const [dailyTypingTime, setDailyTypingTime] = useState(0);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [cleanSessions, setCleanSessions] = useState(0);
  const [daysSinceLastVisit, setDaysSinceLastVisit] = useState(0);

  useEffect(() => {
    const today = new Date();
    const lastVisit = localStorage.getItem('lastVisit');

    if (lastVisit) {
      const lastVisitDate = new Date(lastVisit);
      const diffInDays = Math.floor((today.getTime() - lastVisitDate.getTime()) / (1000 * 3600 * 24));
      setDaysSinceLastVisit(diffInDays);

      if (
        today.getFullYear() === lastVisitDate.getFullYear() &&
        today.getMonth() === lastVisitDate.getMonth() &&
        today.getDate() === lastVisitDate.getDate()
      ) {
        setDailyTypingTime(parseInt(localStorage.getItem('dailyTypingTime') || '0', 10));
        setDailyStreak(parseInt(localStorage.getItem('dailyStreak') || '0', 10));
      } else if (diffInDays === 1) {
        setDailyStreak(parseInt(localStorage.getItem('dailyStreak') || '0', 10) + 1);
        localStorage.setItem('dailyStreak', (parseInt(localStorage.getItem('dailyStreak') || '0', 10) + 1).toString());
        setDailyTypingTime(0);
      } else {
        setDailyStreak(0);
        localStorage.setItem('dailyStreak', '0');
        setDailyTypingTime(0);
      }
    } else {
      setDailyStreak(0);
      localStorage.setItem('dailyStreak', '0');
      setDailyTypingTime(0);
    }

    localStorage.setItem('lastVisit', today.toISOString());
  }, []);

  useEffect(() => {
    if (initialWPM) {
      setWpm(initialWPM.wmp || 0);
      setTestsCompleted(initialWPM.testsCompleted || 0);
      setErrorRate(initialWPM.errorRate || 0);
      setPerfectTests(initialWPM.perfectTests || 0);
      setCleanSessions(initialWPM.cleanSessions || 0);
    }
  }, [initialWPM]);

  useEffect(() => {
    fetch('https://api.quotable.io/random')
      .then(response => response.json())
      .then(data => setOriginalText(data.content))
      .catch(() => setOriginalText('The quick brown fox jumps over the lazy dog.'));
  }, []);

  const startTyping = () => {
    setCurrentScreen('typing');
    setTypedText('');
    setCorrectCharacters(0);
    setTotalErrors(0);
    start();
  };

  const handleTextChange = (text: string) => {
    setTypedText(text);
    if (text === originalText) {
      finishTyping();
    }
  };

  const finishTyping = () => {
    pause();
    const duration = minutes * 60 + seconds;
    const newWPM = calculateWPM(typedText, duration);
    const newErrorRate = calculateErrorRate(originalText, typedText);

    setWpm(newWPM);
    setErrorRate(newErrorRate);
    setCurrentScreen('results');

    const isPerfectTest = newErrorRate === 0;
    if (isPerfectTest) {
      setPerfectTests(prev => prev + 1);
    }

    const isCleanSession = newErrorRate < 1;
    if (isCleanSession) {
      setCleanSessions(prev => prev + 1);
    }

    setTestsCompleted(prev => prev + 1);

    const newDailyTypingTime = dailyTypingTime + Math.round(duration / 60);
    setDailyTypingTime(newDailyTypingTime);
    localStorage.setItem('dailyTypingTime', newDailyTypingTime.toString());

    checkAchievements({
      wpm: newWPM,
      errorRate: newErrorRate,
      duration: duration,
      testsCompleted: testsCompleted + 1,
      perfectTests: perfectTests + (isPerfectTest ? 1 : 0),
      unlockedAchievements: achievements.filter(a => a.unlocked).length,
      dailyTypingTime: newDailyTypingTime,
      dailyStreak: dailyStreak,
      cleanSessions: cleanSessions + (isCleanSession ? 1 : 0),
      daysSinceLastVisit: daysSinceLastVisit
    });

    saveResult(newWPM, newErrorRate, duration);
  };

  const saveResult = async (wpm: number, errorRate: number, duration: number) => {
    try {
      await fetch('/api/save-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          wmp: wmp,
          errorRate: errorRate,
          duration: duration,
        }),
      });
    } catch (error) {
      console.error('Error saving result:', error);
    }
  };

  const resetTyping = () => {
    setCurrentScreen('dashboard');
    reset();
    fetch('https://api.quotable.io/random')
      .then(response => response.json())
      .then(data => setOriginalText(data.content))
      .catch(() => setOriginalText('The quick brown fox jumps over the lazy dog.'));
  };

  const showHistory = () => {
    setCurrentScreen('history');
  };

  const showAchievements = () => {
    setCurrentScreen('achievements');
  };

  const getCurrentErrorRate = () => {
    if (typedText.length === 0) return 0;
    return calculateErrorRate(originalText, typedText);
  };

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollPosition = element.scrollTop;
    const maxScroll = element.scrollHeight - element.clientHeight;
    
    if (scrollPosition >= maxScroll - 10 && currentScreen === 'dashboard') {
      setShowEasterEggConfirmation(true);
    }
  }, [currentScreen]);

  const handleEasterEggConfirm = () => {
    setShowEasterEggConfirmation(false);
    setCurrentScreen('easter-egg');
  };

  const handleEasterEggCancel = () => {
    setShowEasterEggConfirmation(false);
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: getBackgroundGradient(),
        color: theme === 'cotton-candy-glow' ? '#333' : 'white',
        fontFamily: 'Arial, sans-serif',
        overflowX: 'hidden',
        transition: 'background 0.5s ease-in-out'
      }}
      onScroll={handleScroll}
    >
      {/* Achievement Notification - Only show when not typing and achievement exists */}
      {currentScreen !== 'typing' && recentAchievement && (
        <AchievementNotification 
          achievement={recentAchievement} 
          onClose={closeAchievementNotification} 
        />
      )}

      {/* Easter Egg Confirmation Dialog */}
      {showEasterEggConfirmation && (
        <EasterEggConfirmation
          theme={theme}
          onConfirm={handleEasterEggConfirm}
          onCancel={handleEasterEggCancel}
        />
      )}

      {currentScreen === 'dashboard' && (
        <div style={{
          padding: '20px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px'
          }}>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
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
              <p style={{
                fontSize: '1.1rem',
                opacity: 0.8,
                margin: '10px 0 0 0'
              }}>
                Welcome, {username}! Ready to type?
              </p>
            </div>
            <div>
              <button
                onClick={startTyping}
                style={{
                  background: getButtonColor(),
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  backdropFilter: 'blur(10px)'
                }}
              >
                Start Typing
              </button>
            </div>
          </header>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              padding: '30px',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>
                WPM
              </h3>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
                {wpm.toFixed(0)}
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', opacity: 0.8 }}>
                Words Per Minute
              </p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              padding: '30px',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>
                Error Rate
              </h3>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
                {errorRate.toFixed(2)}%
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', opacity: 0.8 }}>
                Accuracy Matters
              </p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              padding: '30px',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>
                Tests Completed
              </h3>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
                {testsCompleted}
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', opacity: 0.8 }}>
                Keep Going!
              </p>
            </div>

            {/* Achievement Box */}
            <div 
              onClick={() => setCurrentScreen('achievements')}
              style={{
                background: 'rgba(255, 215, 0, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '16px',
                padding: '30px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: 'scale(1)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Trophy size={32} style={{ color: '#ffd700', marginBottom: '15px' }} />
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#ffd700' }}>
                Achievements
              </h3>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
                {getUnlockedCount()}/{achievements.length}
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', opacity: 0.8 }}>
                Unlocked
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: 'bold',
              margin: 0
            }}>
              Typing History
            </h2>
            <button
              onClick={showHistory}
              style={{
                background: getButtonColor(),
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                backdropFilter: 'blur(10px)'
              }}
            >
              View All
            </button>
          </div>

          {history && Array.isArray(history) && history.length > 0 ? (
            <HistoryTable history={history.slice(0, 5)} />
          ) : (
            <p style={{
              fontSize: '1rem',
              opacity: 0.7,
              textAlign: 'center'
            }}>
              No history available. Start typing to see your results here!
            </p>
          )}
        </div>
      )}

      {/* Typing Test Screen */}
      {currentScreen === 'typing' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px'
        }}>
          <TypingText
            originalText={originalText}
            typedText={typedText}
            onTextChange={handleTextChange}
            theme={theme}
          />

          <StatsDisplay elapsed={seconds + (minutes * 60)} correctSigns={correctCharacters} totalErrors={totalErrors} currentErrorRate={getCurrentErrorRate()} theme={theme} />

          <button
            onClick={() => setShowPreview(true)}
            style={{
              background: getButtonColor(),
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              marginTop: '20px',
              backdropFilter: 'blur(10px)'
            }}
          >
            Preview Typed Text
          </button>

          <button
            onClick={resetTyping}
            style={{
              background: 'rgba(255, 0, 0, 0.7)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              marginTop: '10px',
              backdropFilter: 'blur(10px)'
            }}
          >
            Give Up
          </button>
        </div>
      )}

      {/* Results Screen */}
      {currentScreen === 'results' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '20px'
          }}>
            Typing Test Results
          </h2>
          <StatsDisplay elapsed={seconds + (minutes * 60)} correctSigns={correctCharacters} totalErrors={totalErrors} currentErrorRate={errorRate} theme={theme} />
          <p style={{
            fontSize: '1.2rem',
            marginBottom: '30px'
          }}>
            WPM: {wpm.toFixed(2)} | Error Rate: {errorRate.toFixed(2)}%
          </p>
          <button
            onClick={resetTyping}
            style={{
              background: getButtonColor(),
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              backdropFilter: 'blur(10px)'
            }}
          >
            Back to Dashboard
          </button>
        </div>
      )}

      {/* History Screen */}
      {currentScreen === 'history' && (
        <div style={{
          padding: '20px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '20px'
          }}>
            Typing History
          </h2>
          {history && Array.isArray(history) && history.length > 0 ? (
            <HistoryTable history={history} />
          ) : (
            <p style={{
              fontSize: '1rem',
              opacity: 0.7,
              textAlign: 'center'
            }}>
              No history available. Start typing to see your results here!
            </p>
          )}
          <button
            onClick={resetTyping}
            style={{
              background: getButtonColor(),
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              marginTop: '20px',
              backdropFilter: 'blur(10px)'
            }}
          >
            Back to Dashboard
          </button>
        </div>
      )}

      {/* Achievements Screen */}
      {currentScreen === 'achievements' && (
        <AchievementsPage
          achievements={achievements}
          onBack={resetTyping}
          theme={theme}
          getButtonColor={getButtonColor}
        />
      )}

      {/* Easter Egg Screen */}
      {currentScreen === 'easter-egg' && (
        <EasterEggPage theme={theme} onGoBack={resetTyping} />
      )}

      {showPreview && (
        <TypedTextPreview
          typedText={typedText}
          originalText={originalText}
          theme={theme}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default Index;
