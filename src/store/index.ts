import { configureStore } from '@reduxjs/toolkit';
import contestsReducer from './slices/contestsSlice';
import filtersReducer from './slices/filtersSlice';
import userPreferencesReducer from './slices/userPreferencesSlice';

export const store = configureStore({
  reducer: {
    contests: contestsReducer,
    filters: filtersReducer,
    userPreferences: userPreferencesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
