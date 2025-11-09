import { TrendingUp, Award, ChefHat, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PostCard } from '../../components/social/PostCard';
import { useAppStore } from '../../store/appStore';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';

export function ExploreScreen() {
  const navigate = useNavigate();
  const posts = useAppStore((state) => state.posts);

  const trendingTopics = [
    { id: 'budget-meals', label: 'Budget Meals', icon: '💰' },
    { id: 'zero-waste', label: 'Zero Waste', icon: '♻️' },
    { id: 'meal-prep', label: 'Meal Prep', icon: '🍱' },
    { id: 'student-life', label: 'Student Life', icon: '🎓' },
    { id: 'family-4', label: 'Family of 4', icon: '👨‍👩‍👧‍👦' },
    { id: 'vegan', label: 'Vegan', icon: '🌱' },
  ];

  return (
    <Screen>

      {/* Trending Topics */}
      <div className="px-4 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={18} className="text-brand-teal" />
          <h2 className="font-semibold text-sm">Trending Topics</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingTopics.map((topic) => (
            <button
              key={topic.id}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-full text-sm font-medium transition-colors touch-target"
            >
              <span className="mr-1">{topic.icon}</span>
              {topic.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6 py-4">
        {/* Trending Budget Meals */}
        <section>
          <div className="px-4 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-brand-teal" />
              <h2 className="font-semibold">Trending Budget Meals</h2>
            </div>
            <button className="text-sm text-brand-teal font-medium touch-target">
              See All
            </button>
          </div>
          <div className="space-y-0">
            {posts.slice(0, 3).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>

        {/* Zero Waste Pros */}
        <section>
          <div className="px-4 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-brand-teal" />
              <h2 className="font-semibold">Zero Waste Pros</h2>
            </div>
            <button className="text-sm text-brand-teal font-medium touch-target">
              See All
            </button>
          </div>
          <div className="px-4">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Top contributors this week</p>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">User {i}</p>
                      <p className="text-xs text-gray-600">Saved {500 + i * 100}g this week</p>
                    </div>
                    <button className="text-sm text-brand-teal font-medium touch-target">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Most Re-cooked */}
        <section>
          <div className="px-4 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChefHat size={18} className="text-brand-teal" />
              <h2 className="font-semibold">Most Re-cooked This Week</h2>
            </div>
            <button className="text-sm text-brand-teal font-medium touch-target">
              See All
            </button>
          </div>
          <div className="px-4 space-y-3">
            {posts
              .filter((p) => p.reCooks > 0)
              .slice(0, 3)
              .map((post) => (
                <div
                  key={post.id}
                  onClick={() => navigate(`/recipe/${post.recipeId}`)}
                  className="bg-white rounded-xl p-4 border border-gray-200 active:bg-gray-50"
                >
                  <div className="flex items-start gap-3">
                    {post.media[0] && (
                      <img
                        src={post.media[0]}
                        alt={post.caption}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1">
                        {post.recipe?.title || 'Recipe'}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {post.caption}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>👤 {post.user.displayName}</span>
                        <span>🔄 {post.reCooks} re-cooks</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>

      {/* Create Plan Button - Fixed at bottom */}
      <div className="fixed bottom-24 left-0 right-0 px-4 pb-4 safe-area-bottom z-30">
        <Button
          variant="primary"
          fullWidth
          onClick={() => navigate('/kitchen/meal-plan/planning')}
          className="rounded-2xl shadow-lg"
        >
          <Plus size={20} className="mr-2" />
          Create Plan
        </Button>
      </div>
    </Screen>
  );
}

