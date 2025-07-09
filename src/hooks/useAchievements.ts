
import { useState, useCallback } from 'react';

interface Achievement {
  name: string;
  subtitle: string;
  wpm: number;
  unlocked: boolean;
}

const ACHIEVEMENTS = [
  { wpm: 50, name: "The Learning Sprout", subtitle: "Good Job on hitting 50 WPM for the first time!" },
  { wpm: 60, name: "The Steady Climber", subtitle: "Keep Going Buddy!" },
  { wpm: 70, name: "Journey Just Begun", subtitle: "You're on the right track!" },
  { wpm: 80, name: "Speed Demon", subtitle: "Impressive typing speed!" },
  { wpm: 90, name: "Lightning Fingers", subtitle: "Your fingers are flying!" },
  { wpm: 100, name: "Century Club", subtitle: "Welcome to the 100 WPM club!" }
];

export const useAchievements = () => {
  const [unlockedAchievements, setUnlockedAchievements] = useState<number[]>(() => {
    const saved = localStorage.getItem('typewave-achievements');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentNotification, setCurrentNotification] = useState<Achievement | null>(null);

  const checkAchievements = useCallback((wpm: number, duration: number) => {
    // Only check for achievements if test was 1 minute or longer
    if (duration < 60) return;

    const newAchievements = ACHIEVEMENTS.filter(achievement => 
      wpm >= achievement.wpm && !unlockedAchievements.includes(achievement.wpm)
    );

    if (newAchievements.length > 0) {
      // Show the highest achievement unlocked
      const highestAchievement = newAchievements[newAchievements.length - 1];
      setCurrentNotification({
        ...highestAchievement,
        unlocked: true
      });

      // Update unlocked achievements
      const newUnlocked = [...unlockedAchievements, ...newAchievements.map(a => a.wpm)];
      setUnlockedAchievements(newUnlocked);
      localStorage.setItem('typewave-achievements', JSON.stringify(newUnlocked));
    }
  }, [unlockedAchievements]);

  const clearNotification = useCallback(() => {
    setCurrentNotification(null);
  }, []);

  const getAllAchievements = useCallback(() => {
    return ACHIEVEMENTS.map(achievement => ({
      ...achievement,
      unlocked: unlockedAchievements.includes(achievement.wpm)
    }));
  }, [unlockedAchievements]);

  return {
    checkAchievements,
    currentNotification,
    clearNotification,
    getAllAchievements,
    unlockedAchievements
  };
};
