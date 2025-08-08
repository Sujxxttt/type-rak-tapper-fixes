
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
  cheatUsageCount?: number;
  totalVisitedDays?: number;
  daysSinceFirstLogin?: number;
  easterEggFound?: boolean;
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
      id: 'youre-not-slow-anymore',
      name: 'You\'re Not Slow Anymore',
      subtitle: '60 WPM — welcome to the real game.',
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
      condition: (stats) => stats.wpm === 99
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
      condition: (stats) => stats.errorRate === 0
    },
    {
      id: 'precision-power',
      name: 'Precision Over Power',
      subtitle: 'Speed is cool, but accuracy is cooler.',
      description: 'Maintain an error rate below 1%.',
      category: 'accuracy',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.errorRate < 1
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
      id: 'till-typing-do-us-part',
      name: 'Till Typing Do Us Part',
      subtitle: 'No logout could end this bond. And I mean that from the bottom of my cache.',
      description: 'Complete 500 typing tests.',
      category: 'milestone',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.testsCompleted >= 500
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
      id: 'key-commitment',
      name: 'Key Commitment',
      subtitle: 'You did it. One week, zero skips.',
      description: 'Use the app daily for 7 consecutive days.',
      category: 'consistency',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.dailyStreak >= 7
    },
    {
      id: 'consistent-chaos',
      name: 'Consistent Chaos',
      subtitle: 'Daily typing like it\'s therapy.',
      description: 'Use the app daily for 15 consecutive days.',
      category: 'consistency',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.dailyStreak >= 15
    },
    {
      id: 'logged-locked',
      name: 'Logged In, Locked On',
      subtitle: 'Used the app daily for 30 days.',
      description: 'Maintain a 30-day daily usage streak.',
      category: 'consistency',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.dailyStreak >= 30
    },
    {
      id: 'frequent-flyer',
      name: 'Frequent Flyer',
      subtitle: 'Your visits are basically scheduled.',
      description: 'Visit the app on 50 different days.',
      category: 'consistency',
      wpm: 0,
      unlocked: false,
      condition: (stats) => (stats.totalVisitedDays || 0) >= 50
    },
    {
      id: 'that-one-typing-guy',
      name: 'That One Typing Guy',
      subtitle: 'You\'re not addicted. You\'re just... extremely attached.',
      description: 'Visit the app on 100 different days.',
      category: 'consistency',
      wpm: 0,
      unlocked: false,
      condition: (stats) => (stats.totalVisitedDays || 0) >= 100
    },
    {
      id: 'loyal-keypresser',
      name: 'Loyal Keypresser',
      subtitle: '200 days Since We Met in. Just saying',
      description: 'It has been 200 days since your first login.',
      category: 'consistency',
      wpm: 0,
      unlocked: false,
      condition: (stats) => (stats.daysSinceFirstLogin || 0) >= 200
    },
    {
      id: 'typing-together-forever',
      name: 'Typing Together, Forever',
      subtitle: '300 Days.You stayed long enough for us to care deeply.',
      description: 'It has been 300 days since your first login.',
      category: 'consistency',
      wpm: 0,
      unlocked: false,
      condition: (stats) => (stats.daysSinceFirstLogin || 0) >= 300
    },
    {
      id: 'its-been-a-year-love',
      name: 'It\'s Been a Year, Love',
      subtitle: 'Happy Typeiversary. You never wrote a love letter — but every test felt like one.',
      description: 'It has been 365 days since your first login.',
      category: 'consistency',
      wpm: 0,
      unlocked: false,
      condition: (stats) => (stats.daysSinceFirstLogin || 0) >= 365
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
      description: 'Type for 1 hour in a single day.',
      category: 'milestone',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.dailyTypingTime >= 60
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
      id: 'wait-that-works',
      name: 'Wait, That Works?',
      subtitle: 'You found the secret. Now don\'t abuse it... too much.',
      description: 'Use the cheat code for the first time.',
      category: 'fun',
      wpm: 0,
      unlocked: false,
      condition: (stats) => (stats.cheatUsageCount || 0) >= 1
    },
    {
      id: 'effort-is-overrated',
      name: 'Effort is Overrated right ?',
      subtitle: 'I dont see any actual reason for it , but you do',
      description: 'Use the cheat code 10 times.',
      category: 'fun',
      wpm: 0,
      unlocked: false,
      condition: (stats) => (stats.cheatUsageCount || 0) >= 10
    },
    {
      id: 'full-test-never-heard',
      name: 'Full Test? Never Heard of It',
      subtitle: 'You\'re allergic to full sessions, huh?',
      description: 'Use the cheat code 50 times.',
      category: 'fun',
      wpm: 0,
      unlocked: false,
      condition: (stats) => (stats.cheatUsageCount || 0) >= 50
    },
    {
      id: 'legendary-skipper',
      name: 'Legendary Skipper',
      subtitle: 'You\'re the reason we made this badge.',
      description: 'Use the cheat code 100 times.',
      category: 'fun',
      wpm: 0,
      unlocked: false,
      condition: (stats) => (stats.cheatUsageCount || 0) >= 100
    },
    {
      id: 'you-found-it',
      name: 'You Found It',
      subtitle: 'What were you hoping for? Definitely not this',
      description: 'Access the easter egg for the first time.',
      category: 'fun',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.easterEggFound === true
    },
    {
      id: 'achievement-collector',
      name: 'Achievement Collector',
      subtitle: 'You unlocked this for unlocking stuff.',
      description: 'Unlock 30 other achievements.',
      category: 'milestone',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.unlockedAchievements >= 30
    }
  ];

  // Calculate progress for achievements
  const calculateProgress = (achievement: Achievement, stats: AchievementStats): { progress: number; maxProgress: number } => {
    if (achievement.unlocked) return { progress: 0, maxProgress: 0 };

    switch (achievement.id) {
      case 'new-recruit':
        return { progress: stats.testsCompleted, maxProgress: 1 };
      case 'rookie-cookie':
        return { progress: Math.min(stats.testsCompleted, 10), maxProgress: 10 };
      case 'halfway-hero':
        return { progress: Math.min(stats.wpm, 50), maxProgress: 50 };
      case 'youre-not-slow-anymore':
        return { progress: Math.min(stats.wpm, 60), maxProgress: 60 };
      case 'typist-on-rise':
        return { progress: Math.min(stats.wpm, 70), maxProgress: 70 };
      case 'speed-class':
        return { progress: Math.min(stats.wpm, 80), maxProgress: 80 };
      case 'ninety-nine':
        return { progress: Math.min(stats.wpm, 99), maxProgress: 99 };
      case 'hundred-club':
        return { progress: Math.min(stats.wpm, 100), maxProgress: 100 };
      case 'the-one':
        return { progress: Math.min(stats.wpm, 150), maxProgress: 150 };
      case 'global-menace':
        return { progress: Math.min(stats.wpm, 180), maxProgress: 180 };
      case 'grinder':
        return { progress: Math.min(stats.testsCompleted, 50), maxProgress: 50 };
      case 'bruisy-finger':
        return { progress: Math.min(stats.testsCompleted, 100), maxProgress: 100 };
      case 'till-typing-do-us-part':
        return { progress: Math.min(stats.testsCompleted, 500), maxProgress: 500 };
      case 'perfectionist':
        return { progress: Math.min(stats.perfectTests, 5), maxProgress: 5 };
      case 'key-commitment':
        return { progress: Math.min(stats.dailyStreak, 7), maxProgress: 7 };
      case 'consistent-chaos':
        return { progress: Math.min(stats.dailyStreak, 15), maxProgress: 15 };
      case 'logged-locked':
        return { progress: Math.min(stats.dailyStreak, 30), maxProgress: 30 };
      case 'frequent-flyer':
        return { progress: Math.min(stats.totalVisitedDays || 0, 50), maxProgress: 50 };
      case 'that-one-typing-guy':
        return { progress: Math.min(stats.totalVisitedDays || 0, 100), maxProgress: 100 };
      case 'loyal-keypresser':
        return { progress: Math.min(stats.daysSinceFirstLogin || 0, 200), maxProgress: 200 };
      case 'typing-together-forever':
        return { progress: Math.min(stats.daysSinceFirstLogin || 0, 300), maxProgress: 300 };
      case 'its-been-a-year-love':
        return { progress: Math.min(stats.daysSinceFirstLogin || 0, 365), maxProgress: 365 };
      case 'focus-zone':
        return { progress: Math.min(stats.dailyTypingTime, 120), maxProgress: 120 };
      case 'hour-power':
        return { progress: Math.min(stats.dailyTypingTime, 60), maxProgress: 60 };
      case 'ultimate-grind':
        return { progress: Math.min(stats.dailyTypingTime, 300), maxProgress: 300 };
      case 'wait-that-works':
        return { progress: Math.min(stats.cheatUsageCount || 0, 1), maxProgress: 1 };
      case 'effort-is-overrated':
        return { progress: Math.min(stats.cheatUsageCount || 0, 10), maxProgress: 10 };
      case 'full-test-never-heard':
        return { progress: Math.min(stats.cheatUsageCount || 0, 50), maxProgress: 50 };
      case 'legendary-skipper':
        return { progress: Math.min(stats.cheatUsageCount || 0, 100), maxProgress: 100 };
      case 'achievement-collector':
        return { progress: Math.min(stats.unlockedAchievements, 30), maxProgress: 30 };
      default:
        return { progress: 0, maxProgress: 1 };
    }
  };

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
      const { progress, maxProgress } = calculateProgress(achievement, stats);
      
      if (!achievement.unlocked && achievement.condition(stats)) {
        // Achievement unlocked!
        setRecentAchievement({
          name: achievement.name,
          subtitle: achievement.subtitle,
          wpm: achievement.wpm
        });
        return { ...achievement, unlocked: true, unlockedAt: new Date().toISOString(), progress, maxProgress };
      }
      return { ...achievement, progress, maxProgress };
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
