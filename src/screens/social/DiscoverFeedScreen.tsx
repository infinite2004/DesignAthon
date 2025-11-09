import { useState, useMemo } from 'react';
import { BookOpen, TrendingUp, Users, Lightbulb } from 'lucide-react';
import { Screen } from '../../components/layout/Screen';
import { PostList } from '../../components/social/PostList';
import { useFeedQuery } from '../../hooks/useFeed';
import { useAppStore } from '../../store/appStore';
import { PullToRefresh } from '../../components/ui/PullToRefresh';
import { FilterChipBar } from '../../components/social/FilterChipBar';
import { PostCardNew } from '../../components/social/PostCardNew';

const filterOptions = [
  { label: '$5 or less', value: 'budget' },
  { label: 'Pantry clears', value: 'pantry-clear' },
  { label: 'Leftovers', value: 'leftovers' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'Quick meals', value: 'quick' },
];

export function DiscoverFeedScreen() {
  const { data: apiPosts, isLoading, isError, refetch } = useFeedQuery();
  const storePosts = useAppStore((state) => state.posts);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  
  const allPostIds = new Set(storePosts.map(p => p.id));
  const additionalApiPosts = apiPosts?.filter(p => !allPostIds.has(p.id)) || [];
  
  const allPosts = [...storePosts, ...additionalApiPosts];
  
  // Get tips on saving food (posts with TIP badge)
  const tipsPosts = useMemo(() => {
    return allPosts
      .filter(post => post.badges.includes('TIP') || post.badges.includes('ZERO-WASTE'))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [allPosts]);
  
  // Get recipes of the week (most re-cooked)
  const recipesOfTheWeek = useMemo(() => {
    return allPosts
      .filter(post => post.recipeId && post.reCooks > 0)
      .sort((a, b) => b.reCooks - a.reCooks)
      .slice(0, 3);
  }, [allPosts]);
  
  // Get articles on food combos (posts with longer captions)
  const articlePosts = useMemo(() => {
    return allPosts
      .filter(post => post.caption.length > 100)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [allPosts]);
  
  // Filter posts based on selected filters
  const filteredPosts = useMemo(() => {
    if (selectedFilters.length === 0) return allPosts;
    
    return allPosts.filter(post => {
      // Check badges
      if (selectedFilters.includes('budget') && post.stats && post.stats.costPerServing <= 5) {
        return true;
      }
      if (selectedFilters.includes('pantry-clear') && post.badges.includes('NO-WASTE')) {
        return true;
      }
      if (selectedFilters.includes('leftovers') && post.badges.includes('LEFTOVERS')) {
        return true;
      }
      if (selectedFilters.includes('vegan') && post.badges.includes('VEGAN')) {
        return true;
      }
      if (selectedFilters.includes('quick') && post.badges.includes('QUICK')) {
        return true;
      }
      return false;
    });
  }, [allPosts, selectedFilters]);
  
  const displayPosts = filteredPosts.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <Screen>
      <PullToRefresh onRefresh={handleRefresh}>
        {/* Tips on Saving Food Section */}
        {tipsPosts.length > 0 && (
          <div className="px-4 py-4 bg-brand-bg border-b border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={20} className="text-brand-teal" />
              <h2 className="text-lg font-bold text-brand-teal">Tips on Saving Food</h2>
            </div>
            <div className="space-y-3">
              {tipsPosts.map((post) => (
                <PostCardNew key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* Recipes of the Week Section */}
        {recipesOfTheWeek.length > 0 && (
          <div className="px-4 py-4 bg-white border-b border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={20} className="text-brand-teal" />
              <h2 className="text-lg font-bold text-brand-teal">Recipes of the Week</h2>
            </div>
            <p className="text-xs text-gray-600 mb-3">Most re-cooked recipes from global users</p>
            <div className="space-y-3">
              {recipesOfTheWeek.map((post) => (
                <PostCardNew key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* Articles on Food Combos Section */}
        {articlePosts.length > 0 && (
          <div className="px-4 py-4 bg-brand-bg border-b border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={20} className="text-brand-teal" />
              <h2 className="text-lg font-bold text-brand-teal">Articles: Food Combos</h2>
            </div>
            <p className="text-xs text-gray-600 mb-3">Tips from blog writers on improving food combinations</p>
            <div className="space-y-3">
              {articlePosts.map((post) => (
                <PostCardNew key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* Featured Users Section */}
        <div className="px-4 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Users size={20} className="text-brand-teal" />
            <h2 className="text-lg font-bold text-brand-teal">Featured Users of the Week</h2>
          </div>
          <p className="text-xs text-gray-600 mb-3">Top contributors this week</p>
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">Coming soon: Featured users showcase</p>
          </div>
        </div>

        {/* All Discover Posts */}
        <div className="px-4 py-4">
          <h2 className="text-lg font-bold text-brand-teal mb-3">Discover Recipes</h2>
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 -mx-4 px-4 py-3 mb-4">
            <FilterChipBar
              filters={filterOptions}
              selected={selectedFilters}
              onChange={setSelectedFilters}
            />
          </div>
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

