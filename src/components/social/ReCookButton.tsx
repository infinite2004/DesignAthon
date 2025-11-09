import { Repeat2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { useToast } from '../ui/ToastContext';
import type { Post } from '../../types';

interface ReCookButtonProps {
  post: Post;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export function ReCookButton({ post, size = 'md', showCount = true }: ReCookButtonProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const reCookPost = useAppStore((state) => state.reCookPost);

  const handleReCook = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!post.recipeId) {
      showToast('No recipe attached to this post', 'error');
      return;
    }
    
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

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <button
      onClick={handleReCook}
      className={`flex items-center gap-1.5 text-gray-600 hover:text-brand-teal touch-target ${sizeClasses[size]}`}
      title="Re-cook this recipe"
    >
      <Repeat2 size={iconSizes[size]} />
      {showCount && <span className="font-medium">{post.reCooks}</span>}
    </button>
  );
}
