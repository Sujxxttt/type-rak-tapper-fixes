
import { useState, useCallback } from 'react';
import { Achievement, AchievementNotification } from '../types/achievements';
import { useLocalStorage } from './useLocalStorage';

const defaultAchievements: Achievement[] = [
  {
    id: 'learning-sprout',
    name: 'The Learning Sprout',
    subtitle: 'Good Job on hitting 50 WPM for the first time',
    wpmRequired: 50,
    timeRequired: 60,
    icon: '🌱',
    unlocked: false
  },
  {
    id: 'steady-climber',
    name: 'The Steady Climber',
    subtitle: 'Keep Going Buddy',
    wpmRequired: 60,
    timeRequired: 60,
    icon: '🧗',
    unlocked: false
  },
  {
    id: 'journey-begun',
    name: 'Journey Just Begun',
    subtitle: 'You\'re on the right path to mastery',
    wpmRequired: 70,
    timeRequired: 60,
    icon: '🚀',
    unlocked: false
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    subtitle: 'Impressive speed and consistency',
    wpmRequired: 80,
    timeRequired: 60,
    icon: '⚡',
    unlocked: false
  },
  {
    id: 'typing-master',
    name: 'Typing Master',
    subtitle: 'You\'ve reached elite typing speeds',
    wpmRequired: 90,
    timeRequired: 60,
    icon: '👑',
    unlocked: false
  }
];

export const useAchievements = (currentUser: string) => {
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>(
    `typeRakAchievements-${currentUser}`,
    defaultAchievements
  );
  const [notification, setNotification] = useState<AchievementNotification | null>(null);

  const checkAchievements = useCallback((wpm: number, testDuration: number) => {
    console.log('Checking achievements for WPM:', wpm, 'Duration:', testDuration);
    
    const newAchievements = [...achievements];
    let newUnlocked: Achievement | null = null;

    for (let i = 0; i < newAchievements.length; i++) {
      const achievement = newAchievements[i];
      
      if (!achievement.unlocked && 
          wpm >= achievement.wpmRequired && 
          testDuration >= achievement.timeRequired) {
        
        console.log('Achievement unlocked:', achievement.name);
        newAchievements[i] = {
          ...achievement,
          unlocked: true,
          unlockedAt: new Date().toISOString()
        };
        
        if (!newUnlocked) {
          newUnlocked = newAchievements[i];
        }
      }
    }

    if (newUnlocked) {
      setAchievements(newAchievements);
      setNotification({
        achievement: newUnlocked,
        show: true
      });
    }
  }, [achievements, setAchievements]);

  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const getUnlockedAchievements = useCallback(() => {
    return achievements.filter(a => a.unlocked);
  }, [achievements]);

  const getProgress = useCallback(() => {
    const unlocked = achievements.filter(a => a.unlocked).length;
    const total = achievements.length;
    return { unlocked, total, percentage: (unlocked / total) * 100 };
  }, [achievements]);

  return {
    achievements,
    notification,
    checkAchievements,
    dismissNotification,
    getUnlockedAchievements,
    getProgress
  };
};
