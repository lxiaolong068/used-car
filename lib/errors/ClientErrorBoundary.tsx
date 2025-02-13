'use client';

import React from 'react';
import { ErrorLogger } from './ErrorLogger';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ClientErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    ErrorLogger.logError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  出错了
                </h2>
                <p className="text-gray-600 mb-4">
                  抱歉，程序遇到了一些问题。我们已经记录了这个错误，并会尽快修复。
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  刷新页面
                </button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
} 