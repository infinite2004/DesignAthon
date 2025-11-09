import React from 'react';

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: string; // Emoji or icon
  illustration?: React.ReactNode;
};

const getDefaultIcon = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('post') || lowerTitle.includes('feed')) return '📝';
  if (lowerTitle.includes('recipe')) return '🍳';
  if (lowerTitle.includes('inventory') || lowerTitle.includes('pantry')) return '📦';
  if (lowerTitle.includes('grocery') || lowerTitle.includes('shopping')) return '🛒';
  if (lowerTitle.includes('meal') || lowerTitle.includes('plan')) return '📅';
  if (lowerTitle.includes('search') || lowerTitle.includes('result')) return '🔍';
  return '📭';
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  illustration,
}) => {
  const displayIcon = icon || getDefaultIcon(title);

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-gradient-to-br from-brand-bg to-white p-8 text-center border border-brand-sage/20">
      {/* Large icon/illustration */}
      <div className="text-6xl mb-2 animate-bounce-subtle">
        {illustration || <span>{displayIcon}</span>}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-brand-teal">{title}</h3>
        {description && (
          <p className="text-sm text-slate-600 max-w-sm mx-auto">{description}</p>
        )}
      </div>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 rounded-xl bg-brand-teal px-6 py-3 text-sm font-semibold text-white touch-target hover:bg-brand-teal/90 active:scale-95 transition-all shadow-md"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

