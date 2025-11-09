import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { Screen } from '../../components/layout/Screen';
import { EmptyState } from '../../components/ui/EmptyState';
import { RecipeCard } from '../../components/recipe/RecipeCard';

export function SavedRecipesScreen() {
  const navigate = useNavigate();
  const savedRecipes = useAppStore((state) => state.savedRecipes);
  const posts = useAppStore((state) => state.posts);
  
  // Get recipes from saved posts
  const recipes = posts
    .filter(p => savedRecipes.includes(p.id) && p.recipe)
    .map(p => p.recipe!)
    .filter((recipe, index, self) => 
      index === self.findIndex(r => r.id === recipe.id)
    );

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
          <h1 className="text-sm font-semibold text-teal">Saved Recipes</h1>
          <div className="w-8" />
        </div>
      </header>

      <div className="px-4 py-4">
        {recipes.length === 0 ? (
          <EmptyState
            title="No saved recipes"
            description="Save recipes from posts to see them here"
            icon="📚"
          />
        ) : (
          <div className="space-y-4">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => navigate(`/recipe/${recipe.id}`)}
                className="cursor-pointer"
              >
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Screen>
  );
}

