import React from 'react';
import {
  Box,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  setPlatforms,
  setTimeRange,
  setSearchQuery,
  Platform,
  TimeRange,
  FiltersState,
} from '../store/slices/filtersSlice';

export const FilterBar: React.FC = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filters) as FiltersState;

  const handlePlatformChange = (platform: Platform) => {
    const newPlatforms = filters.platforms.includes(platform)
      ? filters.platforms.filter((p: Platform) => p !== platform)
      : [...filters.platforms, platform];
    dispatch(setPlatforms(newPlatforms));
  };

  const handleTimeRangeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newTimeRange: TimeRange | null
  ) => {
    if (newTimeRange !== null) {
      dispatch(setTimeRange(newTimeRange));
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(event.target.value));
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        position: 'sticky',
        top: 16,
        zIndex: 1,
        backgroundColor: 'background.paper',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <TextField
          fullWidth
          size="small"
          label="Search contests"
          value={filters.searchQuery}
          onChange={handleSearchChange}
          sx={{ mb: 2 }}
        />
        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <Typography variant="subtitle2" gutterBottom>
            Platforms
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.platforms.includes('codeforces')}
                  onChange={() => handlePlatformChange('codeforces')}
                />
              }
              label="Codeforces"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.platforms.includes('leetcode')}
                  onChange={() => handlePlatformChange('leetcode')}
                />
              }
              label="LeetCode"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.platforms.includes('codechef')}
                  onChange={() => handlePlatformChange('codechef')}
                />
              }
              label="CodeChef"
            />
          </FormGroup>
        </FormControl>
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Contest Status
        </Typography>
        <ToggleButtonGroup
          value={filters.timeRange}
          exclusive
          onChange={handleTimeRangeChange}
          aria-label="contest status"
          size="small"
          fullWidth
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="upcoming">Upcoming</ToggleButton>
          <ToggleButton value="past">Past</ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Paper>
  );
};
