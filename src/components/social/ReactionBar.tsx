import { ChefHat, Flame, Heart, MessageCircle, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useReactions } from '../../hooks/useReactions';
import { useAuth } from '../../providers/AuthProvider';
import { useAppStore } from '../../store/appStore';
import { useToast } from '../ui/ToastContext';
import { cn } from '../../lib/utils';
import type { Post } from '../../types';

type ReactionBarProps = {
  post: Post;
  onCommentPress?: () => void;
  onSavePress?: () => void;
  onRequestRecipe?: () => void;
};

export function ReactionBar({ post, onCommentPress, onSavePress, onRequestRecipe }: ReactionBarProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { react, reactions } = useReactions(post.id);
  const reCookPost = useAppStore((state) => state.reCookPost);
  const currentReaction = user ? reactions.find(r => r.userId === user.id) : undefined;

  const handleCooked = () => {
    if (post.recipeId && post.recipe) {
      // Has recipe - navigate to re-cook flow
      reCookPost(post.id);
      navigate('/post/capture', {
        state: {
          recipeId: post.recipeId,
          recipe: post.recipe,
          reCookFrom: post.id,
        },
      });
      showToast('Re-cooking this recipe! 🍳', 'success');
    } else {
      // No recipe - request recipe
      if (onRequestRecipe) {
        onRequestRecipe();
      } else {
        // Fallback: navigate to post detail where request button is
        navigate(`/post/${post.id}`);
      }
    }
  };

  const handleYoureCooked = () => {
    react('youre_cooked');
  };

  const handleLike = () => {
    react('like');
  };

  const cookedCount = reactions.filter(r => r.type === 'cooked').length;
  const youreCookedCount = reactions.filter(r => r.type === 'youre_cooked').length;
  const likeCount = reactions.filter(r => r.type === 'like').length;

  return (
    <div className="flex items-center gap-4 px-4 py-3">
      <button
        onClick={handleCooked}
        className={cn(
          "flex items-center gap-1.5 touch-target transition-all duration-200 active:scale-110",
          currentReaction?.type === 'cooked' ? "text-brand-teal" : "text-gray-600 hover:text-brand-teal"
        )}
        aria-label={post.recipeId ? "Re-cook recipe" : "Request recipe"}
      >
        <ChefHat
          size={20}
          className={cn(
            currentReaction?.type === 'cooked' && "fill-current"
          )}
        />
        <span className="text-sm font-medium">{cookedCount || post.reCooks || 0}</span>
      </button>

      <button
        onClick={handleYoureCooked}
        className={cn(
          "flex items-center gap-1.5 touch-target transition-all duration-200 active:scale-110",
          currentReaction?.type === 'youre_cooked' ? "text-brand-yellow" : "text-gray-600 hover:text-brand-yellow"
        )}
        aria-label="Fire"
      >
        <Flame
          size={20}
          className={cn(
            currentReaction?.type === 'youre_cooked' && "fill-current"
          )}
        />
        <span className="text-sm font-medium">{youreCookedCount}</span>
      </button>

      <button
        onClick={handleLike}
        className={cn(
          "flex items-center gap-1.5 touch-target transition-all duration-200 active:scale-110",
          currentReaction?.type === 'like' || post.isLiked ? "text-red-500" : "text-gray-600 hover:text-red-500"
        )}
        aria-label="Like"
      >
        <Heart
          size={20}
          className={cn(
            (currentReaction?.type === 'like' || post.isLiked) && "fill-current"
          )}
        />
        <span className="text-sm font-medium">{likeCount || post.likes || 0}</span>
      </button>

      <button
        onClick={onCommentPress}
        className="flex items-center gap-1.5 text-gray-600 hover:text-brand-teal touch-target transition-all duration-200 active:scale-110"
        aria-label="Comment"
      >
        <MessageCircle size={20} />
        <span className="text-sm font-medium">{post.comments || 0}</span>
      </button>

      <div className="flex-1" />

      <button
        onClick={onSavePress}
        className={cn(
          "touch-target transition-all duration-200 active:scale-110",
          post.isSaved ? "text-brand-teal" : "text-gray-600 hover:text-brand-teal"
        )}
        aria-label={post.isSaved ? "Unsave post" : "Save post"}
      >
        <Bookmark size={20} className={post.isSaved ? "fill-current" : ""} />
      </button>
    </div>
  );
}

