import { Heart, MessageCircle, Repeat2, Bookmark, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { useToast } from '../../components/ui/ToastContext';
import { formatTimeAgo, formatCurrency } from '../../lib/utils';
import type { Post, GroceryItem } from '../../types';
import { usePostActions } from '../../hooks/usePostActions';
import { cn } from '../../lib/utils';
import { Avatar } from '../media/Avatar';
import { Badge } from '../ui/Badge';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { likePost } = usePostActions();
  const reCookPost = useAppStore((state) => state.reCookPost);
  const addGroceryItem = useAppStore((state) => state.addGroceryItem);
  const savedPosts = useAppStore((state) => state.savedPosts);
  const savePost = useAppStore((state) => state.savePost);
  const unsavePost = useAppStore((state) => state.unsavePost);
  
  const isSaved = savedPosts.includes(post.id);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    likePost(post.id);
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/post/${post.id}`);
  };

  const handleReCook = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!post.recipeId) return;
    
    // Increment re-cook count
    reCookPost(post.id);
    
    // Navigate to create post with recipe
    navigate('/post/compose', {
      state: {
        recipeId: post.recipeId,
        recipe: post.recipe,
        reCookFrom: post.id,
        imageUri: post.media[0] || '',
      },
    });
    showToast('Re-cooking this recipe! 🍳', 'success');
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved) {
      unsavePost(post.id);
      showToast('Post unsaved', 'success');
    } else {
      savePost(post.id);
      showToast('Post saved! 💾', 'success');
    }
  };

  const handleAddToGroceryList = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handlePostClick = () => {
    navigate(`/post/${post.id}`);
  };

  return (
    <article
      onClick={handlePostClick}
      className="bg-white border-b border-gray-200 active:bg-gray-50 transition-all duration-200 hover:shadow-sm cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pb-2">
        <Avatar
          src={post.user.avatar}
          initials={post.user.displayName ? post.user.displayName.split(' ').map(n => n[0]).join('').toUpperCase() : post.user.username?.charAt(0).toUpperCase() || 'U'}
          size={40}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm truncate">{post.user.displayName}</h3>
            <span className="text-xs text-gray-500">·</span>
            <span className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</span>
          </div>
          <p className="text-xs text-gray-500">@{post.user.username}</p>
        </div>
      </div>

      {/* Media */}
      {post.media.length > 0 && post.media[0] && !post.media[0].startsWith('blob:') ? (
        <div className="w-full aspect-square bg-gray-100 overflow-hidden relative">
          <img
            src={post.media[0]}
            alt={post.caption}
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
        </div>
      ) : (
        // Show placeholder if no valid image
        <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
          <span className="text-4xl">🍳</span>
        </div>
      )}

      {/* Badges */}
      {post.badges.length > 0 && (
        <div className="px-4 pt-2 flex flex-wrap gap-1">
          {post.badges.map((badge) => (
            <Badge key={badge} variant="primary" size="sm">
              {badge}
            </Badge>
          ))}
        </div>
      )}

      {/* Recipe Chip */}
      {post.recipe && post.stats && (
        <div className="px-4 pt-2">
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{post.recipe.title}</p>
              <p className="text-xs text-gray-600">
                {formatCurrency(post.stats.costPerServing)}/serving
                {post.stats.expiringItemsUsed > 0 && (
                  <span> · Used {post.stats.expiringItemsUsed} expiring items</span>
                )}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/recipe/${post.recipeId}`);
              }}
              className="text-xs text-brand-teal font-medium px-2 py-1 hover:bg-brand-bg rounded"
            >
              View Recipe
            </button>
          </div>
        </div>
      )}

      {/* Caption */}
      <div className="px-4 pt-3 pb-2">
        <p className="text-sm text-gray-900 leading-relaxed">{post.caption}</p>
      </div>

      {/* Stats */}
      {post.stats && (
        <div className="px-4 pb-2 flex items-center gap-4 text-xs text-gray-600">
          {post.stats.wasteSaved > 0 && (
            <span>♻️ Saved {post.stats.wasteSaved}g from waste</span>
          )}
          {post.stats.costPerServing > 0 && (
            <span>💰 {formatCurrency(post.stats.costPerServing)}/serving</span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1.5 touch-target transition-all duration-200 active:scale-110",
              post.isLiked ? "text-red-500" : "text-gray-600 hover:text-red-500"
            )}
          >
            <Heart
              size={20}
              className={cn(post.isLiked && "fill-current", "transition-transform duration-200")}
            />
            <span className="text-sm font-medium">{post.likes}</span>
          </button>

          <button
            onClick={handleComment}
            className="flex items-center gap-1.5 text-gray-600 hover:text-brand-teal touch-target transition-all duration-200 active:scale-110"
          >
            <MessageCircle size={20} className="transition-transform duration-200" />
            <span className="text-sm font-medium">{post.comments}</span>
          </button>

          {post.recipeId && (
            <button
              onClick={handleReCook}
              className="flex items-center gap-1.5 text-gray-600 hover:text-brand-teal touch-target transition-all duration-200 active:scale-110"
              title="Re-cook this recipe"
            >
              <Repeat2 size={20} className="transition-transform duration-200" />
              <span className="text-sm font-medium">{post.reCooks}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {post.recipeId && (
            <button
              onClick={handleAddToGroceryList}
              className="text-gray-600 hover:text-brand-teal touch-target transition-all duration-200 active:scale-110"
              title="Add ingredients to grocery list"
            >
              <ShoppingCart size={20} className="transition-transform duration-200" />
            </button>
          )}
          <button
            onClick={handleSave}
            className={`touch-target transition-all duration-200 active:scale-110 ${
              isSaved ? 'text-brand-teal' : 'text-gray-600 hover:text-brand-teal'
            }`}
            title={isSaved ? 'Unsave post' : 'Save post'}
          >
            <Bookmark size={20} className={cn(isSaved ? 'fill-current' : '', 'transition-transform duration-200')} />
          </button>
        </div>
      </div>
    </article>
  );
}

