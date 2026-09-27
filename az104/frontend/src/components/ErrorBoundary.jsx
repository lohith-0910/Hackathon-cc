import React from 'react';
import { ShieldAlert, RefreshCw, LayoutDashboard } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleGoDashboard = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-[#E2E8F0] rounded-xl p-8 shadow-sm text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200">
              <ShieldAlert className="w-7 h-7 text-[#DC2626]" />
            </div>

            <h1 className="text-xl font-bold text-[#0F172A] mb-2">Application Error</h1>
            <p className="text-sm text-[#64748B] mb-6">
              Something went wrong while loading this page.
            </p>

            {this.state.error && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-6 text-left font-mono text-xs text-red-600 overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2.5 bg-[#0078D4] hover:bg-[#0062AD] text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
              <button
                onClick={this.handleGoDashboard}
                className="flex-1 px-4 py-2.5 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#1E293B] font-medium text-sm rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <LayoutDashboard className="w-4 h-4 text-[#64748B]" />
                <span>Go to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
