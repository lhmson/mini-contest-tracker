import React from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { ContestCard } from './ContestCard';
import { useContests } from '../hooks/useContests';

export const ContestList: React.FC = () => {
  const { contests, upcomingContests, pastContests, loading, error } =
    useContests();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity='error'>{error}</Alert>
      </Box>
    );
  }

  if (contests.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant='body1' color='text.secondary'>
          No contests found. Try adjusting your filters.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {upcomingContests.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant='h5' gutterBottom>
            Upcoming Contests
          </Typography>
          {upcomingContests.map((contest) => (
            <ContestCard key={contest.id} contest={contest} />
          ))}
        </Box>
      )}

      {pastContests.length > 0 && (
        <Box>
          <Typography variant='h5' gutterBottom>
            Past Contests
          </Typography>
          {pastContests.map((contest) => (
            <ContestCard key={contest.id} contest={contest} />
          ))}
        </Box>
      )}
    </Box>
  );
};
