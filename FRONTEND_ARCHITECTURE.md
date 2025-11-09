# Frontend Architecture & File Documentation

This document provides a comprehensive overview of all working frontend files in the Cookd app, organized by category and explaining their purpose, functionality, and relationships.

**Last Updated:** January 2025  
**Version:** 2.0.0

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Entry Points & Core Files](#entry-points--core-files)
3. [State Management](#state-management)
4. [Routing & Navigation](#routing--navigation)
5. [Modules (Screens)](#modules-screens)
6. [Components](#components)
7. [Hooks](#hooks)
8. [API & Utilities](#api--utilities)
9. [Types & Interfaces](#types--interfaces)
10. [Styling & Configuration](#styling--configuration)

---

## Project Structure

```
src/
├── api/              # API client and HTTP utilities
├── app/              # App-level routing and shell
├── components/       # Reusable UI components
│   ├── charts/       # Chart components (optional)
│   ├── filters/      # Filter components
│   ├── forms/        # Form input components
│   ├── inventory/    # Inventory-specific components
│   ├── layout/       # Layout components (header, tabs, screen)
│   ├── mealplan/     # Meal plan components
│   ├── media/        # Media handling components
│   ├── profile/      # Profile-specific components
│   ├── recipe/       # Recipe-specific components
│   ├── shopping/     # Shopping list components
│   ├── social/       # Social feed components
│   └── ui/           # Generic UI components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── modules/          # Feature modules (screens)
│   ├── auth/          # Authentication screens
│   ├── feed/         # Feed and explore screens
│   ├── kitchen/      # Kitchen feature screens
│   ├── onboarding/  # Onboarding flow screens
│   ├── profile/      # Profile screens
│   └── social/       # Social interaction screens
├── state/            # State management (Zustand stores)
├── store/            # Main app store
└── types/            # TypeScript type definitions
```

---

## Entry Points & Core Files

### `src/main.tsx`
**Purpose:** Application entry point  
**Status:** ✅ Working  
**Key Features:**
- Renders React app to DOM
- Sets up React Router (`BrowserRouter`)
- Wraps app with `QueryClientProvider` for React Query
- Wraps app with `ToastProvider` for notifications
- Initializes PWA service worker

**Dependencies:**
- `react`, `react-dom`
- `react-router-dom`
- `@tanstack/react-query`
- `./App.tsx`

---

### `src/App.tsx`
**Purpose:** Root application component  
**Status:** ✅ Working  
**Key Features:**
- Provides `AppContent` component that handles auth bootstrapping
- Calls `useBootstrapAuth()` to check authentication status
- Renders `AppRoutes` for navigation
- Handles loading states during auth check

**Key Components:**
- `QueryClientProvider` - React Query context
- `ToastProvider` - Toast notification context
- `AppRoutes` - Main routing component

---

### `src/index.css`
**Purpose:** Global CSS styles  
**Status:** ✅ Working  
**Key Features:**
- Tailwind CSS directives (`@tailwind base/components/utilities`)
- Global body styles (background: `bg-brand-bg`, text: `text-brand-brown`)
- System font stack
- Custom CSS variables for brand colors

---

## State Management

### `src/state/authStore.ts`
**Purpose:** Authentication state management (Zustand)  
**Status:** ✅ Working  
**Key Features:**
- Stores current user (`user: AuthUser | null`)
- Stores loading state (`isLoading: boolean`)
- Actions: `setUser`, `setLoading`
- Persists user to localStorage (mock auth)

**Type Definitions:**
```typescript
type AuthUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
}
```

**Usage:**
- Used throughout app to get current logged-in user
- Updated on login/signup/logout
- Persists across page refreshes

---

### `src/store/appStore.ts`
**Purpose:** Main application state management (Zustand)  
**Status:** ✅ Working  
**Key Features:**
- Centralized state for all app data
- **localStorage persistence** for all major data
- Date serialization/deserialization for Date objects

**State Properties:**
- `posts: Post[]` - All posts (persists to localStorage)
- `comments: Comment[]` - All comments (persists to localStorage)
- `recipes: Recipe[]` - Recipe library
- `inventory: InventoryItem[]` - User's inventory (persists to localStorage)
- `mealPlan: MealPlanEntry[]` - Meal plan entries (persists to localStorage)
- `groceryList: GroceryItem[]` - Grocery list (persists to localStorage)
- `savedPosts: string[]` - Array of saved post IDs (persists to localStorage)
- `savedRecipes: string[]` - Array of saved recipe IDs (persists to localStorage)

**Actions:**
- `addPost(post)` - Creates new post, saves to localStorage
- `likePost(postId)` - Toggles like, updates localStorage
- `addComment(comment)` - Adds comment, updates post count, saves to localStorage
- `reCookPost(postId)` - Increments re-cook count, saves to localStorage
- `savePost(postId)` / `unsavePost(postId)` - Saves/unsaves posts
- `saveRecipe(recipeId)` / `unsaveRecipe(recipeId)` - Saves/unsaves recipes
- `addInventoryItem(item)` - Adds inventory item, saves to localStorage
- `updateInventoryItem(id, updates)` - Updates item, saves to localStorage
- `deleteInventoryItem(id)` - Removes item, saves to localStorage
- `addMealPlanEntry(entry)` - Adds meal to plan, saves to localStorage
- `updateMealPlanEntry(id, updates)` - Updates meal, saves to localStorage
- `addGroceryItem(item)` - Adds to grocery list (merges if exists), saves to localStorage
- `toggleGroceryItem(id)` - Toggles checked state, saves to localStorage
- `deleteGroceryItem(id)` - Removes item, saves to localStorage

**Helper Functions:**
- `serializePosts(posts)` - Converts posts to JSON-safe format
- `deserializePosts(json)` - Converts JSON back to posts with Date objects
- `getInitialPosts()` - Loads posts from localStorage on app start
- `getInitialMealPlan()` - Loads meal plan from localStorage
- `getInitialGroceryList()` - Loads grocery list from localStorage
- `getInitialComments()` - Loads comments from localStorage
- `getInitialInventory()` - Loads inventory from localStorage (with date parsing)
- `getInitialSavedPosts()` - Loads saved posts from localStorage
- `getInitialSavedRecipes()` - Loads saved recipes from localStorage

---

## Routing & Navigation

### `src/app/routes.tsx`
**Purpose:** Centralized route configuration  
**Status:** ✅ Working  
**Key Features:**
- Defines all app routes using React Router
- Public routes (welcome, auth, onboarding)
- Protected routes (require authentication)
- Nested routes within `AppShell`

**Route Structure:**
```
/welcome                          → WelcomeScreen (splash)
/auth/login                       → LoginScreen
/auth/signup                      → SignupScreen
/onboarding/goals                 → OnboardingGoalsScreen
/onboarding/budget                → OnboardingBudgetScreen
/onboarding/cooking-frequency     → OnboardingCookingFrequencyScreen
/onboarding/friends               → OnboardingFriendsScreen

Protected Routes (within AppShell):
/feed                             → FeedScreen
/explore                          → ExploreScreen
/search                           → SearchScreen (stub)
/create                           → CreatePostScreen
/post/:id                         → PostDetailScreen
/recipe/:id                       → RecipeDetailScreen
/recipe/:id/transform             → RecipeTransformScreen (stub)
/user/:id                         → UserProfileScreen
/kitchen                          → KitchenScreen
/kitchen/inventory                → InventoryScreen
/kitchen/inventory/add            → AddInventoryItemScreen
/kitchen/inventory/receipt/camera → ReceiptCameraScreen (stub)
/kitchen/inventory/receipt/review → ReceiptReviewScreen (stub)
/kitchen/ai-recipes               → AiRecipeScreen
/kitchen/meal-plan                → MealPlanScreen
/kitchen/meal-plan/planning       → MealPlanPlanningScreen
/kitchen/meal-plan/add            → MealPlanEditScreen
/kitchen/meal-plan/complete/:id   → MealCompletionScreen
/kitchen/grocery-list             → GroceryListScreen
/kitchen/grocery-list/add         → GroceryListAddScreen (stub)
/kitchen/grocery-list/generate    → GenerateShoppingListScreen (stub)
/profile                          → ProfileScreen
/profile/recipes                  → ProfileRecipesScreen
/profile/edit                     → EditProfileScreen
```

---

### `src/app/AppShell.tsx`
**Purpose:** Root layout for authenticated users  
**Status:** ✅ Working  
**Key Features:**
- Provides consistent layout (header, content, bottom tabs)
- Dynamic header based on current route
- Bottom tab navigation (Feed, Create, Kitchen, Profile)
- Handles navigation for header icons (search, settings)
- Uses "Madimi One" font for "Cookd" logo

**Components Used:**
- `AppHeader` - Top bar with title, back button, right icons
- `BottomTabBar` - Bottom navigation tabs
- `Outlet` - Renders child routes

**Navigation Logic:**
- Search icon → `/search`
- Settings icon → `/profile/edit`
- Back button → `navigate(-1)`

---

### `src/app/ProtectedRoute.tsx`
**Purpose:** Route protection component  
**Status:** ✅ Working  
**Key Features:**
- Checks if user is authenticated
- Shows loading spinner while checking auth
- Redirects to `/welcome` if not authenticated
- Renders children (protected routes) if authenticated

**Dependencies:**
- `useAuthStore` - Gets user and loading state
- `Navigate` - Redirects unauthenticated users

---

## Modules (Screens)

### Authentication Module

#### `src/modules/auth/WelcomeScreen.tsx`
**Purpose:** Splash/welcome screen on app startup  
**Status:** ✅ Working  
**Key Features:**
- Displays "Cookd" logo with "Madimi One" font
- Shows for 2.5 seconds with fade-out animation
- Auto-navigates based on auth status:
  - If logged in → `/feed`
  - If not logged in → `/auth/login`
- Brand teal background with yellow logo

---

#### `src/modules/auth/LoginScreen.tsx`
**Purpose:** User login screen  
**Status:** ✅ Working  
**Key Features:**
- Email and password input fields
- "Cookd" logo display
- Form validation
- Mock authentication (localStorage)
- Navigates to `/feed` on success
- Link to signup screen
- Error handling with toast notifications

**Components Used:**
- `TextField` - Email and password inputs
- `Button` - Submit button
- `LoadingSpinner` - Loading state

---

#### `src/modules/auth/SignupScreen.tsx`
**Purpose:** User registration screen  
**Status:** ✅ Working  
**Key Features:**
- Name, email, password input fields
- "Cookd" logo display
- Form validation
- Mock authentication (localStorage)
- Navigates to `/onboarding/goals` on success
- Link to login screen
- Error handling with toast notifications

**Components Used:**
- `TextField` - Name, email, password inputs
- `Button` - Submit button
- `LoadingSpinner` - Loading state

---

### Onboarding Module

#### `src/modules/onboarding/OnboardingGoalsScreen.tsx`
**Purpose:** First onboarding step - goal selection  
**Status:** ✅ Working  
**Key Features:**
- Multi-select chip group for goals
- Options: reduce waste, save money, eat healthier, meal prep, try recipes, track nutrition
- Saves selected goals to localStorage
- Validates at least one goal selected
- Navigates to budget screen on continue

**Components Used:**
- `ChipGroup` - Multi-select goal chips
- `Button` - Continue button

---

#### `src/modules/onboarding/OnboardingBudgetScreen.tsx`
**Purpose:** Second onboarding step - budget setting  
**Status:** ✅ Working  
**Key Features:**
- Segmented control for budget period (week/month)
- NumberStepper for budget amount ($10-$1000)
- Saves budget to localStorage
- Navigates to cooking frequency screen

**Components Used:**
- `SegmentedControl` - Week/month toggle
- `NumberStepper` - Budget amount input
- `Button` - Continue button

---

#### `src/modules/onboarding/OnboardingCookingFrequencyScreen.tsx`
**Purpose:** Third onboarding step - cooking preferences  
**Status:** ✅ Working  
**Key Features:**
- NumberStepper for days per week to cook (1-7)
- Multi-select chip group for protein goals
- Saves preferences to localStorage
- Navigates to friends screen

**Components Used:**
- `NumberStepper` - Days per week input
- `ChipGroup` - Protein goals selection
- `Button` - Continue button

---

#### `src/modules/onboarding/OnboardingFriendsScreen.tsx`
**Purpose:** Fourth onboarding step - add friends  
**Status:** ✅ Working  
**Key Features:**
- TextField for comma-separated usernames
- Optional step (can skip)
- Saves friends to localStorage
- Navigates to `/feed` on complete or skip

**Components Used:**
- `TextField` - Friend usernames input
- `Button` - Add Friends / Skip buttons

---

### Feed Module

#### `src/modules/feed/FeedScreen.tsx`
**Purpose:** Main social feed screen  
**Status:** ✅ Working  
**Key Features:**
- Displays all posts from Zustand store
- Merges API posts (from React Query) with store posts
- Sorts posts by `createdAt` (newest first)
- Shows posts immediately (reactive Zustand store)
- Uses `PostList` component for rendering
- Handles loading, error, and empty states

**Data Flow:**
- Primary: `useAppStore().posts` (Zustand, reactive)
- Secondary: `useFeedQuery()` (React Query, for future API integration)
- Merges and deduplicates posts

**Components Used:**
- `PostList` - Renders list of posts
- `PostCard` - Individual post display

---

#### `src/modules/feed/ExploreScreen.tsx`
**Purpose:** Discover/explore content screen  
**Status:** ✅ Working  
**Key Features:**
- Trending topics chips (Budget Meals, Zero Waste, Meal Prep, etc.)
- Sections: Trending Budget Meals, Zero Waste Pros, Most Re-cooked
- Shows posts from store
- **"Create Plan" button** at bottom (fixed position)
- Navigates to meal planning screen

**Components Used:**
- `PostCard` - Post display
- `Button` - Create Plan button

---

#### `src/modules/feed/SearchScreen.tsx`
**Purpose:** Search functionality screen  
**Status:** ⚠️ Stub (navigation works, search TODO)  
**Key Features:**
- Screen exists and navigation works
- Placeholder/TODO message
- Needs search implementation

---

### Social Module

#### `src/modules/social/CreatePostScreen.tsx`
**Purpose:** Create new post screen  
**Status:** ✅ Working  
**Key Features:**
- Multi-step post creation flow
- Post type selection: meal, fridge, tip
- Media picker (placeholder - needs file picker)
- Caption input with dynamic placeholders
- Recipe attachment (works via navigation from "Cook Now & Share")
- Stats preview (shows recipe cost estimate)
- Before/after images for fridge posts
- Creates post with correct user ID from `authStore`
- Saves post to Zustand store and localStorage
- Invalidates React Query cache
- Shows success toast
- Navigates to feed after creation
- Recipe data included in post, appears in profile recipes

**State Management:**
- Uses `authStore.user` for post author
- Uses `useAppStore().addPost` for persistence
- Recipe passed via `location.state` from recipe detail

**Components Used:**
- `MediaPicker` - Image selection (placeholder)
- `TextField` - Caption input
- `Button` - Submit button

---

#### `src/modules/social/PostDetailScreen.tsx`
**Purpose:** Full post view with comments  
**Status:** ✅ Working  
**Key Features:**
- Displays full post content
- Shows all comments from store
- Like button (persists to localStorage)
- Re-cook button (navigates to create post)
- Add to grocery list (respects inventory)
- Comment input (adds comments to store)
- Comments persist to localStorage

**Components Used:**
- `PostCard` - Post display
- `CommentList` - Comments display
- `NewCommentInput` - Comment submission

---

### Kitchen Module

#### `src/modules/kitchen/KitchenScreen.tsx`
**Purpose:** Kitchen hub - main navigation  
**Status:** ✅ Working  
**Key Features:**
- Grid of 4 tiles: Inventory, AI Recipes, Meal Plan, Grocery List
- Each tile navigates to respective screen
- Quick stats display (items in stock, expiring soon, meals planned)
- Color-coded tiles for visual distinction

---

#### `src/modules/kitchen/inventory/InventoryScreen.tsx`
**Purpose:** Inventory management screen  
**Status:** ✅ Working  
**Key Features:**
- Displays all inventory items from store
- Category filtering (all, fridge, freezer, pantry)
- Expiring soon alerts (items expiring in 3 days)
- "Add Item" button → `AddInventoryItemScreen`
- "Scan Receipt" button → `ReceiptCameraScreen` (stub)
- **"Take Fridge Photo" button** → Opens modal with MediaPicker
- Fridge photo updates existing fridge items or creates new entry
- Items persist to localStorage
- Items can be deleted
- Item photos supported

**Components Used:**
- `InventoryList` - Item list display
- `InventoryItemRow` - Individual item row
- `MediaPicker` - Fridge photo capture
- `Modal` - Fridge photo modal
- `EmptyState` - Empty inventory message

---

#### `src/modules/kitchen/inventory/AddInventoryItemScreen.tsx`
**Purpose:** Add new inventory item screen  
**Status:** ✅ Working  
**Key Features:**
- Form for item details (name, quantity, unit, location)
- Date picker for expiry date
- Location selector (fridge, freezer, pantry)
- **MediaPicker for item photo** (optional)
- Saves item to Zustand store and localStorage
- Date serialization for localStorage
- Navigates back on success
- Shows success toast

**Components Used:**
- `TextField` - Item name input
- `NumberStepper` - Quantity input
- `DatePicker` - Expiry date picker
- `MediaPicker` - Item photo (optional)
- `Button` - Save button

---

#### `src/modules/kitchen/inventory/ReceiptCameraScreen.tsx`
**Purpose:** Receipt scanning camera screen  
**Status:** ⚠️ Stub (navigation works, camera TODO)  
**Key Features:**
- Screen exists and navigation works
- Placeholder UI for camera
- Needs camera integration and OCR

---

#### `src/modules/kitchen/inventory/ReceiptReviewScreen.tsx`
**Purpose:** Review scanned receipt items  
**Status:** ⚠️ Stub (navigation works, review TODO)  
**Key Features:**
- Screen exists and navigation works
- Needs receipt item review and mapping logic

---

#### `src/modules/kitchen/recipes/AiRecipeScreen.tsx`
**Purpose:** AI recipe generation screen  
**Status:** ✅ Working (UI functional, AI simulated)  
**Key Features:**
- Generate recipe button (simulated 2s delay)
- Displays generated recipe
- **"Cook Now & Share"** → Navigates to create post with recipe
- **"Add to grocery list"** → Adds ingredients (respects inventory)
- **"Plan Later"** → Navigates to meal plan with recipe
- Recipe display with ingredients, steps, cost estimate

**Components Used:**
- `Button` - Action buttons
- `Screen` - Layout wrapper

---

#### `src/modules/kitchen/recipes/RecipeDetailScreen.tsx`
**Purpose:** Recipe detail view  
**Status:** ✅ Working  
**Key Features:**
- Displays recipe with image, title, description
- Shows ingredients list with amounts
- Shows step-by-step instructions
- Creator info (if from post)
- Quick info (prep time, cook time, servings)
- Cost per serving display
- **"Cook Now & Share"** → Navigates to create post with recipe pre-filled
- **"Plan Later"** → Navigates to meal plan with recipe
- **"Add to List"** → Adds ingredients to grocery list (respects inventory)
- **"Re-cook & Post"** → Navigates to create post with recipe
- **"Save"** → Saves/unsaves recipe (persists to localStorage)
- **"Remix with AI"** → Navigates to transform screen (stub)

**Components Used:**
- `Button` - Action buttons
- `Screen` - Layout wrapper

---

#### `src/modules/kitchen/recipes/RecipeTransformScreen.tsx`
**Purpose:** AI recipe remix/transform screen  
**Status:** ⚠️ Stub (navigation works, transform TODO)  
**Key Features:**
- Screen exists and navigation works
- Needs AI transform implementation

---

#### `src/modules/kitchen/mealplan/MealPlanScreen.tsx`
**Purpose:** Weekly meal plan calendar view  
**Status:** ✅ Working  
**Key Features:**
- Displays current week calendar
- Shows planned meals from store
- Highlights days with planned meals
- Displays meal photos, custom titles/descriptions
- "Mark as cooked" button → `MealCompletionScreen`
- "Add meal" button → `MealPlanEditScreen`
- Meals persist to localStorage

**Components Used:**
- `Screen` - Layout wrapper

---

#### `src/modules/kitchen/mealplan/MealPlanPlanningScreen.tsx`
**Purpose:** Meal planning preferences screen  
**Status:** ✅ Working  
**Key Features:**
- NumberStepper for days to cook (1-7)
- NumberStepper for meals per day (1-3)
- NumberStepper for people (1-10)
- ChipGroup for meal prep goals (batch cooking, prep ahead, quick meals, freezer meals)
- Saves preferences to localStorage
- Navigates to meal plan edit screen
- Preferences used in meal plan entry (people count)

**Components Used:**
- `NumberStepper` - Days, meals, people inputs
- `ChipGroup` - Meal prep goals
- `Button` - Create Meal Plan button

---

#### `src/modules/kitchen/mealplan/MealPlanEditScreen.tsx`
**Purpose:** Add/edit meal plan entry screen  
**Status:** ✅ Working  
**Key Features:**
- Recipe pre-selection (from navigation state or manual)
- Date picker for meal date
- Meal type selector (breakfast, lunch, dinner, snack)
- Servings input (defaults from planning preferences)
- **Meal editing** - Custom title and description
- **MediaPicker for meal photo** (optional)
- Saves meal to Zustand store and localStorage
- **Auto-adds ingredients to grocery list** (respects inventory, multiplies by servings)
- Shows success toast with added items count
- Navigates back to meal plan screen

**Components Used:**
- `DatePicker` - Meal date selection
- `SegmentedControl` - Meal type selector
- `NumberStepper` - Servings input
- `TextField` - Meal title input
- `textarea` - Meal description input
- `MediaPicker` - Meal photo (optional)
- `Button` - Save button

---

#### `src/modules/kitchen/mealplan/MealCompletionScreen.tsx`
**Purpose:** Mark meal as cooked screen  
**Status:** ✅ Working  
**Key Features:**
- Displays meal summary (recipe, date, meal type)
- "Mark meal as cooked" button
- Updates meal plan entry (sets `isCooked: true`, `cookedAt: Date`)
- **Updates sustainability tracking:**
  - Increments days cooked (if first meal of day)
  - Adds $10 to money saved (estimate vs eating out)
- Saves to localStorage
- Shows success toast
- Navigates back to meal plan

**Components Used:**
- `Button` - Mark as cooked / Cancel buttons

---

#### `src/modules/kitchen/shopping/GroceryListScreen.tsx`
**Purpose:** Grocery list display screen  
**Status:** ✅ Working  
**Key Features:**
- Displays grocery items from store
- Items grouped by category (Produce, Meat, Dairy, Canned, Pantry, Frozen, Other)
- Categories sorted in logical order
- Progress bar showing completion percentage
- Checkbox toggling (persists to localStorage)
- Items can be deleted
- Items persist to localStorage
- **Auto-generates from meal plans and recipes** (respects inventory)
- Info box explaining auto-generation
- Empty state when no items

**Components Used:**
- `EmptyState` - Empty list message
- `Screen` - Layout wrapper

---

#### `src/modules/kitchen/shopping/GroceryListAddScreen.tsx`
**Purpose:** Manually add grocery items screen  
**Status:** ⚠️ Stub (navigation works, form TODO)  
**Key Features:**
- Screen exists and navigation works
- Needs form implementation

---

#### `src/modules/kitchen/shopping/GenerateShoppingListScreen.tsx`
**Purpose:** Generate grocery list from meal plan screen  
**Status:** ⚠️ Stub (navigation works, generation TODO)  
**Key Features:**
- Screen exists and navigation works
- Needs generation logic (currently auto-generates in meal plan edit)

---

### Profile Module

#### `src/modules/profile/ProfileScreen.tsx`
**Purpose:** User profile screen  
**Status:** ✅ Working  
**Key Features:**
- Displays user info from `authStore.user`
- Avatar with initials fallback
- Stats: Posts, Followers, Following, Waste Saved
- **Sustainability tracking section:**
  - Days cooked / Days goal
  - Money saved (estimated vs eating out)
- Tabs: Posts, Recipes
- Posts filtered by `user.id` (shows user's posts)
- "Edit Profile" button → `EditProfileScreen`
- "Sign Out" button → Logs out and navigates to welcome
- Empty state if no posts

**Components Used:**
- `Avatar` - User avatar
- `PostCard` - User's posts
- `Button` - Sign out button

---

#### `src/modules/profile/ProfileRecipesScreen.tsx`
**Purpose:** User's recipes display screen  
**Status:** ✅ Working  
**Key Features:**
- Grid layout of recipe cards
- Shows recipes from user's posts
- Shows saved recipes from other users' posts
- Removes duplicates by recipe ID
- Recipe cards show image, title, description, servings, cost
- Navigates to recipe detail on click
- Empty state if no recipes

**Components Used:**
- `EmptyState` - No recipes message
- `Screen` - Layout wrapper

---

#### `src/modules/profile/EditProfileScreen.tsx`
**Purpose:** Edit user profile screen  
**Status:** ✅ Working  
**Key Features:**
- Form for name, username, bio
- MediaPicker for avatar selection
- Character limit for bio (200 chars)
- Validation (name and username required)
- Saves to `authStore` and localStorage
- Updates user in auth store
- Shows success toast
- Navigates back on save

**Components Used:**
- `Avatar` - Profile picture display
- `TextField` - Name, username inputs
- `textarea` - Bio input
- `MediaPicker` - Avatar selection
- `Button` - Save button

---

#### `src/modules/profile/UserProfileScreen.tsx`
**Purpose:** View other user's profile screen  
**Status:** ✅ Working  
**Key Features:**
- Displays other user's profile
- Shows their posts
- Follow button (UI ready, needs API)
- Similar layout to own profile

**Components Used:**
- `PostList` - User's posts
- `FollowButton` - Follow/unfollow button

---

#### `src/modules/profile/ProfileBadgesScreen.tsx`
**Purpose:** User badges display screen  
**Status:** ❌ Removed (per user request)  
**Key Features:**
- File exists but not used
- Badges tab removed from profile

---

## Components

### Layout Components

#### `src/components/layout/AppHeader.tsx`
**Purpose:** Top navigation bar  
**Status:** ✅ Working  
**Key Features:**
- Dynamic title based on route
- "Cookd" logo uses "Madimi One" font with brand colors
- Back button (conditional, based on route)
- Right icon (search, settings) - conditional
- Brand colors (teal background, yellow logo)
- Touch-friendly targets

**Props:**
- `title: string` - Header title
- `showBackButton?: boolean` - Show back button
- `rightIcon?: 'search' | 'settings'` - Right icon type
- `onRightIconPress?: () => void` - Right icon handler

---

#### `src/components/layout/BottomTabBar.tsx`
**Purpose:** Bottom tab navigation  
**Status:** ✅ Working  
**Key Features:**
- 4 tabs: Feed, Create, Kitchen, Profile
- Active tab highlighting (brand teal)
- Icon + label for each tab
- Navigates on tab press
- Brand colors (teal active state)

**Tabs:**
- Feed → `/feed`
- Create → `/create`
- Kitchen → `/kitchen`
- Profile → `/profile`

---

#### `src/components/layout/Screen.tsx`
**Purpose:** Standard page container  
**Status:** ✅ Working  
**Key Features:**
- Consistent padding and scrolling
- Safe area support (mobile notches)
- Brand background color (`bg-brand-bg`)
- Scrollable content area

**Props:**
- `children: React.ReactNode`
- `scroll?: boolean` - Enable scrolling (default: true)
- `background?: 'default' | 'muted' | 'transparent'`

---

### UI Components

#### `src/components/ui/Button.tsx`
**Purpose:** Reusable button component  
**Status:** ✅ Working  
**Key Features:**
- Variants: primary, secondary, ghost, danger
- Sizes: sm, md, lg
- Loading state with spinner
- Icon support (left/right)
- Full width option
- Disabled state
- Brand colors (teal primary, sage secondary)
- Rounded corners (`rounded-2xl`)

**Props:**
- `variant?: 'primary' | 'secondary' | 'ghost' | 'danger'`
- `size?: 'sm' | 'md' | 'lg'`
- `loading?: boolean`
- `disabled?: boolean`
- `fullWidth?: boolean`
- `iconLeft?: React.ReactNode`
- `iconRight?: React.ReactNode`
- `onClick?: () => void`

---

#### `src/components/ui/IconButton.tsx`
**Purpose:** Icon-only button  
**Status:** ✅ Working  
**Key Features:**
- Touch-friendly size (44px minimum)
- Variants: primary, secondary, ghost
- Brand colors
- Hover states

---

#### `src/components/ui/Badge.tsx`
**Purpose:** Badge/tag component  
**Status:** ✅ Working  
**Key Features:**
- Variants: primary, secondary
- Brand colors (yellow primary, brown text)
- Used for post tags (NO-WASTE, UNDER-$3, etc.)

---

#### `src/components/ui/LoadingSpinner.tsx`
**Purpose:** Loading indicator  
**Status:** ✅ Working  
**Key Features:**
- Animated spinner
- Size variants
- Brand teal color

---

#### `src/components/ui/ErrorMessage.tsx`
**Purpose:** Error message display  
**Status:** ✅ Working  
**Key Features:**
- Error message text
- Optional retry button
- Used for network errors, API errors

**Props:**
- `message: string`
- `onRetry?: () => void`

---

#### `src/components/ui/EmptyState.tsx`
**Purpose:** Empty state display  
**Status:** ✅ Working  
**Key Features:**
- Title and description
- Optional action button
- Used when lists are empty

**Props:**
- `title: string`
- `description?: string`
- `actionLabel?: string`
- `onAction?: () => void`

---

#### `src/components/ui/ToastContext.tsx`
**Purpose:** Toast notification system  
**Status:** ✅ Working  
**Key Features:**
- Global toast context
- `useToast()` hook for showing toasts
- Toast types: success, error, info
- Auto-dismiss after 3 seconds
- Stack multiple toasts
- Position: bottom center (mobile-friendly)

**Usage:**
```typescript
const { showToast } = useToast();
showToast('Success message!', 'success');
```

---

#### `src/components/ui/Modal.tsx`
**Purpose:** Modal dialog component  
**Status:** ✅ Working  
**Key Features:**
- Overlay with backdrop
- Centered content
- Title and close button
- Click outside to close
- Used for fridge photo modal, confirmations

**Props:**
- `isOpen: boolean`
- `onClose: () => void`
- `title?: string`
- `children: React.ReactNode`

---

#### `src/components/ui/BottomSheet.tsx`
**Purpose:** Mobile-style bottom sheet  
**Status:** ✅ Working  
**Key Features:**
- Slides up from bottom
- Backdrop overlay
- Drag to dismiss
- Mobile-optimized

---

### Form Components

#### `src/components/forms/TextField.tsx`
**Purpose:** Text input field  
**Status:** ✅ Working  
**Key Features:**
- Label and placeholder
- Error message display
- Multiline support (textarea)
- Disabled state
- Brand styling (teal focus ring, rounded-2xl)
- Types: text, email, password, number

**Props:**
- `label?: string`
- `placeholder?: string`
- `value: string`
- `onChange: (v: string) => void`
- `type?: 'text' | 'email' | 'password' | 'number'`
- `multiline?: boolean`
- `error?: string`
- `disabled?: boolean`
- `rows?: number`

---

#### `src/components/forms/NumberStepper.tsx`
**Purpose:** Number input with +/- buttons  
**Status:** ✅ Working  
**Key Features:**
- Increment/decrement buttons
- Min/max/step support
- Touch-friendly
- Used in onboarding, meal planning, inventory

**Props:**
- `label?: string`
- `value: number`
- `onChange: (v: number) => void`
- `min?: number`
- `max?: number`
- `step?: number`

---

#### `src/components/forms/ChipGroup.tsx`
**Purpose:** Selectable chip group  
**Status:** ✅ Working  
**Key Features:**
- Single or multi-select mode
- Visual selection states
- Used in onboarding (goals, protein preferences, meal prep goals)
- Brand colors for selected state

**Props:**
- `mode: 'single' | 'multi'`
- `value: string | string[]`
- `options: { label: string; value: string }[]`
- `onChange: (v: string | string[]) => void`

---

#### `src/components/forms/SegmentedControl.tsx`
**Purpose:** Segmented control (two-option toggle)  
**Status:** ✅ Working  
**Key Features:**
- Two-option toggle
- Visual selection state
- Used in onboarding budget screen (week/month)

**Props:**
- `value: string`
- `onChange: (v: string) => void`
- `options: { label: string; value: string }[]`

---

#### `src/components/forms/DatePicker.tsx`
**Purpose:** Date input field  
**Status:** ✅ Working  
**Key Features:**
- Native date input
- Proper formatting
- Used in meal plan edit screen

**Props:**
- `label?: string`
- `value: string` (ISO date string)
- `onChange: (v: string) => void`

---

### Social Components

#### `src/components/social/PostCard.tsx`
**Purpose:** Core social post display component  
**Status:** ✅ Working  
**Key Features:**
- Displays post with user info, media, caption
- Recipe chip (if attached)
- Stats display (waste saved, cost per serving)
- Badges (NO-WASTE, UNDER-$3, etc.)
- Action buttons:
  - **Like** (persists to localStorage, shows filled heart)
  - **Comment** (navigates to post detail)
  - **Re-cook** (navigates to create post with recipe)
  - **Save** (bookmark icon, persists to localStorage)
  - **Add to grocery list** (if recipe attached, respects inventory)
- Clickable to navigate to post detail
- Saved posts show filled bookmark icon

**Components Used:**
- `Avatar` - User avatar
- `Badge` - Post badges
- `formatTimeAgo` - Relative time display
- `formatCurrency` - Cost formatting

---

#### `src/components/social/PostList.tsx`
**Purpose:** List of posts with states  
**Status:** ✅ Working  
**Key Features:**
- Renders array of posts
- Loading state (spinner)
- Error state (error message with retry)
- Empty state (no posts message)
- Maps posts to `PostCard` components

**Props:**
- `posts: Post[] | undefined`
- `isLoading: boolean`
- `isError: boolean`
- `onRetry?: () => void`

---

#### `src/components/social/CommentList.tsx`
**Purpose:** List of comments  
**Status:** ✅ Working  
**Key Features:**
- Displays comments for a post
- Shows user avatar, name, content, time
- Sorted by creation date
- Used in `PostDetailScreen`

**Props:**
- `comments: Comment[]`
- `postId: string`

---

#### `src/components/social/NewCommentInput.tsx`
**Purpose:** Comment input field  
**Status:** ✅ Working  
**Key Features:**
- Text input for comment
- Send button (disabled if empty)
- Creates comment with current user
- Adds to Zustand store and localStorage
- Updates post comment count
- Shows success toast
- Clears input on submit

**Components Used:**
- `Send` icon from lucide-react

---

#### `src/components/social/FollowButton.tsx`
**Purpose:** Follow/unfollow button  
**Status:** ✅ Working (UI ready, needs API)  
**Key Features:**
- Toggles follow state
- Shows "Follow" or "Following"
- React Query mutation (ready for API)
- Used in user profiles

---

### Media Components

#### `src/components/media/Avatar.tsx`
**Purpose:** User avatar component  
**Status:** ✅ Working  
**Key Features:**
- Displays user image or initials
- Size variants
- Brand colors (sage background, white text)
- Circular shape

**Props:**
- `src?: string | null` - Image URL
- `initials?: string` - Fallback initials
- `size?: number` - Avatar size

---

#### `src/components/media/MediaPicker.tsx`
**Purpose:** Media selection component  
**Status:** ⚠️ Partially Working  
**Key Features:**
- File input for images
- Preview of selected media
- Delete/reselect option
- **`capture="environment"`** attribute for camera access on mobile
- Currently uses placeholder URL (needs file picker implementation)
- Used in create post, inventory, meal plan, profile edit

**Props:**
- `media: SelectedMedia | null`
- `onChange: (media: SelectedMedia | null) => void`
- `label?: string`

**TODO:**
- Implement actual file selection
- Image preview from file
- Image upload to storage

---

### Inventory Components

#### `src/components/inventory/InventoryList.tsx`
**Purpose:** List of inventory items  
**Status:** ✅ Working  
**Key Features:**
- Renders array of inventory items
- Empty state when no items
- Maps items to `InventoryItemRow`

**Props:**
- `items: InventoryItem[]`

---

#### `src/components/inventory/InventoryItemRow.tsx`
**Purpose:** Single inventory item display  
**Status:** ✅ Working  
**Key Features:**
- Displays item name, quantity, unit, location
- Expiry date indicator (color-coded)
- Days until expiry calculation
- **Item photo thumbnail** (if available)
- **Delete button** (trash icon)
- Clickable to edit (if needed)
- Color coding: red (overdue), orange (expiring soon), green (good)

**Components Used:**
- `Trash2` icon for delete

---

### Shopping Components

#### `src/components/shopping/ShoppingListView.tsx`
**Purpose:** Grocery list display  
**Status:** ⚠️ Stub (exists but not used)  
**Key Features:**
- Component exists
- Currently grocery list renders inline in `GroceryListScreen`
- Could be extracted for reusability

---

#### `src/components/shopping/ShoppingListItemRow.tsx`
**Purpose:** Single grocery item display  
**Status:** ⚠️ Stub (exists but not used)  
**Key Features:**
- Component exists
- Currently grocery items render inline in `GroceryListScreen`
- Could be extracted for reusability

---

## Hooks

### `src/hooks/useAuth.tsx`
**Purpose:** Authentication hook  
**Status:** ✅ Working  
**Key Features:**
- `useLogin()` - Login mutation
- `useSignup()` - Signup mutation
- `useLogout()` - Logout function
- `useBootstrapAuth()` - Check auth on app load
- Mock authentication with localStorage
- Updates `authStore` on login/signup/logout

**Mock Auth:**
- Stores user in `localStorage` as `mock_auth_user`
- Loads user on app start
- No real API calls (ready for backend integration)

---

### `src/hooks/useFeed.ts`
**Purpose:** Feed data fetching hook  
**Status:** ✅ Working (returns mock data)  
**Key Features:**
- React Query hook for feed data
- Returns mock posts
- Ready for API integration
- Used in `FeedScreen` (though screen primarily uses Zustand)

---

### `src/hooks/usePostActions.ts`
**Purpose:** Post interaction hooks  
**Status:** ✅ Working  
**Key Features:**
- `likePost(postId)` - Toggles like (uses Zustand directly)
- Returns loading state (currently false, no API calls)
- Used in `PostCard` and `PostDetailScreen`

---

## API & Utilities

### `src/api/client.ts`
**Purpose:** HTTP client for API calls  
**Status:** ✅ Working (infrastructure ready)  
**Key Features:**
- `apiGet(url, options?)` - GET requests
- `apiPost(url, data, options?)` - POST requests
- `apiPatch(url, data, options?)` - PATCH requests
- `apiDelete(url, options?)` - DELETE requests
- Error handling
- TypeScript types
- Ready for backend integration

**Base URL:**
- Uses `import.meta.env.VITE_API_URL` or defaults to mock

---

### `src/lib/utils.ts`
**Purpose:** Utility functions  
**Status:** ✅ Working  
**Key Functions:**
- `formatCurrency(amount)` - Formats money ($X.XX)
- `formatTimeAgo(date)` - Relative time ("2h ago")
- `cn(...classes)` - Class name merger (clsx + tailwind-merge)
- `daysUntil(date)` - Days until date calculation

---

## Types & Interfaces

### `src/types/index.ts`
**Purpose:** Main type definitions  
**Status:** ✅ Working  
**Key Types:**
- `User` - User profile type
- `Post` - Social post type (with recipe, stats, badges)
- `Comment` - Comment type
- `Recipe` - Recipe type (ingredients, steps, cost)
- `InventoryItem` - Inventory item type (with dates, photos)
- `MealPlanEntry` - Meal plan entry type (with custom fields, photos)
- `GroceryItem` - Grocery list item type
- `PostStats` - Post statistics (cost, waste saved)
- `Badge` - Achievement badge type

**Key Properties:**
- `Post.recipe?: Recipe` - Optional attached recipe
- `Post.isSaved?: boolean` - Save state
- `MealPlanEntry.imageUrl?: string` - Meal photo
- `MealPlanEntry.customTitle?: string` - Edited meal title
- `InventoryItem.imageUrl?: string` - Item photo

---

### `src/types/social.ts`
**Purpose:** Social-specific types  
**Status:** ✅ Working  
**Key Types:**
- Re-exports `Post`, `Comment`, `User` from `./index`
- `FeedPost` - Alias for `Post`
- `PostComment` - Alias for `Comment`

---

### `src/types/kitchen.ts`
**Purpose:** Kitchen-specific types  
**Status:** ✅ Working  
**Key Types:**
- Kitchen-related type definitions
- Used for inventory, meal plans, grocery lists

---

### `src/types/userPreferences.ts`
**Purpose:** User preferences types  
**Status:** ✅ Working  
**Key Types:**
- `UserPreferences` - Onboarding and user settings
- `SustainabilityTracking` - Tracking metrics (days cooked, money saved)

---

### `src/vite-env.d.ts`
**Purpose:** Vite environment type definitions  
**Status:** ✅ Working  
**Key Features:**
- TypeScript declarations for `ImportMeta.env`
- Defines `VITE_API_URL` type

---

## Styling & Configuration

### `tailwind.config.js`
**Purpose:** Tailwind CSS configuration  
**Status:** ✅ Working  
**Key Features:**
- Custom brand colors:
  - `brand-yellow: '#FFD07B'`
  - `brand-sage: '#7EB09B'`
  - `brand-teal: '#00635D'`
  - `brand-brown: '#4C2719'`
  - `brand-bg: '#FFF6EB'`
- Custom border radius: `rounded-2xl: '1.5rem'`
- Mobile-first responsive design

---

### `postcss.config.js`
**Purpose:** PostCSS configuration  
**Status:** ✅ Working  
**Key Features:**
- Tailwind CSS plugin
- Autoprefixer for browser compatibility

---

### `vite.config.ts`
**Purpose:** Vite build configuration  
**Status:** ✅ Working  
**Key Features:**
- React plugin
- PWA plugin (service worker, manifest)
- TypeScript support
- Path aliases (if configured)

---

### `tsconfig.json`
**Purpose:** TypeScript configuration  
**Status:** ✅ Working  
**Key Features:**
- Strict mode enabled
- React JSX support
- Path mappings
- ES2020 target

---

## Data Flow & Architecture

### State Management Flow

```
User Action
  ↓
Component (Screen/Component)
  ↓
Hook (useAuth, useAppStore) OR Direct Store Access
  ↓
Zustand Store (appStore.ts)
  ↓
localStorage (persistence)
  ↓
UI Update (reactive)
```

### Post Creation Flow

```
CreatePostScreen
  ↓
User fills form (type, caption, recipe, media)
  ↓
handlePost()
  ↓
Creates Post object with authStore.user
  ↓
addPost() → Zustand store
  ↓
Saves to localStorage
  ↓
Invalidates React Query cache
  ↓
FeedScreen updates (reactive Zustand)
  ↓
Post appears immediately
```

### Meal Planning Flow

```
ExploreScreen → "Create Plan"
  ↓
MealPlanPlanningScreen (set preferences)
  ↓
Saves preferences to localStorage
  ↓
MealPlanEditScreen (select recipe, date, meal type)
  ↓
addMealPlanEntry() → Zustand store
  ↓
Auto-adds ingredients to grocery list (respects inventory)
  ↓
Saves to localStorage
  ↓
MealPlanScreen displays meal
  ↓
MealCompletionScreen (mark as cooked)
  ↓
Updates sustainability tracking
```

### Recipe to Post Flow

```
RecipeDetailScreen → "Cook Now & Share"
  ↓
Navigate to CreatePostScreen with recipe in location.state
  ↓
CreatePostScreen pre-fills recipe
  ↓
User adds caption, media
  ↓
Creates post with recipe attached
  ↓
Post appears in feed
  ↓
Recipe appears in ProfileRecipesScreen
```

---

## Key Features & Functionality

### ✅ Fully Working Features

1. **Authentication**
   - Login/signup with mock auth
   - User persistence in localStorage
   - Protected routes
   - Sign out functionality

2. **Onboarding**
   - Complete 4-step flow
   - Goals, budget, cooking frequency, friends
   - Preferences saved to localStorage

3. **Social Feed**
   - Post display with immediate updates
   - Like, comment, re-cook, save functionality
   - Post creation with recipes
   - Comments with persistence

4. **Kitchen Features**
   - Inventory management (add, delete, photos)
   - Meal planning (planning → edit → completion)
   - Grocery list (auto-generation, checkoff, delete)
   - Recipe detail with all actions

5. **Profile**
   - User profile with posts
   - Recipe collection (user's + saved)
   - Profile editing
   - Sustainability tracking

6. **Data Persistence**
   - All major data persists to localStorage
   - Date serialization/deserialization
   - Survives page refreshes

### ⚠️ Partially Working Features

1. **Media Picker**
   - UI exists, placeholder URLs
   - Needs actual file selection
   - Needs image upload

2. **Search**
   - Screen exists, navigation works
   - No search functionality

3. **Receipt Scanning**
   - Screens exist, navigation works
   - No camera/OCR integration

4. **AI Features**
   - Recipe generation simulated
   - Recipe transform stub

---

## Component Relationships

### Post Display Chain
```
FeedScreen
  → PostList
    → PostCard
      → Avatar, Badge, formatCurrency, formatTimeAgo
```

### Comment Chain
```
PostDetailScreen
  → CommentList
    → Comment items
  → NewCommentInput
    → useAppStore().addComment
```

### Inventory Chain
```
InventoryScreen
  → InventoryList
    → InventoryItemRow
      → Delete button → useAppStore().deleteInventoryItem
```

### Meal Planning Chain
```
MealPlanScreen
  → Meal entries
MealPlanEditScreen
  → DatePicker, SegmentedControl, NumberStepper, MediaPicker
  → useAppStore().addMealPlanEntry
MealCompletionScreen
  → useAppStore().updateMealPlanEntry
  → Updates sustainability tracking
```

---

## File Count Summary

- **Total TypeScript/TSX Files:** ~107
- **Screens (Modules):** 25+
- **Components:** 50+
- **Hooks:** 3
- **Stores:** 2 (authStore, appStore)
- **Type Definitions:** 4 files
- **Utility Files:** 2 (api/client, lib/utils)

---

## Dependencies

### Core
- `react` (^18.2.0) - UI framework
- `react-dom` (^18.2.0) - DOM rendering
- `react-router-dom` (^6.20.0) - Routing
- `@tanstack/react-query` (^5.17.0) - Server state management
- `zustand` (^4.4.7) - Client state management

### UI & Styling
- `tailwindcss` (^3.3.6) - CSS framework
- `lucide-react` (^0.294.0) - Icons
- `clsx` (^2.0.0) - Class name utility
- `tailwind-merge` (^2.1.0) - Tailwind class merging

### Utilities
- `date-fns` (^2.30.0) - Date formatting
- `uuid` (^13.0.0) - ID generation

### Build Tools
- `vite` (^5.0.8) - Build tool
- `typescript` (^5.3.3) - Type checking
- `vite-plugin-pwa` (^0.17.4) - PWA support

---

## Best Practices & Patterns

### State Management
- **Zustand** for client-side state (posts, inventory, meal plans, etc.)
- **React Query** for server state (ready for API integration)
- **localStorage** for persistence (all major data)

### Component Organization
- **Modules** - Feature-based screen organization
- **Components** - Reusable UI components by category
- **Hooks** - Custom logic extraction
- **Types** - Centralized type definitions

### Code Patterns
- **Functional components** with hooks
- **TypeScript** for type safety
- **Mobile-first** responsive design
- **Touch-friendly** targets (44px minimum)
- **Brand consistency** (colors, fonts, spacing)

---

## Future Integration Points

### Backend API
- All hooks ready for API integration
- API client infrastructure in place
- Error handling ready
- Just need to swap mock data for real API calls

### Media Handling
- MediaPicker needs file selection
- Image upload to storage (S3/Cloudinary)
- Image optimization
- Video support (future)

### Real-time Features
- WebSocket integration for live updates
- Push notifications
- Activity feed

---

**Documentation Status:** Complete  
**Last Reviewed:** January 2025  
**Next Update:** After backend integration

