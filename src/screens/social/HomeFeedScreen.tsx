import { useMemo } from 'react';
import { Screen } from '../../components/layout/Screen';
import { PostList } from '../../components/social/PostList';
import { useFeedQuery } from '../../hooks/useFeed';
import { useAppStore } from '../../store/appStore';
import { useAuth } from '../../providers/AuthProvider';
import { PullToRefresh } from '../../components/ui/PullToRefresh';
import { DailyDropBanner } from '../../components/social/DailyDropBanner';
import { useDailyCookdNotifications } from '../../hooks/useDailyCookdNotifications';

export function HomeFeedScreen() {
  const { data: apiPosts, isLoading, isError, refetch } = useFeedQuery();
  const storePosts = useAppStore((state) => state.posts);
  const followingUsers = useAppStore((state) => state.followingUsers);
  const { user } = useAuth();
  
  // Enable daily Cook'd notifications
  useDailyCookdNotifications();
  
  // Filter posts to only show posts from users we follow (or our own posts)
  const filteredPosts = useMemo(() => {
    const allPostIds = new Set(storePosts.map(p => p.id));
    const additionalApiPosts = apiPosts?.filter(p => !allPostIds.has(p.id)) || [];
    const allPosts = [...storePosts, ...additionalApiPosts];
    
    // If user has no follows yet, show all posts (for onboarding)
    if (followingUsers.length === 0 && !user) {
      return allPosts;
    }
    
    // Filter to only show posts from followed users + own posts
    const currentUserId = user?.id;
    return allPosts.filter(post => {
      // Always show own posts
      if (post.userId === currentUserId) return true;
      // Show posts from followed users
      return followingUsers.includes(post.userId);
    });
  }, [storePosts, apiPosts, followingUsers, user]);
  
  const displayPosts = filteredPosts.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <Screen>
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="space-y-4">
          <DailyDropBanner />
          <PostList
            posts={displayPosts}
            isLoading={isLoading && storePosts.length === 0}
            isError={isError && storePosts.length === 0}
            onRetry={() => refetch()}
          />
        </div>
      </PullToRefresh>
    </Screen>
  );
}

