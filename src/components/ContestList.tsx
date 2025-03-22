import React, { useEffect } from 'react';
import { Grid, CircularProgress, Alert, Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchContests } from '../store/slices/contestsSlice';
import { ContestCard } from './ContestCard';
import { Contest } from '../types/contest';
import { isUpcoming, isPast, getContestStatus } from '../utils/timeUtils';

export const ContestList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { contests, loading, error } = useSelector(
    (state: RootState) => state.contests
  );
  const { platforms, timeRange, searchQuery } = useSelector(
    (state: RootState) => state.filters
  ) as { platforms: string[]; timeRange: string[]; searchQuery: string };

  useEffect(() => {
    dispatch(fetchContests());
  }, [dispatch]);

  const filteredContests = contests.filter((contest) => {
    // Platform filter
    if (platforms.length > 0 && !platforms.includes(contest.platform)) {
      return false;
    }

    // Time range filter
    if (timeRange.length > 0) {
      const status = getContestStatus(contest.startTime, contest.endTime);
      if (!timeRange.includes(status)) {
        return false;
      }
    }

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        contest.name.toLowerCase().includes(query) ||
        contest.platform.toLowerCase().includes(query)
      );
    }

    return true;
  });

  if (loading) {
    return (
      <Grid
        container
        justifyContent='center'
        alignItems='center'
        style={{ minHeight: '200px' }}
      >
        <CircularProgress />
      </Grid>
    );
  }

  if (error) {
    return (
      <Grid
        container
        justifyContent='center'
        alignItems='center'
        style={{ minHeight: '200px' }}
      >
        <Alert severity='error'>{error}</Alert>
      </Grid>
    );
  }

  if (filteredContests.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant='body1' color='text.secondary'>
          No contests found matching your filters.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {filteredContests.map((contest: Contest) => (
        <Grid item xs={12} sm={6} md={4} key={contest.id}>
          <ContestCard contest={contest} />
        </Grid>
      ))}
    </Grid>
  );
};
