import { Sparkles } from 'lucide-react';
import { ChipGroup } from '../forms/ChipGroup';

interface TransformOptionsProps {
  selectedOptions: string[];
  onChange: (options: string[]) => void;
  onTransform: () => void;
}

const transformOptions = [
  { label: 'Make it vegan', value: 'vegan' },
  { label: 'Make it vegetarian', value: 'vegetarian' },
  { label: 'Make it cheaper', value: 'cheaper' },
  { label: 'Make it healthier', value: 'healthier' },
  { label: 'Make it spicier', value: 'spicier' },
  { label: 'Make it gluten-free', value: 'gluten-free' },
  { label: 'Make it keto-friendly', value: 'keto' },
  { label: 'Double the recipe', value: 'double' },
  { label: 'Halve the recipe', value: 'halve' },
];

export function TransformOptions({
  selectedOptions,
  onChange,
  onTransform,
}: TransformOptionsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-brand-teal mb-2">Remix Your Recipe</h2>
        <p className="text-slate-600">
          Select how you'd like to transform this recipe
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Transformation options (select all that apply)
        </label>
        <ChipGroup
          mode="multi"
          options={transformOptions}
          value={selectedOptions}
          onChange={onChange}
        />
      </div>

      <button
        onClick={onTransform}
        disabled={selectedOptions.length === 0}
        className="w-full flex items-center justify-center gap-2 py-3 bg-brand-teal text-white rounded-2xl font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed touch-target"
      >
        <Sparkles size={20} />
        Transform Recipe
      </button>
    </div>
  );
}

