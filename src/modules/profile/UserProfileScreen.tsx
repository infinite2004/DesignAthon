import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../../api/client';
import { formatCurrency } from '../../lib/utils';
import { PostList } from '../../components/social/PostList';
import { Avatar } from '../../components/media/Avatar';
import { Screen } from '../../components/layout/Screen';
import { FollowButton } from '../../components/social/FollowButton';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import type { User, Post } from '../../types';

export function UserProfileScreen() {
  const { id } = useParams<{ id: string }>();

  const { data: user, isLoading: userLoading, isError: userError } = useQuery<User>({
    queryKey: ['user', id],
    queryFn: () => apiGet<User>(`/users/${id}`),
    enabled: !!id,
  });

  const { data: userPosts = [], isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ['user', id, 'posts'],
    queryFn: () => apiGet<Post[]>(`/users/${id}/posts`),
    enabled: !!id,
  });

  const { data: isFollowing = false } = useQuery<boolean>({
    queryKey: ['user', id, 'following'],
    queryFn: () => apiGet<boolean>(`/users/${id}/following`),
    enabled: !!id,
  });

  if (userLoading) {
    return (
      <Screen>
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner />
        </div>
      </Screen>
    );
  }

  if (userError || !user) {
    return (
      <Screen>
        <div className="p-4">
          <ErrorMessage message="User not found" />
        </div>
      </Screen>
    );
  }

  return (
    <Screen>

      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-start gap-4 mb-4">
            <Avatar
              src={user.avatar}
              initials={user.displayName ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase() : user.username?.charAt(0).toUpperCase() || 'U'}
              size={80}
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold">{user.displayName}</h2>
              <p className="text-sm text-gray-600">@{user.username}</p>
              {user.bio && (
                <p className="text-sm text-gray-700 mt-2">{user.bio}</p>
              )}
            </div>
          </div>

          {/* Follow Button */}
          <FollowButton userId={user.id} isFollowing={isFollowing} />

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{user.followers}</p>
              <p className="text-xs text-gray-600">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{user.following}</p>
              <p className="text-xs text-gray-600">Following</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{user.mealsShared}</p>
              <p className="text-xs text-gray-600">Meals</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">
                {(user.wasteReduced / 1000).toFixed(1)}kg
              </p>
              <p className="text-xs text-gray-600">Saved</p>
            </div>
          </div>

          {/* Achievement Stats */}
          <div className="mt-4 p-3 bg-brand-bg rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Average cost per serving</p>
                <p className="text-lg font-bold text-brand-teal">
                  {formatCurrency(user.avgCostPerServing)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div>
        <PostList
          posts={userPosts}
          isLoading={postsLoading}
          isError={false}
        />
      </div>
    </Screen>
  );
}

