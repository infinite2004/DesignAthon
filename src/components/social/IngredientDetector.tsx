import { useState, useEffect } from 'react';
import { Sparkles, Check } from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface IngredientDetectorProps {
  imageUrl: string;
  onIngredientsDetected: (ingredients: string[]) => void;
  detectedIngredients?: string[];
}

// Mock ingredient detection - in production, this would call an AI API
const mockDetectIngredients = async (_imageUrl: string): Promise<string[]> => {
  // Simulate AI detection delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock detected ingredients based on common food items
  const commonIngredients = [
    'chicken', 'rice', 'tomatoes', 'onions', 'garlic', 'peppers',
    'pasta', 'cheese', 'bread', 'eggs', 'potatoes', 'carrots',
    'broccoli', 'spinach', 'mushrooms', 'beans', 'corn', 'avocado'
  ];
  
  // Return 3-6 random ingredients
  const count = Math.floor(Math.random() * 4) + 3;
  const shuffled = [...commonIngredients].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export function IngredientDetector({ imageUrl, onIngredientsDetected, detectedIngredients }: IngredientDetectorProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>(detectedIngredients || []);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(detectedIngredients || []);

  useEffect(() => {
    if (!detectedIngredients && imageUrl) {
      detectIngredients();
    } else if (detectedIngredients) {
      setIngredients(detectedIngredients);
      setSelectedIngredients(detectedIngredients);
    }
  }, [imageUrl, detectedIngredients]);

  const detectIngredients = async () => {
    setIsDetecting(true);
    try {
      const detected = await mockDetectIngredients(imageUrl);
      setIngredients(detected);
      setSelectedIngredients(detected);
      onIngredientsDetected(detected);
    } catch (error) {
      console.error('Error detecting ingredients:', error);
    } finally {
      setIsDetecting(false);
    }
  };

  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients(prev => {
      const newSelection = prev.includes(ingredient)
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient];
      onIngredientsDetected(newSelection);
      return newSelection;
    });
  };

  if (isDetecting) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <LoadingSpinner size={32} />
        <p className="text-sm text-gray-600">Detecting ingredients...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-brand-teal" />
          <h3 className="text-sm font-semibold text-slate-700">Detected Ingredients</h3>
        </div>
        <button
          onClick={detectIngredients}
          className="text-xs text-brand-teal hover:underline"
        >
          Re-detect
        </button>
      </div>
      
      {ingredients.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ingredient) => {
            const isSelected = selectedIngredients.includes(ingredient);
            return (
              <button
                key={ingredient}
                onClick={() => toggleIngredient(ingredient)}
                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium transition-all
                  ${isSelected
                    ? 'bg-brand-teal text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                <div className="flex items-center gap-1.5">
                  {isSelected && <Check size={14} />}
                  <span>{ingredient}</span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No ingredients detected. Try re-detecting.</p>
      )}
    </div>
  );
}

