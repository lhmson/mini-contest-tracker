import { describe, it, expect, vi } from 'vitest';
import {
  formatTimeRemaining,
  formatContestDuration,
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
      expect(formatTimeRemaining(futureDate.toISOString())).toBe(
        'Starts in 30m'
      );
    });

    it('should show hours and minutes for contests less than a day away', () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 5);
      futureDate.setMinutes(futureDate.getMinutes() + 30);
      expect(formatTimeRemaining(futureDate.toISOString())).toBe(
        'Starts in 5h 30m'
      );
    });

    it('should show days, hours, and minutes for contests more than a day away', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 2);
      futureDate.setHours(futureDate.getHours() + 5);
      futureDate.setMinutes(futureDate.getMinutes() + 30);
      expect(formatTimeRemaining(futureDate.toISOString())).toBe(
        'Starts in 2d 5h 30m'
      );
    });
  });

  describe('formatContestDuration', () => {
    it('should format duration in hours and minutes', () => {
      expect(formatContestDuration(7200)).toBe('2h 0m'); // 2 hours
      expect(formatContestDuration(5400)).toBe('1h 30m'); // 1.5 hours
      expect(formatContestDuration(1800)).toBe('30m'); // 30 minutes
    });
  });

  describe('formatContestTime', () => {
    it('should format contest time correctly', () => {
      const date = new Date('2024-03-20T10:00:00Z');
      expect(formatContestTime(date.toISOString())).toBe('10:00 UTC');
    });
  });
});
