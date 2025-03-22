import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserPreferences, Platform } from '../../types/contest';

const initialState: UserPreferences = {
  theme: 'light',
  defaultPlatforms: ['codeforces', 'codechef', 'leetcode'],
  defaultReminderTime: 60, // 1 hour
  defaultNotificationType: 'email',
};

const userPreferencesSlice = createSlice({
  name: 'userPreferences',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setDefaultPlatforms: (state, action: PayloadAction<Platform[]>) => {
      state.defaultPlatforms = action.payload;
    },
    setDefaultReminderTime: (state, action: PayloadAction<number>) => {
      state.defaultReminderTime = action.payload;
    },
    setDefaultNotificationType: (
      state,
      action: PayloadAction<'email' | 'sms'>
    ) => {
      state.defaultNotificationType = action.payload;
    },
  },
});

export const {
  setTheme,
  setDefaultPlatforms,
  setDefaultReminderTime,
  setDefaultNotificationType,
} = userPreferencesSlice.actions;

export default userPreferencesSlice.reducer;
