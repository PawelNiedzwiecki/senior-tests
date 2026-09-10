import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    // The interview-prep kit. Drill stubs deliberately declare parameters they
    // do not use yet (that is the exercise), and nothing here is a Vite HMR
    // boundary, so the react-refresh rule does not apply.
    files: ['prep/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    // Drill STUBS only. These are deliberately incomplete: unimplemented
    // generators throw instead of yielding, placeholder types ignore their type
    // parameters, and `{}` stands in for "you work this out". Solutions and
    // tests keep the full rule set.
    files: ['prep/drills/**/*.{ts,tsx}'],
    rules: {
      'require-yield': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
])
