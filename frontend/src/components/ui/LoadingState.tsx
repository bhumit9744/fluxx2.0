import React from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface LoadingStateProps {
  status?: 'loading' | 'error' | 'empty';
  message?: string;
  onRetry?: () => void;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  status = 'loading',
  message,
  onRetry
}) => {
  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-3 font-mono text-xs text-slate-500">
        <RefreshCw className="w-6 h-6 text-[#0EA89A] animate-spin" />
        <span>{message || 'Loading environmental observations...'}</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-3 font-mono text-xs text-slate-600 bg-red-50/50 rounded-2xl border border-red-100">
        <AlertCircle className="w-6 h-6 text-[#D95353]" />
        <span className="font-semibold text-slate-900">{message || 'Unable to connect to FLUXX data service.'}</span>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Retry Connection
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-2 font-mono text-xs text-slate-400">
      <span>{message || 'No observations available.'}</span>
    </div>
  );
};
