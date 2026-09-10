# Senior Frontend Practice

Two things live in this repository:

| | |
| --- | --- |
| **[`prep/`](./prep/README.md)** | **DeepL senior frontend TypeScript interview prep** — 24 test-driven drills, 4 timed mock interviews, and 5 cheat sheets, laid out as a six-day sprint. Start at [`prep/README.md`](./prep/README.md). |
| `src/` | The original React exercise app (below), unchanged. |

```bash
npm install
npm run drills:watch      # the interview drills
npm run dev               # the React exercise app
```

---

# React Senior Exercises

A collection of hands-on React exercises designed to test and improve your React skills for senior-level positions.

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Project Structure

```
src/
├── exercises/          # Incomplete exercises (your workspace)
│   ├── 01-memory-game/
│   ├── 02-use-debounce/
│   ├── 03-performance-optimization/
│   ├── 04-context-reducer/
│   ├── 05-error-boundaries/
│   ├── 06-compound-components/
│   └── 07-form-validation/
│
├── solutions/          # Complete solutions (reference)
│   ├── 01-memory-game/
│   ├── 02-use-debounce/
│   ├── 03-performance-optimization/
│   ├── 04-context-reducer/
│   ├── 05-error-boundaries/
│   ├── 06-compound-components/
│   └── 07-form-validation/
│
└── App.tsx             # Exercise navigator
```

## Exercises Overview

### 1. Memory Game (Intermediate)
**Topics:** `useState`, `useEffect`, `useCallback`

Build a classic card matching game. Practice managing complex state, side effects for match checking, and optimizing event handlers.

### 2. useDebounce Custom Hook (Intermediate)
**Topics:** Custom Hooks, `useEffect` cleanup, `useRef`

Create a debounce hook for optimizing search inputs. Learn about cleanup functions and building reusable custom hooks.

### 3. Performance Optimization (Advanced)
**Topics:** `React.memo`, `useMemo`, `useCallback`

Fix a product list with performance issues. Learn to identify and resolve unnecessary re-renders using memoization techniques.

### 4. Context & useReducer (Advanced)
**Topics:** `useContext`, `useReducer`, State Management

Build a shopping cart with theme switching. Master the Context API and useReducer for complex state management.

### 5. Error Boundaries (Advanced)
**Topics:** Class Components, Error Handling, Data Fetching

Create Error Boundary components to gracefully handle runtime errors. Learn about error recovery and fallback UIs.

### 6. Compound Components Pattern (Advanced)
**Topics:** Design Patterns, Context API, Component Composition

Build an Accordion using the compound components pattern. Learn flexible, declarative component APIs.

### 7. Form Validation (Advanced)
**Topics:** Custom Hooks, Form Handling, TypeScript Generics

Create a robust form validation system with a custom `useForm` hook. Practice TypeScript generics and complex validation logic.

## How to Use

1. **Start the app:** Run `npm run dev` and open the app in your browser
2. **Select an exercise:** Click on any exercise card from the home screen
3. **Read the README:** Each exercise folder has a README with requirements
4. **Complete TODOs:** Look for `// TODO` comments in the exercise files
5. **Check your work:** Click "View Solution" to compare with the reference implementation
6. **Toggle views:** Switch between Exercise and Solution modes to compare

## Tips for Success

- Read the README in each exercise folder before starting
- Look for `// TODO` and `// YOUR CODE HERE` comments
- Check the browser console for helpful logs
- Use React DevTools to inspect component re-renders
- Try to complete each exercise before looking at the solution

## Skills Tested

- React Hooks (useState, useEffect, useCallback, useMemo, useReducer, useContext)
- Custom Hooks
- Performance Optimization
- Error Handling
- Advanced Patterns (Compound Components)
- TypeScript with React
- Form Handling
- State Management

## License

MIT
