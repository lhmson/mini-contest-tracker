import { describe, it, expect } from 'vitest';
import {
  formatTimeRemaining,
  formatDuration,
  formatContestTime,
} from '../timeUtils';

describe('timeUtils', () => {
  describe('formatTimeRemaining', () => {
    it('should show "Started" for past contests', () => {
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 1);
      expect(formatTimeRemaining(pastDate.toISOString())).toBe('Started');
    });

    it('should show minutes for contests less than an hour away', () => {
      const futureDate = new Date();
      futureDate.setMinutes(futureDate.getMinutes() + 30);
      const result = formatTimeRemaining(futureDate.toISOString());
      expect(result).toMatch(/^Starts in \d+m$/);
    });

    it('should show hours and minutes for contests less than a day away', () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 5);
      futureDate.setMinutes(futureDate.getMinutes() + 30);
      const result = formatTimeRemaining(futureDate.toISOString());
      expect(result).toMatch(/^Starts in \d+h \d+m$/);
    });

    it('should show days, hours, and minutes for contests more than a day away', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 2);
      futureDate.setHours(futureDate.getHours() + 5);
      futureDate.setMinutes(futureDate.getMinutes() + 30);
      const result = formatTimeRemaining(futureDate.toISOString());
      expect(result).toMatch(/^Starts in \d+d \d+h \d+m$/);
    });
  });

  describe('formatDuration', () => {
    it('should format duration in hours and minutes', () => {
      expect(formatDuration(120)).toBe('2h 0m'); // 2 hours
      expect(formatDuration(90)).toBe('1h 30m'); // 1.5 hours
      expect(formatDuration(30)).toBe('30m'); // 30 minutes
    });
  });

  describe('formatContestTime', () => {
    it('should format contest time correctly', () => {
      const date = new Date('2024-03-20T10:00:00Z');
      expect(formatContestTime(date.toISOString())).toBe('Mar 20, 2024 17:00');
    });
  });
});
