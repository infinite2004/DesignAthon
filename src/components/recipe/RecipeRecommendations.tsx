import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Clock } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { formatCurrency } from '../../lib/utils';

interface RecipeRecommendationsProps {
  maxResults?: number;
}

export function RecipeRecommendations({ maxResults = 5 }: RecipeRecommendationsProps) {
  const navigate = useNavigate();
  const posts = useAppStore((state) => state.posts);
  const inventory = useAppStore((state) => state.inventory);
  const savedRecipes = useAppStore((state) => state.savedRecipes);

  // Get user preferences
  const userPrefs = useMemo(() => {
    try {
      const budget = JSON.parse(localStorage.getItem('user_budget') || '{}');
      const cooking = JSON.parse(localStorage.getItem('user_cooking_prefs') || '{}');
      const diet = JSON.parse(localStorage.getItem('user_diet_prefs') || '{}');
      return { budget, cooking, diet };
    } catch {
      return { budget: {}, cooking: {}, diet: {} };
    }
  }, []);

  // Score and rank recipes
  const recommendations = useMemo(() => {
    const recipePosts = posts
      .filter(post => post.recipe && post.type === 'meal')
      .map(post => ({
        post,
        recipe: post.recipe!,
        score: 0,
      }));

    // Score each recipe
    recipePosts.forEach(({ recipe }) => {
      let recipeScore = 0;

      // Inventory match (highest priority)
      if (recipe.ingredients && inventory.length > 0) {
        const matchingIngredients = recipe.ingredients.filter(ing =>
          inventory.some(inv => 
            inv.name.toLowerCase().includes(ing.name.toLowerCase()) ||
            ing.name.toLowerCase().includes(inv.name.toLowerCase())
          )
        );
        const matchPercentage = matchingIngredients.length / recipe.ingredients.length;
        recipeScore += matchPercentage * 50; // Up to 50 points

        // Bonus for expiring items
        const expiringItems = inventory.filter(inv => {
          if (!inv.expiryDate) return false;
          const daysUntil = Math.floor(
            (new Date(inv.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );
          return daysUntil <= 3 && daysUntil >= 0;
        });
        const usingExpiring = recipe.ingredients.filter(ing =>
          expiringItems.some(inv =>
            inv.name.toLowerCase().includes(ing.name.toLowerCase())
          )
        ).length;
        recipeScore += usingExpiring * 10; // 10 points per expiring item used
      }

      // Budget alignment
      if (recipe.costEstimate && userPrefs.budget.amount) {
        const costPerServing = recipe.costEstimate / (recipe.servings || 1);
        const budgetPerMeal = userPrefs.budget.amount / (userPrefs.budget.period === 'week' ? 21 : 90);
        if (costPerServing <= budgetPerMeal) {
          recipeScore += 20; // Budget-friendly
        }
      }

      // Not already saved (prefer new recipes)
      if (!savedRecipes.includes(recipe.id)) {
        recipeScore += 10;
      }

      // Lower cost = higher score
      if (recipe.costEstimate) {
        const costPerServing = recipe.costEstimate / (recipe.servings || 1);
        if (costPerServing < 3) {
          recipeScore += 15; // Very budget-friendly
        } else if (costPerServing < 5) {
          recipeScore += 10;
        }
      }

    });

    // Sort by score and return top results
    const scoredRecipes = recipePosts.map(({ recipe, post }) => {
      let recipeScore = 0;
      
      // Calculate score (same logic as above)
      if (recipe.ingredients) {
        const matchingIngredients = recipe.ingredients.filter(ing =>
          inventory.some(inv =>
            inv.name.toLowerCase().includes(ing.name.toLowerCase())
          )
        ).length;
        recipeScore += (matchingIngredients / recipe.ingredients.length) * 50;
      }
      
      if (recipe.costEstimate && recipe.servings) {
        const costPerServing = recipe.costEstimate / recipe.servings;
        if (costPerServing < 3) {
          recipeScore += 15;
        } else if (costPerServing < 5) {
          recipeScore += 10;
        }
      }
      
      return {
        recipe,
        post,
        score: recipeScore,
        ingredientMatch: recipe.ingredients
          ? (recipe.ingredients.filter(ing =>
              inventory.some(inv =>
                inv.name.toLowerCase().includes(ing.name.toLowerCase())
              )
            ).length / recipe.ingredients.length) * 100
          : 0,
      };
    });
    
    return scoredRecipes
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
  }, [posts, inventory, savedRecipes, userPrefs, maxResults]);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-brand-teal/5 to-brand-sage/5 rounded-2xl p-4 border border-brand-teal/20">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={20} className="text-brand-teal" />
        <h3 className="font-bold text-brand-teal">Recommended for You</h3>
      </div>
      <p className="text-xs text-slate-600 mb-4">
        Based on your inventory and preferences
      </p>
      
      <div className="space-y-3">
        {recommendations.map(({ recipe, post, ingredientMatch }) => (
          <button
            key={recipe.id}
            onClick={() => navigate(`/recipe/${recipe.id}`, { state: { recipe } })}
            className="w-full text-left bg-white rounded-xl p-3 border border-slate-200 hover:border-brand-teal hover:shadow-md transition-all active:scale-[0.98]"
          >
            <div className="flex items-start gap-3">
              {post.media && post.media.length > 0 ? (
                <img
                  src={post.media[0]}
                  alt={recipe.title}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-brand-teal/20 to-brand-sage/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🍳</span>
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-slate-900 line-clamp-1 mb-1">
                  {recipe.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-slate-600 mb-2">
                  {recipe.prepTime && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {recipe.prepTime} min
                    </span>
                  )}
                  {recipe.costEstimate && (
                    <span className="font-semibold text-brand-teal">
                      {formatCurrency(recipe.costEstimate / (recipe.servings || 1))}/serving
                    </span>
                  )}
                </div>
                {ingredientMatch > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-teal rounded-full transition-all"
                        style={{ width: `${Math.min(ingredientMatch, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-600">
                      {Math.round(ingredientMatch)}% match
                    </span>
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
