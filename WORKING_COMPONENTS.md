# Working Components & Features Documentation

This document provides a comprehensive overview of all working components, screens, and features in the Cook'd application.

---

## 📱 Navigation Structure

### Main Tab Navigator
**Location:** `src/navigation/MainTabNavigator.tsx`

The app uses a bottom tab navigation with 5 tabs:
1. **Home** - Social feed (following only)
2. **Discover** - Global discovery feed
3. **+ (Post)** - Create new post (floating button)
4. **Chef** - COOK'D Assistant & Pantry
5. **Profile** - User profile

---

## 🏠 Social Feed Components

### HomeFeedScreen
**Location:** `src/screens/social/HomeFeedScreen.tsx`
**Status:** ✅ Working

**Features:**
- Displays posts from users you follow (filtered feed)
- Shows your own posts
- Pull-to-refresh functionality
- Daily Cook'd banner integration
- Uses Zustand store for reactive updates
- Merges API posts with local store posts

**Key Components Used:**
- `PostList` - Renders list of posts
- `PostCardNew` - Individual post display
- `DailyDropBanner` - Daily posting reminder
- `PullToRefresh` - Refresh gesture

---

### DiscoverFeedScreen
**Location:** `src/screens/social/DiscoverFeedScreen.tsx`
**Status:** ✅ Working

**Features:**
- **Tips on Saving Food** section - Shows posts with TIP/ZERO-WASTE badges
- **Recipes of the Week** - Most re-cooked recipes from global users
- **Articles on Food Combos** - Posts with longer captions (blog-style)
- **Featured Users of the Week** - Placeholder for top contributors
- **Discover Recipes** - Full feed with filters
- Filter chips: $5 or less, Pantry clears, Leftovers, Vegan, Quick meals

**Key Components Used:**
- `PostCardNew` - Post display
- `PostList` - Full post list
- `FilterChipBar` - Filter selection

---

### PostCardNew
**Location:** `src/components/social/PostCardNew.tsx`
**Status:** ✅ Working

**Features:**
- Displays post with user avatar, name, timestamp
- Shows post media (images/videos)
- Cost per serving pill
- Ingredient chips row
- Reaction bar (cooked, like, comment, save)
- Handles navigation to post detail
- Save/unsave functionality
- Daily Cook'd badge support

---

### PostDetailScreen
**Location:** `src/screens/social/PostDetailScreen.tsx`
**Status:** ✅ Working

**Features:**
- Full post view with all details
- User header with avatar
- Post media display
- Caption and stats
- Reaction buttons (like, comment, re-cook)
- Comments section with `CommentList`
- New comment input (`NewCommentInput`)
- Add to grocery list button (if recipe exists)

---

### PostCaptureScreen
**Location:** `src/screens/social/PostCaptureScreen.tsx`
**Status:** ✅ Working

**Features:**
- Camera/gallery selection
- Media capture interface
- Handles draft recipe data
- Navigation to post composer

---

### PostComposerScreen
**Location:** `src/screens/social/PostComposerScreen.tsx`
**Status:** ✅ Working

**Features:**
- Caption input
- Cost per serving input
- Rating selection
- Pantry item selection (for tracking usage)
- Recipe attachment
- Auto-reduces pantry quantities when items used
- Handles re-cook posts with special badge
- Creates and saves posts to store

---

### DailyDropBanner
**Location:** `src/components/social/DailyDropBanner.tsx`
**Status:** ✅ Working

**Features:**
- Shows daily posting reminder (BeReal style)
- Countdown timer until midnight
- Only shows if user hasn't posted today
- Navigates to post capture on click
- Dark teal background with white text

---

### ReactionBar
**Location:** `src/components/social/ReactionBar.tsx`
**Status:** ✅ Working

**Features:**
- Like button with count
- Comment button with count
- Re-cook button (if recipe exists)
- Save button (bookmark)
- Uses actual user ID from auth
- Optimistic UI updates

---

### CommentList
**Location:** `src/components/social/CommentList.tsx`
**Status:** ✅ Working

**Features:**
- Displays list of comments
- Shows user avatar, name, timestamp
- Comment content
- Filters comments by post ID

---

### NewCommentInput
**Location:** `src/components/social/NewCommentInput.tsx`
**Status:** ✅ Working

**Features:**
- Text input for new comments
- Submit button
- Uses auth provider for user ID
- Adds comments to store

---

## 👨‍🍳 Chef / COOK'D Assistant Components

### PantryOverviewScreen
**Location:** `src/screens/chef/PantryOverviewScreen.tsx`
**Status:** ✅ Working

**Features:**
- Pantry summary card (total items, expiring soon)
- Quick action buttons:
  - Add manually
  - Scan fridge
  - Scan receipt
  - What do you want to eat?
- Category lists (Fridge, Freezer, Pantry)
- Expandable/collapsible categories
- Chatbot assistant button (bottom right)
- Empty state handling

---

### WhatDoYouWantToEatScreen
**Location:** `src/screens/chef/WhatDoYouWantToEatScreen.tsx`
**Status:** ✅ Working

**Features:**
- "Surprise Me!" button - AI generates random recipe
- Manual input field - Search for specific recipes
- Pantry info display
- Navigation to AI recipe list with query parameters

---

### AIRecipeListScreen
**Location:** `src/screens/chef/AIRecipeListScreen.tsx`
**Status:** ✅ Working

**Features:**
- Displays AI-generated recipes based on pantry
- Time filters (Quick, Medium, Any)
- Cost filters (Under $5, Under $10, Any)
- Recipe cards with:
  - Title and description
  - Ingredients list
  - Cook time and cost estimate
  - "Cook Now & Share" button
  - "Save Recipe" button
- Handles surprise me and manual input queries

---

### AIRecipeCard
**Location:** `src/components/chef/AIRecipeCard.tsx`
**Status:** ✅ Working

**Features:**
- Recipe title and description
- Ingredients list with pantry status
- Prep/cook time display
- Cost estimate
- Action buttons (Cook & Share, Save)
- Ingredient availability indicators

---

### AIChatScreen
**Location:** `src/screens/chef/AIChatScreen.tsx`
**Status:** ✅ Working

**Features:**
- Chat interface with AI assistant
- Message history
- Text input with send button
- Mock AI responses
- Scrollable chat view

---

### AddItemManualScreen
**Location:** `src/screens/chef/AddItemManualScreen.tsx`
**Status:** ✅ Working

**Features:**
- Manual item entry form
- Ingredient autocomplete
- Category selection (Fridge, Freezer, Pantry)
- Quantity and unit input
- Expiry date picker
- Purchase price input
- Saves to inventory store

---

### IngredientAutocompleteField
**Location:** `src/components/chef/IngredientAutocompleteField.tsx`
**Status:** ✅ Working

**Features:**
- Text input with autocomplete suggestions
- Common ingredient suggestions
- Focus handling
- Keyboard navigation

---

### FridgeVisionCaptureScreen
**Location:** `src/screens/chef/FridgeVisionCaptureScreen.tsx`
**Status:** ✅ Working

**Features:**
- Camera/gallery selection
- Fridge photo capture
- Navigation to review screen

---

### FridgeVisionReviewScreen
**Location:** `src/screens/chef/FridgeVisionReviewScreen.tsx`
**Status:** ✅ Working

**Features:**
- Displays AI-detected items from fridge photo
- Review and confirm items
- Add to inventory
- Edit detected items

---

### ReceiptScanCaptureScreen
**Location:** `src/screens/chef/ReceiptScanCaptureScreen.tsx`
**Status:** ✅ Working

**Features:**
- Receipt photo capture
- Camera/gallery selection
- Navigation to review screen

---

### ReceiptReviewScreen
**Location:** `src/screens/chef/ReceiptReviewScreen.tsx`
**Status:** ✅ Working

**Features:**
- Displays OCR-detected items from receipt
- Review and confirm items
- Add to inventory
- Edit detected items
- Price extraction

---

### PantrySummaryCard
**Location:** `src/components/chef/PantrySummaryCard.tsx`
**Status:** ✅ Working

**Features:**
- Total items count
- Expiring soon count
- Visual summary display

---

### PantryItemRow
**Location:** `src/components/chef/PantryItemRow.tsx`
**Status:** ✅ Working

**Features:**
- Displays single pantry item
- Name, quantity, unit
- Expiry date (if available)
- Location indicator
- Edit/delete actions

---

## 👤 Profile Components

### ProfileScreen
**Location:** `src/screens/profile/ProfileScreen.tsx`
**Status:** ✅ Working

**Features:**
- Profile header with avatar and cover
- User stats:
  - Days cooked
  - Average cost per meal
  - Meals this week
  - Money saved
- Badges display (if any)
- Tab navigation:
  - **Your Posts** - Grid of user's posts
  - **Saved** - Saved posts and recipes
- Settings button
- Calculates sustainability metrics from localStorage

---

### SavedRecipesScreen
**Location:** `src/screens/profile/SavedRecipesScreen.tsx`
**Status:** ✅ Working

**Features:**
- Displays saved recipes
- Recipe cards with navigation
- Empty state handling

---

### SettingsScreen
**Location:** `src/screens/profile/SettingsScreen.tsx`
**Status:** ✅ Working

**Features:**
- Edit display name
- Edit username
- Edit bio
- Save changes
- Sign out button
- Updates user profile in auth provider

---

### PostThumbnailCard
**Location:** `src/components/profile/PostThumbnailCard.tsx`
**Status:** ✅ Working

**Features:**
- Compact post thumbnail
- Image display with fallback
- Cost per serving overlay
- Navigation to post detail

---

### BadgeCard
**Location:** `src/components/profile/BadgeCard.tsx`
**Status:** ✅ Working

**Features:**
- Displays user badge
- Badge icon
- Badge name and description
- Earned date

---

## 🔐 Authentication Components

### LoginScreen
**Location:** `src/screens/auth/LoginScreen.tsx`
**Status:** ✅ Working

**Features:**
- Email input
- Password input
- Login button
- Link to signup
- Mock authentication (localStorage)
- Error handling

---

### SignupScreen
**Location:** `src/screens/auth/SignupScreen.tsx`
**Status:** ✅ Working

**Features:**
- Email input
- Password input
- Display name input
- Signup button
- Link to login
- Mock authentication (localStorage)
- Error handling

---

### AuthProvider
**Location:** `src/providers/AuthProvider.tsx`
**Status:** ✅ Working

**Features:**
- User state management
- Login/logout/signup functions
- User update function
- localStorage persistence
- Bootstrap auth on mount
- Provides auth context to app

---

## 🎯 Onboarding Components

### OnboardingGoalsScreen
**Location:** `src/screens/onboarding/OnboardingGoalsScreen.tsx`
**Status:** ✅ Working

**Features:**
- Multi-select goal chips
- Options: Reduce waste, Save money, Eat healthier, etc.
- Saves to localStorage
- Progress indicator

---

### OnboardingBudgetScreen
**Location:** `src/screens/onboarding/OnboardingBudgetScreen.tsx`
**Status:** ✅ Working

**Features:**
- Budget period selection (Week/Month)
- Budget amount input (NumberStepper)
- Saves to localStorage
- Progress indicator

---

### OnboardingDietScreen
**Location:** `src/screens/onboarding/OnboardingDietScreen.tsx`
**Status:** ✅ Working

**Features:**
- Dietary preferences selection
- Allergies selection
- Multi-select chips
- Saves to localStorage

---

### OnboardingInventoryBootstrapScreen
**Location:** `src/screens/onboarding/OnboardingInventoryBootstrapScreen.tsx`
**Status:** ✅ Working

**Features:**
- Initial pantry setup
- Option to scan receipt
- Option to add manually
- Quick add interface

---

## 🎨 UI Components

### Button
**Location:** `src/components/ui/Button.tsx`
**Status:** ✅ Working

**Features:**
- Multiple variants (primary, secondary, ghost, danger)
- Multiple sizes (sm, md, lg)
- Loading state
- Disabled state
- Icon support (left/right)
- Full width option

---

### TextField
**Location:** `src/components/forms/TextField.tsx`
**Status:** ✅ Working

**Features:**
- Label support
- Placeholder
- Error messages
- Multiline support
- Type variants (text, email, password, number)
- Auto-complete support
- onFocus, onKeyPress handlers

---

### SegmentedControl
**Location:** `src/components/forms/SegmentedControl.tsx`
**Status:** ✅ Working

**Features:**
- Multiple options
- Active state styling
- Touch-friendly
- Smooth transitions

---

### Avatar
**Location:** `src/components/media/Avatar.tsx`
**Status:** ✅ Working

**Features:**
- Image display
- Initials fallback
- Customizable size
- Rounded design

---

### Screen
**Location:** `src/components/layout/Screen.tsx`
**Status:** ✅ Working

**Features:**
- Safe area padding
- Scrollable option
- Background variants
- Full height container

---

### EmptyState
**Location:** `src/components/ui/EmptyState.tsx`
**Status:** ✅ Working

**Features:**
- Title and description
- Icon support
- Action button
- Centered layout

---

### LoadingSpinner
**Location:** `src/components/ui/LoadingSpinner.tsx`
**Status:** ✅ Working

**Features:**
- Animated spinner
- Customizable size
- Centered display

---

### ErrorMessage
**Location:** `src/components/ui/ErrorMessage.tsx`
**Status:** ✅ Working

**Features:**
- Error message display
- Retry button option
- Styled error state

---

### PullToRefresh
**Location:** `src/components/ui/PullToRefresh.tsx`
**Status:** ✅ Working

**Features:**
- Pull-to-refresh gesture
- Loading indicator
- Callback on refresh

---

### FilterChipBar
**Location:** `src/components/social/FilterChipBar.tsx`
**Status:** ✅ Working

**Features:**
- Multiple filter chips
- Multi-select support
- Active state styling
- Horizontal scrollable

---

### BottomSheet
**Location:** `src/components/ui/BottomSheet.tsx`
**Status:** ✅ Working

**Features:**
- Slide-up modal
- Title support
- Backdrop overlay
- Close on backdrop click

---

### ToastContext
**Location:** `src/components/ui/ToastContext.tsx`
**Status:** ✅ Working

**Features:**
- Toast notifications
- Success/error/info variants
- Auto-dismiss
- Queue management

---

## 📦 State Management

### AppStore (Zustand)
**Location:** `src/store/appStore.ts`
**Status:** ✅ Working

**Features:**
- Posts management
- Comments management
- Inventory management
- Meal plan management
- Grocery list management
- Saved posts/recipes
- Following users
- localStorage persistence for all data

**Key Actions:**
- `addPost`, `likePost`, `addComment`
- `followUser`, `unfollowUser`
- `addInventoryItem`, `updateInventoryItem`
- `savePost`, `saveRecipe`
- And more...

---

## 🔄 Data Flow

### Post Creation Flow
1. User taps "+" button → `PostCaptureScreen`
2. Capture/select media → `PostComposerScreen`
3. Add caption, cost, select pantry items → Save to store
4. Post appears in feed immediately (reactive store)

### Recipe Discovery Flow
1. User goes to Chef tab → `PantryOverviewScreen`
2. Taps "What do you want to eat?" → `WhatDoYouWantToEatScreen`
3. Selects "Surprise Me" or enters query → `AIRecipeListScreen`
4. Views recipe → Can cook & share or save

### Following Flow
1. User views post → Can follow user
2. Followed users' posts appear in Home feed
3. Discover feed shows all posts (global)

---

## 🎯 Key Features Status

### ✅ Fully Working
- Social feed (following filter)
- Post creation and display
- Comments and reactions
- Profile with tabs
- Pantry management
- AI recipe generation
- Receipt/fridge scanning (UI ready)
- Saved posts/recipes
- Following system
- Discover feed with sections
- Daily Cook'd banner
- Authentication (mock)
- Onboarding flow
- Grocery list
- Meal planning

### 🔄 Partially Working
- Receipt OCR (UI ready, needs backend)
- Fridge vision AI (UI ready, needs backend)
- AI chat (mock responses)
- Featured users (placeholder)

### 📝 Notes
- All data persists to localStorage
- Mock authentication for development
- Ready for backend API integration
- Responsive mobile-first design
- PWA-ready configuration

---

## 🎨 Design System

### Colors
- **Brand Teal:** #00635D (primary)
- **Brand Sage:** #7EB09B (secondary)
- **Brand Yellow:** #FFD07B (accent)
- **Brand Brown:** #4C2719 (text)
- **Brand BG:** #FFF6EB (background)

### Typography
- System fonts with fallbacks
- Responsive sizing with `clamp()`
- Clear hierarchy

### Spacing
- Consistent padding/margins
- Touch-friendly targets (44px minimum)
- Safe area support

---

## 📱 Navigation Routes

### Main Routes
- `/home` - Home feed
- `/discover` - Discover feed
- `/post/capture` - Post capture
- `/post/compose` - Post composer
- `/post/:id` - Post detail
- `/chef` - Pantry overview
- `/chef/what-to-eat` - Recipe discovery
- `/chef/ai-recipes` - AI recipe list
- `/chef/ai-chat` - AI chat
- `/profile` - User profile
- `/profile/saved` - Saved recipes
- `/profile/settings` - Settings

### Auth Routes
- `/login` - Login screen
- `/signup` - Signup screen

### Onboarding Routes
- `/onboarding/goals` - Goals selection
- `/onboarding/budget` - Budget setup
- `/onboarding/diet` - Diet preferences
- `/onboarding/inventory` - Initial inventory

---

This documentation reflects the current state of the application. All listed components are functional and integrated into the app's navigation and data flow.

