import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error }: { error: Error | null }) {
  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle size={32} className="text-red-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-brand-teal">Something went wrong</h1>
          <p className="text-sm text-slate-600">
            We encountered an unexpected error. Don't worry, your data is safe.
          </p>
          {error && process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left">
              <summary className="text-xs text-slate-500 cursor-pointer">Error details</summary>
              <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                {error.toString()}
              </pre>
            </details>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-4">
          <Button
            variant="primary"
            fullWidth
            onClick={handleReload}
            iconLeft={<RefreshCw size={18} />}
          >
            Reload Page
          </Button>
          <Button
            variant="ghost"
            fullWidth
            onClick={handleGoHome}
            iconLeft={<Home size={18} />}
          >
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
