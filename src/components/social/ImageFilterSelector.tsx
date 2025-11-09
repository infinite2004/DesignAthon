import { cn } from '../../lib/utils';

type FilterType = 'none' | 'vintage' | 'warm' | 'cool' | 'bw' | 'high-contrast' | 'bright';

interface ImageFilterSelectorProps {
  imageUrl: string;
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const filters: { id: FilterType; label: string; preview: string }[] = [
  { id: 'none', label: 'Original', preview: '' },
  { id: 'vintage', label: 'Vintage', preview: 'sepia-50 contrast-110 brightness-95' },
  { id: 'warm', label: 'Warm', preview: 'sepia-30 brightness-105' },
  { id: 'cool', label: 'Cool', preview: 'hue-rotate-180 brightness-95' },
  { id: 'bw', label: 'B&W', preview: 'grayscale' },
  { id: 'high-contrast', label: 'Contrast', preview: 'contrast-125 brightness-110' },
  { id: 'bright', label: 'Bright', preview: 'brightness-125 saturate-110' },
];

export function ImageFilterSelector({ imageUrl, selectedFilter, onFilterChange }: ImageFilterSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-white mb-3">Color Filters</h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={cn(
              "flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all",
              selectedFilter === filter.id
                ? "border-white scale-105"
                : "border-white/30"
            )}
          >
            <div className="relative w-full h-full">
              <img
                src={imageUrl}
                alt={filter.label}
                className={cn(
                  "w-full h-full object-cover",
                  filter.preview
                )}
              />
              {selectedFilter === filter.id && (
                <div className="absolute inset-0 bg-white/20" />
              )}
            </div>
            <p className={cn(
              "text-xs text-center mt-1",
              selectedFilter === filter.id ? "text-white font-semibold" : "text-white/70"
            )}>
              {filter.label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
