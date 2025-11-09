import { useNavigate } from 'react-router-dom';
import { BookOpen, Grid3x3, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '../../state/authStore';
import { useAppStore } from '../../store/appStore';
import { useAuth } from '../../hooks/useAuth';
import { PostCard } from '../../components/social/PostCard';
import { Avatar } from '../../components/media/Avatar';
import { Screen } from '../../components/layout/Screen';
import { useToast } from '../../components/ui/ToastContext';

export function ProfileScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const user = useAuthStore((state) => state.user);
  const posts = useAppStore((state) => state.posts);
  const { logout } = useAuth();

  if (!user) {
    return (
      <Screen>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">Please sign in</p>
        </div>
      </Screen>
    );
  }

  // Convert authStore user to display format
  const displayName = user.name;
  const username = user.username;
  const avatar = user.avatarUrl || undefined;
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

  const userPosts = posts.filter((p) => p.userId === user.id);
  
  // Calculate waste saved from posts
  const wasteSaved = userPosts.reduce((total, post) => {
    return total + (post.stats?.wasteSaved || 0);
  }, 0);
  const wasteSavedKg = (wasteSaved / 1000).toFixed(1);

  // Get sustainability tracking from localStorage
  const getSustainabilityTracking = () => {
    try {
      const stored = localStorage.getItem('sustainability_tracking');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading sustainability tracking:', error);
    }
    // Default values
    const cookingPrefs = JSON.parse(localStorage.getItem('user_cooking_prefs') || '{}');
    return {
      daysCooked: 0,
      daysGoal: cookingPrefs.daysPerWeek || 5,
      moneySaved: 0,
      wasteSaved: wasteSaved,
      newRecipesLearned: 0,
      mealsShared: userPosts.length,
    };
  };

  const sustainability = getSustainabilityTracking();
  
  // Calculate money saved (estimate: $10 per meal vs eating out)
  const estimatedMoneySaved = userPosts.length * 10;

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await logout();
      showToast('Signed out successfully', 'success');
      navigate('/welcome', { replace: true });
    }
  };

  return (
    <Screen>

      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-start gap-4">
            <Avatar
              src={avatar}
              initials={initials}
              size={80}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-brand-teal">{displayName}</h2>
                  <p className="text-sm text-slate-600">@{username}</p>
                </div>
                <button
                  onClick={() => navigate('/profile/edit')}
                  className="p-2 text-brand-teal hover:bg-brand-sage/10 rounded-lg touch-target"
                  title="Edit Profile"
                >
                  <Settings size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <p className="text-lg font-bold text-brand-teal">{userPosts.length}</p>
              <p className="text-xs text-slate-600">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-brand-teal">0</p>
              <p className="text-xs text-slate-600">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-brand-teal">0</p>
              <p className="text-xs text-slate-600">Following</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-brand-teal">{wasteSavedKg}kg</p>
              <p className="text-xs text-slate-600">Waste Saved</p>
            </div>
          </div>

          {/* Sustainability Tracking */}
          <div className="mt-4 p-4 bg-brand-bg rounded-2xl border border-brand-sage/20">
            <h3 className="font-semibold text-sm mb-3 text-brand-teal">Sustainability Tracking</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-slate-600">Days Cooked</p>
                <p className="font-bold text-brand-teal text-lg">
                  {sustainability.daysCooked}/{sustainability.daysGoal}
                </p>
              </div>
              <div>
                <p className="text-slate-600">Money Saved</p>
                <p className="font-bold text-brand-teal text-lg">
                  ${estimatedMoneySaved.toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-slate-200">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 border-b-2 border-brand-teal text-brand-teal font-semibold touch-target">
            <Grid3x3 size={18} />
            <span>Posts</span>
          </button>
          <button
            onClick={() => navigate('/profile/recipes')}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-slate-600 touch-target"
          >
            <BookOpen size={18} />
            <span>Recipes</span>
          </button>
        </div>
      </div>

      {/* Posts */}
      <div>
        {userPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <p className="text-slate-500 text-center mb-4">
              You haven't shared any posts yet.
            </p>
            <button
              onClick={() => navigate('/create')}
              className="px-6 py-3 bg-brand-teal text-white rounded-full font-semibold touch-target"
            >
              Create Your First Post
            </button>
          </div>
        ) : (
          userPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>

      {/* Sign Out Section */}
      <div className="px-4 py-6 border-t border-slate-200 mt-4">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-50 text-red-600 rounded-2xl font-medium hover:bg-red-100 transition-colors touch-target"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </Screen>
  );
}

