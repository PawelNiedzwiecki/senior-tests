import { useState } from 'react';
import './App.css';

// Import exercises
import { MemoryGame as MemoryGameExercise } from './exercises/01-memory-game/MemoryGame';
import { SearchDemo as SearchDemoExercise } from './exercises/02-use-debounce/SearchDemo';
import { ProductList as ProductListExercise } from './exercises/03-performance-optimization/ProductList';
import { ShoppingCart as ShoppingCartExercise } from './exercises/04-context-reducer/ShoppingCart';
import { DataFetcher as DataFetcherExercise } from './exercises/05-error-boundaries/DataFetcher';
import { AccordionDemo as AccordionDemoExercise } from './exercises/06-compound-components/AccordionDemo';
import { RegistrationForm as RegistrationFormExercise } from './exercises/07-form-validation/RegistrationForm';

// Import solutions
import { MemoryGame as MemoryGameSolution } from './solutions/01-memory-game/MemoryGame';
import { SearchDemo as SearchDemoSolution } from './solutions/02-use-debounce/SearchDemo';
import { ProductList as ProductListSolution } from './solutions/03-performance-optimization/ProductList';
import { ShoppingCart as ShoppingCartSolution } from './solutions/04-context-reducer/ShoppingCart';
import { DataFetcher as DataFetcherSolution } from './solutions/05-error-boundaries/DataFetcher';
import { AccordionDemo as AccordionDemoSolution } from './solutions/06-compound-components/AccordionDemo';
import { RegistrationForm as RegistrationFormSolution } from './solutions/07-form-validation/RegistrationForm';

type ExerciseKey =
  | 'memory-game'
  | 'use-debounce'
  | 'performance'
  | 'context-reducer'
  | 'error-boundaries'
  | 'compound-components'
  | 'form-validation';

interface Exercise {
  id: ExerciseKey;
  title: string;
  difficulty: 'Intermediate' | 'Advanced';
  topics: string[];
  ExerciseComponent: React.ComponentType;
  SolutionComponent: React.ComponentType;
}

const exercises: Exercise[] = [
  {
    id: 'memory-game',
    title: '01. Memory Game',
    difficulty: 'Intermediate',
    topics: ['useState', 'useEffect', 'useCallback'],
    ExerciseComponent: MemoryGameExercise,
    SolutionComponent: MemoryGameSolution,
  },
  {
    id: 'use-debounce',
    title: '02. useDebounce Hook',
    difficulty: 'Intermediate',
    topics: ['Custom Hooks', 'useEffect cleanup', 'useRef'],
    ExerciseComponent: SearchDemoExercise,
    SolutionComponent: SearchDemoSolution,
  },
  {
    id: 'performance',
    title: '03. Performance Optimization',
    difficulty: 'Advanced',
    topics: ['React.memo', 'useMemo', 'useCallback'],
    ExerciseComponent: ProductListExercise,
    SolutionComponent: ProductListSolution,
  },
  {
    id: 'context-reducer',
    title: '04. Context & useReducer',
    difficulty: 'Advanced',
    topics: ['useContext', 'useReducer', 'State Management'],
    ExerciseComponent: ShoppingCartExercise,
    SolutionComponent: ShoppingCartSolution,
  },
  {
    id: 'error-boundaries',
    title: '05. Error Boundaries',
    difficulty: 'Advanced',
    topics: ['Class Components', 'Error Handling', 'Data Fetching'],
    ExerciseComponent: DataFetcherExercise,
    SolutionComponent: DataFetcherSolution,
  },
  {
    id: 'compound-components',
    title: '06. Compound Components',
    difficulty: 'Advanced',
    topics: ['Design Patterns', 'Context API', 'Component Composition'],
    ExerciseComponent: AccordionDemoExercise,
    SolutionComponent: AccordionDemoSolution,
  },
  {
    id: 'form-validation',
    title: '07. Form Validation',
    difficulty: 'Advanced',
    topics: ['Custom Hooks', 'Form Handling', 'TypeScript Generics'],
    ExerciseComponent: RegistrationFormExercise,
    SolutionComponent: RegistrationFormSolution,
  },
];

function App() {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseKey | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  const currentExercise = exercises.find((e) => e.id === selectedExercise);

  if (selectedExercise && currentExercise) {
    const Component = showSolution
      ? currentExercise.SolutionComponent
      : currentExercise.ExerciseComponent;

    return (
      <div className="app">
        <header className="app-header">
          <button className="back-button" onClick={() => setSelectedExercise(null)}>
            ← Back to Exercises
          </button>
          <div className="header-title">
            <h2>{currentExercise.title}</h2>
            <span className={`badge ${showSolution ? 'solution' : 'exercise'}`}>
              {showSolution ? 'Solution' : 'Exercise'}
            </span>
          </div>
          <button
            className="toggle-button"
            onClick={() => setShowSolution(!showSolution)}
          >
            {showSolution ? 'View Exercise' : 'View Solution'}
          </button>
        </header>
        <main className="exercise-content">
          <Component />
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="home-header">
        <h1>React Senior Exercises</h1>
        <p>Practice advanced React concepts with hands-on exercises</p>
      </header>

      <main className="exercises-grid">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="exercise-card"
            onClick={() => setSelectedExercise(exercise.id)}
          >
            <div className="card-header">
              <h3>{exercise.title}</h3>
              <span className={`difficulty ${exercise.difficulty.toLowerCase()}`}>
                {exercise.difficulty}
              </span>
            </div>
            <div className="topics">
              {exercise.topics.map((topic) => (
                <span key={topic} className="topic-tag">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        ))}
      </main>

      <footer className="home-footer">
        <p>
          Complete the TODO sections in the <code>exercises</code> folder.
          <br />
          Check your work against the <code>solutions</code> folder.
        </p>
      </footer>
    </div>
  );
}

export default App;
