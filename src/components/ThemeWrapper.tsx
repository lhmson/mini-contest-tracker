import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { UserPreferences } from '../types/contest';

interface ThemeWrapperProps {
  children: React.ReactNode;
}

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children }) => {
  const theme = useSelector(
    (state: RootState) => (state.userPreferences as UserPreferences).theme
  );
  const darkTheme = createTheme({
    palette: {
      mode: theme,
    },
  });

  return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>;
};
