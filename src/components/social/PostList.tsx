import React from 'react';
import type { Post } from '../../types';
import { PostCardNew } from './PostCardNew';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import { ErrorMessage } from '../ui/ErrorMessage';
import { EmptyState } from '../ui/EmptyState';
import { useNavigate } from 'react-router-dom';

type PostListProps = {
  posts: Post[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
};

export const PostList: React.FC<PostListProps> = ({
  posts,
  isLoading,
  isError,
  onRetry,
}) => {
  const navigate = useNavigate();

  if (isLoading && !posts) {
    return (
      <div className="p-4 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <LoadingSkeleton variant="circular" width={40} height={40} />
              <div className="flex-1 space-y-2">
                <LoadingSkeleton variant="text" width="60%" height={16} />
                <LoadingSkeleton variant="text" width="40%" height={12} />
              </div>
            </div>
            <LoadingSkeleton variant="rounded" width="100%" height={200} />
            <div className="space-y-2">
              <LoadingSkeleton variant="text" width="100%" height={14} />
              <LoadingSkeleton variant="text" width="80%" height={14} />
            </div>
            <div className="flex gap-4">
              <LoadingSkeleton variant="rounded" width={60} height={32} />
              <LoadingSkeleton variant="rounded" width={60} height={32} />
              <LoadingSkeleton variant="rounded" width={60} height={32} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <ErrorMessage message="Couldn't load posts." onRetry={onRetry} />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="p-4">
        <EmptyState
          title="No posts yet"
          description="Follow people or share your first meal to get started!"
          actionLabel="Create Your First Post"
          onAction={() => navigate('/create')}
          icon="📝"
        />
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {posts.map((post) => (
        <PostCardNew key={post.id} post={post} />
      ))}
    </div>
  );
};

