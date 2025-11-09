import { Chip } from '../forms/Chip';

interface TagFilterBarProps {
  tags: string[];
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  mode?: 'single' | 'multi';
}

export function TagFilterBar({
  tags,
  selectedTags,
  onChange,
  mode = 'multi',
}: TagFilterBarProps) {
  const handleToggle = (tag: string) => {
    if (mode === 'single') {
      onChange([tag]);
    } else {
      const set = new Set(selectedTags);
      set.has(tag) ? set.delete(tag) : set.add(tag);
      onChange(Array.from(set));
    }
  };

  if (tags.length === 0) {
    return (
      <div className="text-xs text-slate-500 py-2">
        No tags available
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {tags.map((tag) => (
        <Chip
          key={tag}
          label={tag}
          selected={selectedTags.includes(tag)}
          onClick={() => handleToggle(tag)}
        />
      ))}
    </div>
  );
}
