import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchContests } from '../services/contestService';
import {
  setContests,
  setLoading,
  setError,
} from '../store/slices/contestsSlice';
import { Contest } from '../types/contest';
import { getContestStatus } from '../utils/timeUtils';

interface ContestFilters {
  platforms: string[];
  timeRange: 'all' | 'upcoming' | 'past';
  searchQuery: string;
}

export const useContests = () => {
  const dispatch = useDispatch();
  const { contests, loading, error } = useSelector(
    (state: RootState) => state.contests
  );
  const filters = useSelector((state: RootState) => state.filters);

  useEffect(() => {
    const loadContests = async () => {
      try {
        dispatch(setLoading(true));
        const fetchedContests = await fetchContests();
        dispatch(setContests(fetchedContests));
      } catch (error) {
        dispatch(
          setError(
            error instanceof Error ? error.message : 'Failed to fetch contests'
          )
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadContests();
    // Refresh contests every 5 minutes
    const interval = setInterval(loadContests, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const filterContests = (contests: Contest[], filters: ContestFilters) => {
    return contests.filter((contest) => {
      // Platform filter
      if (filters.platforms.length > 0 && !filters.platforms.includes(contest.platform)) {
        return false;
      }

      // Time range filter
      const status = getContestStatus(contest.startTime, contest.endTime);
      if (filters.timeRange === 'upcoming' && status !== 'Upcoming') return false;
      if (filters.timeRange === 'past' && status !== 'Past') return false;

      // Search query filter
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        return (
          contest.name.toLowerCase().includes(searchLower) ||
          contest.platform.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  };

  const filteredContests = filterContests(contests, filters as ContestFilters);

  const upcomingContests = filteredContests.filter((contest: Contest) =>
    getContestStatus(contest.startTime, contest.endTime) === 'Upcoming'
  );

  const pastContests = filteredContests.filter((contest: Contest) =>
    getContestStatus(contest.startTime, contest.endTime) === 'Past'
  );

  return {
    contests: filteredContests,
    upcomingContests,
    pastContests,
    loading,
    error,
  };
};
