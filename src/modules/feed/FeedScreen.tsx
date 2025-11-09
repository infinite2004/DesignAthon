import { PostList } from '../../components/social/PostList';
import { useFeedQuery } from '../../hooks/useFeed';
import { Screen } from '../../components/layout/Screen';
import { useAppStore } from '../../store/appStore';
import { PullToRefresh } from '../../components/ui/PullToRefresh';

export function FeedScreen() {
  const { data: apiPosts, isLoading, isError, refetch } = useFeedQuery();
  // Always use Zustand store posts as source of truth (includes localStorage)
  const storePosts = useAppStore((state) => state.posts);
  
  // Use store posts as primary source (they include localStorage posts)
  // Store posts are reactive - when a new post is added, this component will re-render
  // If API has additional posts, merge them (avoiding duplicates)
  const allPostIds = new Set(storePosts.map(p => p.id));
  const additionalApiPosts = apiPosts?.filter(p => !allPostIds.has(p.id)) || [];
  
  // Combine and sort by date (newest first)
  // Store posts are already sorted newest first when added, but we ensure proper sorting
  const displayPosts = [...storePosts, ...additionalApiPosts].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <Screen>
      <PullToRefresh onRefresh={handleRefresh}>
        <PostList
          posts={displayPosts}
          isLoading={isLoading && storePosts.length === 0}
          isError={isError && storePosts.length === 0}
          onRetry={() => refetch()}
        />
      </PullToRefresh>
    </Screen>
  );
}

