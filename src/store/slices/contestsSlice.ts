import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Contest } from '../../types/contest';
import { fetchContests as fetchContestsService } from '../../services/contestService';

interface ContestsState {
  contests: Contest[];
  bookmarkedContests: string[];
  loading: boolean;
  error: string | null;
}

const loadBookmarkedContests = (): string[] => {
  try {
    const saved = localStorage.getItem('bookmarkedContests');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading bookmarked contests:', error);
    return [];
  }
};

const saveBookmarkedContests = (bookmarkedContests: string[]) => {
  try {
    localStorage.setItem(
      'bookmarkedContests',
      JSON.stringify(bookmarkedContests)
    );
  } catch (error) {
    console.error('Error saving bookmarked contests:', error);
  }
};

const initialState: ContestsState = {
  contests: [],
  bookmarkedContests: loadBookmarkedContests(),
  loading: false,
  error: null,
};

export const fetchContests = createAsyncThunk(
  'contests/fetchContests',
  async () => {
    const contests = await fetchContestsService();
    return contests;
  }
);

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
      saveBookmarkedContests(state.bookmarkedContests);
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchContests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContests.fulfilled, (state, action) => {
        state.loading = false;
        state.contests = action.payload;
      })
      .addCase(fetchContests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch contests';
      });
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
