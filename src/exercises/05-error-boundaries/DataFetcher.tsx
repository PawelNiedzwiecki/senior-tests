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
        <h2>User Profiles</h2>

        {/* TODO 1: Wrap the UserProfile components with ErrorBoundary */}
        {/* Pass the key prop to allow resetting, and onReset={handleReset} */}

        <div className="profiles-grid">
          <UserProfile userId={1} shouldFail={simulateError} />
          <UserProfile userId={2} shouldFail={simulateError} />
          <UserProfile userId={3} shouldFail={simulateError} />
        </div>
      </div>

      {/* TODO 2: Create a section with individual error boundaries per profile */}
      {/* This demonstrates isolating errors so one failure doesn't affect others */}
      <div className="isolated-profiles">
        <h2>Isolated Error Boundaries</h2>
        <p>Each profile has its own error boundary</p>

        <div className="profiles-grid">
          {/* Wrap each UserProfile in its own ErrorBoundary */}
          {/* YOUR CODE HERE */}
        </div>
      </div>
    </div>
  );
};

export default DataFetcher;
