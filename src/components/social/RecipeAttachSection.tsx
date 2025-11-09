import { X, Link2, Check } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import type { Recipe } from '../../types';

interface RecipeAttachSectionProps {
  recipe: Recipe | null;
  onSelect: () => void;
  onRemove: () => void;
  onToggleStats: () => void;
  showStats: boolean;
}

export function RecipeAttachSection({
  recipe,
  onSelect,
  onRemove,
  onToggleStats,
  showStats,
}: RecipeAttachSectionProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Recipe
      </label>
      {recipe ? (
        <div className="p-4 bg-brand-bg rounded-2xl border border-brand-sage/20">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-brand-teal mb-1">
                {recipe.title}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2">
                {recipe.description}
              </p>
            </div>
            <button
              onClick={onRemove}
              className="p-1 text-slate-400 hover:text-slate-600 touch-target"
              title="Remove recipe"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-600 mt-2">
            <span>{recipe.servings} servings</span>
            <span>•</span>
            <span>{recipe.prepTime + recipe.cookTime} min</span>
            {recipe.costEstimate && (
              <>
                <span>•</span>
                <span className="font-semibold text-brand-teal">
                  {formatCurrency(recipe.costEstimate)}/serving
                </span>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <button
            onClick={onSelect}
            className="w-full flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 touch-target"
          >
            <Link2 size={20} className="text-gray-400" />
            <span className="flex-1 text-left text-sm">Pick from your recipes</span>
          </button>
        </div>
      )}
      <button
        onClick={onToggleStats}
        className="w-full mt-2 flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 touch-target"
      >
        <span className="flex-1 text-left text-sm">Auto-fill stats from recipe</span>
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
          showStats ? 'bg-brand-teal border-brand-teal' : 'border-gray-300'
        }`}>
          {showStats && <Check size={14} className="text-white" />}
        </div>
      </button>
    </div>
  );
}
