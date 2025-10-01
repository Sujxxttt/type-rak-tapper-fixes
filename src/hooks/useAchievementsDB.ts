import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  progressFunction?: (stats: AchievementStats) => number;
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
  cheatUsageCount: number;
  totalVisitDays: number;
  daysSinceFirstLogin: number;
  currentDailyTypingMinutes: number;
}

export const useAchievementsDB = (username: string) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentAchievement, setRecentAchievement] = useState<{ name: string; subtitle: string; wpm: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const calculateAccuracy = (correct: number, incorrect: number) => {
    const total = correct + incorrect;
    return total > 0 ? (correct / total) * 100 : 100;
  };

  const calculateWPM = (correct: number, time: number) => {
    const minutes = time / 60;
    return minutes > 0 ? correct / minutes : 0;
  };

  const checkAndUnlockAchievement = (
    achievementsList: Achievement[],
    achievementId: string,
    condition: (stats: AchievementStats) => boolean,
    stats: AchievementStats
  ): Achievement[] => {
    return achievementsList.map((achievement) => {
      if (achievement.id === achievementId && condition(stats)) {
        return { ...achievement, unlocked: true };
      }
      return achievement;
    });
  };

  const updateAchievementProgress = (
    achievementsList: Achievement[],
    achievementId: string,
    progressFunction: (stats: AchievementStats) => number,
    stats: AchievementStats
  ): Achievement[] => {
    return achievementsList.map((achievement) => {
      if (achievement.id === achievementId && progressFunction) {
        return { ...achievement, progress: progressFunction(stats) };
      }
      return achievement;
    });
  };

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
      maxProgress: 10,
      progressFunction: (stats) => Math.min(stats.testsCompleted, 10),
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
      maxProgress: 50,
      progressFunction: (stats) => Math.min(stats.wpm, 50),
      condition: (stats) => stats.wpm >= 50
    },
    {
      id: 'you-not-slow-anymore',
      name: 'You\'re Not Slow Anymore',
      subtitle: '60 WPM — welcome to the real game.',
      description: 'Reach 60 WPM for the first time.',
      category: 'speed',
      wpm: 60,
      unlocked: false,
      maxProgress: 60,
      progressFunction: (stats) => Math.min(stats.wpm, 60),
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
      maxProgress: 70,
      progressFunction: (stats) => Math.min(stats.wpm, 70),
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
      maxProgress: 80,
      progressFunction: (stats) => Math.min(stats.wpm, 80),
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
      maxProgress: 100,
      progressFunction: (stats) => Math.min(stats.wpm, 100),
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
      maxProgress: 150,
      progressFunction: (stats) => Math.min(stats.wpm, 150),
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
      maxProgress: 180,
      progressFunction: (stats) => Math.min(stats.wpm, 180),
      condition: (stats) => stats.wpm >= 180
    },
    {
      id: 'wait-that-works',
      name: 'Wait, That Works?',
      subtitle: 'You found the secret. Now don\'t abuse it... too much.',
      description: 'Access the cheat code for the first time.',
      category: 'fun',
      wpm: 0,
      unlocked: false,
      condition: (stats) => stats.cheatUsageCount >= 1
    },
    {
      id: 'effort-overrated',
      name: 'Effort is Overrated right?',
      subtitle: 'I dont see any actual reason for it, but you do.',
      description: 'Use the cheat code 10 times.',
      category: 'fun',
      wpm: 0,
      unlocked: false,
      maxProgress: 10,
      progressFunction: (stats) => Math.min(stats.cheatUsageCount, 10),
      condition: (stats) => stats.cheatUsageCount >= 10
    },
    {
      id: 'full-test-never-heard',
      name: 'Full Test? Never Heard of It',
      subtitle: 'You\'re allergic to full sessions, huh?',
      description: 'Use the cheat code 50 times.',
      category: 'fun',
      wpm: 0,
      unlocked: false,
      maxProgress: 50,
      progressFunction: (stats) => Math.min(stats.cheatUsageCount, 50),
      condition: (stats) => stats.cheatUsageCount >= 50
    },
    {
      id: 'legendary-skipper',
      name: 'Legendary Skipper',
      subtitle: 'You\'re the reason we made this badge.',
      description: 'Use the cheat code 100 times.',
      category: 'fun',
      wpm: 0,
      unlocked: false,
      maxProgress: 100,
      progressFunction: (stats) => Math.min(stats.cheatUsageCount, 100),
      condition: (stats) => stats.cheatUsageCount >= 100
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
      maxProgress: 50,
      progressFunction: (stats) => Math.min(stats.testsCompleted, 50),
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
      maxProgress: 100,
      progressFunction: (stats) => Math.min(stats.testsCompleted, 100),
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
      maxProgress: 5,
      progressFunction: (stats) => Math.min(stats.perfectTests, 5),
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
      maxProgress: 7,
      progressFunction: (stats) => Math.min(stats.dailyStreak, 7),
      condition: (stats) => stats.dailyStreak >= 7
    },
    {
      id: 'frequent-flyer',
      name: 'Frequent Flyer',
      subtitle: 'Your visits are basically scheduled.',
      description: 'Visit the app on 50 different days.',
      category: 'consistency',
      wpm: 0,
      unlocked: false,
      maxProgress: 50,
      progressFunction: (stats) => Math.min(stats.totalVisitDays, 50),
      condition: (stats) => stats.totalVisitDays >= 50
    },
    {
      id: 'that-one-typing-guy',
      name: 'That One Typing Guy',
      subtitle: 'You\'re not addicted. You\'re just... extremely attached.',
      description: 'Visit the app on 100 different days.',
      category: 'consistency',
      wpm: 0,
      unlocked: false,
      maxProgress: 100,
      progressFunction: (stats) => Math.min(stats.totalVisitDays, 100),
      condition: (stats) => stats.totalVisitDays >= 100
    },
    {
      id: 'loyal-keypresser',
      name: 'Loyal Keypresser',
      subtitle: '200 days Since We Met. Just saying.',
      description: '200 days since your first login.',
      category: 'consistency',
      wpm: 0,
      unlocked: false,
      maxProgress: 200,
      progressFunction: (stats) => Math.min(stats.daysSinceFirstLogin, 200),
      condition: (stats) => stats.daysSinceFirstLogin >= 200
    },
    {
      id: 'typing-together-forever',
      name: 'Typing Together, Forever',
      subtitle: '300 Days. You stayed long enough for us to care deeply.',
      description: '300 days since your first login.',
      category: 'consistency',
      wpm: 0,
      unlocked: false,
      maxProgress: 300,
      progressFunction: (stats) => Math.min(stats.daysSinceFirstLogin, 300),
      condition: (stats) => stats.daysSinceFirstLogin >= 300
    },
    {
      id: 'its-been-a-year-love',
      name: 'It\'s Been a Year, Love',
      subtitle: 'Happy Typeiversary. You never wrote a love letter — but every test felt like one.',
      description: '365 days since your first login.',
      category: 'consistency',
      wpm: 0,
      unlocked: false,
      maxProgress: 365,
      progressFunction: (stats) => Math.min(stats.daysSinceFirstLogin, 365),
      condition: (stats) => stats.daysSinceFirstLogin >= 365
    },
    {
      id: 'till-typing-do-us-part',
      name: 'Till Typing Do Us Part',
      subtitle: 'No logout could end this bond. And I mean that from the bottom of my cache.',
      description: 'Complete 500 tests.',
      category: 'milestone',
      wpm: 0,
      unlocked: false,
      maxProgress: 500,
      progressFunction: (stats) => Math.min(stats.testsCompleted, 500),
      condition: (stats) => stats.testsCompleted >= 500
    },
    {
      id: 'logged-locked',
      name: 'Logged In, Locked On',
      subtitle: 'Used the app daily for 15 days.',
      description: 'Maintain a 15-day daily usage streak.',
      category: 'consistency',
      wpm: 0,
      unlocked: false,
      maxProgress: 15,
      progressFunction: (stats) => Math.min(stats.dailyStreak, 15),
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
      maxProgress: 120,
      progressFunction: (stats) => Math.min(stats.currentDailyTypingMinutes, 120),
      condition: (stats) => stats.currentDailyTypingMinutes >= 120
    },
    {
      id: 'hour-power',
      name: 'The Hour of Power',
      subtitle: 'Full hour of finger breaking exercise.',
      description: 'Type for 60 minutes in a single day.',
      category: 'milestone',
      wpm: 0,
      unlocked: false,
      maxProgress: 60,
      progressFunction: (stats) => Math.min(stats.currentDailyTypingMinutes, 60),
      condition: (stats) => stats.currentDailyTypingMinutes >= 60
    },
    {
      id: 'ultimate-grind',
      name: 'The Ultimate Grind',
      subtitle: '5 hours. For what? For greatness. You have earned Rak\'s Respect.',
      description: 'Type for 5 hours in a single day.',
      category: 'milestone',
      wpm: 0,
      unlocked: false,
      maxProgress: 300,
      progressFunction: (stats) => Math.min(stats.currentDailyTypingMinutes, 300),
      condition: (stats) => stats.currentDailyTypingMinutes >= 300
    },
    {
      id: 'achievement-collector',
      name: 'Achievement Collector',
      subtitle: 'You unlocked this for unlocking stuff.',
      description: 'Unlock 30 other achievements.',
      category: 'milestone',
      wpm: 0,
      unlocked: false,
      maxProgress: 30,
      progressFunction: (stats) => Math.min(stats.unlockedAchievements, 30),
      condition: (stats) => stats.unlockedAchievements >= 30
    }
  ];

  // Load achievements from database
  useEffect(() => {
    loadAchievements();
  }, [username]);

  const loadAchievements = async () => {
    try {
      // Fetch user achievements from database
      const { data: dbAchievements, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', username);

      if (error) throw error;

      // Fetch user stats
      const { data: userStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', username)
        .single();

      // Merge database data with achievement definitions
      const mergedAchievements = allAchievements.map(achievement => {
        const dbAchievement = dbAchievements?.find(a => a.achievement_id === achievement.id);
        
        if (dbAchievement) {
          return {
            ...achievement,
            unlocked: dbAchievement.unlocked,
            unlockedAt: dbAchievement.unlocked_at,
            progress: dbAchievement.progress
          };
        }

        // Calculate progress from user stats if available
        if (achievement.progressFunction && userStats) {
          const stats = buildStatsFromDB(userStats);
          return {
            ...achievement,
            progress: achievement.progressFunction(stats)
          };
        }

        return achievement;
      });

      setAchievements(mergedAchievements);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading achievements:', error);
      setIsLoading(false);
    }
  };

  const buildStatsFromDB = (userStats: any): AchievementStats => {
    const daysSinceLastVisit = userStats.last_visit 
      ? Math.floor((Date.now() - new Date(userStats.last_visit).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    const daysSinceFirstLogin = userStats.first_login
      ? Math.floor((Date.now() - new Date(userStats.first_login).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    return {
      wpm: userStats.max_wpm || 0,
      errorRate: 0,
      duration: 0,
      testsCompleted: userStats.total_tests || 0,
      perfectTests: userStats.perfect_tests || 0,
      unlockedAchievements: 0,
      dailyTypingTime: 0,
      dailyStreak: userStats.daily_streak || 0,
      cleanSessions: 0,
      daysSinceLastVisit,
      cheatUsageCount: userStats.cheat_count || 0,
      totalVisitDays: userStats.total_visit_days || 0,
      daysSinceFirstLogin,
      currentDailyTypingMinutes: userStats.daily_typing_minutes || 0
    };
  };

  const checkAchievements = async (stats: AchievementStats) => {
    const updatedAchievements = [...achievements];
    let newlyUnlocked: Achievement | null = null;

    for (let i = 0; i < updatedAchievements.length; i++) {
      const achievement = updatedAchievements[i];
      
      if (!achievement.unlocked && achievement.condition(stats)) {
        // Unlock achievement
        updatedAchievements[i] = {
          ...achievement,
          unlocked: true,
          unlockedAt: new Date().toISOString()
        };
        newlyUnlocked = updatedAchievements[i];

        // Save to database
        await supabase
          .from('achievements')
          .upsert({
            user_id: username,
            achievement_id: achievement.id,
            unlocked: true,
            unlocked_at: new Date().toISOString(),
            progress: achievement.maxProgress || 0
          }, {
            onConflict: 'user_id,achievement_id'
          });
      } else if (achievement.progressFunction && achievement.maxProgress) {
        // Update progress
        const progress = achievement.progressFunction(stats);
        updatedAchievements[i] = {
          ...achievement,
          progress
        };

        // Save progress to database
        await supabase
          .from('achievements')
          .upsert({
            user_id: username,
            achievement_id: achievement.id,
            unlocked: achievement.unlocked,
            progress
          }, {
            onConflict: 'user_id,achievement_id'
          });
      }
    }

    setAchievements(updatedAchievements);

    if (newlyUnlocked) {
      setRecentAchievement({
        name: newlyUnlocked.name,
        subtitle: newlyUnlocked.subtitle,
        wpm: newlyUnlocked.wpm
      });
    }

    // Update user stats in database
    await supabase
      .from('user_stats')
      .upsert({
        user_id: username,
        max_wpm: Math.max(stats.wpm, 0),
        total_tests: stats.testsCompleted,
        perfect_tests: stats.perfectTests,
        daily_streak: stats.dailyStreak,
        cheat_count: stats.cheatUsageCount,
        total_visit_days: stats.totalVisitDays,
        daily_typing_minutes: stats.currentDailyTypingMinutes,
        last_visit: new Date().toISOString(),
        first_login: new Date().toISOString()
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: false
      });
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
    getUnlockedCount,
    isLoading
  };
};
