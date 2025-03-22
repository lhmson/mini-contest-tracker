import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TimeRange = 'upcoming' | 'past' | null;
export type Platform = 'leetcode' | 'codeforces' | 'atcoder' | 'codechef';

interface FiltersState {
  platforms: Platform[];
  timeRange: TimeRange[];
  searchQuery: string;
}

const initialState: FiltersState = {
  platforms: ['leetcode', 'codeforces', 'atcoder', 'codechef'],
  timeRange: ['upcoming', 'past'],
  searchQuery: '',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setPlatforms: (state, action: PayloadAction<Platform[]>) => {
      state.platforms = action.payload;
    },
    setTimeRange: (state, action: PayloadAction<TimeRange[]>) => {
      state.timeRange = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearFilters: (state) => {
      state.platforms = ['leetcode', 'codeforces', 'atcoder', 'codechef'];
      state.timeRange = ['upcoming', 'past'];
      state.searchQuery = '';
    },
  },
});

export const { setPlatforms, setTimeRange, setSearchQuery, clearFilters } =
  filtersSlice.actions;
export default filtersSlice.reducer;
