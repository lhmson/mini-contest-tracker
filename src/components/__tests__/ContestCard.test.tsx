import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ContestCard } from '../ContestCard';
import contestsReducer from '../../store/slices/contestsSlice';
import { Platform } from '../../types/contest';
import '@testing-library/jest-dom';
import { ReactNode } from 'react';

interface MockComponentProps {
  children?: ReactNode;
  label?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
  'data-testid'?: string;
  gutterBottom?: boolean;
  variant?: string;
  component?: string;
  color?: string;
  size?: string;
  sx?: Record<string, unknown>;
  underline?: string;
  rel?: string;
}

// Mock Material-UI components
vi.mock('@mui/material', () => ({
  Card: ({ children, ...props }: MockComponentProps) => (
    <div data-testid="card" {...props}>
      {children}
    </div>
  ),
  CardContent: ({ children, ...props }: MockComponentProps) => (
    <div data-testid="card-content" {...props}>
      {children}
    </div>
  ),
  Typography: ({ children, ...props }: MockComponentProps) => (
    <div data-testid="typography" {...props}>
      {children}
    </div>
  ),
  Chip: ({ label, ...props }: MockComponentProps) => (
    <div {...props}>{label}</div>
  ),
  IconButton: ({ children, onClick, ...props }: MockComponentProps) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
  Box: ({ children, ...props }: MockComponentProps) => (
    <div {...props}>{children}</div>
  ),
  Link: ({ children, href, target, ...props }: MockComponentProps) => (
    <a href={href} target={target} {...props}>
      {children}
    </a>
  ),
}));

// Mock Material-UI icons
vi.mock('@mui/icons-material', () => ({
  Bookmark: () => 'Bookmark',
  BookmarkBorder: () => 'BookmarkBorder',
}));

const mockContest = {
  id: '1',
  name: 'Test Contest',
  platform: 'Codeforces' as Platform,
  startTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
  endTime: new Date(Date.now() + 10800000).toISOString(), // 3 hours from now
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
        bookmarkedContests: [],
        loading: false,
        error: null,
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
    expect(screen.getByText(/Starts in/)).toBeInTheDocument();

    // Check for duration text using a flexible regex pattern
    const durationRegex = /Duration:.*2.*hours.*0.*minutes/i;
    expect(screen.getByText(durationRegex)).toBeInTheDocument();
  });

  it('toggles bookmark when bookmark button is clicked', async () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <ContestCard contest={mockContest} />
      </Provider>
    );

    const bookmarkButton = screen.getByRole('button');
    await fireEvent.click(bookmarkButton);

    const state = store.getState();
    expect(state.contests.bookmarkedContests).toContain(mockContest.id);
  });

  it('has correct link for contest URL', () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <ContestCard contest={mockContest} />
      </Provider>
    );

    const link = screen.getByText('View Contest');
    expect(link).toHaveAttribute('href', mockContest.url);
    expect(link).toHaveAttribute('target', '_blank');
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

    const solutionLink = screen.getByText('Solution Video');
    expect(solutionLink).toBeInTheDocument();
    expect(solutionLink).toHaveAttribute(
      'href',
      contestWithSolution.solutionUrl
    );
    expect(solutionLink).toHaveAttribute('target', '_blank');
  });
});
