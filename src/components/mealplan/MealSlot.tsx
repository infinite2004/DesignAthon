import { Check, Clock } from 'lucide-react';
import { formatTimeAgo } from '../../lib/utils';
import type { MealPlanEntry } from '../../types';

interface MealSlotProps {
  meal: MealPlanEntry;
  onClick: () => void;
  onComplete?: () => void;
  variant?: 'default' | 'compact';
}

export function MealSlot({
  meal,
  onClick,
  onComplete,
  variant = 'default',
}: MealSlotProps) {
  const displayTitle = meal.customTitle || meal.recipe.title;
  const displayDescription = meal.customDescription || meal.recipe.description;

  if (variant === 'compact') {
    return (
      <button
        onClick={onClick}
        className={`w-full p-2 rounded-lg border transition-colors touch-target text-left ${
          meal.isCooked
            ? 'bg-green-50 border-green-200'
            : 'bg-white border-slate-200 hover:border-brand-sage'
        }`}
      >
        <div className="flex items-center gap-2">
          {meal.isCooked && <Check size={14} className="text-green-600" />}
          <p className="text-xs font-semibold line-clamp-1">{displayTitle}</p>
        </div>
      </button>
    );
  }

  return (
    <div
      className={`p-4 rounded-2xl border transition-colors ${
        meal.isCooked
          ? 'bg-green-50 border-green-200'
          : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex items-start gap-3">
        {meal.imageUrl && (
          <img
            src={meal.imageUrl}
            alt={displayTitle}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-semibold text-sm text-slate-900 line-clamp-1">
              {displayTitle}
            </h3>
            {meal.isCooked && (
              <Check size={16} className="text-green-600 flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-slate-600 line-clamp-2 mb-2">
            {displayDescription}
          </p>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="capitalize">{meal.mealType}</span>
            <span>•</span>
            <span>{meal.recipe.servings} servings</span>
            {meal.cookedAt && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {formatTimeAgo(meal.cookedAt)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      
      {!meal.isCooked && onComplete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
          className="mt-3 w-full py-2 bg-brand-teal text-white rounded-lg text-xs font-semibold touch-target"
        >
          Mark as cooked
        </button>
      )}
    </div>
  );
}
