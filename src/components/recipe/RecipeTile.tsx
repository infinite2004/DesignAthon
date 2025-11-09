import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../lib/utils';
import type { Recipe } from '../../types';

interface RecipeTileProps {
  recipe: Recipe;
  showStats?: boolean;
}

export function RecipeTile({ recipe, showStats = false }: RecipeTileProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/recipe/${recipe.id}`)}
      className="bg-white rounded-xl p-4 border border-gray-200 active:bg-gray-50 touch-target"
    >
      <div className="flex items-start gap-3">
        {recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm mb-1 line-clamp-1">
            {recipe.title}
          </h3>
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
            {recipe.description}
          </p>
          {showStats && (
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>{recipe.servings} servings</span>
              {recipe.costEstimate && (
                <>
                  <span>•</span>
                  <span className="font-semibold text-brand-teal">
                    {formatCurrency(recipe.costEstimate)}/serving
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

