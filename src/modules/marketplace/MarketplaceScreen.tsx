import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Heart, Bookmark, ShoppingCart } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useToast } from '../../components/ui/ToastContext';
import { Screen } from '../../components/layout/Screen';
import { Avatar } from '../../components/media/Avatar';
import { formatCurrency } from '../../lib/utils';
import { formatTimeAgo } from '../../lib/utils';
import { DietFilterBar } from '../../components/filters/DietFilterBar';
import { TagFilterBar } from '../../components/filters/TagFilterBar';
import { SearchBar } from '../../components/ui/SearchBar';
import { EmptyState } from '../../components/ui/EmptyState';
import type { Recipe } from '../../types';

type DietFilter = 'all' | 'vegan' | 'vegetarian' | 'pescatarian' | 'keto' | 'paleo' | 'halal' | 'kosher';

export function MarketplaceScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const posts = useAppStore((state) => state.posts);
  const savedRecipes = useAppStore((state) => state.savedRecipes);
  const saveRecipe = useAppStore((state) => state.saveRecipe);
  const unsaveRecipe = useAppStore((state) => state.unsaveRecipe);
  const addGroceryItem = useAppStore((state) => state.addGroceryItem);
  const inventory = useAppStore((state) => state.inventory);
  const likePost = useAppStore((state) => state.likePost);

  const [searchQuery, setSearchQuery] = useState('');
  const [dietFilter, setDietFilter] = useState<DietFilter>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Get all recipes from posts
  const recipePosts = useMemo(() => {
    return posts
      .filter(post => (post.recipe || post.recipeId) && post.type === 'meal')
      .map(post => {
        // If post has recipe object, use it; otherwise create a basic recipe from recipeId
        let recipe: Recipe | null = post.recipe || null;
        
        // If no recipe but has recipeId, create a basic recipe object
        if (!recipe && post.recipeId) {
          recipe = {
            id: post.recipeId,
            title: post.caption.split('\n')[0].substring(0, 50) || 'Recipe',
            description: post.caption,
            ingredients: [],
            steps: [],
            servings: post.stats?.expiringItemsUsed || 2,
            prepTime: 15,
            cookTime: 30,
            costEstimate: post.stats?.costPerServing || 0,
            tags: post.badges.map(b => b.toLowerCase()),
            reCookCount: post.reCooks,
            createdAt: post.createdAt,
          };
        }
        
        return recipe ? {
          post,
          recipe,
        } : null;
      })
      .filter((item): item is { post: typeof posts[0]; recipe: Recipe } => item !== null);
  }, [posts]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    recipePosts.forEach(({ post }) => {
      post.badges.forEach(badge => tagSet.add(badge));
    });
    return Array.from(tagSet);
  }, [recipePosts]);

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    let filtered = recipePosts;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(({ recipe, post }) =>
        recipe.title.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query) ||
        post.user.displayName.toLowerCase().includes(query) ||
        recipe.ingredients.some(ing => ing.name.toLowerCase().includes(query))
      );
    }

    // Diet filter
    if (dietFilter !== 'all') {
      filtered = filtered.filter(({ recipe }) =>
        recipe.tags?.includes(dietFilter)
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(({ post }) =>
        selectedTags.some(tag => post.badges.includes(tag))
      );
    }

    return filtered;
  }, [recipePosts, searchQuery, dietFilter, selectedTags]);

  const handleLike = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    likePost(postId);
  };

  const handleSave = (recipeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedRecipes.includes(recipeId)) {
      unsaveRecipe(recipeId);
      showToast('Recipe unsaved', 'success');
    } else {
      saveRecipe(recipeId);
      showToast('Recipe saved! 💾', 'success');
    }
  };

  const handleAddToList = (recipe: Recipe, e: React.MouseEvent) => {
    e.stopPropagation();
    let addedCount = 0;

    recipe.ingredients.forEach((ing) => {
      const inInventory = inventory.some(
        (invItem) => invItem.name.toLowerCase() === ing.name.toLowerCase()
      );
      
      if (!inInventory) {
        let category = 'Produce';
        const nameLower = ing.name.toLowerCase();
        if (nameLower.includes('can') || nameLower.includes('jar')) {
          category = 'Canned';
        } else if (nameLower.includes('frozen')) {
          category = 'Frozen';
        } else if (nameLower.includes('spice') || nameLower.includes('flour') || nameLower.includes('oil') || nameLower.includes('sauce')) {
          category = 'Pantry';
        } else if (nameLower.includes('milk') || nameLower.includes('cheese') || nameLower.includes('yogurt')) {
          category = 'Dairy';
        } else if (nameLower.includes('meat') || nameLower.includes('chicken') || nameLower.includes('beef') || nameLower.includes('fish')) {
          category = 'Meat';
        }
        
        addGroceryItem({
          id: crypto.randomUUID(),
          name: ing.name,
          quantity: ing.amount,
          unit: ing.unit,
          category,
          isChecked: false,
          recipeId: recipe.id,
        });
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
      {/* Header with Search */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 safe-area-top">
        <div className="px-4 py-3 space-y-3">
          <div className="flex items-center gap-2">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search recipes..."
              onFocus={() => setShowFilters(false)}
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-xl touch-target transition-colors ${
                showFilters || dietFilter !== 'all' || selectedTags.length > 0
                  ? 'bg-brand-teal text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Filter size={20} />
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="space-y-3 pb-2">
              <DietFilterBar value={dietFilter} onChange={setDietFilter} />
              {allTags.length > 0 && (
                <TagFilterBar
                  tags={allTags}
                  selectedTags={selectedTags}
                  onChange={setSelectedTags}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pinterest-style Grid */}
      {filteredRecipes.length === 0 ? (
        <div className="p-4">
          <EmptyState
            title={searchQuery ? "No recipes found" : "No recipes yet"}
            description={searchQuery 
              ? "Try adjusting your search or filters to find more recipes" 
              : "Start following people or create posts with recipes to see them here!"}
            actionLabel={searchQuery ? undefined : "Create Your First Recipe Post"}
            onAction={searchQuery ? undefined : () => navigate('/create')}
            icon="🍳"
          />
        </div>
      ) : (
        <div className="px-2 py-4">
          <div className="columns-2 gap-2">
            {filteredRecipes.map(({ post, recipe }) => {
              const isSaved = savedRecipes.includes(recipe.id);
              const hasImage = post.media && post.media.length > 0;
              
              return (
                <div
                  key={recipe.id}
                  onClick={() => navigate(`/recipe/${recipe.id}`, { state: { recipe } })}
                  className="mb-2 break-inside-avoid bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 touch-target cursor-pointer active:scale-[0.98]"
                >
                  {/* Image */}
                  {hasImage && post.media[0] && !post.media[0].startsWith('blob:') ? (
                    <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={post.media[0]}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector('.image-fallback')) {
                            const fallback = document.createElement('div');
                            fallback.className = 'image-fallback absolute inset-0 flex items-center justify-center bg-gray-200';
                            fallback.innerHTML = '<span class="text-4xl">🍳</span>';
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar
                              src={post.user.avatar}
                              initials={post.user.displayName[0]}
                              size={24}
                            />
                            <span className="text-white text-xs font-medium">
                              {post.user.displayName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => handleLike(post.id, e)}
                              className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm touch-target transition-all duration-200 active:scale-110 hover:bg-white/30"
                            >
                              <Heart
                                size={16}
                                className={`transition-all duration-200 ${post.isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`}
                              />
                            </button>
                            <button
                              onClick={(e) => handleSave(recipe.id, e)}
                              className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm touch-target transition-all duration-200 active:scale-110 hover:bg-white/30"
                            >
                              <Bookmark
                                size={16}
                                className={`transition-all duration-200 ${isSaved ? 'fill-brand-teal text-brand-teal' : 'text-white'}`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full aspect-square bg-gradient-to-br from-brand-teal/20 to-brand-sage/20 flex items-center justify-center">
                      <span className="text-4xl">🍳</span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-3 space-y-2">
                    {/* Title & User */}
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                        {recipe.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={post.user.avatar}
                          initials={post.user.displayName[0]}
                          size={20}
                        />
                        <span className="text-xs text-gray-600">
                          {post.user.displayName}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400">
                          {formatTimeAgo(post.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span>{recipe.servings} servings</span>
                      {recipe.costEstimate && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-brand-teal">
                            {formatCurrency(recipe.costEstimate)}/serving
                          </span>
                        </>
                      )}
                    </div>

                    {/* Badges */}
                    {post.badges.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.badges.slice(0, 3).map((badge) => (
                          <span
                            key={badge}
                            className="px-2 py-0.5 bg-brand-sage/20 text-brand-teal rounded-full text-[10px] font-medium"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/recipe/${recipe.id}`, { state: { recipe } });
                        }}
                        className="flex-1 py-1.5 bg-brand-teal text-white rounded-lg text-xs font-semibold touch-target"
                      >
                        View Recipe
                      </button>
                      <button
                        onClick={(e) => handleAddToList(recipe, e)}
                        className="p-1.5 text-gray-600 hover:text-brand-teal touch-target"
                        title="Add to grocery list"
                      >
                        <ShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Screen>
  );
}

