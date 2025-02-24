"use client";

import { Component, ReactNode } from "react";
import { monitoring } from "@/utils/monitoring";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error) {
    monitoring.logError(error, { component: "ErrorBoundary" });
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 rounded-md bg-red-50 border border-red-200">
            <h2 className="text-red-800 font-semibold">
              Etwas ist schief gelaufen
            </h2>
            <p className="text-red-600 mt-1">Bitte laden Sie die Seite neu.</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
