import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchContests } from '../services/contestService';
import {
  setContests,
  setLoading,
  setError,
} from '../store/slices/contestsSlice';
import { Contest, ContestFilters } from '../types/contest';
import { isContestUpcoming, isContestPast } from '../utils/timeUtils';

export const useContests = () => {
  const dispatch = useDispatch();
  const { contests, loading, error } = useSelector(
    (state: RootState) => state.contests
  );
  const filters = useSelector(
    (state: RootState) => state.filters
  ) as ContestFilters;
  const { platforms, showPastContests, showUpcomingContests } = filters;

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

  const filteredContests = contests.filter((contest: Contest) => {
    const platformMatch = platforms.includes(contest.platform);
    const timeMatch =
      (showUpcomingContests && isContestUpcoming(contest.startTime)) ||
      (showPastContests && isContestPast(contest.endTime));
    return platformMatch && timeMatch;
  });

  const upcomingContests = filteredContests.filter((contest: Contest) =>
    isContestUpcoming(contest.startTime)
  );

  const pastContests = filteredContests.filter((contest: Contest) =>
    isContestPast(contest.endTime)
  );

  return {
    contests: filteredContests,
    upcomingContests,
    pastContests,
    loading,
    error,
  };
};
