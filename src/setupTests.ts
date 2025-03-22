import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configure testing-library to use data-testid as the default test ID
configure({ testIdAttribute: 'data-testid' });
