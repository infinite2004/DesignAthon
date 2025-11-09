import { Chip } from '../forms/Chip';

type DietFilter = 'all' | 'vegan' | 'vegetarian' | 'pescatarian' | 'keto' | 'paleo' | 'halal' | 'kosher';

interface DietFilterBarProps {
  value: DietFilter;
  onChange: (filter: DietFilter) => void;
}

const dietOptions: { value: DietFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'pescatarian', label: 'Pescatarian' },
  { value: 'keto', label: 'Keto' },
  { value: 'paleo', label: 'Paleo' },
  { value: 'halal', label: 'Halal' },
  { value: 'kosher', label: 'Kosher' },
];

export function DietFilterBar({ value, onChange }: DietFilterBarProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {dietOptions.map((option) => (
        <Chip
          key={option.value}
          label={option.label}
          selected={value === option.value}
          onClick={() => onChange(option.value)}
        />
      ))}
    </div>
  );
}
