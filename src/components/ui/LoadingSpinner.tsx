import React from 'react';

export const LoadingSpinner: React.FC<{ size?: number }> = ({ size = 24 }) => {
  return (
    <div
      className="animate-spin rounded-full border-2 border-slate-400 border-t-transparent"
      style={{ width: size, height: size }}
      aria-label="Loading"
    />
  );
};

