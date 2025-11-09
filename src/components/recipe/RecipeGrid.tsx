import { useNavigate } from 'react-router-dom';
import type { Recipe } from '../../types';
import { EmptyState } from '../ui/EmptyState';

interface RecipeGridProps {
  recipes: Recipe[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export function RecipeGrid({ recipes, emptyTitle, emptyDescription }: RecipeGridProps) {
  const navigate = useNavigate();

  if (recipes.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || "No recipes yet"}
        description={emptyDescription || "Recipes will appear here when you create posts with recipes attached or save recipes from others."}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {recipes.map((recipe) => (
        <button
          key={recipe.id}
          onClick={() => navigate(`/recipe/${recipe.id}`)}
          className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow touch-target text-left"
        >
          {recipe.image && (
            <div className="aspect-square w-full overflow-hidden bg-slate-100">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-3">
            <h3 className="font-semibold text-sm text-slate-900 mb-1 line-clamp-2">
              {recipe.title}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2 mb-2">
              {recipe.description}
            </p>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>{recipe.servings} servings</span>
              {recipe.costEstimate && (
                <span className="font-semibold text-brand-teal">
                  ${recipe.costEstimate.toFixed(2)}/serving
                </span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

