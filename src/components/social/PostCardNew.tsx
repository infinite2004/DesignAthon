import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { useToast } from '../../components/ui/ToastContext';
import { formatTimeAgo } from '../../lib/utils';
import type { Post } from '../../types';
import { Avatar } from '../media/Avatar';
import { ReactionBar } from './ReactionBar';
import { CostPill } from './CostPill';
import { IngredientChipsRow } from './IngredientChipsRow';
import { Tag } from '../ui/Tag';

interface PostCardProps {
  post: Post;
  onPress?: () => void;
}

export function PostCardNew({ post, onPress }: PostCardProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const savedPosts = useAppStore((state) => state.savedPosts);
  const savePost = useAppStore((state) => state.savePost);
  const unsavePost = useAppStore((state) => state.unsavePost);
  
  const isSaved = savedPosts.includes(post.id);

  const handlePostClick = () => {
    if (onPress) {
      onPress();
    } else {
      navigate(`/post/${post.id}`);
    }
  };

  const handleCommentPress = () => {
    navigate(`/post/${post.id}`);
  };

  const handleSavePress = () => {
    if (isSaved) {
      unsavePost(post.id);
      showToast('Post unsaved', 'success');
    } else {
      savePost(post.id);
      showToast('Post saved! 💾', 'success');
    }
  };

  const handleRequestRecipe = () => {
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
            <h3 className="font-semibold text-sm truncate">{post.user.displayName || post.user.username || 'User'}</h3>
            {post.badges.includes('DAILY-COOKD') && (
              <Tag label="Daily Cook'd" variant="highlight" />
            )}
            <span className="text-xs text-gray-500">·</span>
            <span className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</span>
          </div>
          <p className="text-xs text-gray-500">@{post.user.username}</p>
        </div>
      </div>

      {/* Image */}
      {post.media.length > 0 && post.media[0] && !post.media[0].startsWith('blob:') ? (
        <div className="w-full aspect-[4/5] bg-gray-100 overflow-hidden relative">
          <img
            src={post.media[0]}
            alt={post.caption}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Show fallback when image fails to load
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
        <div className="w-full aspect-[4/5] bg-gray-200 flex items-center justify-center">
          <span className="text-4xl">🍳</span>
        </div>
      )}

      {/* Content Block */}
      <div className="px-4 pt-3 space-y-2">
        {/* Cost Pill */}
        {post.stats?.costPerServing && (
          <CostPill cost={post.stats.costPerServing} />
        )}

        {/* Mini Blog Text */}
        <p className="text-sm text-gray-900 leading-relaxed line-clamp-3">
          {post.caption}
        </p>

        {/* Ingredient Chips */}
        {post.recipe && (
          <IngredientChipsRow recipe={post.recipe} />
        )}

        {/* Creator Self-Rating */}
        {post.stats && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <span>⭐ 4.5 by you</span>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <ReactionBar
        post={{ ...post, isSaved }}
        onCommentPress={handleCommentPress}
        onSavePress={handleSavePress}
        onRequestRecipe={handleRequestRecipe}
      />
    </article>
  );
}

