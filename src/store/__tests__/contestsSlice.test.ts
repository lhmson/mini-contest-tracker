import { describe, it, expect } from 'vitest';
import contestsReducer, {
  toggleBookmark,
  setContests,
} from '../slices/contestsSlice';
import { Platform } from '../../types/contest';

describe('contestsSlice', () => {
  const initialState = {
    contests: [],
    bookmarkedContests: [],
    loading: false,
    error: null,
  };

  const mockContest = {
    id: '1',
    name: 'Test Contest',
    platform: 'Codeforces' as Platform,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 7200000).toISOString(),
    duration: 7200,
    url: 'https://test.com',
    isBookmarked: false,
  };

  it('should handle initial state', () => {
    expect(contestsReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  it('should handle setContests', () => {
    const contests = [mockContest];
    const actual = contestsReducer(initialState, setContests(contests));
    expect(actual.contests).toEqual(contests);
  });

  it('should handle toggleBookmark', () => {
    const state = {
      ...initialState,
      contests: [mockContest],
      bookmarkedContests: [],
    };

    // Toggle bookmark on
    const actualOn = contestsReducer(state, toggleBookmark(mockContest.id));
    expect(actualOn.contests[0].isBookmarked).toBe(true);
    expect(actualOn.bookmarkedContests).toContain(mockContest.id);

    // Toggle bookmark off
    const actualOff = contestsReducer(actualOn, toggleBookmark(mockContest.id));
    expect(actualOff.contests[0].isBookmarked).toBe(false);
    expect(actualOff.bookmarkedContests).not.toContain(mockContest.id);
  });
});
