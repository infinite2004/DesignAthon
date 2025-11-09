import { useState, useMemo } from 'react';
import { Sparkles, Share2, Calendar, ShoppingCart, Check, AlertCircle, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/appStore';
import { useToast } from '../../../components/ui/ToastContext';
import { formatCurrency } from '../../../lib/utils';
import type { Recipe, GroceryItem, Ingredient } from '../../../types';
import { Screen } from '../../../components/layout/Screen';
import { Button } from '../../../components/ui/Button';

export function AiRecipeScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const addGroceryItem = useAppStore((state) => state.addGroceryItem);
  const inventory = useAppStore((state) => state.inventory);
  const groceryList = useAppStore((state) => state.groceryList);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [wasteSaved, setWasteSaved] = useState(0); // Store waste saved separately

  // Identify key ingredients (first 2-3 ingredients or main proteins/vegetables)
  const getKeyIngredients = (ingredients: Ingredient[]): string[] => {
    // Key ingredients are usually the first 2-3, or main proteins/vegetables
    const keyNames: string[] = [];
    
    // Always include first ingredient
    if (ingredients.length > 0) {
      keyNames.push(ingredients[0].name.toLowerCase());
    }
    
    // Include main proteins (chicken, beef, fish, salmon, eggs, etc.)
    ingredients.forEach(ing => {
      const nameLower = ing.name.toLowerCase();
      if (nameLower.includes('chicken') || nameLower.includes('beef') || 
          nameLower.includes('fish') || nameLower.includes('salmon') || 
          nameLower.includes('eggs') || nameLower.includes('tofu') ||
          nameLower.includes('chickpeas') || nameLower.includes('lentils') ||
          nameLower.includes('black beans')) {
        if (!keyNames.includes(nameLower)) {
          keyNames.push(nameLower);
        }
      }
    });
    
    // Include first 2-3 vegetables if no proteins found
    if (keyNames.length < 2) {
      ingredients.slice(0, 3).forEach(ing => {
        const nameLower = ing.name.toLowerCase();
        if (!keyNames.includes(nameLower)) {
          keyNames.push(nameLower);
        }
      });
    }
    
    return keyNames;
  };

  // Cross-reference ingredients with inventory and grocery list
  const ingredientAnalysis = useMemo(() => {
    if (!recipe) return null;

    const keyIngredientNames = getKeyIngredients(recipe.ingredients);
    const analysis = recipe.ingredients.map(ing => {
      const nameLower = ing.name.toLowerCase();
      const isKeyIngredient = keyIngredientNames.some(key => 
        nameLower.includes(key) || key.includes(nameLower)
      );
      
      // Check inventory (case-insensitive, partial match)
      const inInventory = inventory.some(invItem => {
        const invNameLower = invItem.name.toLowerCase();
        return invNameLower === nameLower || 
               invNameLower.includes(nameLower) || 
               nameLower.includes(invNameLower);
      });
      
      // Check grocery list
      const inGroceryList = groceryList.some(groceryItem => {
        const groceryNameLower = groceryItem.name.toLowerCase();
        return groceryNameLower === nameLower || 
               groceryNameLower.includes(nameLower) || 
               nameLower.includes(groceryNameLower);
      });
      
      return {
        ingredient: ing,
        isKeyIngredient,
        inInventory,
        inGroceryList,
        needsToBuy: !inInventory && !inGroceryList,
      };
    });

    const inInventoryCount = analysis.filter(a => a.inInventory).length;
    const inGroceryListCount = analysis.filter(a => a.inGroceryList).length;
    const needsToBuyCount = analysis.filter(a => a.needsToBuy).length;
    const keyIngredientsInInventory = analysis.filter(a => a.isKeyIngredient && a.inInventory).length;
    const totalKeyIngredients = analysis.filter(a => a.isKeyIngredient).length;

    return {
      analysis,
      inInventoryCount,
      inGroceryListCount,
      needsToBuyCount,
      keyIngredientsInInventory,
      totalKeyIngredients,
      hasNoInventory: inInventoryCount === 0,
    };
  }, [recipe, inventory, groceryList]);

  // Recipe templates for variety
  const recipeTemplates: Omit<Recipe, 'id' | 'createdAt'>[] = [
    {
      title: 'Quick Veggie Stir Fry',
      description: 'A fast and healthy meal using your expiring vegetables',
      ingredients: [
        { id: '1', name: 'Bell peppers', amount: 2, unit: 'pieces' },
        { id: '2', name: 'Onion', amount: 1, unit: 'medium' },
        { id: '3', name: 'Mushrooms', amount: 200, unit: 'g' },
        { id: '4', name: 'Garlic', amount: 2, unit: 'cloves' },
        { id: '5', name: 'Soy sauce', amount: 2, unit: 'tbsp' },
        { id: '6', name: 'Rice', amount: 1, unit: 'cup' },
      ],
      steps: [
        'Heat oil in a wok or large pan',
        'Add garlic and stir for 30 seconds',
        'Add vegetables and stir-fry for 5 minutes',
        'Add soy sauce and cook for 2 more minutes',
        'Serve over rice',
      ],
      servings: 3,
      prepTime: 10,
      cookTime: 10,
      costEstimate: 2.20,
      tags: ['vegetarian', 'quick', 'budget-friendly'],
      reCookCount: 0,
    },
    {
      title: 'Mediterranean Pasta Primavera',
      description: 'Fresh pasta dish with seasonal vegetables and herbs',
      ingredients: [
        { id: '1', name: 'Pasta', amount: 200, unit: 'g' },
        { id: '2', name: 'Cherry tomatoes', amount: 150, unit: 'g' },
        { id: '3', name: 'Zucchini', amount: 1, unit: 'medium' },
        { id: '4', name: 'Garlic', amount: 3, unit: 'cloves' },
        { id: '5', name: 'Olive oil', amount: 2, unit: 'tbsp' },
        { id: '6', name: 'Basil', amount: 10, unit: 'leaves' },
        { id: '7', name: 'Parmesan cheese', amount: 30, unit: 'g' },
      ],
      steps: [
        'Cook pasta according to package directions',
        'Heat olive oil in a large pan over medium heat',
        'Add garlic and cook for 1 minute until fragrant',
        'Add zucchini and tomatoes, cook for 5-7 minutes',
        'Toss cooked pasta with vegetables',
        'Garnish with fresh basil and parmesan',
      ],
      servings: 2,
      prepTime: 10,
      cookTime: 15,
      costEstimate: 2.80,
      tags: ['vegetarian', 'italian', 'quick'],
      reCookCount: 0,
    },
    {
      title: 'Spicy Black Bean Soup',
      description: 'Hearty and warming soup perfect for using up pantry staples',
      ingredients: [
        { id: '1', name: 'Black beans', amount: 1, unit: 'can' },
        { id: '2', name: 'Onion', amount: 1, unit: 'medium' },
        { id: '3', name: 'Carrots', amount: 2, unit: 'medium' },
        { id: '4', name: 'Celery', amount: 2, unit: 'stalks' },
        { id: '5', name: 'Cumin', amount: 1, unit: 'tsp' },
        { id: '6', name: 'Chili powder', amount: 1, unit: 'tsp' },
        { id: '7', name: 'Vegetable broth', amount: 2, unit: 'cups' },
      ],
      steps: [
        'Dice onion, carrots, and celery',
        'Heat oil in a large pot and sauté vegetables for 5 minutes',
        'Add spices and cook for 1 minute',
        'Add black beans and vegetable broth',
        'Simmer for 15 minutes until vegetables are tender',
        'Blend half the soup for creaminess (optional)',
        'Season with salt and pepper to taste',
      ],
      servings: 4,
      prepTime: 10,
      cookTime: 20,
      costEstimate: 1.90,
      tags: ['vegan', 'budget-friendly', 'comfort-food'],
      reCookCount: 0,
    },
    {
      title: 'One-Pan Chicken & Vegetables',
      description: 'Simple roasted meal that uses up expiring produce',
      ingredients: [
        { id: '1', name: 'Chicken thighs', amount: 4, unit: 'pieces' },
        { id: '2', name: 'Potatoes', amount: 3, unit: 'medium' },
        { id: '3', name: 'Broccoli', amount: 200, unit: 'g' },
        { id: '4', name: 'Carrots', amount: 2, unit: 'medium' },
        { id: '5', name: 'Olive oil', amount: 2, unit: 'tbsp' },
        { id: '6', name: 'Rosemary', amount: 1, unit: 'sprig' },
        { id: '7', name: 'Lemon', amount: 1, unit: 'piece' },
      ],
      steps: [
        'Preheat oven to 400°F (200°C)',
        'Cut potatoes and carrots into chunks',
        'Toss chicken and vegetables with olive oil and rosemary',
        'Arrange on a baking sheet in a single layer',
        'Roast for 25-30 minutes until chicken is cooked through',
        'Squeeze lemon over everything before serving',
      ],
      servings: 4,
      prepTime: 15,
      cookTime: 30,
      costEstimate: 3.50,
      tags: ['protein', 'one-pan', 'easy'],
      reCookCount: 0,
    },
    {
      title: 'Creamy Mushroom Risotto',
      description: 'Rich and comforting Italian rice dish',
      ingredients: [
        { id: '1', name: 'Arborio rice', amount: 1, unit: 'cup' },
        { id: '2', name: 'Mushrooms', amount: 250, unit: 'g' },
        { id: '3', name: 'Onion', amount: 1, unit: 'small' },
        { id: '4', name: 'White wine', amount: 0.5, unit: 'cup' },
        { id: '5', name: 'Vegetable broth', amount: 4, unit: 'cups' },
        { id: '6', name: 'Parmesan cheese', amount: 50, unit: 'g' },
        { id: '7', name: 'Butter', amount: 2, unit: 'tbsp' },
      ],
      steps: [
        'Heat broth in a separate pot and keep warm',
        'Sauté mushrooms until golden, set aside',
        'Cook onion in butter until translucent',
        'Add rice and toast for 2 minutes',
        'Add wine and stir until absorbed',
        'Add warm broth one ladle at a time, stirring constantly',
        'Continue until rice is creamy and al dente (about 20 minutes)',
        'Stir in mushrooms, parmesan, and butter',
      ],
      servings: 3,
      prepTime: 10,
      cookTime: 30,
      costEstimate: 3.80,
      tags: ['vegetarian', 'italian', 'comfort-food'],
      reCookCount: 0,
    },
    {
      title: 'Thai-Style Curry Bowl',
      description: 'Aromatic and flavorful curry with vegetables',
      ingredients: [
        { id: '1', name: 'Coconut milk', amount: 1, unit: 'can' },
        { id: '2', name: 'Red curry paste', amount: 2, unit: 'tbsp' },
        { id: '3', name: 'Eggplant', amount: 1, unit: 'medium' },
        { id: '4', name: 'Bell pepper', amount: 1, unit: 'piece' },
        { id: '5', name: 'Onion', amount: 1, unit: 'medium' },
        { id: '6', name: 'Basil', amount: 10, unit: 'leaves' },
        { id: '7', name: 'Jasmine rice', amount: 1, unit: 'cup' },
      ],
      steps: [
        'Cook rice according to package directions',
        'Cut vegetables into bite-sized pieces',
        'Heat curry paste in a pan for 1 minute',
        'Add coconut milk and bring to a simmer',
        'Add vegetables and cook for 10-12 minutes until tender',
        'Stir in basil leaves',
        'Serve over rice',
      ],
      servings: 3,
      prepTime: 15,
      cookTime: 15,
      costEstimate: 3.20,
      tags: ['vegetarian', 'thai', 'spicy'],
      reCookCount: 0,
    },
    {
      title: 'Breakfast Scramble Bowl',
      description: 'Protein-packed morning meal using leftover vegetables',
      ingredients: [
        { id: '1', name: 'Eggs', amount: 4, unit: 'pieces' },
        { id: '2', name: 'Spinach', amount: 100, unit: 'g' },
        { id: '3', name: 'Tomatoes', amount: 2, unit: 'medium' },
        { id: '4', name: 'Onion', amount: 0.5, unit: 'medium' },
        { id: '5', name: 'Cheese', amount: 50, unit: 'g' },
        { id: '6', name: 'Bread', amount: 2, unit: 'slices' },
      ],
      steps: [
        'Dice tomatoes and onion',
        'Heat oil in a pan and sauté onion until soft',
        'Add spinach and cook until wilted',
        'Whisk eggs and pour into pan',
        'Scramble eggs with vegetables',
        'Add cheese and season with salt and pepper',
        'Serve with toast',
      ],
      servings: 2,
      prepTime: 5,
      cookTime: 10,
      costEstimate: 2.40,
      tags: ['breakfast', 'protein', 'quick'],
      reCookCount: 0,
    },
    {
      title: 'Lentil & Vegetable Stew',
      description: 'Hearty and nutritious stew perfect for meal prep',
      ingredients: [
        { id: '1', name: 'Red lentils', amount: 1, unit: 'cup' },
        { id: '2', name: 'Carrots', amount: 2, unit: 'medium' },
        { id: '3', name: 'Celery', amount: 3, unit: 'stalks' },
        { id: '4', name: 'Onion', amount: 1, unit: 'medium' },
        { id: '5', name: 'Cumin', amount: 1, unit: 'tsp' },
        { id: '6', name: 'Turmeric', amount: 0.5, unit: 'tsp' },
        { id: '7', name: 'Vegetable broth', amount: 3, unit: 'cups' },
      ],
      steps: [
        'Rinse lentils until water runs clear',
        'Dice all vegetables',
        'Sauté onion, carrots, and celery for 5 minutes',
        'Add spices and cook for 1 minute',
        'Add lentils and broth, bring to a boil',
        'Reduce heat and simmer for 20 minutes until lentils are tender',
        'Season with salt and pepper',
      ],
      servings: 4,
      prepTime: 10,
      cookTime: 25,
      costEstimate: 1.60,
      tags: ['vegan', 'budget-friendly', 'meal-prep'],
      reCookCount: 0,
    },
    {
      title: 'Sheet Pan Salmon & Veggies',
      description: 'Healthy one-pan meal with omega-3 rich salmon',
      ingredients: [
        { id: '1', name: 'Salmon fillets', amount: 2, unit: 'pieces' },
        { id: '2', name: 'Asparagus', amount: 200, unit: 'g' },
        { id: '3', name: 'Cherry tomatoes', amount: 150, unit: 'g' },
        { id: '4', name: 'Lemon', amount: 1, unit: 'piece' },
        { id: '5', name: 'Olive oil', amount: 2, unit: 'tbsp' },
        { id: '6', name: 'Dill', amount: 1, unit: 'tbsp' },
      ],
      steps: [
        'Preheat oven to 425°F (220°C)',
        'Arrange salmon and vegetables on a baking sheet',
        'Drizzle with olive oil and season with salt, pepper, and dill',
        'Roast for 12-15 minutes until salmon flakes easily',
        'Squeeze lemon over everything before serving',
      ],
      servings: 2,
      prepTime: 5,
      cookTime: 15,
      costEstimate: 4.50,
      tags: ['protein', 'healthy', 'one-pan'],
      reCookCount: 0,
    },
    {
      title: 'Chickpea & Spinach Curry',
      description: 'Quick and satisfying Indian-inspired curry',
      ingredients: [
        { id: '1', name: 'Chickpeas', amount: 1, unit: 'can' },
        { id: '2', name: 'Spinach', amount: 200, unit: 'g' },
        { id: '3', name: 'Onion', amount: 1, unit: 'medium' },
        { id: '4', name: 'Garlic', amount: 3, unit: 'cloves' },
        { id: '5', name: 'Curry powder', amount: 2, unit: 'tsp' },
        { id: '6', name: 'Coconut milk', amount: 0.5, unit: 'can' },
        { id: '7', name: 'Rice', amount: 1, unit: 'cup' },
      ],
      steps: [
        'Cook rice according to package directions',
        'Sauté onion and garlic until fragrant',
        'Add curry powder and cook for 1 minute',
        'Add chickpeas and coconut milk, simmer for 10 minutes',
        'Stir in spinach and cook until wilted',
        'Serve over rice',
      ],
      servings: 3,
      prepTime: 10,
      cookTime: 15,
      costEstimate: 2.30,
      tags: ['vegan', 'indian', 'quick'],
      reCookCount: 0,
    },
    {
      title: 'Zucchini Noodles with Pesto',
      description: 'Light and fresh low-carb pasta alternative',
      ingredients: [
        { id: '1', name: 'Zucchini', amount: 3, unit: 'medium' },
        { id: '2', name: 'Basil', amount: 30, unit: 'g' },
        { id: '3', name: 'Pine nuts', amount: 30, unit: 'g' },
        { id: '4', name: 'Garlic', amount: 2, unit: 'cloves' },
        { id: '5', name: 'Olive oil', amount: 3, unit: 'tbsp' },
        { id: '6', name: 'Parmesan cheese', amount: 40, unit: 'g' },
      ],
      steps: [
        'Spiralize zucchini into noodles',
        'Blend basil, pine nuts, garlic, and olive oil into pesto',
        'Heat a pan and sauté zucchini noodles for 2-3 minutes',
        'Toss with pesto and parmesan',
        'Serve immediately',
      ],
      servings: 2,
      prepTime: 10,
      cookTime: 5,
      costEstimate: 3.10,
      tags: ['vegetarian', 'low-carb', 'quick'],
      reCookCount: 0,
    },
    {
      title: 'Mexican Quinoa Bowl',
      description: 'Colorful and nutritious bowl with southwest flavors',
      ingredients: [
        { id: '1', name: 'Quinoa', amount: 1, unit: 'cup' },
        { id: '2', name: 'Black beans', amount: 1, unit: 'can' },
        { id: '3', name: 'Corn', amount: 1, unit: 'cup' },
        { id: '4', name: 'Bell pepper', amount: 1, unit: 'piece' },
        { id: '5', name: 'Lime', amount: 1, unit: 'piece' },
        { id: '6', name: 'Cilantro', amount: 10, unit: 'g' },
        { id: '7', name: 'Avocado', amount: 1, unit: 'piece' },
      ],
      steps: [
        'Cook quinoa according to package directions',
        'Dice bell pepper and chop cilantro',
        'Mix quinoa with black beans and corn',
        'Add bell pepper and cilantro',
        'Squeeze lime juice over the bowl',
        'Top with sliced avocado',
      ],
      servings: 3,
      prepTime: 10,
      cookTime: 15,
      costEstimate: 2.90,
      tags: ['vegan', 'mexican', 'healthy'],
      reCookCount: 0,
    },
  ];

  const generateRecipe = async () => {
    setLoading(true);
    // Simulate AI recipe generation
    setTimeout(() => {
      // Randomly select a recipe template
      const randomTemplate = recipeTemplates[Math.floor(Math.random() * recipeTemplates.length)];
      
      // Calculate waste saved based on recipe (randomized between 300-600g)
      const wasteAmount = Math.floor(Math.random() * 300) + 300;
      
      // Convert to proper Recipe format
      const generatedRecipe: Recipe = {
        id: `ai-${Date.now()}`,
        ...randomTemplate,
        createdAt: new Date(),
      };
      
      setRecipe(generatedRecipe);
      setWasteSaved(wasteAmount);
      setLoading(false);
      showToast('Recipe generated! 🎉', 'success');
    }, 2000);
  };

  const handleCookNow = () => {
    if (!recipe) return;
    // Navigate to capture screen first, then compose with recipe
    navigate('/post/capture', {
      state: {
        recipeId: recipe.id,
        draftRecipe: recipe,
        autoFill: true,
      },
    });
  };

  const handlePlanLater = () => {
    if (!recipe) return;
    // Navigate to meal plan with recipe pre-selected
    navigate('/kitchen/meal-plan/add', {
      state: {
        recipeId: recipe.id,
        recipe: recipe,
      },
    });
    showToast('Recipe added to meal plan! 📅', 'success');
  };

  const handleAddToList = () => {
    if (!recipe) return;
    
    let addedCount = 0;

    // Add ingredients to grocery list (respecting inventory)
    recipe.ingredients.forEach((ing) => {
      // Check if ingredient is already in inventory (case-insensitive name match)
      const inInventory = inventory.some(
        (invItem) => invItem.name.toLowerCase() === ing.name.toLowerCase()
      );
      
      // Only add to grocery list if not in inventory
      if (!inInventory) {
        // Determine category based on ingredient name
        let category = 'Produce';
        const nameLower = ing.name.toLowerCase();
        if (nameLower.includes('can') || nameLower.includes('jar') || nameLower.includes('bottle')) {
          category = 'Canned';
        } else if (nameLower.includes('frozen') || nameLower.includes('ice')) {
          category = 'Frozen';
        } else if (nameLower.includes('spice') || nameLower.includes('flour') || nameLower.includes('sugar') || nameLower.includes('oil') || nameLower.includes('sauce')) {
          category = 'Pantry';
        } else if (nameLower.includes('milk') || nameLower.includes('cheese') || nameLower.includes('yogurt') || nameLower.includes('butter')) {
          category = 'Dairy';
        } else if (nameLower.includes('meat') || nameLower.includes('chicken') || nameLower.includes('beef') || nameLower.includes('fish')) {
          category = 'Meat';
        }
        
        const groceryItem: GroceryItem = {
          id: crypto.randomUUID(),
          name: ing.name,
          quantity: ing.amount,
          unit: ing.unit,
          category,
          isChecked: false,
          recipeId: recipe.id,
        };
        addGroceryItem(groceryItem);
        addedCount++;
      }
    });
    
    if (addedCount > 0) {
      showToast(`Added ${addedCount} ingredients to your grocery list! 🛒`, 'success');
    } else {
      showToast('All ingredients already in your inventory! ✅', 'success');
    }
  };

  return (
    <Screen>

      <div className="px-4 py-6">
        {!recipe ? (
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Sparkles size={24} className="text-purple-600" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Generate a Recipe</h2>
                  <p className="text-sm text-gray-600">Based on your inventory</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Our AI will analyze your inventory and create a personalized recipe
                that uses items that are expiring soon, helping you reduce waste and save money.
              </p>
              <button
                onClick={generateRecipe}
                disabled={loading}
                className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold disabled:opacity-50 touch-target flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>Generate Recipe</span>
                  </>
                )}
              </button>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-sm mb-2 text-blue-900">💡 Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Keep your inventory updated for better suggestions</li>
                <li>• Recipes prioritize items expiring soon</li>
                <li>• You can customize recipes after generation</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Recipe Card */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{recipe.title}</h2>
                  <p className="text-gray-600">{recipe.description}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Cost per serving</p>
                    <p className="text-lg font-bold text-green-700">
                      {formatCurrency(recipe.costEstimate)}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Waste saved</p>
                    <p className="text-lg font-bold text-orange-700">{wasteSaved}g</p>
                  </div>
                </div>

                {/* Ingredients Analysis */}
                {ingredientAnalysis && (
                  <div className="space-y-4">
                    {/* Summary */}
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Package size={16} className="text-blue-600" />
                        <h3 className="font-semibold text-sm text-blue-900">Ingredient Check</h3>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-blue-700 font-semibold">{ingredientAnalysis.inInventoryCount}</p>
                          <p className="text-blue-600">In Fridge</p>
                        </div>
                        <div>
                          <p className="text-blue-700 font-semibold">{ingredientAnalysis.inGroceryListCount}</p>
                          <p className="text-blue-600">In Cart</p>
                        </div>
                        <div>
                          <p className="text-orange-700 font-semibold">{ingredientAnalysis.needsToBuyCount}</p>
                          <p className="text-orange-600">Need to Buy</p>
                        </div>
                      </div>
                      {ingredientAnalysis.hasNoInventory && (
                        <div className="mt-2 p-2 bg-orange-100 rounded border border-orange-200">
                          <p className="text-xs text-orange-800 flex items-center gap-1">
                            <AlertCircle size={12} />
                            None of these ingredients are in your inventory
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Ingredients List */}
                    <div>
                      <h3 className="font-semibold mb-2">Ingredients</h3>
                      <ul className="space-y-2">
                        {ingredientAnalysis.analysis.map((item) => {
                          const { ingredient, isKeyIngredient, inInventory, inGroceryList } = item;
                          return (
                            <li
                              key={ingredient.id}
                              className={`flex items-center gap-3 p-2 rounded-lg ${
                                isKeyIngredient
                                  ? 'bg-brand-bg border border-brand-sage'
                                  : 'bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                {inInventory ? (
                                  <Check size={16} className="text-green-600 flex-shrink-0" />
                                ) : inGroceryList ? (
                                  <ShoppingCart size={16} className="text-blue-600 flex-shrink-0" />
                                ) : (
                                  <AlertCircle size={16} className="text-orange-600 flex-shrink-0" />
                                )}
                                <span className="text-sm flex-1">
                                  <span className="font-semibold">{ingredient.amount} {ingredient.unit}</span>{' '}
                                  <span className={isKeyIngredient ? 'font-semibold text-brand-teal' : ''}>
                                    {ingredient.name}
                                  </span>
                                  {isKeyIngredient && (
                                    <span className="ml-1 text-xs text-brand-teal">⭐ Key</span>
                                  )}
                                </span>
                              </div>
                              <div className="flex-shrink-0 text-xs">
                                {inInventory ? (
                                  <span className="text-green-600 font-medium">In Fridge</span>
                                ) : inGroceryList ? (
                                  <span className="text-blue-600 font-medium">In Cart</span>
                                ) : (
                                  <span className="text-orange-600 font-medium">Need</span>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* Recommendations */}
                    {ingredientAnalysis.needsToBuyCount > 0 && (
                      <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-center gap-2 mb-2">
                          <ShoppingCart size={16} className="text-orange-600" />
                          <h4 className="font-semibold text-sm text-orange-900">
                            Add to Shopping Cart
                          </h4>
                        </div>
                        <p className="text-xs text-orange-800 mb-3">
                          {ingredientAnalysis.needsToBuyCount} ingredient{ingredientAnalysis.needsToBuyCount > 1 ? 's' : ''} missing from your inventory and grocery list
                        </p>
                        <Button
                          variant="primary"
                          size="sm"
                          fullWidth
                          onClick={handleAddToList}
                          className="rounded-xl"
                        >
                          <ShoppingCart size={16} />
                          Add Missing Items to Cart
                        </Button>
                      </div>
                    )}

                    {/* All Available Message */}
                    {ingredientAnalysis.needsToBuyCount === 0 && ingredientAnalysis.inInventoryCount > 0 && (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-xs text-green-800 flex items-center gap-1">
                          <Check size={12} />
                          All ingredients are available! You can cook this recipe now.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Steps */}
                <div>
                  <h3 className="font-semibold mb-2">Instructions</h3>
                  <ol className="space-y-2">
                    {recipe.steps.map((step: string, i: number) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-semibold text-xs">
                          {i + 1}
                        </span>
                        <span className="flex-1">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 pb-6 space-y-2">
                <button
                  onClick={handleCookNow}
                  className="w-full py-3 bg-brand-teal text-white rounded-xl font-semibold touch-target flex items-center justify-center gap-2 shadow-md"
                >
                  <Share2 size={20} />
                  Cook Now & Share
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handlePlanLater}
                    className="py-3 border-2 border-gray-300 rounded-xl font-medium touch-target flex items-center justify-center gap-2 hover:border-brand-teal hover:bg-brand-bg transition-colors"
                  >
                    <Calendar size={18} />
                    Plan Later
                  </button>
                  <button
                    onClick={handleAddToList}
                    className="py-3 border-2 border-gray-300 rounded-xl font-medium touch-target flex items-center justify-center gap-2 hover:border-brand-teal hover:bg-brand-bg transition-colors"
                  >
                    <ShoppingCart size={18} />
                    Add to List
                  </button>
                </div>
                <button
                  onClick={() => {
                    setRecipe(null);
                    setWasteSaved(0);
                    showToast('Generate a new recipe! ✨', 'info');
                  }}
                  className="w-full py-2 text-gray-600 text-sm font-medium touch-target hover:text-brand-teal transition-colors"
                >
                  Generate Another Recipe
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Screen>
  );
}

