import React from 'react';
import {
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Paper,
  Stack,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  setPlatforms,
  setShowPastContests,
  setShowUpcomingContests,
} from '../store/slices/filtersSlice';
import { Platform, ContestFilters } from '../types/contest';

const platforms: { value: Platform; label: string }[] = [
  { value: 'codeforces', label: 'Codeforces' },
  { value: 'codechef', label: 'CodeChef' },
  { value: 'leetcode', label: 'LeetCode' },
];

export const FilterBar: React.FC = () => {
  const dispatch = useDispatch();
  const filters = useSelector(
    (state: RootState) => state.filters
  ) as ContestFilters;
  const {
    platforms: selectedPlatforms,
    showPastContests,
    showUpcomingContests,
  } = filters;

  const handlePlatformToggle = (platform: Platform) => {
    const newPlatforms = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter((p: Platform) => p !== platform)
      : [...selectedPlatforms, platform];
    dispatch(setPlatforms(newPlatforms));
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant='h6' gutterBottom>
        Filters
      </Typography>
      <Stack spacing={2}>
        <Box>
          <Typography variant='subtitle1' gutterBottom>
            Platforms
          </Typography>
          <FormGroup>
            {platforms.map((platform) => (
              <FormControlLabel
                key={platform.value}
                control={
                  <Checkbox
                    checked={selectedPlatforms.includes(platform.value)}
                    onChange={() => handlePlatformToggle(platform.value)}
                  />
                }
                label={platform.label}
              />
            ))}
          </FormGroup>
        </Box>

        <Box>
          <Typography variant='subtitle1' gutterBottom>
            Contest Status
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showUpcomingContests}
                  onChange={(e) =>
                    dispatch(setShowUpcomingContests(e.target.checked))
                  }
                />
              }
              label='Show Upcoming Contests'
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showPastContests}
                  onChange={(e) =>
                    dispatch(setShowPastContests(e.target.checked))
                  }
                />
              }
              label='Show Past Contests'
            />
          </FormGroup>
        </Box>
      </Stack>
    </Paper>
  );
};
