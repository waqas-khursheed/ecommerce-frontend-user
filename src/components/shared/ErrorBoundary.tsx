"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

// Error boundaries must be class components — no hook equivalent exists yet.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // TODO: send to an error-tracking service (Sentry, etc.).
    console.error("Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <p className="font-medium">Something went wrong.</p>
            <Button onClick={() => this.setState({ hasError: false })}>Try again</Button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
