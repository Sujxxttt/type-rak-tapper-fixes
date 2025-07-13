
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
  getProgress?: (stats: AchievementStats) => { current: number; max: number };
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
  totalVisitDays?: number;
  daysSinceFirstLogin?: number;
  cheatUsage?: number;
  maxWPM?: number;
  easterEggVisited?: boolean;
}

export const useAchievements = (username: string) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentAchievement, setRecentAchievement] = useState<{ name: string; subtitle: string; wpm: number } | null>(null);

  // Define all achievements
  const allAchievements: Achievement[] = [
    {
      id: 'new-recruit',
      name: 'New Recruit',
      subtitle: 'Completed your first test. Welcome aboard!',
      description: 'Complete your very first typing test to unlock this achievement.',
      category: 'milestone',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.testsCompleted >= 1,
      getProgress: (stats) => ({ current: Math.min(stats.testsCompleted, 1), max: 1 })
    },
    {
      id: 'rookie-cookie',
      name: 'Rookie Cookie',
      subtitle: 'Ten tests deep. Call yourself a learner now.',
      description: 'Complete 10 typing tests to show your dedication.',
      category: 'milestone',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.testsCompleted >= 10,
      getProgress: (stats) => ({ current: Math.min(stats.testsCompleted, 10), max: 10 })
    },
    {
      id: 'halfway-hero',
      name: 'Halfway Hero',
      subtitle: 'Half of 100. Still all heart.',
      description: 'Achieve 50 WPM in a typing test.',
      category: 'speed',
      wpm: 50,
      unlocked: false,
      condition: (stats) => stats.wpm >= 50,
      getProgress: (stats) => ({ current: Math.min(stats.maxWPM || stats.wpm, 50), max: 50 })
    },
    {
      id: 'you-not-slow-anymore',
      name: "You're Not Slow Anymore",
      subtitle: '60 WPM — welcome to the real game.',
      description: 'Reach 60 WPM for the first time.',
      category: 'speed',
      wpm: 60,
      unlocked: false,
      condition: (stats) => stats.wpm >= 60,
      getProgress: (stats) => ({ current: Math.min(stats.maxWPM || stats.wpm, 60), max: 60 })
    },
    {
      id: 'typist-on-rise',
      name: 'Typist on the Rise',
      subtitle: 'Don\'t look down now. You\'re starting to pick up the pace.',
      description: 'Hit 70 WPM and join the ranks of skilled typists.',
      category: 'speed',
      wpm: 70,
      unlocked: false,
      condition: (stats) => stats.wpm >= 70,
      getProgress: (stats) => ({ current: Math.min(stats.maxWPM || stats.wpm, 70), max: 70 })
    },
    {
      id: 'speed-class',
      name: 'Speed Class Unlocked',
      subtitle: 'You\'ve left average behind.',
      description: 'Achieve 80 WPM and leave the average typist behind.',
      category: 'speed',
      wpm: 80,
      unlocked: false,
      condition: (stats) => stats.wpm >= 80,
      getProgress: (stats) => ({ current: Math.min(stats.maxWPM || stats.wpm, 80), max: 80 })
    },
    {
      id: 'ninety-nine',
      name: 'Ninety Nine Problems but Speed Ain\'t One',
      subtitle: 'Hit exactly 99 WPM. So close to triple digits!',
      description: 'Achieve exactly 99 WPM in a typing test.',
      category: 'speed',
      wpm: 99,
      unlocked: false,
      condition: (stats) => stats.wpm === 99,
      getProgress: (stats) => ({ current: Math.min(stats.maxWPM || stats.wpm, 99), max: 99 })
    },
    {
      id: 'hundred-club',
      name: 'Whoo !!! Hundred Club',
      subtitle: 'Hit 100 WPM. Welcome to the elite.',
      description: 'Join the exclusive 100 WPM club.',
      category: 'speed',
      wpm: 100,
      unlocked: false,
      condition: (stats) => stats.wpm >= 100,
      getProgress: (stats) => ({ current: Math.min(stats.maxWPM || stats.wpm, 100), max: 100 })
    },
    {
      id: 'the-one',
      name: 'The One',
      subtitle: 'Welcome to the Top 1% Global. Legend. Untouchable. Mildly intimidating.',
      description: 'Achieve 150 WPM and become legendary.',
      category: 'speed',
      wpm: 150,
      unlocked: false,
      condition: (stats) => stats.wpm >= 150,
      getProgress: (stats) => ({ current: Math.min(stats.maxWPM || stats.wpm, 150), max: 150 })
    },
    {
      id: 'global-menace',
      name: 'Global Menace',
      subtitle: 'You\'ve reached the summit. You\'re not near the top. You are the top.',
      description: 'Reach 180 WPM and dominate the leaderboards.',
      category: 'speed',
      wpm: 180,
      unlocked: false,
      condition: (stats) => stats.wpm >= 180,
      getProgress: (stats) => ({ current: Math.min(stats.maxWPM || stats.wpm, 180), max: 180 })
    },
    {
      id: 'sniper-hands',
      name: 'Sniper Hands',
      subtitle: 'Every letter hit. Every. Single. Damn. One.',
      description: 'Complete a test with 0% error rate.',
      category: 'accuracy',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.errorRate === 0,
      getProgress: (stats) => ({ current: stats.errorRate === 0 ? 1 : 0, max: 1 })
    },
    {
      id: 'precision-power',
      name: 'Precision Over Power',
      subtitle: 'Speed is cool, but accuracy is cooler.',
      description: 'Maintain an error rate below 1%.',
      category: 'accuracy',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.errorRate < 1,
      getProgress: (stats) => ({ current: Math.max(0, 1 - stats.errorRate), max: 1 })
    },
    {
      id: 'hit-everything',
      name: 'Hit Everything But the Right Keys',
      subtitle: 'Talent of a different kind.',
      description: 'Achieve an error rate above 5%.',
      category: 'fun',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.errorRate > 5,
      getProgress: (stats) => ({ current: Math.max(0, stats.errorRate), max: 5 })
    },
    {
      id: 'spellchecker',
      name: 'May the Spellchecker Help You',
      subtitle: 'It\'s your only hope.',
      description: 'Reach an error rate above 8%.',
      category: 'fun',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.errorRate > 8,
      getProgress: (stats) => ({ current: Math.max(0, stats.errorRate), max: 8 })
    },
    {
      id: 'grinder',
      name: 'The Grinder',
      subtitle: 'Hit 50 tests. You have noticed the improvement Don\'t ya.',
      description: 'Complete 50 typing tests.',
      category: 'milestone',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.testsCompleted >= 50,
      getProgress: (stats) => ({ current: Math.min(stats.testsCompleted, 50), max: 50 })
    },
    {
      id: 'bruisy-finger',
      name: 'BruisyFinger',
      subtitle: '100 tests Completed. You\'re Evolved.',
      description: 'Complete 100 typing tests.',
      category: 'milestone',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.testsCompleted >= 100,
      getProgress: (stats) => ({ current: Math.min(stats.testsCompleted, 100), max: 100 })
    },
    {
      id: 'till-typing-do-us-part',
      name: 'Till Typing Do Us Part',
      subtitle: 'No logout could end this bond. And I mean that from the bottom of my cache.',
      description: 'Complete 500 typing tests.',
      category: 'milestone',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.testsCompleted >= 500,
      getProgress: (stats) => ({ current: Math.min(stats.testsCompleted, 500), max: 500 })
    },
    {
      id: 'perfectionist',
      name: 'Perfectionist Club',
      subtitle: '5 typo-free tests.',
      description: 'Complete 5 tests with perfect accuracy.',
      category: 'accuracy',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.perfectTests >= 5,
      getProgress: (stats) => ({ current: Math.min(stats.perfectTests, 5), max: 5 })
    },
    {
      id: 'key-commitment',
      name: 'Key Commitment',
      subtitle: 'You did it. One week, zero skips.',
      description: 'Use the app daily for 7 consecutive days.',
      category: 'consistency',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.dailyStreak >= 7,
      getProgress: (stats) => ({ current: Math.min(stats.dailyStreak, 7), max: 7 })
    },
    {
      id: 'logged-locked',
      name: 'Logged In, Locked On',
      subtitle: 'Used the app daily for 15 days.',
      description: 'Maintain a 15-day daily usage streak.',
      category: 'consistency',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.dailyStreak >= 15,
      getProgress: (stats) => ({ current: Math.min(stats.dailyStreak, 15), max: 15 })
    },
    {
      id: 'frequent-flyer',
      name: 'Frequent Flyer',
      subtitle: 'Your visits are basically scheduled.',
      description: 'Visit the app for 50 total days.',
      category: 'consistency',
      wpm: 0,
      unlocked: false,
      condition: (stats) => (stats.totalVisitDays || 0) >= 50,
      getProgress: (stats) => ({ current: Math.min(stats.totalVisitDays || 0, 50), max: 50 })
    },
    {
      id: 'that-one-typing-guy',
      name: 'That One Typing Guy',
      subtitle: 'You\'re not addicted. You\'re just... extremely attached.',
      description: 'Visit the app for 100 total days.',
      category: 'consistency',
      wpm: 0,
      unlocked: false,
      condition: (stats) => (stats.totalVisitDays || 0) >= 100,
      getProgress: (stats) => ({ current: Math.min(stats.totalVisitDays || 0, 100), max: 100 })
    },
    {
      id: 'loyal-keypresser',
      name: 'Loyal Keypresser',
      subtitle: '200 days Since We Met. Just saying.',
      description: '200 days since first login.',
      category: 'consistency',
      wpm: 0,
      unlocked: false,
      condition: (stats) => (stats.daysSinceFirstLogin || 0) >= 200,
      getProgress: (stats) => ({ current: Math.min(stats.daysSinceFirstLogin || 0, 200), max: 200 })
    },
    {
      id: 'typing-together-forever',
      name: 'Typing Together, Forever',
      subtitle: '300 Days. You stayed long enough for us to care deeply.',
      description: '300 days since first login.',
      category: 'consistency',
      wpm: 0,
      unlocked: false,
      condition: (stats) => (stats.daysSinceFirstLogin || 0) >= 300,
      getProgress: (stats) => ({ current: Math.min(stats.daysSinceFirstLogin || 0, 300), max: 300 })
    },
    {
      id: 'its-been-a-year',
      name: 'It\'s Been a Year, Love',
      subtitle: 'Happy Typeiversary. You never wrote a love letter — but every test felt like one.',
      description: '365 days since first login.',
      category: 'consistency',
      wpm: 0,
      unlocked: false,
      condition: (stats) => (stats.daysSinceFirstLogin || 0) >= 365,
      getProgress: (stats) => ({ current: Math.min(stats.daysSinceFirstLogin || 0, 365), max: 365 })
    },
    {
      id: 'comeback',
      name: 'The Comeback',
      subtitle: 'Returned after 7+ days of break.',
      description: 'Return to the app after a 7+ day break.',
      category: 'fun',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.daysSinceLastVisit >= 7,
      getProgress: (stats) => ({ current: Math.min(stats.daysSinceLastVisit, 7), max: 7 })
    },
    {
      id: 'the-hour-of-power',
      name: 'The Hour of Power',
      subtitle: 'Full hour of finger breaking exercise.',
      description: 'Type for 60 minutes in a single day.',
      category: 'milestone',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.dailyTypingTime >= 60,
      getProgress: (stats) => ({ current: Math.min(stats.dailyTypingTime, 60), max: 60 })
    },
    {
      id: 'focus-zone',
      name: 'The Focus Zone',
      subtitle: 'You locked in for Full 2 hours.',
      description: 'Type for 2 hours in a single day.',
      category: 'milestone',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.dailyTypingTime >= 120,
      getProgress: (stats) => ({ current: Math.min(stats.dailyTypingTime, 120), max: 120 })
    },
    {
      id: 'ultimate-grind',
      name: 'The Ultimate Grind',
      subtitle: '5 hours. For what? For greatness. You have earned Rak\'s Respect.',
      description: 'Type for 5 hours in a single day.',
      category: 'milestone',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.dailyTypingTime >= 300,
      getProgress: (stats) => ({ current: Math.min(stats.dailyTypingTime, 300), max: 300 })
    },
    {
      id: 'wait-that-works',
      name: 'Wait, That Works?',
      subtitle: 'You found the secret. Now don\'t abuse it... too much.',
      description: 'Access the cheat code for the first time.',
      category: 'fun',
      wpm: 0,
      unlocked: false,
      condition: (stats) => (stats.cheatUsage || 0) >= 1,
      getProgress: (stats) => ({ current: Math.min(stats.cheatUsage || 0, 1), max: 1 })
    },
    {
      id: 'effort-overrated',
      name: 'Effort is Overrated right?',
      subtitle: 'I dont see any actual reason for it, but you do.',
      description: 'Use the cheat code 10 times.',
      category: 'fun',
      wpm: 0,
      unlocked: false,
      condition: (stats) => (stats.cheatUsage || 0) >= 10,
      getProgress: (stats) => ({ current: Math.min(stats.cheatUsage || 0, 10), max: 10 })
    },
    {
      id: 'full-test-never-heard',
      name: 'Full Test? Never Heard of It',
      subtitle: 'You\'re allergic to full sessions, huh?',
      description: 'Use the cheat code 50 times.',
      category: 'fun',
      wpm: 0,
      unlocked: false,
      condition: (stats) => (stats.cheatUsage || 0) >= 50,
      getProgress: (stats) => ({ current: Math.min(stats.cheatUsage || 0, 50), max: 50 })
    },
    {
      id: 'legendary-skipper',
      name: 'Legendary Skipper',
      subtitle: 'You\'re the reason we made this badge.',
      description: 'Use the cheat code 100 times.',
      category: 'fun',
      wpm: 0,
      unlocked: false,
      condition: (stats) => (stats.cheatUsage || 0) >= 100,
      getProgress: (stats) => ({ current: Math.min(stats.cheatUsage || 0, 100), max: 100 })
    },
    {
      id: 'you-found-it',
      name: 'You Found It',
      subtitle: 'What were you hoping for? Definitely not this.',
      description: 'Visit the easter egg page.',
      category: 'fun',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.easterEggVisited === true,
      getProgress: (stats) => ({ current: stats.easterEggVisited ? 1 : 0, max: 1 })
    },
    {
      id: 'achievement-collector',
      name: 'Achievement Collector',
      subtitle: 'You unlocked this for unlocking stuff.',
      description: 'Unlock 23 other achievements.',
      category: 'milestone',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.unlockedAchievements >= 23,
      getProgress: (stats) => ({ current: Math.min(stats.unlockedAchievements, 23), max: 23 })
    }
  ];

  // Load achievements from localStorage
  useEffect(() => {
    const savedAchievements = localStorage.getItem(`typeRakAchievements-${username}`);
    if (savedAchievements) {
      const parsed = JSON.parse(savedAchievements);
      const updatedAchievements = allAchievements.map(achievement => {
        const saved = parsed.find((a: Achievement) => a.id === achievement.id);
        return saved ? { ...achievement, unlocked: saved.unlocked, unlockedAt: saved.unlockedAt } : achievement;
      });
      setAchievements(updatedAchievements);
    } else {
      setAchievements(allAchievements);
    }
  }, [username]);

  const checkAchievements = (stats: AchievementStats) => {
    const updatedAchievements = achievements.map(achievement => {
      // Update progress for all achievements
      if (achievement.getProgress) {
        const progress = achievement.getProgress(stats);
        achievement.progress = progress.current;
        achievement.maxProgress = progress.max;
      }

      if (!achievement.unlocked && achievement.condition(stats)) {
        // Achievement unlocked!
        setRecentAchievement({
          name: achievement.name,
          subtitle: achievement.subtitle,
          wpm: achievement.wpm
        });
        return { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() };
      }
      return achievement;
    });

    setAchievements(updatedAchievements);
    localStorage.setItem(`typeRakAchievements-${username}`, JSON.stringify(updatedAchievements));
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
