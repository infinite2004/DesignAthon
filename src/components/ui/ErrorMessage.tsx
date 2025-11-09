import React from 'react';

type ErrorMessageProps = {
  message?: string;
  onRetry?: () => void;
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = 'Something went wrong.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700">
      <span>{message}</span>
      {onRetry && (
        <button
          className="rounded-full bg-red-600 px-4 py-1 text-xs font-medium text-white touch-target"
          onClick={onRetry}
        >
          Try again
        </button>
      )}
    </div>
  );
};

