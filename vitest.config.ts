import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Every drill test imports its subject from `@impl/...`.
// By default that resolves to your work-in-progress files in `prep/drills`.
// Run with SOLUTIONS=1 to point the exact same tests at `prep/solutions`
// (useful to confirm a test is passable, or to diff your approach).
const target = process.env.SOLUTIONS === '1' ? 'solutions' : 'drills';
const useSolutions = target === 'solutions';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@impl': path.resolve(import.meta.dirname, 'prep', target),
    },
  },
  test: {
    root: path.resolve(import.meta.dirname, 'prep'),
    environment: 'jsdom',
    setupFiles: [path.resolve(import.meta.dirname, 'prep/support/setup.ts')],
    include: ['**/*.test.ts', '**/*.test.tsx'],
    typecheck: {
      enabled: true,
      include: ['**/*.test-d.ts', '**/*.test-d.tsx'],
      tsconfig: useSolutions
        ? path.resolve(import.meta.dirname, 'prep/tsconfig.solutions.json')
        : path.resolve(import.meta.dirname, 'prep/tsconfig.json'),
    },
  },
});
