import { useState } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { UserProfile } from './UserProfile';
import './ErrorBoundary.css';

export const DataFetcher = () => {
  const [key, setKey] = useState(0);
  const [simulateError, setSimulateError] = useState(false);

  // Reset the error boundary by changing the key
  const handleReset = () => {
    setKey((prev) => prev + 1);
    setSimulateError(false);
  };

  return (
    <div className="data-fetcher">
      <h1>Error Boundaries Demo</h1>

      <div className="controls">
        <label>
          <input
            type="checkbox"
            checked={simulateError}
            onChange={(e) => setSimulateError(e.target.checked)}
          />
          Simulate API Error
        </label>
      </div>

      <p className="description">
        Toggle the checkbox to simulate an API error. The Error Boundary will catch
        the error and display a fallback UI with a retry option.
      </p>

      <div className="profiles-container">
        <h2>User Profiles (Shared Error Boundary)</h2>
        <p>All profiles share one error boundary - one failure affects all</p>

        {/* SOLUTION 1: Wrap the UserProfile components with ErrorBoundary */}
        <ErrorBoundary key={key} onReset={handleReset}>
          <div className="profiles-grid">
            <UserProfile userId={1} shouldFail={simulateError} />
            <UserProfile userId={2} shouldFail={simulateError} />
            <UserProfile userId={3} shouldFail={simulateError} />
          </div>
        </ErrorBoundary>
      </div>

      {/* SOLUTION 2: Create a section with individual error boundaries per profile */}
      <div className="isolated-profiles">
        <h2>Isolated Error Boundaries</h2>
        <p>Each profile has its own error boundary - failures are isolated</p>

        <div className="profiles-grid">
          <ErrorBoundary
            key={`isolated-1-${key}`}
            onReset={handleReset}
            fallback={
              <div className="error-boundary-fallback">
                <p>User 1 failed to load</p>
                <button className="retry-button" onClick={handleReset}>
                  Retry
                </button>
              </div>
            }
          >
            <UserProfile userId={1} shouldFail={simulateError} />
          </ErrorBoundary>

          <ErrorBoundary
            key={`isolated-2-${key}`}
            onReset={handleReset}
            fallback={
              <div className="error-boundary-fallback">
                <p>User 2 failed to load</p>
                <button className="retry-button" onClick={handleReset}>
                  Retry
                </button>
              </div>
            }
          >
            <UserProfile userId={2} shouldFail={false} />
          </ErrorBoundary>

          <ErrorBoundary
            key={`isolated-3-${key}`}
            onReset={handleReset}
            fallback={
              <div className="error-boundary-fallback">
                <p>User 3 failed to load</p>
                <button className="retry-button" onClick={handleReset}>
                  Retry
                </button>
              </div>
            }
          >
            <UserProfile userId={3} shouldFail={simulateError} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default DataFetcher;
