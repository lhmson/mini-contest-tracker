export type Platform = 'codeforces' | 'codechef' | 'leetcode';

export interface Contest {
  id: string;
  name: string;
  platform: Platform;
  startTime: string;
  endTime: string;
  duration: number;
  url: string;
  solutionUrl?: string;
  isBookmarked?: boolean;
}

export interface ContestFilters {
  platforms: Platform[];
  showPastContests: boolean;
  showUpcomingContests: boolean;
}

export interface ContestReminder {
  contestId: string;
  userId: string;
  reminderTime: number; // minutes before contest
  notificationType: 'email' | 'sms';
  isEnabled: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  defaultPlatforms: Platform[];
  defaultReminderTime: number;
  defaultNotificationType: 'email' | 'sms';
}
