import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Platform = 'codeforces' | 'leetcode' | 'codechef';
export type TimeRange = 'all' | 'upcoming' | 'past';

export interface FiltersState {
  platforms: Platform[];
  timeRange: TimeRange;
  searchQuery: string;
}

const initialState: FiltersState = {
  platforms: ['codeforces', 'leetcode', 'codechef'],
  timeRange: 'all',
  searchQuery: ''
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setPlatforms: (state, action: PayloadAction<Platform[]>) => {
      state.platforms = action.payload;
    },
    setTimeRange: (state, action: PayloadAction<TimeRange>) => {
      state.timeRange = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    resetFilters: (state) => {
      state.platforms = initialState.platforms;
      state.timeRange = initialState.timeRange;
      state.searchQuery = initialState.searchQuery;
    }
  }
});

export const { setPlatforms, setTimeRange, setSearchQuery, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
