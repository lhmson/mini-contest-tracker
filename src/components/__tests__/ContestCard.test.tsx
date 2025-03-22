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
  id: '1',
  name: 'Test Contest',
  platform: 'codeforces',
  startTime: '2024-03-20T10:00:00Z',
  endTime: '2024-03-20T12:00:00Z',
  duration: 120,
  url: 'https://example.com'
};

describe('ContestCard', () => {
  it('renders contest information correctly', () => {
    render(<ContestCard contest={mockContest} />);
    expect(screen.getByText('Test Contest')).toBeInTheDocument();
    expect(screen.getByText('codeforces')).toBeInTheDocument();
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
