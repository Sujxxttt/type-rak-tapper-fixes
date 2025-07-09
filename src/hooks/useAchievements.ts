
import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface Achievement {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  condition: (stats: any) => boolean;
  progress?: number;
  maxProgress?: number;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'speed' | 'accuracy' | 'consistency' | 'fun' | 'milestone';
}

const ACHIEVEMENTS_CONFIG: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  // Speed Achievements (require 1+ minute duration)
  {
    id: 'halfway-hero',
    name: 'Halfway Hero',
    subtitle: 'Half of 100. Still all heart.',
    description: 'Hit 50 WPM for the first time (1+ minute test)',
    condition: (stats) => stats.wpm >= 50 && stats.duration >= 60,
    category: 'speed'
  },
  {
    id: 'wpm-rising',
    name: 'WPM Rising',
    subtitle: 'Feels good, doesn\'t it?',
    description: 'Hit 60 WPM for the first time (1+ minute test)',
    condition: (stats) => stats.wpm >= 60 && stats.duration >= 60,
    category: 'speed'
  },
  {
    id: 'typist-on-rise',
    name: 'Typist on the Rise',
    subtitle: 'Don\'t look down now. You\'re starting to pick up the pace.',
    description: 'Hit 70 WPM for the first time (1+ minute test)',
    condition: (stats) => stats.wpm >= 70 && stats.duration >= 60,
    category: 'speed'
  },
  {
    id: 'speed-class-unlocked',
    name: 'Speed Class Unlocked',
    subtitle: 'You\'ve left average behind.',
    description: 'Hit 80 WPM for the first time (1+ minute test)',
    condition: (stats) => stats.wpm >= 80 && stats.duration >= 60,
    category: 'speed'
  },
  {
    id: 'ninety-nine-problems',
    name: 'Ninety Nine Problems but Speed Ain\'t One',
    subtitle: 'So close to the century!',
    description: 'Hit exactly 99 WPM (1+ minute test)',
    condition: (stats) => stats.wpm === 99 && stats.duration >= 60,
    category: 'speed'
  },
  {
    id: 'hundred-club',
    name: 'Whoo !!! Hundred Club',
    subtitle: 'Hit 100 WPM. Welcome to the elite.',
    description: 'Achieve 100 WPM (1+ minute test)',
    condition: (stats) => stats.wpm >= 100 && stats.duration >= 60,
    category: 'speed'
  },
  {
    id: 'the-one',
    name: 'The One',
    subtitle: 'Welcome to the Top 1% Global. Legend. Untouchable. Mildly intimidating.',
    description: 'Hit 150 WPM (1+ minute test)',
    condition: (stats) => stats.wpm >= 150 && stats.duration >= 60,
    category: 'speed'
  },
  {
    id: 'global-menace',
    name: 'Global Menace',
    subtitle: 'You\'ve reached the summit. You\'re not near the top. You are the top.',
    description: 'Hit 180 WPM (1+ minute test)',
    condition: (stats) => stats.wpm >= 180 && stats.duration >= 60,
    category: 'speed'
  },

  // Accuracy Achievements
  {
    id: 'sniper-hands',
    name: 'Sniper Hands',
    subtitle: 'Every letter hit. Every. Single. Damn. One.',
    description: 'Get 0% error rate',
    condition: (stats) => stats.errorRate === 0,
    category: 'accuracy'
  },
  {
    id: 'precision-over-power',
    name: 'Precision Over Power',
    subtitle: 'Speed is cool, but accuracy is cooler.',
    description: 'Get error rate under 1%',
    condition: (stats) => stats.errorRate < 1 && stats.errorRate > 0,
    category: 'accuracy'
  },
  {
    id: 'perfectionist-club',
    name: 'Perfectionist Club',
    subtitle: 'Excellence is a habit.',
    description: 'Complete 5 typo-free tests',
    condition: (stats) => stats.perfectTests >= 5,
    progress: 0,
    maxProgress: 5,
    category: 'accuracy'
  },
  {
    id: 'clean-cutter',
    name: 'Clean Cutter',
    subtitle: 'Consistency in perfection.',
    description: 'Type clean across 3 sessions',
    condition: (stats) => stats.cleanSessions >= 3,
    progress: 0,
    maxProgress: 3,
    category: 'accuracy'
  },

  // Fun/Error Achievements
  {
    id: 'hit-everything-but-right',
    name: 'Hit Everything But the Right Keys',
    subtitle: 'Talent of a different kind.',
    description: 'Get error rate of more than 5%',
    condition: (stats) => stats.errorRate > 5,
    category: 'fun'
  },
  {
    id: 'spellchecker-help',
    name: 'May the Spellchecker Help You',
    subtitle: 'It\'s your only hope.',
    description: 'Get error rate of more than 8%',
    condition: (stats) => stats.errorRate > 8,
    category: 'fun'
  },

  // Milestone Achievements
  {
    id: 'new-recruit',
    name: 'New Recruit',
    subtitle: 'Completed your first test. Welcome aboard!',
    description: 'Complete your first typing test',
    condition: (stats) => stats.testsCompleted >= 1,
    category: 'milestone'
  },
  {
    id: 'rookie-cookie',
    name: 'Rookie Cookie',
    subtitle: 'Ten tests deep. Call yourself a learner now.',
    description: 'Complete 10 tests',
    condition: (stats) => stats.testsCompleted >= 10,
    progress: 0,
    maxProgress: 10,
    category: 'milestone'
  },
  {
    id: 'the-grinder',
    name: 'The Grinder',
    subtitle: 'Hit 50 tests. You have noticed the improvement Don\'t ya',
    description: 'Complete 50 tests',
    condition: (stats) => stats.testsCompleted >= 50,
    progress: 0,
    maxProgress: 50,
    category: 'milestone'
  },
  {
    id: 'bruisy-finger',
    name: 'BruisyFinger',
    subtitle: '100 tests Completed. You\'re Evolved',
    description: 'Complete 100 tests',
    condition: (stats) => stats.testsCompleted >= 100,
    progress: 0,
    maxProgress: 100,
    category: 'milestone'
  },

  // Time-based Achievements
  {
    id: 'the-focus-zone',
    name: 'The Focus Zone',
    subtitle: 'You locked in for Full 2 hours.',
    description: 'Type for 2 hours in a single day',
    condition: (stats) => stats.dailyTypingTime >= 7200, // 2 hours in seconds
    progress: 0,
    maxProgress: 7200,
    category: 'consistency'
  },
  {
    id: 'hour-of-power',
    name: 'The Hour of Power',
    subtitle: 'Full hour of finger breaking exercise.',
    description: 'Type for 3 hours in a single day',
    condition: (stats) => stats.dailyTypingTime >= 10800, // 3 hours
    progress: 0,
    maxProgress: 10800,
    category: 'consistency'
  },
  {
    id: 'ultimate-grind',
    name: 'The Ultimate Grind',
    subtitle: '5 hours. For what? For greatness. You have earned Rak\'s Respect',
    description: 'Type for 5 hours in a single day',
    condition: (stats) => stats.dailyTypingTime >= 18000, // 5 hours
    progress: 0,
    maxProgress: 18000,
    category: 'consistency'
  },

  // Consistency Achievements
  {
    id: 'consistent-chaos',
    name: 'Consistent Chaos',
    subtitle: 'Daily typing like it\'s therapy.',
    description: 'Use the website every day for 7 days straight',
    condition: (stats) => stats.dailyStreak >= 7,
    progress: 0,
    maxProgress: 7,
    category: 'consistency'
  },
  {
    id: 'logged-in-locked-on',
    name: 'Logged In, Locked On',
    subtitle: 'Dedication has a name.',
    description: 'Use the app daily for 15 days',
    condition: (stats) => stats.dailyStreak >= 15,
    progress: 0,
    maxProgress: 15,
    category: 'consistency'
  },
  {
    id: 'the-comeback',
    name: 'The Comeback',
    subtitle: 'Distance makes the heart grow fonder.',
    description: 'Return after 7+ days of break',
    condition: (stats) => stats.daysSinceLastVisit >= 7,
    category: 'consistency'
  },

  // Meta Achievement
  {
    id: 'achievement-collector',
    name: 'Achievement Collector',
    subtitle: 'You unlocked this for unlocking stuff.',
    description: 'Collect all other achievements',
    condition: (stats) => stats.unlockedAchievements >= 24, // Total other achievements
    progress: 0,
    maxProgress: 24,
    category: 'milestone'
  }
];

export const useAchievements = (currentUser: string) => {
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>(
    `achievements-${currentUser}`, 
    ACHIEVEMENTS_CONFIG.map(config => ({ ...config, unlocked: false }))
  );
  const [recentAchievement, setRecentAchievement] = useState<Achievement | null>(null);

  // Initialize achievements if user doesn't have them
  useEffect(() => {
    if (achievements.length !== ACHIEVEMENTS_CONFIG.length) {
      const updatedAchievements = ACHIEVEMENTS_CONFIG.map(config => {
        const existing = achievements.find(a => a.id === config.id);
        return existing || { ...config, unlocked: false };
      });
      setAchievements(updatedAchievements);
    }
  }, [currentUser]);

  const checkAchievements = (stats: any) => {
    const updatedAchievements = [...achievements];
    let newAchievements: Achievement[] = [];

    updatedAchievements.forEach((achievement, index) => {
      if (!achievement.unlocked && achievement.condition(stats)) {
        updatedAchievements[index] = {
          ...achievement,
          unlocked: true,
          unlockedAt: new Date().toISOString()
        };
        newAchievements.push(updatedAchievements[index]);
      }

      // Update progress for progress-based achievements
      if (achievement.maxProgress && !achievement.unlocked) {
        let progress = 0;
        switch (achievement.id) {
          case 'perfectionist-club':
            progress = Math.min(stats.perfectTests || 0, achievement.maxProgress);
            break;
          case 'clean-cutter':
            progress = Math.min(stats.cleanSessions || 0, achievement.maxProgress);
            break;
          case 'rookie-cookie':
          case 'the-grinder':
          case 'bruisy-finger':
            progress = Math.min(stats.testsCompleted || 0, achievement.maxProgress);
            break;
          case 'consistent-chaos':
          case 'logged-in-locked-on':
            progress = Math.min(stats.dailyStreak || 0, achievement.maxProgress);
            break;
          case 'the-focus-zone':
          case 'hour-of-power':
          case 'ultimate-grind':
            progress = Math.min(stats.dailyTypingTime || 0, achievement.maxProgress);
            break;
          case 'achievement-collector':
            progress = Math.min(stats.unlockedAchievements || 0, achievement.maxProgress);
            break;
        }
        updatedAchievements[index] = { ...achievement, progress };
      }
    });

    if (newAchievements.length > 0) {
      setAchievements(updatedAchievements);
      // Show the first new achievement
      setRecentAchievement(newAchievements[0]);
    }
  };

  const closeAchievementNotification = () => {
    setRecentAchievement(null);
  };

  const getUnlockedCount = () => {
    return achievements.filter(a => a.unlocked).length;
  };

  const getProgressForCategory = (category: string) => {
    const categoryAchievements = achievements.filter(a => a.category === category);
    const unlockedInCategory = categoryAchievements.filter(a => a.unlocked).length;
    return {
      unlocked: unlockedInCategory,
      total: categoryAchievements.length,
      percentage: Math.round((unlockedInCategory / categoryAchievements.length) * 100)
    };
  };

  return {
    achievements,
    recentAchievement,
    checkAchievements,
    closeAchievementNotification,
    getUnlockedCount,
    getProgressForCategory
  };
};
