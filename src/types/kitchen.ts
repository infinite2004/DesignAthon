// Kitchen-specific types
export type { InventoryItem, MealPlanEntry, GroceryItem, Recipe } from './index';

// Recipe summary for lists/cards
export interface RecipeSummary {
  id: string;
  title: string;
  imageUrl?: string;
  costPerServing?: number;
  readyInMinutes?: number;
  tags?: string[];
}

// Shopping list item type
export interface ShoppingListItem {
  id: string;
  name: string;
  quantity?: number;
  unit?: string;
  checked: boolean;
  estimatedPrice?: number;
}

