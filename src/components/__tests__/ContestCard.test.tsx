import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ContestCard from '../ContestCard';
import contestsReducer from '../../store/contestsSlice';
import { Contest } from '../../types/contest';
import '@testing-library/jest-dom';

const mockContest = {
  id: '1',
  name: 'Test Contest',
  platform: 'Codeforces',
  startTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
  duration: 7200, // 2 hours
  url: 'https://test.com',
  isBookmarked: false,
};

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      contests: contestsReducer,
    },
    preloadedState: {
      contests: {
        contests: [mockContest],
        ...initialState,
      },
    },
  });
};

describe('ContestCard', () => {
  it('renders contest information correctly', () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <ContestCard contest={mockContest} />
      </Provider>
    );

    expect(screen.getByText('Test Contest')).toBeInTheDocument();
    expect(screen.getByText('Codeforces')).toBeInTheDocument();
    expect(screen.getByText('Starts in 1h 0m')).toBeInTheDocument();
    expect(screen.getByText('2h 0m')).toBeInTheDocument();
  });

  it('toggles bookmark when bookmark button is clicked', () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <ContestCard contest={mockContest} />
      </Provider>
    );

    const bookmarkButton = screen.getByRole('button');
    fireEvent.click(bookmarkButton);

    const state = store.getState();
    expect(state.contests.contests[0].isBookmarked).toBe(true);
  });

  it('opens contest URL when clicked', () => {
    const store = createTestStore();
    const windowSpy = vi.spyOn(window, 'open');

    render(
      <Provider store={store}>
        <ContestCard contest={mockContest} />
      </Provider>
    );

    const card = screen.getByRole('button', { name: /test contest/i });
    fireEvent.click(card);

    expect(windowSpy).toHaveBeenCalledWith('https://test.com', '_blank');
  });

  it('displays solution video link when available', () => {
    const contestWithSolution = {
      ...mockContest,
      solutionUrl: 'https://youtube.com/watch?v=123',
    };

    const store = createTestStore();
    render(
      <Provider store={store}>
        <ContestCard contest={contestWithSolution} />
      </Provider>
    );

    expect(screen.getByText('Solution Video')).toBeInTheDocument();
  });
});
