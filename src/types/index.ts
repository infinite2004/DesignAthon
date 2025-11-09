export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  followers: number;
  following: number;
  mealsShared: number;
  wasteReduced: number; // in grams
  avgCostPerServing: number;
  badges: Badge[];
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  type: 'meal' | 'fridge' | 'tip';
  media: string[]; // image/video URLs
  caption: string;
  recipeId?: string;
  recipe?: Recipe;
  stats?: PostStats;
  badges: string[]; // NO-WASTE, UNDER-$3, etc.
  likes: number;
  comments: number;
  reCooks: number;
  createdAt: Date;
  isLiked?: boolean;
  isSaved?: boolean; // For save posts feature
}

export interface PostStats {
  costPerServing: number;
  wasteSaved: number; // in grams
  expiringItemsUsed: number;
  macros?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface Recipe {
  id: string;
  userId?: string; // undefined if AI-generated
  title: string;
  description: string;
  ingredients: Ingredient[];
  steps: string[];
  servings: number;
  prepTime: number; // minutes
  cookTime: number; // minutes
  costEstimate: number;
  tags: string[];
  sourceRecipeId?: string; // if re-cooked
  reCookCount: number;
  image?: string;
  createdAt: Date;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'fridge' | 'freezer' | 'pantry';
  quantity: number;
  unit: string;
  expiryDate?: Date;
  purchaseDate?: Date;
  purchasePrice?: number;
  location: string;
  imageUrl?: string; // Photo of the item or fridge/pantry
}

export interface MealPlanEntry {
  id: string;
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipeId: string;
  recipe: Recipe;
  isCooked: boolean;
  cookedAt?: Date;
  imageUrl?: string; // Photo of the meal
  customTitle?: string; // Custom title if edited
  customDescription?: string; // Custom description if edited
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  isChecked: boolean;
  recipeId?: string;
  estimatedPrice?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: User;
  content: string;
  parentId?: string; // for nested replies
  replies?: Comment[];
  createdAt: Date;
}

