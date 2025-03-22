import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ContestCard } from '../ContestCard';
import contestsReducer from '../../store/slices/contestsSlice';
import { Contest } from '../../types/contest';
import '@testing-library/jest-dom';

const mockStore = configureStore({
  reducer: {
    contests: contestsReducer,
  },
});

const mockContest: Contest = {
  id: 'test-1',
  name: 'Test Contest',
  platform: 'codeforces',
  startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
  endTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
  duration: 120,
  url: 'https://example.com/contest',
};

describe('ContestCard', () => {
  it('renders contest information correctly', () => {
    render(
      <Provider store={mockStore}>
        <ContestCard contest={mockContest} />
      </Provider>
    );

    expect(screen.getByText('Test Contest')).toBeInTheDocument();
    expect(screen.getByText('codeforces')).toBeInTheDocument();
    expect(screen.getByText(/2 hours 0 minutes/)).toBeInTheDocument();
  });

  it('handles bookmark toggle', () => {
    render(
      <Provider store={mockStore}>
        <ContestCard contest={mockContest} />
      </Provider>
    );

    const bookmarkButton = screen.getByRole('button');
    fireEvent.click(bookmarkButton);

    const state = mockStore.getState();
    expect(state.contests.bookmarkedContests).toContain(mockContest.id);
  });

  it('displays solution video link when available', () => {
    const contestWithSolution = {
      ...mockContest,
      solutionUrl: 'https://youtube.com/watch?v=123',
    };

    render(
      <Provider store={mockStore}>
        <ContestCard contest={contestWithSolution} />
      </Provider>
    );

    expect(screen.getByText('Solution Video')).toBeInTheDocument();
  });
});
