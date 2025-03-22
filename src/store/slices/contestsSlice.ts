import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Contest } from '../../types/contest';

interface ContestsState {
  contests: Contest[];
  bookmarkedContests: string[];
  loading: boolean;
  error: string | null;
}

const initialState: ContestsState = {
  contests: [],
  bookmarkedContests: [],
  loading: false,
  error: null,
};

const contestsSlice = createSlice({
  name: 'contests',
  initialState,
  reducers: {
    setContests: (state, action: PayloadAction<Contest[]>) => {
      state.contests = action.payload;
    },
    addContest: (state, action: PayloadAction<Contest>) => {
      state.contests.push(action.payload);
    },
    toggleBookmark: (state, action: PayloadAction<string>) => {
      const contestId = action.payload;
      const index = state.bookmarkedContests.indexOf(contestId);
      if (index === -1) {
        state.bookmarkedContests.push(contestId);
      } else {
        state.bookmarkedContests.splice(index, 1);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateSolutionUrl: (
      state,
      action: PayloadAction<{ contestId: string; solutionUrl: string }>
    ) => {
      const contest = state.contests.find(
        (c) => c.id === action.payload.contestId
      );
      if (contest) {
        contest.solutionUrl = action.payload.solutionUrl;
      }
    },
  },
});

export const {
  setContests,
  addContest,
  toggleBookmark,
  setLoading,
  setError,
  updateSolutionUrl,
} = contestsSlice.actions;

export default contestsSlice.reducer;
