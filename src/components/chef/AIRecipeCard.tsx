import { useState } from 'react';
import { Clock, ChefHat, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/Button';
import { Tag } from '../ui/Tag';
import { formatCurrency } from '../../lib/utils';
import { cn } from '../../lib/utils';
import type { AIRecipe } from '../../types/chef';

type AIRecipeCardProps = {
  recipe: AIRecipe;
  onCookAndShare: () => void;
  onSaveRecipe: () => void;
};

export function AIRecipeCard({ recipe, onCookAndShare, onSaveRecipe }: AIRecipeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const totalTime = recipe.prepTime + recipe.cookTime;
  const pantryItemsUsed = recipe.ingredients.filter(ing => ing.inPantry);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 mb-1">{recipe.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>
        </div>
        <Sparkles size={20} className="text-brand-teal flex-shrink-0 ml-2" />
      </div>

      {/* Quick Info */}
      <div className="flex items-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{totalTime} min</span>
        </div>
        <div className="flex items-center gap-1">
          <ChefHat size={14} />
          <span className="capitalize">{recipe.difficulty}</span>
        </div>
        <span className="font-semibold text-brand-teal">
          {formatCurrency(recipe.costEstimate)}/serving
        </span>
      </div>

      {/* Pantry Items Used */}
      {pantryItemsUsed.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-700 mb-2">
            Uses {pantryItemsUsed.length} items from your pantry:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {pantryItemsUsed.slice(0, 5).map((ing, index) => (
              <Tag key={index} label={ing.name} variant="highlight" />
            ))}
            {pantryItemsUsed.length > 5 && (
              <Tag label={`+${pantryItemsUsed.length - 5} more`} />
            )}
          </div>
        </div>
      )}

      {/* Actions - Moved before expandable section for visibility */}
      <div className="flex gap-2 pt-2 border-t border-gray-200">
        <Button
          variant="primary"
          fullWidth
          onClick={onCookAndShare}
          className="rounded-xl"
        >
          Cook & Share
        </Button>
        <Button
          variant="secondary"
          onClick={onSaveRecipe}
          className="rounded-xl"
        >
          Save
        </Button>
      </div>

      {/* Expandable Recipe Section */}
      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <span className="text-sm font-semibold text-slate-900">
            {isExpanded ? 'Hide Recipe' : 'View Recipe'}
          </span>
          {isExpanded ? (
            <ChevronUp size={20} className="text-gray-500" />
          ) : (
            <ChevronDown size={20} className="text-gray-500" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
            {/* Ingredients */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Ingredients</h4>
              <div className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-lg",
                      ingredient.inPantry
                        ? "bg-brand-bg border border-brand-sage/20"
                        : "bg-gray-50 border border-gray-200"
                    )}
                  >
                    <span className="text-sm text-slate-700">{ingredient.name}</span>
                    <div className="flex items-center gap-2">
                      {ingredient.inPantry && (
                        <span className="text-xs text-brand-teal font-medium">In pantry</span>
                      )}
                      <span className="text-sm font-medium text-slate-900">
                        {ingredient.amount} {ingredient.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Instructions</h4>
              <ol className="space-y-2">
                {recipe.steps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-teal text-white text-xs font-semibold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-sm text-slate-700 flex-1 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Additional Info */}
            <div className="flex items-center gap-4 pt-2 border-t border-gray-200">
              <div className="text-xs text-gray-600">
                <span className="font-medium">Servings:</span> {recipe.servings}
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-medium">Prep:</span> {recipe.prepTime} min
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-medium">Cook:</span> {recipe.cookTime} min
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

