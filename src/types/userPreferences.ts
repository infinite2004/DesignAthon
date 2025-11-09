export interface UserPreferences {
  goals: string[];
  budget: {
    period: 'week' | 'month';
    amount: number;
  };
  cookingFrequency: {
    daysPerWeek: number;
    proteinGoals: string[];
  };
  friends: string[];
  savedPosts: string[];
  savedRecipes: string[];
  cuisinePreferences: string[];
  weeklyGoals: {
    daysToCook: number;
    mealsPerDay: number;
    people: number;
    mealPrepGoals: string[];
  };
}

export interface SustainabilityTracking {
  daysCooked: number;
  daysGoal: number;
  moneySaved: number; // compared to eating out
  wasteSaved: number; // in grams
  newRecipesLearned: number;
  mealsShared: number;
}

