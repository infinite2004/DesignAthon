import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { Screen } from '../../components/layout/Screen';
import { Avatar } from '../../components/media/Avatar';
import { ReactionBar } from '../../components/social/ReactionBar';
import { CostPill } from '../../components/social/CostPill';
import { IngredientChipsRow } from '../../components/social/IngredientChipsRow';
import { CommentList } from '../../components/social/CommentList';
import { NewCommentInput } from '../../components/social/NewCommentInput';
import { Button } from '../../components/ui/Button';
import { formatTimeAgo } from '../../lib/utils';
import { BottomSheet } from '../../components/ui/BottomSheet';

export function PostDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const posts = useAppStore((state) => state.posts);
  const comments = useAppStore((state) => state.comments);
  const savedPosts = useAppStore((state) => state.savedPosts);
  const savePost = useAppStore((state) => state.savePost);
  const unsavePost = useAppStore((state) => state.unsavePost);
  const post = posts.find(p => p.id === id);
  const [showRequestSheet, setShowRequestSheet] = useState(false);

  if (!post) {
    return (
      <Screen>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">Post not found</p>
        </div>
      </Screen>
    );
  }

  const handleRequestRecipe = () => {
    setShowRequestSheet(true);
  };

  const handleStartDM = () => {
    setShowRequestSheet(false);
    navigate(`/recipe-request/${post.id}`);
  };

  return (
    <Screen>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 touch-target"
            aria-label="Back"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-sm font-semibold text-teal">Post</h1>
          <div className="w-8" />
        </div>
      </header>

      {/* Post Content */}
      <div className="bg-white">
        {/* User Header */}
        <div className="flex items-center gap-3 p-4">
          <Avatar
            src={post.user.avatar}
            initials={post.user.displayName ? post.user.displayName.split(' ').map(n => n[0]).join('').toUpperCase() : post.user.username?.charAt(0).toUpperCase() || 'U'}
            size={48}
          />
          <div className="flex-1">
            <h3 className="font-semibold text-base">{post.user.displayName || post.user.username || 'User'}</h3>
            <p className="text-xs text-gray-500">
              @{post.user.username} · {formatTimeAgo(post.createdAt)}
            </p>
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

        {/* Content */}
        <div className="px-4 pt-4 space-y-3">
          {/* Cost & Stats */}
          {post.stats && (
            <div className="flex items-center gap-3">
              {post.stats.costPerServing > 0 && (
                <CostPill cost={post.stats.costPerServing} />
              )}
              {post.stats.wasteSaved > 0 && (
                <span className="text-xs text-gray-600">
                  ♻️ Saved {post.stats.wasteSaved}g from waste
                </span>
              )}
            </div>
          )}

          {/* Caption */}
          <p className="text-base text-gray-900 leading-relaxed">{post.caption}</p>

          {/* Ingredients */}
          {post.recipe && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Ingredients</h4>
              <IngredientChipsRow recipe={post.recipe} maxVisible={10} />
            </div>
          )}

          {/* Recipe Steps */}
          {post.recipe && post.recipe.steps.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Steps</h4>
              <ol className="space-y-2">
                {post.recipe.steps.map((step, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    <span className="font-semibold text-teal">{index + 1}.</span> {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Request Recipe Button */}
          {!post.recipe && (
            <Button
              variant="secondary"
              fullWidth
              onClick={handleRequestRecipe}
              className="rounded-2xl"
            >
              Request Recipe
            </Button>
          )}
        </div>

        {/* Reaction Bar */}
        <ReactionBar 
          post={{ ...post, isSaved: savedPosts.includes(post.id) }} 
          onCommentPress={() => {
            // Scroll to comments section or focus comment input
            const commentsSection = document.getElementById('comments-section');
            if (commentsSection) {
              commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }} 
          onSavePress={() => {
            const isSaved = savedPosts.includes(post.id);
            if (isSaved) {
              unsavePost(post.id);
            } else {
              savePost(post.id);
            }
          }}
          onRequestRecipe={handleRequestRecipe}
        />
      </div>

      {/* Comments */}
      <div id="comments-section" className="bg-white border-t border-gray-200">
        <CommentList comments={comments.filter(c => c.postId === post.id)} />
        <NewCommentInput postId={post.id} />
      </div>

      {/* Request Recipe Bottom Sheet */}
      <BottomSheet
        isOpen={showRequestSheet}
        onClose={() => setShowRequestSheet(false)}
        title="Request Recipe"
      >
        <div className="p-4 space-y-4">
          <p className="text-sm text-gray-600">
            Send a message to {post.user.displayName} to request the recipe for this meal.
          </p>
          <Button
            variant="primary"
            fullWidth
            onClick={handleStartDM}
            className="rounded-2xl"
          >
            Start Conversation
          </Button>
        </div>
      </BottomSheet>
    </Screen>
  );
}

