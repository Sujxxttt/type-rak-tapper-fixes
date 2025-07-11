
import { useState, useEffect } from 'react';

export interface Achievement {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  category: string;
  wpm: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
  condition: (stats: AchievementStats) => boolean;
}

export interface AchievementStats {
  wpm: number;
  errorRate: number;
  duration: number;
  testsCompleted: number;
  perfectTests: number;
  unlockedAchievements: number;
  dailyTypingTime: number;
  dailyStreak: number;
  cleanSessions: number;
  daysSinceLastVisit: number;
}

export const useAchievements = (username: string) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentAchievement, setRecentAchievement] = useState<{ name: string; subtitle: string; wpm: number } | null>(null);

  // Define all achievements with proper conditions
  const allAchievements: Achievement[] = [
    {
      id: 'new-recruit',
      name: 'New Recruit',
      subtitle: 'Completed your first test. Welcome aboard!',
      description: 'Complete your very first typing test to unlock this achievement.',
      category: 'milestone',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.testsCompleted >= 1
    },
    {
      id: 'rookie-cookie',
      name: 'Rookie Cookie',
      subtitle: 'Ten tests deep. Call yourself a learner now.',
      description: 'Complete 10 typing tests to show your dedication.',
      category: 'milestone',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.testsCompleted >= 10
    },
    {
      id: 'halfway-hero',
      name: 'Halfway Hero',
      subtitle: 'Half of 100. Still all heart.',
      description: 'Achieve 50 WPM in a typing test.',
      category: 'speed',
      wpm: 50,
      unlocked: false,
      condition: (stats) => stats.wpm >= 50
    },
    {
      id: 'wpm-rising',
      name: 'WPM Rising',
      subtitle: 'Feels good, doesn\'t it?',
      description: 'Reach 60 WPM for the first time.',
      category: 'speed',
      wpm: 60,
      unlocked: false,
      condition: (stats) => stats.wpm >= 60
    },
    {
      id: 'typist-on-rise',
      name: 'Typist on the Rise',
      subtitle: 'Don\'t look down now. You\'re starting to pick up the pace.',
      description: 'Hit 70 WPM and join the ranks of skilled typists.',
      category: 'speed',
      wpm: 70,
      unlocked: false,
      condition: (stats) => stats.wpm >= 70
    },
    {
      id: 'speed-class',
      name: 'Speed Class Unlocked',
      subtitle: 'You\'ve left average behind.',
      description: 'Achieve 80 WPM and leave the average typist behind.',
      category: 'speed',
      wpm: 80,
      unlocked: false,
      condition: (stats) => stats.wpm >= 80
    },
    {
      id: 'ninety-nine',
      name: 'Ninety Nine Problems but Speed Ain\'t One',
      subtitle: 'Hit exactly 99 WPM. So close to triple digits!',
      description: 'Achieve exactly 99 WPM in a typing test.',
      category: 'speed',
      wpm: 99,
      unlocked: false,
      condition: (stats) => Math.floor(stats.wpm) === 99
    },
    {
      id: 'hundred-club',
      name: 'Whoo !!! Hundred Club',
      subtitle: 'Hit 100 WPM. Welcome to the elite.',
      description: 'Join the exclusive 100 WPM club.',
      category: 'speed',
      wpm: 100,
      unlocked: false,
      condition: (stats) => stats.wpm >= 100
    },
    {
      id: 'the-one',
      name: 'The One',
      subtitle: 'Welcome to the Top 1% Global. Legend. Untouchable. Mildly intimidating.',
      description: 'Achieve 150 WPM and become legendary.',
      category: 'speed',
      wpm: 150,
      unlocked: false,
      condition: (stats) => stats.wpm >= 150
    },
    {
      id: 'global-menace',
      name: 'Global Menace',
      subtitle: 'You\'ve reached the summit. You\'re not near the top. You are the top.',
      description: 'Reach 180 WPM and dominate the leaderboards.',
      category: 'speed',
      wpm: 180,
      unlocked: false,
      condition: (stats) => stats.wpm >= 180
    },
    {
      id: 'sniper-hands',
      name: 'Sniper Hands',
      subtitle: 'Every letter hit. Every. Single. Damn. One.',
      description: 'Complete a test with 0% error rate.',
      category: 'accuracy',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.errorRate === 0 && stats.testsCompleted > 0
    },
    {
      id: 'precision-power',
      name: 'Precision Over Power',
      subtitle: 'Speed is cool, but accuracy is cooler.',
      description: 'Maintain an error rate below 1%.',
      category: 'accuracy',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.errorRate < 1 && stats.errorRate >= 0 && stats.testsCompleted > 0
    },
    {
      id: 'hit-everything',
      name: 'Hit Everything But the Right Keys',
      subtitle: 'Talent of a different kind.',
      description: 'Achieve an error rate above 5%.',
      category: 'fun',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.errorRate > 5
    },
    {
      id: 'spellchecker',
      name: 'May the Spellchecker Help You',
      subtitle: 'It\'s your only hope.',
      description: 'Reach an error rate above 8%.',
      category: 'fun',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.errorRate > 8
    },
    {
      id: 'grinder',
      name: 'The Grinder',
      subtitle: 'Hit 50 tests. You have noticed the improvement Don\'t ya.',
      description: 'Complete 50 typing tests.',
      category: 'milestone',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.testsCompleted >= 50
    },
    {
      id: 'bruisy-finger',
      name: 'BruisyFinger',
      subtitle: '100 tests Completed. You\'re Evolved.',
      description: 'Complete 100 typing tests.',
      category: 'milestone',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.testsCompleted >= 100
    },
    {
      id: 'perfectionist',
      name: 'Perfectionist Club',
      subtitle: '5 typo-free tests.',
      description: 'Complete 5 tests with perfect accuracy.',
      category: 'accuracy',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.perfectTests >= 5
    },
    {
      id: 'clean-cutter',
      name: 'Clean Cutter',
      subtitle: 'Typed clean across 3 sessions.',
      description: 'Complete 3 clean typing sessions.',
      category: 'consistency',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.cleanSessions >= 3
    },
    {
      id: 'consistent-chaos',
      name: 'Consistent Chaos',
      subtitle: 'Daily typing like it\'s therapy.',
      description: 'Use the app daily for 7 consecutive days.',
      category: 'consistency',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.dailyStreak >= 7
    },
    {
      id: 'logged-locked',
      name: 'Logged In, Locked On',
      subtitle: 'Used the app daily for 15 days.',
      description: 'Maintain a 15-day daily usage streak.',
      category: 'consistency',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.dailyStreak >= 15
    },
    {
      id: 'comeback',
      name: 'The Comeback',
      subtitle: 'Returned after 7+ days of break.',
      description: 'Return to the app after a 7+ day break.',
      category: 'fun',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.daysSinceLastVisit >= 7
    },
    {
      id: 'focus-zone',
      name: 'The Focus Zone',
      subtitle: 'You locked in for Full 2 hours.',
      description: 'Type for 2 hours in a single day.',
      category: 'milestone',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.dailyTypingTime >= 120
    },
    {
      id: 'hour-power',
      name: 'The Hour of Power',
      subtitle: 'Full hour of finger breaking exercise.',
      description: 'Type for 3 hours in a single day.',
      category: 'milestone',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.dailyTypingTime >= 180
    },
    {
      id: 'ultimate-grind',
      name: 'The Ultimate Grind',
      subtitle: '5 hours. For what? For greatness. You have earned Rak\'s Respect.',
      description: 'Type for 5 hours in a single day.',
      category: 'milestone',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.dailyTypingTime >= 300
    },
    {
      id: 'achievement-collector',
      name: 'Achievement Collector',
      subtitle: 'You unlocked this for unlocking stuff.',
      description: 'Unlock 23 other achievements.',
      category: 'milestone',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.unlockedAchievements >= 23
    }
  ];

  // Load achievements from localStorage
  useEffect(() => {
    if (!username) return;
    
    const savedAchievements = localStorage.getItem(`typeRakAchievements-${username}`);
    if (savedAchievements) {
      try {
        const parsed = JSON.parse(savedAchievements);
        const updatedAchievements = allAchievements.map(achievement => {
          const saved = parsed.find((a: Achievement) => a.id === achievement.id);
          return saved ? { ...achievement, unlocked: saved.unlocked, unlockedAt: saved.unlockedAt } : achievement;
        });
        setAchievements(updatedAchievements);
      } catch (error) {
        console.error('Error loading achievements:', error);
        setAchievements(allAchievements);
      }
    } else {
      setAchievements(allAchievements);
    }
  }, [username]);

  const checkAchievements = (stats: AchievementStats) => {
    if (!username || achievements.length === 0) return;

    const updatedAchievements = achievements.map(achievement => {
      if (!achievement.unlocked && achievement.condition(stats)) {
        // Achievement unlocked!
        console.log(`Achievement unlocked: ${achievement.name}`);
        setRecentAchievement({
          name: achievement.name,
          subtitle: achievement.subtitle,
          wpm: achievement.wpm
        });
        return { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() };
      }
      return achievement;
    });

    // Only update if there are changes
    const hasChanges = updatedAchievements.some((achievement, index) => 
      achievement.unlocked !== achievements[index].unlocked
    );

    if (hasChanges) {
      setAchievements(updatedAchievements);
      localStorage.setItem(`typeRakAchievements-${username}`, JSON.stringify(updatedAchievements));
    }
  };

  const closeAchievementNotification = () => {
    setRecentAchievement(null);
  };

  const getUnlockedCount = () => {
    return achievements.filter(a => a.unlocked).length;
  };

  return {
    achievements,
    recentAchievement,
    checkAchievements,
    closeAchievementNotification,
    getUnlockedCount
  };
};
