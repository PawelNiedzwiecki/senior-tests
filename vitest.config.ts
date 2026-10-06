import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Every drill/exam test imports its subject from `@algo/...`, `@patterns/...`,
// etc. By default those resolve to your work-in-progress files.
// Run with SOLUTIONS=1 to point the exact same tests at the `solutions`
// folders (useful to confirm a test is passable, or to diff your approach).
const useSolutions = process.env.SOLUTIONS === '1';
const target = useSolutions ? 'solutions' : 'drills';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@algo': path.resolve(import.meta.dirname, 'prep/algo', target),
      '@patterns': path.resolve(import.meta.dirname, 'prep/patterns', target),
      '@leetcode': path.resolve(import.meta.dirname, 'prep/leetcode', target),
      '@tier1': path.resolve(import.meta.dirname, 'prep/tier-1', useSolutions ? 'solutions' : 'exams'),
    },
  },
  test: {
    root: path.resolve(import.meta.dirname, 'prep'),
    environment: 'node',
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
