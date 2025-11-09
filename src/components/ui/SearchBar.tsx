import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search posts, recipes, users...',
  onClear,
  onFocus,
  onBlur,
  autoFocus,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <div
      className={`flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2 transition-colors ${
        isFocused ? 'bg-white ring-2 ring-brand-teal' : ''
      }`}
    >
      <Search size={18} className="text-gray-400 flex-shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => {
          setIsFocused(true);
          onFocus?.();
        }}
        onBlur={() => {
          setIsFocused(false);
          onBlur?.();
        }}
        autoFocus={autoFocus}
        className="flex-1 bg-transparent text-sm focus:outline-none"
      />
      {value && (
        <button
          onClick={handleClear}
          className="p-1 text-gray-400 hover:text-gray-600 touch-target"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
