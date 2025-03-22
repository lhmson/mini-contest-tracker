import React from 'react';
import {
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Paper,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  setPlatforms,
  setTimeRange,
  setSearchQuery,
  Platform,
  TimeRange,
} from '../store/slices/filtersSlice';

export const FilterBar: React.FC = () => {
  const dispatch = useDispatch();
  const { platforms, timeRange, searchQuery } = useSelector(
    (state: RootState) => state.filters
  ) as { platforms: Platform[]; timeRange: TimeRange[]; searchQuery: string };

  const handlePlatformChange = (platform: Platform) => {
    const newPlatforms = platforms.includes(platform)
      ? platforms.filter((p: Platform) => p !== platform)
      : [...platforms, platform];
    dispatch(setPlatforms(newPlatforms));
  };

  const handleTimeRangeChange = (range: TimeRange) => {
    const newTimeRange = timeRange.includes(range)
      ? timeRange.filter((r) => r !== range)
      : [...timeRange, range];
    dispatch(setTimeRange(newTimeRange));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(event.target.value));
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant='h6' gutterBottom>
        Filters
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormGroup>
          <Typography variant='subtitle1' gutterBottom>
            Platforms
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={platforms.includes('leetcode')}
                onChange={() => handlePlatformChange('leetcode')}
              />
            }
            label='LeetCode'
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={platforms.includes('codeforces')}
                onChange={() => handlePlatformChange('codeforces')}
              />
            }
            label='Codeforces'
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={platforms.includes('atcoder')}
                onChange={() => handlePlatformChange('atcoder')}
              />
            }
            label='AtCoder'
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={platforms.includes('codechef')}
                onChange={() => handlePlatformChange('codechef')}
              />
            }
            label='CodeChef'
          />
        </FormGroup>

        <FormGroup>
          <Typography variant='subtitle1' gutterBottom>
            Contest Status
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={timeRange.includes('upcoming')}
                onChange={() => handleTimeRangeChange('upcoming')}
              />
            }
            label='Show Upcoming Contests'
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={timeRange.includes('past')}
                onChange={() => handleTimeRangeChange('past')}
              />
            }
            label='Show Past Contests'
          />
        </FormGroup>

        <TextField
          label='Search Contests'
          variant='outlined'
          value={searchQuery}
          onChange={handleSearchChange}
          fullWidth
        />
      </Box>
    </Paper>
  );
};
