import { Clock, Users, ShoppingCart, Calendar, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../lib/utils';
import type { Recipe } from '../../types';

interface RecipeCardProps {
  recipe: Recipe;
  onCookNow?: () => void;
  onPlanLater?: () => void;
  onAddToList?: () => void;
  variant?: 'default' | 'compact';
}

export function RecipeCard({
  recipe,
  onCookNow,
  onPlanLater,
  onAddToList,
  variant = 'default',
}: RecipeCardProps) {
  const navigate = useNavigate();

  if (variant === 'compact') {
    return (
      <div
        onClick={() => navigate(`/recipe/${recipe.id}`)}
        className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow touch-target"
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
                {formatCurrency(recipe.costEstimate)}/serving
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {recipe.image && (
        <div className="w-full aspect-video bg-slate-100">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4 space-y-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900 mb-1">{recipe.title}</h3>
          <p className="text-sm text-slate-600 line-clamp-2">{recipe.description}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <Clock size={16} className="mx-auto mb-1 text-gray-600" />
            <p className="text-gray-600">Prep</p>
            <p className="font-semibold">{recipe.prepTime} min</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <Clock size={16} className="mx-auto mb-1 text-gray-600" />
            <p className="text-gray-600">Cook</p>
            <p className="font-semibold">{recipe.cookTime} min</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <Users size={16} className="mx-auto mb-1 text-gray-600" />
            <p className="text-gray-600">Serves</p>
            <p className="font-semibold">{recipe.servings}</p>
          </div>
        </div>

        {recipe.costEstimate && (
          <div className="p-3 bg-brand-bg rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Estimated cost per serving</p>
            <p className="text-xl font-bold text-brand-teal">
              {formatCurrency(recipe.costEstimate)}
            </p>
          </div>
        )}

        <div className="space-y-2">
          {onCookNow && (
            <button
              onClick={onCookNow}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-teal text-white rounded-xl font-semibold touch-target"
            >
              <Share2 size={18} />
              Cook Now & Share
            </button>
          )}
          <div className="flex gap-2">
            {onPlanLater && (
              <button
                onClick={onPlanLater}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium touch-target"
              >
                <Calendar size={16} />
                Plan Later
              </button>
            )}
            {onAddToList && (
              <button
                onClick={onAddToList}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium touch-target"
              >
                <ShoppingCart size={16} />
                Add to List
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
