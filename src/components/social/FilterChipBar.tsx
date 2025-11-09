import { Chip } from '../forms/Chip';

type Filter = {
  label: string;
  value: string;
};

type FilterChipBarProps = {
  filters: Filter[];
  selected: string[];
  onChange: (selected: string[]) => void;
};

export function FilterChipBar({ filters, selected, onChange }: FilterChipBarProps) {
  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {filters.map((filter) => (
        <Chip
          key={filter.value}
          label={filter.label}
          selected={selected.includes(filter.value)}
          onClick={() => handleToggle(filter.value)}
        />
      ))}
    </div>
  );
}

