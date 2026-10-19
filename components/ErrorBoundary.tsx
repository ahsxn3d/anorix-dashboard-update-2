'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary Caught]:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 my-4 rounded-2xl bg-[#171717]/90 border border-red-500/40 text-center space-y-4 shadow-2xl backdrop-blur-xl">
          <div className="w-12 h-12 mx-auto rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-300" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white font-mono">
              {this.props.fallbackTitle || 'Component Rendering Recovered'}
            </h3>
            <p className="text-xs text-red-300/80 font-mono max-w-md mx-auto">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 rounded-xl bg-[#3B82F6] hover:bg-[#3B82F6] text-white text-xs font-bold font-mono inline-flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-[#3B82F6]/30"
          >
            <RefreshCcw className="w-3.5 h-3.5" /> Reload View
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
