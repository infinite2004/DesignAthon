import { useState } from 'react';
import { Check, X } from 'lucide-react';

interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
}

interface IngredientSelectorProps {
  receiptItems: string[];
  availableIngredients: Ingredient[];
  onSelect: (receiptItem: string, ingredient: Ingredient) => void;
  onSkip: (receiptItem: string) => void;
}

export function IngredientSelector({
  receiptItems,
  availableIngredients,
  onSelect,
  onSkip,
}: IngredientSelectorProps) {
  const [selectedMap, setSelectedMap] = useState<Record<string, string>>({});

  const handleSelect = (receiptItem: string, ingredientId: string) => {
    setSelectedMap((prev) => ({ ...prev, [receiptItem]: ingredientId }));
    const ingredient = availableIngredients.find((ing) => ing.id === ingredientId);
    if (ingredient) {
      onSelect(receiptItem, ingredient);
    }
  };

  return (
    <div className="space-y-4">
      {receiptItems.map((item) => {
        const selectedId = selectedMap[item];
        return (
          <div key={item} className="p-4 bg-white rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium text-sm text-slate-900">{item}</p>
              <button
                onClick={() => onSkip(item)}
                className="p-1 text-slate-400 hover:text-slate-600 touch-target"
                title="Skip this item"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {availableIngredients.map((ingredient) => {
                const isSelected = selectedId === ingredient.id;
                return (
                  <button
                    key={ingredient.id}
                    onClick={() => handleSelect(item, ingredient.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border-2 transition-colors touch-target ${
                      isSelected
                        ? 'border-brand-teal bg-brand-teal/5'
                        : 'border-slate-200 hover:border-brand-sage'
                    }`}
                  >
                    <div className="text-left">
                      <p className="font-medium text-sm">{ingredient.name}</p>
                      <p className="text-xs text-slate-600">
                        {ingredient.amount} {ingredient.unit}
                      </p>
                    </div>
                    {isSelected && (
                      <Check size={18} className="text-brand-teal" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
