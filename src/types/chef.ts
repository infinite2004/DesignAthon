export interface PantryItem {
  id: string;
  name: string;
  category: 'fridge' | 'freezer' | 'pantry';
  quantity: number;
  unit: string;
  expiryDate?: Date;
  purchaseDate?: Date;
  purchasePrice?: number;
  location: string;
  imageUrl?: string;
  confidence?: number; // For AI-detected items
}

export interface AIRecipe {
  id: string;
  title: string;
  description: string;
  ingredients: Array<{
    name: string;
    amount: number;
    unit: string;
    inPantry: boolean; // Whether user has this
  }>;
  steps: string[];
  servings: number;
  prepTime: number;
  cookTime: number;
  costEstimate: number;
  difficulty: 'easy' | 'medium' | 'hard';
  pantryItemsUsed: string[]; // Pantry item IDs
  tags: string[];
}

export interface DMMessage {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  recipeDraft?: {
    ingredients: string[];
    steps: string[];
  };
  createdAt: Date;
}

export interface DMThread {
  id: string;
  postId: string;
  requesterId: string;
  creatorId: string;
  messages: DMMessage[];
  status: 'pending' | 'active' | 'completed';
  createdAt: Date;
}

