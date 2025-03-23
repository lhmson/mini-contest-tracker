import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import React from 'react';
import { LinkProps } from '@mui/material';

// Mock Material-UI components globally
vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return {
    ...actual,
    Link: ({ children, ...props }: LinkProps) =>
      React.createElement('a', props, children),
  };
});

// Clean up after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
