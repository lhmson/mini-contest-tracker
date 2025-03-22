import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContestFilters, Platform } from '../../types/contest';

const initialState: ContestFilters = {
  platforms: ['codeforces', 'codechef', 'leetcode'],
  showPastContests: true,
  showUpcomingContests: true,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setPlatforms: (state, action: PayloadAction<Platform[]>) => {
      state.platforms = action.payload;
    },
    togglePlatform: (state, action: PayloadAction<Platform>) => {
      const platform = action.payload;
      const index = state.platforms.indexOf(platform);
      if (index === -1) {
        state.platforms.push(platform);
      } else {
        state.platforms.splice(index, 1);
      }
    },
    setShowPastContests: (state, action: PayloadAction<boolean>) => {
      state.showPastContests = action.payload;
    },
    setShowUpcomingContests: (state, action: PayloadAction<boolean>) => {
      state.showUpcomingContests = action.payload;
    },
  },
});

export const {
  setPlatforms,
  togglePlatform,
  setShowPastContests,
  setShowUpcomingContests,
} = filtersSlice.actions;

export default filtersSlice.reducer;
