import { ShoppingCart, Repeat2, Sparkles, Clock, Users, Calendar, Share2, Bookmark } from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../../store/appStore';
import { useToast } from '../../../components/ui/ToastContext';
import { formatCurrency } from '../../../lib/utils';
import type { Recipe, GroceryItem } from '../../../types';
import { Screen } from '../../../components/layout/Screen';

export function RecipeDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const posts = useAppStore((state) => state.posts);
  const addGroceryItem = useAppStore((state) => state.addGroceryItem);
  const savedRecipes = useAppStore((state) => state.savedRecipes);
  const saveRecipe = useAppStore((state) => state.saveRecipe);
  const unsaveRecipe = useAppStore((state) => state.unsaveRecipe);
  
  // Get recipe from location state if coming from meal plan
  const recipeFromState = location.state?.recipe;

  const post = posts.find((p) => p.recipeId === id);

  // Mock recipe data - use recipe from state, post, or create default
  const recipe: Recipe = recipeFromState || post?.recipe || {
    id: id || '1',
    title: 'Chickpea Spinach Curry',
    description: 'A delicious and budget-friendly curry that uses up expiring vegetables',
    ingredients: [
      { id: '1', name: 'Chickpeas', amount: 1, unit: 'can' },
      { id: '2', name: 'Spinach', amount: 200, unit: 'g' },
      { id: '3', name: 'Cherry tomatoes', amount: 150, unit: 'g' },
      { id: '4', name: 'Onion', amount: 1, unit: 'medium' },
      { id: '5', name: 'Garlic', amount: 2, unit: 'cloves' },
      { id: '6', name: 'Curry powder', amount: 2, unit: 'tsp' },
    ],
    steps: [
      'Heat oil in a large pan over medium heat',
      'Add chopped onion and garlic, cook until soft',
      'Add curry powder and stir for 1 minute',
      'Add chickpeas and tomatoes, cook for 5 minutes',
      'Add spinach and cook until wilted',
      'Season with salt and serve hot',
    ],
    servings: 4,
    prepTime: 10,
    cookTime: 15,
    costEstimate: 2.50,
    tags: [],
    reCookCount: 0,
    createdAt: new Date(),
  };

  const isRecipeSaved = savedRecipes.includes(recipe.id);

  const handleCookNow = () => {
    // Navigate to capture screen first, then compose with recipe
    navigate('/post/capture', { 
      state: { 
        recipeId: recipe.id,
        draftRecipe: recipe,
        autoFill: true 
      } 
    });
  };

  const handlePlanLater = () => {
    // Navigate to meal plan with recipe pre-selected
    navigate('/kitchen/meal-plan/add', { 
      state: { 
        recipeId: recipe.id,
        recipe: recipe 
      } 
    });
  };

  const handleAddToList = () => {
    const inventory = useAppStore.getState().inventory;
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
        } else if (nameLower.includes('spice') || nameLower.includes('flour') || nameLower.includes('sugar') || nameLower.includes('oil')) {
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

  const handleRemix = () => {
    navigate(`/recipe/${recipe.id}/transform`);
  };

  const handleSaveRecipe = () => {
    if (!recipe) return;
    
    if (isRecipeSaved) {
      unsaveRecipe(recipe.id);
      showToast('Recipe unsaved', 'success');
    } else {
      saveRecipe(recipe.id);
      showToast('Recipe saved! 💾', 'success');
    }
  };

  return (
    <Screen>

      {/* Recipe Image */}
      {post?.media[0] && (
        <div className="w-full aspect-video bg-gray-100">
          <img
            src={post.media[0]}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="px-4 py-6 space-y-6">
        {/* Recipe Header */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{recipe.title}</h1>
          <p className="text-gray-600">{recipe.description}</p>
        </div>

        {/* Creator Info */}
        {post && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <img
              src={post.user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
              alt={post.user.displayName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold text-sm">{post.user.displayName}</p>
              <p className="text-xs text-gray-600">{post.reCooks} people re-cooked this</p>
            </div>
            <button className="text-sm text-brand-teal font-medium touch-target">
              Follow
            </button>
          </div>
        )}

        {/* Quick Info */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Clock size={20} className="mx-auto mb-1 text-gray-600" />
            <p className="text-xs text-gray-600">Prep</p>
            <p className="font-semibold">{recipe.prepTime} min</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Clock size={20} className="mx-auto mb-1 text-gray-600" />
            <p className="text-xs text-gray-600">Cook</p>
            <p className="font-semibold">{recipe.cookTime} min</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Users size={20} className="mx-auto mb-1 text-gray-600" />
            <p className="text-xs text-gray-600">Serves</p>
            <p className="font-semibold">{recipe.servings}</p>
          </div>
        </div>

        {/* Cost */}
        <div className="p-3 bg-brand-bg rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Estimated cost per serving</p>
          <p className="text-2xl font-bold text-brand-teal">
            {formatCurrency(recipe.costEstimate)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Primary: Cook Now & Share */}
          <button
            onClick={handleCookNow}
            className="w-full flex items-center justify-center gap-2 py-3 bg-brand-teal text-white rounded-2xl font-semibold shadow-md touch-target"
          >
            <Share2 size={20} />
            Cook Now & Share
          </button>

          {/* Secondary: Plan Later & Add to List */}
          <div className="flex gap-3">
            <button
              onClick={handlePlanLater}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-700 rounded-2xl font-medium touch-target"
            >
              <Calendar size={18} />
              Plan Later
            </button>
            <button
              onClick={handleAddToList}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-700 rounded-2xl font-medium touch-target"
            >
              <ShoppingCart size={18} />
              Add to List
            </button>
          </div>

          {/* Tertiary: Re-cook, Save & Remix */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/post/capture', { state: { recipeId: recipe.id, recipe } })}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-300 text-slate-700 rounded-2xl font-medium touch-target"
            >
              <Repeat2 size={18} />
              Re-cook & Post
            </button>
            <button
              onClick={handleSaveRecipe}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 border rounded-2xl font-medium touch-target ${
                isRecipeSaved 
                  ? 'border-brand-teal bg-brand-teal/10 text-brand-teal' 
                  : 'border-slate-300 text-slate-700'
              }`}
            >
              <Bookmark size={18} className={isRecipeSaved ? 'fill-current' : ''} />
              {isRecipeSaved ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={handleRemix}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-300 text-slate-700 rounded-2xl font-medium touch-target"
            >
              <Sparkles size={18} />
              Remix
            </button>
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <h2 className="text-lg font-bold mb-3">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ing) => (
              <li key={ing.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <div className="w-5 h-5 rounded-full border-2 border-brand-teal flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-brand-teal"></div>
                </div>
                <span className="text-sm">
                  <span className="font-semibold">{ing.amount} {ing.unit}</span> {ing.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div>
          <h2 className="text-lg font-bold mb-3">Instructions</h2>
          <ol className="space-y-4">
            {recipe.steps.map((step, index) => (
              <li key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <p className="flex-1 text-gray-700 leading-relaxed pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Screen>
  );
}

