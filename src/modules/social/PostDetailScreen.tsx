import { Heart, MessageCircle, Repeat2, ShoppingCart } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { useToast } from '../../components/ui/ToastContext';
import { formatTimeAgo, formatCurrency } from '../../lib/utils';
import { cn } from '../../lib/utils';
import { Screen } from '../../components/layout/Screen';
import { Avatar } from '../../components/media/Avatar';
import { usePostActions } from '../../hooks/usePostActions';
import { CommentList } from '../../components/social/CommentList';
import { NewCommentInput } from '../../components/social/NewCommentInput';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import type { GroceryItem } from '../../types';

export function PostDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { likePost } = usePostActions();
  const posts = useAppStore((state) => state.posts);
  const comments = useAppStore((state) => state.comments);
  const reCookPost = useAppStore((state) => state.reCookPost);
  const addGroceryItem = useAppStore((state) => state.addGroceryItem);

  // Get post from store
  const post = posts.find((p) => p.id === id);
  const postComments = comments.filter((c) => c.postId === id);

  if (!post) {
    return (
      <Screen>
        <div className="p-4">
          <ErrorMessage message="Post not found" />
        </div>
      </Screen>
    );
  }

  const handleReCook = () => {
    if (!post.recipeId) return;
    
    // Increment re-cook count
    reCookPost(post.id);
    
    // Navigate to create post with recipe
    navigate('/create', {
      state: {
        recipeId: post.recipeId,
        recipe: post.recipe,
        reCookFrom: post.id,
      },
    });
    showToast('Re-cooking this recipe! 🍳', 'success');
  };

  const handleAddToGroceryList = () => {
    if (!post.recipe || !post.recipe.ingredients) {
      showToast('No recipe ingredients available', 'error');
      return;
    }

    const inventory = useAppStore.getState().inventory;
    let addedCount = 0;

    // Add ingredients to grocery list (respecting inventory)
    post.recipe.ingredients.forEach((ing) => {
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
          recipeId: post.recipeId,
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
    <Screen background="transparent">

      {/* Post Content */}
      <div className="border-b border-gray-200">
        <div className="flex items-center gap-3 p-4">
          <Avatar
            src={post.user.avatar}
            initials={post.user.displayName ? post.user.displayName.split(' ').map(n => n[0]).join('').toUpperCase() : post.user.username?.charAt(0).toUpperCase() || 'U'}
            size={40}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">{post.user.displayName}</h3>
              <span className="text-xs text-gray-500">·</span>
              <span className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</span>
            </div>
            <p className="text-xs text-gray-500">@{post.user.username}</p>
          </div>
        </div>

        {post.media.length > 0 && (
          <div className="w-full aspect-square bg-gray-100">
            <img
              src={post.media[0]}
              alt={post.caption}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="px-4 py-4 space-y-3">
          <p className="text-sm leading-relaxed">{post.caption}</p>

          {post.stats && (
            <div className="p-3 bg-gray-50 rounded-lg space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Cost per serving:</span>
                <span className="font-semibold">{formatCurrency(post.stats.costPerServing)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Waste saved:</span>
                <span className="font-semibold">{post.stats.wasteSaved}g</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={() => likePost(post.id)}
              className={cn(
                "flex items-center gap-1.5 touch-target",
                post.isLiked ? "text-red-500" : "text-gray-600"
              )}
            >
              <Heart size={20} className={cn(post.isLiked && "fill-current")} />
              <span className="text-sm font-medium">{post.likes}</span>
            </button>

            <button className="flex items-center gap-1.5 text-gray-600 touch-target">
              <MessageCircle size={20} />
              <span className="text-sm font-medium">{post.comments}</span>
            </button>

            {post.recipeId && (
              <button
                onClick={handleReCook}
                className="flex items-center gap-1.5 text-gray-600 hover:text-brand-teal touch-target"
                title="Re-cook this recipe"
              >
                <Repeat2 size={20} />
                <span className="text-sm font-medium">{post.reCooks}</span>
              </button>
            )}
          </div>

          {/* Action Buttons */}
          {post.recipeId && (
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={handleAddToGroceryList}
                className="flex items-center gap-2 px-4 py-2 bg-brand-bg rounded-2xl text-sm font-medium text-brand-teal touch-target"
              >
                <ShoppingCart size={18} />
                Add to Grocery List
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="flex-1 pb-20">
        <div className="px-4 py-4">
          <h2 className="font-semibold text-sm mb-3">Comments</h2>
          <CommentList comments={postComments} />
        </div>
      </div>

      {/* Comment Input */}
      <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
        <NewCommentInput postId={post.id} />
      </div>
    </Screen>
  );
}

