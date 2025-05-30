import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // FIXED: Use the error parameter in getDerivedStateFromError
  static getDerivedStateFromError(error) {
    // Log error for debugging
    console.error('Error boundary caught error:', error);
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white p-8 border border-gray-200 rounded-none shadow-sm text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="font-cookie text-3xl font-light text-gray-900 mb-2">
              Oops! Something went wrong
            </h1>
            <p className="font-lato text-gray-600 mb-6">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-none hover:bg-gray-800 transition-colors font-lato"
            >
              <RefreshCw size={18} />
              Refresh Page
            </button>

            {/* FIXED: Use import.meta.env instead of process.env for Vite */}
            {import.meta.env.DEV && (
              <details className="mt-6 text-left">
                <summary className="font-lato text-sm text-gray-500 cursor-pointer">
                  Show error details (Development only)
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 text-xs text-gray-700 overflow-auto">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;