import { Routes, Route, Navigate } from 'react-router-dom';
import { Home, Compass, Plus, ChefHat, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

// Home Stack
import { HomeFeedScreen } from '../screens/social/HomeFeedScreen';
import { PostDetailScreen } from '../screens/social/PostDetailScreen';
import { RecipeRequestDMThreadScreen } from '../screens/social/RecipeRequestDMThreadScreen';

// Discover Stack
import { DiscoverFeedScreen } from '../screens/social/DiscoverFeedScreen';

// Post Stack
import { PostCaptureScreen } from '../screens/social/PostCaptureScreen';
import { PostComposerScreen } from '../screens/social/PostComposerScreen';

// Chef Stack
import { PantryOverviewScreen } from '../screens/chef/PantryOverviewScreen';
import { AddItemManualScreen } from '../screens/chef/AddItemManualScreen';
import { FridgeVisionCaptureScreen } from '../screens/chef/FridgeVisionCaptureScreen';
import { FridgeVisionReviewScreen } from '../screens/chef/FridgeVisionReviewScreen';
import { ReceiptScanCaptureScreen } from '../screens/chef/ReceiptScanCaptureScreen';
import { ReceiptReviewScreen } from '../screens/chef/ReceiptReviewScreen';
import { AIRecipeListScreen } from '../screens/chef/AIRecipeListScreen';
import { AIChatScreen } from '../screens/chef/AIChatScreen';
import { WhatDoYouWantToEatScreen } from '../screens/chef/WhatDoYouWantToEatScreen';

// Profile Stack
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { SavedRecipesScreen } from '../screens/profile/SavedRecipesScreen';
import { PantryShortcutScreen } from '../screens/profile/PantryShortcutScreen';
import { SettingsScreen } from '../screens/profile/SettingsScreen';

type Tab = {
  key: string;
  label: string;
  icon: typeof Home;
  path: string;
};

const tabs: Tab[] = [
  { key: 'home', label: 'Home', icon: Home, path: '/home' },
  { key: 'discover', label: 'Discover', icon: Compass, path: '/discover' },
  { key: 'post', label: '', icon: Plus, path: '/post/capture' },
  { key: 'chef', label: 'Chef', icon: ChefHat, path: '/chef' },
  { key: 'profile', label: 'Profile', icon: User, path: '/profile' },
];

export function MainTabNavigator() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/home') {
      return location.pathname === '/home' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col h-screen bg-beige">
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <Routes>
          {/* Home Stack */}
          <Route path="/home" element={<HomeFeedScreen />} />
          <Route path="/post/:id" element={<PostDetailScreen />} />
          <Route path="/recipe-request/:postId" element={<RecipeRequestDMThreadScreen />} />

          {/* Discover Stack */}
          <Route path="/discover" element={<DiscoverFeedScreen />} />

          {/* Post Stack */}
          <Route path="/post/capture" element={<PostCaptureScreen />} />
          <Route path="/post/compose" element={<PostComposerScreen />} />

          {/* Chef Stack */}
          <Route path="/chef" element={<PantryOverviewScreen />} />
          <Route path="/chef/add-item" element={<AddItemManualScreen />} />
          <Route path="/chef/fridge/capture" element={<FridgeVisionCaptureScreen />} />
          <Route path="/chef/fridge/review" element={<FridgeVisionReviewScreen />} />
          <Route path="/chef/receipt/capture" element={<ReceiptScanCaptureScreen />} />
          <Route path="/chef/receipt/review" element={<ReceiptReviewScreen />} />
          <Route path="/chef/what-to-eat" element={<WhatDoYouWantToEatScreen />} />
          <Route path="/chef/ai-recipes" element={<AIRecipeListScreen />} />
          <Route path="/chef/ai-chat" element={<AIChatScreen />} />

          {/* Profile Stack */}
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/profile/saved" element={<SavedRecipesScreen />} />
          <Route path="/profile/pantry" element={<PantryShortcutScreen />} />
          <Route path="/profile/settings" element={<SettingsScreen />} />

          {/* Default */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
        <div className="flex justify-around items-center h-16 px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.path);
            const isPostTab = tab.key === 'post';

            return (
              <button
                key={tab.key}
                onClick={() => navigate(tab.path)}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full touch-target transition-all",
                  isPostTab
                    ? "relative -mt-4"
                    : "gap-1",
                  active && !isPostTab && "text-brand-teal"
                )}
              >
                {isPostTab ? (
                  <div className="w-14 h-14 rounded-full bg-brand-teal text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                    <Icon size={24} />
                  </div>
                ) : (
                  <>
                    <Icon
                      size={24}
                      className={cn(
                        "transition-all",
                        active ? "text-brand-teal scale-110" : "text-gray-500"
                      )}
                    />
                    <span className={cn(
                      "text-xs font-medium transition-colors",
                      active ? "text-brand-teal font-semibold" : "text-gray-500"
                    )}>
                      {tab.label}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

