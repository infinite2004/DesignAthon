import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { Screen } from '../../components/layout/Screen';
import { FilterChipBar } from '../../components/social/FilterChipBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { AIRecipeCard } from '../../components/chef/AIRecipeCard';
import type { AIRecipe } from '../../types/chef';

const timeFilters = [
  { label: 'Quick (<30min)', value: 'quick' },
  { label: 'Medium (30-60min)', value: 'medium' },
  { label: 'Any time', value: 'any' },
];

const costFilters = [
  { label: 'Under $5', value: 'budget' },
  { label: 'Under $10', value: 'moderate' },
  { label: 'Any cost', value: 'any' },
];

// Recipe templates for variety
const recipeTemplates = [
  {
    title: 'Pantry Clear Pasta',
    description: 'Use up your pasta and canned goods in a delicious one-pot meal',
    baseSteps: [
      'Heat olive oil in a large pan over medium heat',
      'Add garlic and sauté until fragrant',
      'Add canned tomatoes and simmer for 10 minutes',
      'Cook pasta according to package directions',
      'Combine pasta with sauce and serve hot',
    ],
    servings: 4,
    prepTime: 10,
    cookTime: 20,
    costEstimate: 3.50,
    difficulty: 'easy' as const,
    tags: ['pantry-clear', 'quick', 'one-pot'],
  },
  {
    title: 'Quick Stir Fry',
    description: 'A fast and flavorful stir fry using your available vegetables',
    baseSteps: [
      'Heat oil in a wok or large skillet over high heat',
      'Add protein and cook until browned',
      'Add vegetables and stir-fry for 3-4 minutes',
      'Add sauce and cook for 1 more minute',
      'Serve over rice or noodles',
    ],
    servings: 3,
    prepTime: 15,
    cookTime: 15,
    costEstimate: 4.25,
    difficulty: 'easy' as const,
    tags: ['quick', 'healthy', 'stir-fry'],
  },
  {
    title: 'Hearty Soup',
    description: 'A comforting soup that uses up multiple pantry items',
    baseSteps: [
      'Sauté onions and garlic in a large pot',
      'Add vegetables and cook until softened',
      'Add broth and bring to a boil',
      'Reduce heat and simmer for 20 minutes',
      'Season to taste and serve hot',
    ],
    servings: 6,
    prepTime: 15,
    cookTime: 30,
    costEstimate: 2.75,
    difficulty: 'easy' as const,
    tags: ['comfort', 'budget', 'soup'],
  },
  {
    title: 'Sheet Pan Meal',
    description: 'An easy one-pan dinner that minimizes cleanup',
    baseSteps: [
      'Preheat oven to 425°F',
      'Toss vegetables and protein with oil and seasonings',
      'Spread on a sheet pan in a single layer',
      'Roast for 20-25 minutes until golden',
      'Serve immediately',
    ],
    servings: 4,
    prepTime: 10,
    cookTime: 25,
    costEstimate: 5.00,
    difficulty: 'easy' as const,
    tags: ['one-pan', 'easy', 'roasted'],
  },
  {
    title: 'Quick Quesadilla',
    description: 'A fast and cheesy meal using pantry staples',
    baseSteps: [
      'Heat a large skillet over medium heat',
      'Place tortilla in pan and add cheese and fillings',
      'Fold tortilla in half and cook until golden',
      'Flip and cook the other side',
      'Cut into wedges and serve',
    ],
    servings: 2,
    prepTime: 5,
    cookTime: 10,
    costEstimate: 3.00,
    difficulty: 'easy' as const,
    tags: ['quick', 'cheesy', 'comfort'],
  },
  {
    title: 'Mediterranean Bowl',
    description: 'A fresh and healthy bowl with Mediterranean flavors',
    baseSteps: [
      'Cook grains according to package directions',
      'Prepare vegetables and protein',
      'Make a simple vinaigrette',
      'Assemble bowl with grains, vegetables, and protein',
      'Drizzle with dressing and serve',
    ],
    servings: 3,
    prepTime: 20,
    cookTime: 15,
    costEstimate: 4.50,
    difficulty: 'medium' as const,
    tags: ['healthy', 'mediterranean', 'bowl'],
  },
  {
    title: 'Curry Delight',
    description: 'A flavorful curry that brings warmth and spice',
    baseSteps: [
      'Heat oil and toast spices until fragrant',
      'Add onions and cook until soft',
      'Add protein and cook until browned',
      'Add coconut milk and simmer for 15 minutes',
      'Serve over rice with fresh herbs',
    ],
    servings: 4,
    prepTime: 15,
    cookTime: 25,
    costEstimate: 5.50,
    difficulty: 'medium' as const,
    tags: ['curry', 'spicy', 'comfort'],
  },
  {
    title: 'Breakfast Scramble',
    description: 'A protein-packed breakfast using pantry items',
    baseSteps: [
      'Heat oil in a non-stick pan',
      'Add vegetables and cook until tender',
      'Add eggs and scramble gently',
      'Season with salt and pepper',
      'Serve hot with toast',
    ],
    servings: 2,
    prepTime: 5,
    cookTime: 10,
    costEstimate: 2.50,
    difficulty: 'easy' as const,
    tags: ['breakfast', 'quick', 'protein'],
  },
];

// Generate 3 random different recipes
const generateSurpriseRecipes = (pantry: any[]): AIRecipe[] => {
  // Shuffle recipe templates to get different ones each time
  const shuffled = [...recipeTemplates].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 3);
  
  const timestamp = Date.now();
  
  return selected.map((template, index) => {
    // Use pantry items for ingredients, or generate mock ones
    const availableItems = pantry.length > 0 
      ? pantry.slice(0, Math.min(6, pantry.length))
      : [
          { name: 'Chicken', quantity: 1, unit: 'lb' },
          { name: 'Rice', quantity: 2, unit: 'cups' },
          { name: 'Vegetables', quantity: 1, unit: 'cup' },
          { name: 'Spices', quantity: 1, unit: 'tsp' },
        ];
    
    return {
      id: `surprise-${timestamp}-${index}`,
      title: template.title,
      description: template.description,
      ingredients: availableItems.map((item, idx) => ({
        name: item.name,
        amount: item.quantity || (idx + 1),
        unit: item.unit || 'unit',
        inPantry: pantry.length > 0 && pantry.some(p => p.name.toLowerCase().includes(item.name.toLowerCase())),
      })),
      steps: template.baseSteps,
      servings: template.servings,
      prepTime: template.prepTime,
      cookTime: template.cookTime,
      costEstimate: template.costEstimate,
      difficulty: template.difficulty,
      pantryItemsUsed: pantry.length > 0 ? pantry.slice(0, Math.min(5, pantry.length)).map(item => item.id) : [],
      tags: template.tags,
    };
  });
};

export function AIRecipeListScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const pantry = useAppStore((state) => state.inventory);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<string[]>([]);
  const [selectedCostFilter, setSelectedCostFilter] = useState<string[]>([]);
  const [surpriseRecipes, setSurpriseRecipes] = useState<AIRecipe[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const isSurpriseMe = location.state?.surpriseMe === true;
  const surpriseKey = location.state?.surpriseKey || Date.now();

  // Generate surprise recipes when surpriseMe is true
  useEffect(() => {
    if (isSurpriseMe) {
      setIsGenerating(true);
      // Simulate AI generation delay
      setTimeout(() => {
        const recipes = generateSurpriseRecipes(pantry);
        setSurpriseRecipes(recipes);
        setIsGenerating(false);
      }, 1500);
    } else {
      // Clear recipes when not in surprise mode
      setSurpriseRecipes([]);
    }
  }, [isSurpriseMe, surpriseKey, pantry]);

  // Generate AI recipes from pantry (for non-surprise mode)
  const aiRecipes = useMemo<AIRecipe[]>(() => {
    if (isSurpriseMe) {
      return surpriseRecipes;
    }
    
    // Default single recipe for manual search
    return [
      {
        id: '1',
        title: 'Pantry Clear Pasta',
        description: 'Use up your pasta and canned goods',
        ingredients: pantry.slice(0, 5).map(item => ({
          name: item.name,
          amount: item.quantity,
          unit: item.unit,
          inPantry: true,
        })),
        steps: [
          'Heat olive oil in a large pan',
          'Add garlic and sauté',
          'Add canned tomatoes and simmer',
          'Cook pasta and combine',
          'Serve hot',
        ],
        servings: 4,
        prepTime: 10,
        cookTime: 20,
        costEstimate: 3.50,
        difficulty: 'easy',
        pantryItemsUsed: pantry.slice(0, 5).map(item => item.id),
        tags: ['pantry-clear', 'quick'],
      },
    ];
  }, [pantry, isSurpriseMe, surpriseRecipes]);

  const filteredRecipes = useMemo(() => {
    let filtered = aiRecipes;

    if (selectedTimeFilter.length > 0) {
      filtered = filtered.filter(recipe => {
        const totalTime = recipe.prepTime + recipe.cookTime;
        if (selectedTimeFilter.includes('quick')) {
          return totalTime < 30;
        }
        if (selectedTimeFilter.includes('medium')) {
          return totalTime >= 30 && totalTime <= 60;
        }
        return true;
      });
    }

    if (selectedCostFilter.length > 0) {
      filtered = filtered.filter(recipe => {
        if (selectedCostFilter.includes('budget')) {
          return recipe.costEstimate <= 5;
        }
        if (selectedCostFilter.includes('moderate')) {
          return recipe.costEstimate <= 10;
        }
        return true;
      });
    }

    return filtered;
  }, [aiRecipes, selectedTimeFilter, selectedCostFilter]);

  return (
    <Screen>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 touch-target"
            aria-label="Back"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-sm font-semibold text-teal">AI Recipes</h1>
          <div className="w-8" />
        </div>
      </header>

      {/* Filters */}
      <div className="px-4 py-3 bg-white border-b border-gray-200 space-y-3">
        <div>
          <p className="text-xs font-medium text-gray-700 mb-2">Time</p>
          <FilterChipBar
            filters={timeFilters}
            selected={selectedTimeFilter}
            onChange={setSelectedTimeFilter}
          />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-700 mb-2">Cost</p>
          <FilterChipBar
            filters={costFilters}
            selected={selectedCostFilter}
            onChange={setSelectedCostFilter}
          />
        </div>
      </div>

      {/* Recipe List */}
      <div className="px-4 py-4 pb-32 safe-area-bottom">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal mb-4"></div>
            <p className="text-sm text-gray-600">Generating surprise recipes...</p>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <EmptyState
            title="No recipes found"
            description="Try adjusting your filters or add more items to your pantry"
            icon="🍳"
          />
        ) : (
          <div className="space-y-4">
            {isSurpriseMe && (
              <div className="mb-4 p-3 bg-brand-bg rounded-xl border border-brand-sage/20">
                <p className="text-sm font-medium text-brand-teal">
                  🎲 Surprise! Here are 3 different recipes for you
                </p>
              </div>
            )}
            {filteredRecipes.map((recipe) => (
              <AIRecipeCard
                key={recipe.id}
                recipe={recipe}
                onCookAndShare={() => {
                  navigate('/post/capture', {
                    state: {
                      draftRecipe: {
                        id: recipe.id,
                        title: recipe.title,
                        description: recipe.description,
                        ingredients: recipe.ingredients.map(ing => ({
                          id: crypto.randomUUID(),
                          name: ing.name,
                          amount: ing.amount,
                          unit: ing.unit,
                        })),
                        steps: recipe.steps,
                        servings: recipe.servings,
                        prepTime: recipe.prepTime,
                        cookTime: recipe.cookTime,
                        costEstimate: recipe.costEstimate,
                        tags: recipe.tags,
                        reCookCount: 0,
                        createdAt: new Date(),
                      },
                    },
                  });
                }}
                onSaveRecipe={() => {
                  // Save recipe
                  navigate(-1);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </Screen>
  );
}

