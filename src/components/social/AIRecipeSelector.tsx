import { useState } from 'react';
import { Sparkles, X, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { BottomSheet } from '../ui/BottomSheet';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { Recipe } from '../../types';

interface AIRecipeSelectorProps {
  detectedIngredients: string[];
  pantry?: Array<{ id: string; name: string }>;
  onRecipeSelect: (recipe: Recipe | null) => void;
  selectedRecipe?: Recipe | null;
}

// Mock AI recipe generation based on ingredients
const generateAIRecipe = async (ingredients: string[]): Promise<Recipe[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate 2-3 mock recipes
  const recipeTemplates: Omit<Recipe, 'id' | 'createdAt'>[] = [
    {
      title: `${ingredients[0] || 'Delicious'} ${ingredients[1] || 'Meal'}`,
      description: `A tasty recipe using ${ingredients.slice(0, 3).join(', ')}`,
      ingredients: ingredients.slice(0, 5).map((name, idx) => ({
        id: `ing-${Date.now()}-${idx}`,
        name,
        amount: 1,
        unit: 'unit',
      })),
      steps: [
        `Prepare ${ingredients[0] || 'ingredients'}`,
        'Cook according to your preference',
        'Serve and enjoy!',
      ],
      servings: 4,
      prepTime: 15,
      cookTime: 30,
      costEstimate: 5.50,
      tags: ['ai-generated', 'quick'],
      reCookCount: 0,
    },
    {
      title: `Quick ${ingredients[0] || 'Dish'}`,
      description: `Fast and easy recipe with ${ingredients.slice(0, 2).join(' and ')}`,
      ingredients: ingredients.slice(0, 4).map((name, idx) => ({
        id: `ing-${Date.now()}-${idx}`,
        name,
        amount: 1,
        unit: 'unit',
      })),
      steps: [
        'Gather all ingredients',
        'Follow cooking instructions',
        'Plate and serve',
      ],
      servings: 2,
      prepTime: 10,
      cookTime: 20,
      costEstimate: 4.00,
      tags: ['ai-generated', 'budget'],
      reCookCount: 0,
    },
  ];
  
  return recipeTemplates.map((template, index) => ({
    id: `ai-recipe-${Date.now()}-${index}`,
    ...template,
    createdAt: new Date(),
  }));
};

export function AIRecipeSelector({ 
  detectedIngredients, 
  onRecipeSelect, 
  selectedRecipe 
}: AIRecipeSelectorProps) {
  const [showSelector, setShowSelector] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiRecipes, setAiRecipes] = useState<Recipe[]>([]);

  const handleGenerateRecipes = async () => {
    if (detectedIngredients.length === 0) return;
    
    setIsGenerating(true);
    try {
      const recipes = await generateAIRecipe(detectedIngredients);
      setAiRecipes(recipes);
    } catch (error) {
      console.error('Error generating recipes:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    onRecipeSelect(recipe);
    setShowSelector(false);
  };

  const handleRemoveRecipe = () => {
    onRecipeSelect(null);
  };

  if (selectedRecipe) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-brand-bg rounded-xl border border-brand-sage/20">
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">{selectedRecipe.title}</p>
            <p className="text-xs text-gray-600">AI-generated recipe</p>
          </div>
          <button
            onClick={handleRemoveRecipe}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Remove recipe"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <Button
          variant="secondary"
          fullWidth
          onClick={() => setShowSelector(true)}
          iconLeft={<Sparkles size={16} />}
          className="rounded-xl"
        >
          Change Recipe
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        variant="secondary"
        fullWidth
        onClick={() => {
          setShowSelector(true);
          if (aiRecipes.length === 0 && detectedIngredients.length > 0) {
            handleGenerateRecipes();
          }
        }}
        iconLeft={<Sparkles size={16} />}
        className="rounded-xl"
        disabled={detectedIngredients.length === 0}
      >
        {detectedIngredients.length === 0 
          ? 'Detect ingredients first' 
          : 'Include AI Recipe'}
      </Button>

      <BottomSheet
        isOpen={showSelector}
        onClose={() => setShowSelector(false)}
        title="AI-Generated Recipes"
      >
        <div className="max-h-96 overflow-y-auto space-y-4 p-4">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <LoadingSpinner size={32} />
              <p className="text-sm text-gray-600">Generating recipes...</p>
            </div>
          ) : aiRecipes.length > 0 ? (
            aiRecipes.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => handleSelectRecipe(recipe)}
                className="w-full p-4 bg-white rounded-xl border border-gray-200 hover:border-brand-teal hover:bg-brand-bg transition-all text-left"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-slate-900">{recipe.title}</h3>
                  <Plus size={18} className="text-brand-teal flex-shrink-0" />
                </div>
                <p className="text-xs text-gray-600 mb-2">{recipe.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{recipe.prepTime + recipe.cookTime} min</span>
                  <span>${recipe.costEstimate.toFixed(2)}</span>
                  <span>{recipe.servings} servings</span>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 mb-4">
                No recipes generated yet. Click to generate based on detected ingredients.
              </p>
              <Button
                variant="primary"
                onClick={handleGenerateRecipes}
                iconLeft={<Sparkles size={16} />}
                disabled={detectedIngredients.length === 0}
                className="rounded-xl"
              >
                Generate Recipes
              </Button>
            </div>
          )}
        </div>
      </BottomSheet>
    </>
  );
}

