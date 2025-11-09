import { useState, useRef, useEffect } from 'react';
import { TextField } from '../forms/TextField';

const commonIngredients = [
  'Chicken breast', 'Ground beef', 'Salmon', 'Eggs', 'Milk', 'Cheese',
  'Tomatoes', 'Onions', 'Garlic', 'Potatoes', 'Carrots', 'Broccoli',
  'Rice', 'Pasta', 'Bread', 'Flour', 'Sugar', 'Salt', 'Pepper',
  'Olive oil', 'Butter', 'Yogurt', 'Lettuce', 'Spinach', 'Bell peppers',
];

type IngredientAutocompleteFieldProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function IngredientAutocompleteField({
  label,
  value,
  onChange,
  placeholder,
}: IngredientAutocompleteFieldProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.trim()) {
      const filtered = commonIngredients.filter(ing =>
        ing.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSelect(suggestion)}
              className="w-full text-left px-4 py-2 hover:bg-beige transition-colors first:rounded-t-xl last:rounded-b-xl"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

