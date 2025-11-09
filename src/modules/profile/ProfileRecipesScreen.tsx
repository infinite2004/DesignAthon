import { Screen } from '../../components/layout/Screen';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../state/authStore';
import { useAppStore } from '../../store/appStore';
import { EmptyState } from '../../components/ui/EmptyState';

export const ProfileRecipesScreen: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const posts = useAppStore((state) => state.posts);

  if (!user) {
    return (
      <Screen>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">Please sign in</p>
        </div>
      </Screen>
    );
  }

  // Get all recipes from user's posts and saved recipes
  const savedRecipes = useAppStore((state) => state.savedRecipes);
  const allPosts = useAppStore((state) => state.posts);
  
  // Get recipes from user's posts
  const userPostRecipes = posts
    .filter((p) => p.userId === user.id && p.recipe)
    .map((post) => post.recipe!)
    .filter((recipe, index, self) => 
      // Remove duplicates by recipe ID
      index === self.findIndex((r) => r.id === recipe.id)
    );
  
  // Get saved recipes from other users' posts
  const savedRecipeObjects = allPosts
    .filter((p) => p.recipe && savedRecipes.includes(p.recipe.id))
    .map((post) => post.recipe!)
    .filter((recipe, index, self) => 
      index === self.findIndex((r) => r.id === recipe.id)
    );
  
  // Combine user's recipes and saved recipes
  const userRecipes = [...userPostRecipes, ...savedRecipeObjects];

  return (
    <Screen>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            className="p-2 -ml-2 touch-target" 
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <ArrowLeft size={24} className="text-brand-teal" />
          </button>
          <h1 className="text-sm font-semibold text-brand-teal">My Recipes</h1>
          <div className="w-8" />
        </div>
      </header>
      
      <div className="px-4 py-6">
        {userRecipes.length === 0 ? (
          <EmptyState
            title="No recipes yet"
            description="Create posts with recipes or save recipes from others to see them here!"
            actionLabel="Create Your First Recipe Post"
            onAction={() => navigate('/create')}
            icon="🍳"
          />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {userRecipes.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => navigate(`/recipe/${recipe.id}`)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow touch-target"
              >
                {recipe.image && (
                  <div className="aspect-square w-full overflow-hidden bg-slate-100">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-slate-900 mb-1 line-clamp-2">
                    {recipe.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                    {recipe.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>{recipe.servings} servings</span>
                    {recipe.costEstimate && (
                      <span className="font-semibold text-brand-teal">
                        ${recipe.costEstimate.toFixed(2)}/serving
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Screen>
  );
};

