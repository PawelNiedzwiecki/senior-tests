import { Component, ReactNode } from 'react';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

// SOLUTION: Implement the ErrorBoundary class component
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // SOLUTION 2: Initialize state
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  // SOLUTION 3: Implement getDerivedStateFromError
  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render shows the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  // SOLUTION 4: Implement componentDidCatch
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);

    // Update state with error info
    this.setState({
      errorInfo,
    });

    // In a real app, you would send this to an error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  // SOLUTION 5: Implement handleReset method
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Call the onReset prop if provided
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render(): ReactNode {
    // SOLUTION 6: Implement the render method
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="error-boundary-fallback">
          <div className="error-icon">⚠️</div>
          <h2>Something went wrong</h2>

          {/* SOLUTION 7: Display the error message */}
          {this.state.error && (
            <div className="error-details">
              <strong>Error:</strong> {this.state.error.message}
            </div>
          )}

          {/* SOLUTION 8: Add a "Try Again" button */}
          <button className="retry-button" onClick={this.handleReset}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
