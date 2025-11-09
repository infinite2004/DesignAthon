import { useNavigate } from 'react-router-dom';
import type { Post } from '../../types';

type PostThumbnailCardProps = {
  post: Post;
};

export function PostThumbnailCard({ post }: PostThumbnailCardProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/post/${post.id}`)}
      className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 touch-target"
    >
      {post.media && post.media.length > 0 && post.media[0] && !post.media[0].startsWith('blob:') ? (
        <img
          src={post.media[0]}
          alt={post.caption || 'Post image'}
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
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <span className="text-4xl">🍳</span>
        </div>
      )}
      {post.stats?.costPerServing && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
          <p className="text-xs text-white font-medium">
            ${post.stats.costPerServing.toFixed(2)}
          </p>
        </div>
      )}
    </button>
  );
}

