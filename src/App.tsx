import React from 'react';
import { Container, Box, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import { ContestList } from './components/ContestList';
import { FilterBar } from './components/FilterBar';
import { ThemeWrapper } from './components/ThemeWrapper';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeWrapper>
        <CssBaseline />
        <Container maxWidth="lg">
          <Box sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Box sx={{ width: 280 }}>
                <FilterBar />
              </Box>
              <Box sx={{ flex: 1 }}>
                <ContestList />
              </Box>
            </Box>
          </Box>
        </Container>
      </ThemeWrapper>
    </Provider>
  );
};

export default App;
