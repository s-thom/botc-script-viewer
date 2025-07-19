import { Component, type ReactNode } from "react";

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

export interface ErrorBoundaryState {
  error: Error | null;
}

const initialState: ErrorBoundaryState = {
  error: null,
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = initialState;
  }

  render(): ReactNode {
    if (this.state.error) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
