import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './AppShell';
import { ProtectedRoute } from './ProtectedRoute';
import { WelcomeScreen } from '../modules/auth/WelcomeScreen';
import { LoginScreen } from '../modules/auth/LoginScreen';
import { SignupScreen } from '../modules/auth/SignupScreen';
import { FeedScreen } from '../modules/feed/FeedScreen';
import { ExploreScreen } from '../modules/feed/ExploreScreen';
import { SearchScreen } from '../modules/feed/SearchScreen';
import { CreatePostScreen } from '../modules/social/CreatePostScreen';
import { PostDetailScreen } from '../modules/social/PostDetailScreen';
import { KitchenScreen } from '../modules/kitchen/KitchenScreen';
import { InventoryScreen } from '../modules/kitchen/inventory/InventoryScreen';
import { AddInventoryItemScreen } from '../modules/kitchen/inventory/AddInventoryItemScreen';
import { ReceiptCameraScreen } from '../modules/kitchen/inventory/ReceiptCameraScreen';
import { ReceiptReviewScreen } from '../modules/kitchen/inventory/ReceiptReviewScreen';
import { AiRecipeScreen } from '../modules/kitchen/recipes/AiRecipeScreen';
import { RecipeDetailScreen } from '../modules/kitchen/recipes/RecipeDetailScreen';
import { RecipeTransformScreen } from '../modules/kitchen/recipes/RecipeTransformScreen';
import { MealPlanScreen } from '../modules/kitchen/mealplan/MealPlanScreen';
import { MealPlanPlanningScreen } from '../modules/kitchen/mealplan/MealPlanPlanningScreen';
import { MealPlanEditScreen } from '../modules/kitchen/mealplan/MealPlanEditScreen';
import { MealCompletionScreen } from '../modules/kitchen/mealplan/MealCompletionScreen';
import { GroceryListScreen } from '../modules/kitchen/shopping/GroceryListScreen';
import { GroceryListAddScreen } from '../modules/kitchen/shopping/GroceryListAddScreen';
import { GenerateShoppingListScreen } from '../modules/kitchen/shopping/GenerateShoppingListScreen';
import { ProfileScreen } from '../modules/profile/ProfileScreen';
import { ProfileRecipesScreen } from '../modules/profile/ProfileRecipesScreen';
import { EditProfileScreen } from '../modules/profile/EditProfileScreen';
import { UserProfileScreen } from '../modules/profile/UserProfileScreen';
import { MarketplaceScreen } from '../modules/marketplace/MarketplaceScreen';
import { OnboardingGoalsScreen } from '../modules/onboarding/OnboardingGoalsScreen';
import { OnboardingBudgetScreen } from '../modules/onboarding/OnboardingBudgetScreen';
import { OnboardingCookingFrequencyScreen } from '../modules/onboarding/OnboardingCookingFrequencyScreen';
import { OnboardingDietScreen } from '../modules/onboarding/OnboardingDietScreen';
import { OnboardingFriendsScreen } from '../modules/onboarding/OnboardingFriendsScreen';
import { OnboardingInventoryBootstrapScreen } from '../modules/onboarding/OnboardingInventoryBootstrapScreen';

export function AppRoutes() {
  return (
    <Routes>
      {/* Welcome/Splash screen - should be first */}
      <Route path="/welcome" element={<WelcomeScreen />} />
      
      {/* Auth routes (public) */}
      <Route path="/auth/login" element={<LoginScreen />} />
      <Route path="/auth/signup" element={<SignupScreen />} />
      
      {/* Onboarding routes (public) */}
      <Route path="/onboarding/goals" element={<OnboardingGoalsScreen />} />
      <Route path="/onboarding/budget" element={<OnboardingBudgetScreen />} />
      <Route path="/onboarding/cooking-frequency" element={<OnboardingCookingFrequencyScreen />} />
      <Route path="/onboarding/diet" element={<OnboardingDietScreen />} />
      <Route path="/onboarding/friends" element={<OnboardingFriendsScreen />} />
      <Route path="/onboarding/inventory" element={<OnboardingInventoryBootstrapScreen />} />
      
      {/* Protected app routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/feed" replace />} />
          <Route path="feed" element={<FeedScreen />} />
          <Route path="explore" element={<ExploreScreen />} />
          <Route path="search" element={<SearchScreen />} />
          <Route path="create" element={<CreatePostScreen />} />
          <Route path="marketplace" element={<MarketplaceScreen />} />
          <Route path="post/:id" element={<PostDetailScreen />} />
          <Route path="recipe/:id" element={<RecipeDetailScreen />} />
          <Route path="recipe/:id/transform" element={<RecipeTransformScreen />} />
          <Route path="user/:id" element={<UserProfileScreen />} />
          
          {/* Kitchen routes */}
          <Route path="kitchen" element={<KitchenScreen />} />
          <Route path="kitchen/inventory" element={<InventoryScreen />} />
          <Route path="kitchen/inventory/add" element={<AddInventoryItemScreen />} />
          <Route path="kitchen/inventory/receipt/camera" element={<ReceiptCameraScreen />} />
          <Route path="kitchen/inventory/receipt/review" element={<ReceiptReviewScreen />} />
          <Route path="kitchen/ai-recipes" element={<AiRecipeScreen />} />
          <Route path="kitchen/meal-plan" element={<MealPlanScreen />} />
          <Route path="kitchen/meal-plan/planning" element={<MealPlanPlanningScreen />} />
          <Route path="kitchen/meal-plan/add" element={<MealPlanEditScreen />} />
          <Route path="kitchen/meal-plan/complete/:id" element={<MealCompletionScreen />} />
          <Route path="kitchen/grocery-list" element={<GroceryListScreen />} />
          <Route path="kitchen/grocery-list/add" element={<GroceryListAddScreen />} />
          <Route path="kitchen/grocery-list/generate" element={<GenerateShoppingListScreen />} />
          
          {/* Profile routes */}
          <Route path="profile" element={<ProfileScreen />} />
          <Route path="profile/recipes" element={<ProfileRecipesScreen />} />
          <Route path="profile/edit" element={<EditProfileScreen />} />
          <Route path="settings" element={<EditProfileScreen />} />
        </Route>
      </Route>
      
      {/* Fallback - redirect to welcome */}
      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  );
}

