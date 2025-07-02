
export interface Achievement {
  id: string;
  name: string;
  subtitle: string;
  wpmRequired: number;
  timeRequired: number; // in seconds
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface AchievementNotification {
  achievement: Achievement;
  show: boolean;
}
