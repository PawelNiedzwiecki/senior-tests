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

// TODO 1: Implement the ErrorBoundary class component
// This must be a class component because error boundaries require
// lifecycle methods that don't have hooks equivalents
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // TODO 2: Initialize state with hasError: false, error: null, errorInfo: null
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  // TODO 3: Implement getDerivedStateFromError
  // This static method is called when a child component throws an error
  // It should return an object to update state
  static getDerivedStateFromError(error: Error): Partial<State> {
    // YOUR CODE HERE
    return {};
  }

  // TODO 4: Implement componentDidCatch
  // This is called after an error has been thrown
  // Use it for logging errors to an error reporting service
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // YOUR CODE HERE
    // Log the error (in a real app, send to error tracking service)
  }

  // TODO 5: Implement handleReset method
  // Should reset the error state and call onReset prop if provided
  handleReset = (): void => {
    // YOUR CODE HERE
  };

  render(): ReactNode {
    // TODO 6: Implement the render method
    // - If hasError is true, render the fallback UI or custom fallback prop
    // - If hasError is false, render children normally

    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="error-boundary-fallback">
          <h2>Something went wrong</h2>
          {/* TODO 7: Display the error message if available */}
          {/* TODO 8: Add a "Try Again" button that calls handleReset */}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
