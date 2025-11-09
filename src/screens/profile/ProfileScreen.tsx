import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Flame } from 'lucide-react';
import { useAuth } from '../../providers/AuthProvider';
import { useAppStore } from '../../store/appStore';
import { useDailyCookd } from '../../hooks/useDailyCookd';
import { Screen } from '../../components/layout/Screen';
import { Avatar } from '../../components/media/Avatar';
import { BadgeCard } from '../../components/profile/BadgeCard';
import { PostThumbnailCard } from '../../components/profile/PostThumbnailCard';
import { SegmentedControl } from '../../components/forms/SegmentedControl';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../lib/utils';

type ProfileTab = 'meals' | 'saved';

export function ProfileScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const posts = useAppStore((state) => state.posts);
  const savedPosts = useAppStore((state) => state.savedPosts);
  const savedRecipes = useAppStore((state) => state.savedRecipes);
  const { streak } = useDailyCookd();
  const [activeTab, setActiveTab] = useState<ProfileTab>('meals');

  if (!user) {
    return (
      <Screen>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">Please sign in</p>
        </div>
      </Screen>
    );
  }

  const userPosts = posts.filter(p => p.userId === user.id);
  const avgCost = userPosts.length > 0
    ? userPosts.reduce((sum, p) => sum + (p.stats?.costPerServing || 0), 0) / userPosts.length
    : 0;

  // Ensure badges is an array
  const badges = Array.isArray(user.badges) ? user.badges : [];

  // Calculate daysCooked from sustainability tracking
  const getSustainabilityTracking = () => {
    try {
      const stored = localStorage.getItem('sustainability_tracking');
      if (stored) {
        const tracking = JSON.parse(stored);
        return {
          daysCooked: tracking.daysCooked || 0,
          moneySaved: tracking.moneySaved || 0,
        };
      }
    } catch (error) {
      console.error('Error loading sustainability tracking:', error);
    }
    return { daysCooked: 0, moneySaved: 0 };
  };

  const sustainability = getSustainabilityTracking();
  const daysCooked = sustainability.daysCooked;
  const moneySaved = sustainability.moneySaved;

  return (
    <Screen>
      {/* Header */}
      <div className="relative">
        <div className="h-32 bg-brand-teal" />
        <div className="px-4 -mt-16">
          <div className="flex items-end justify-between mb-4">
            <Avatar
              src={user.avatar}
              initials={user.displayName ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase() : user.username?.charAt(0).toUpperCase() || 'U'}
              size={80}
              className="border-4 border-white"
            />
            <button
              onClick={() => navigate('/profile/settings')}
              className="p-2 bg-white rounded-full shadow-md touch-target"
              aria-label="Settings"
            >
              <Settings size={20} className="text-gray-600" />
            </button>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{user.displayName || user.username || 'User'}</h1>
            <p className="text-gray-600">@{user.username || 'user'}</p>
            {user.bio && (
              <p className="text-sm text-gray-600 mt-2">{user.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Flame size={16} className="text-brand-yellow" />
              <p className="text-lg font-bold text-brand-teal">{streak}</p>
            </div>
            <p className="text-xs text-gray-600">Day streak</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-brand-teal">{daysCooked}</p>
            <p className="text-xs text-gray-600">Days cooked</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-brand-teal">{formatCurrency(avgCost)}</p>
            <p className="text-xs text-gray-600">Avg cost/meal</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-brand-teal">{formatCurrency(moneySaved)}</p>
            <p className="text-xs text-gray-600">$ saved</p>
          </div>
        </div>
      </div>

      {/* Badges Strip */}
      {badges.length > 0 && (
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {badges.slice(0, 5).map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="px-4 py-3 border-t border-gray-200">
        <SegmentedControl
          value={activeTab}
          onChange={(v) => setActiveTab(v as ProfileTab)}
          options={[
            { label: 'Your Posts', value: 'meals' },
            { label: 'Saved', value: 'saved' },
          ]}
        />
      </div>

      {/* Tab Content */}
      <div className="px-4 py-4">
        {activeTab === 'meals' && (
          <div>
            {userPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No meals shared yet</p>
                <Button
                  variant="primary"
                  onClick={() => navigate('/post/capture')}
                  className="rounded-xl"
                >
                  Create Your First Post
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {userPosts.map((post) => (
                  <PostThumbnailCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div>
            {savedPosts.length === 0 && savedRecipes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No saved items yet</p>
                <p className="text-sm text-gray-400">Save posts and recipes to see them here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedPosts.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Saved Posts</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {savedPosts.map((postId) => {
                        const post = posts.find(p => p.id === postId);
                        return post ? <PostThumbnailCard key={post.id} post={post} /> : null;
                      })}
                    </div>
                  </div>
                )}
                {savedRecipes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Saved Recipes</h3>
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => navigate('/profile/saved')}
                      className="rounded-xl"
                    >
                      View All Saved Recipes
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Screen>
  );
}

