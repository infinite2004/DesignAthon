import { Tag } from '../ui/Tag';
import type { Recipe } from '../../types';

type IngredientChipsRowProps = {
  recipe: Recipe;
  maxVisible?: number;
};

export function IngredientChipsRow({ recipe, maxVisible = 5 }: IngredientChipsRowProps) {
  const keyIngredients = recipe.ingredients
    .slice(0, maxVisible)
    .map(ing => ing.name);

  const remaining = recipe.ingredients.length - maxVisible;

  return (
    <div className="flex flex-wrap gap-1.5 px-4 pt-2">
      {keyIngredients.map((ingredient, index) => (
        <Tag key={index} label={ingredient} />
      ))}
      {remaining > 0 && (
        <Tag label={`+${remaining} more`} />
      )}
    </div>
  );
}

