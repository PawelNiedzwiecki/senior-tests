import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Testing Library auto-registers cleanup only when Vitest globals are enabled.
// This project uses explicit imports, so wire it up by hand — without this,
// DOM from one test leaks into the next and `getAllByRole` counts double.
afterEach(() => {
  cleanup();
});
