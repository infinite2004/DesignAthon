import { create } from 'zustand';
import type { User, Post, Recipe, InventoryItem, MealPlanEntry, GroceryItem, Comment } from '../types';

interface AppState {
  currentUser: User | null;
  posts: Post[];
  comments: Comment[];
  recipes: Recipe[];
  inventory: InventoryItem[];
  mealPlan: MealPlanEntry[];
  groceryList: GroceryItem[];
  savedPosts: string[];
  savedRecipes: string[];
  followingUsers: string[]; // Array of user IDs that current user follows
  
  // Actions
  setCurrentUser: (user: User) => void;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  addPost: (post: Post) => void;
  likePost: (postId: string) => void;
  addComment: (comment: Comment) => void;
  reCookPost: (postId: string) => void;
  savePost: (postId: string) => void;
  unsavePost: (postId: string) => void;
  saveRecipe: (recipeId: string) => void;
  unsaveRecipe: (recipeId: string) => void;
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  addMealPlanEntry: (entry: MealPlanEntry) => void;
  updateMealPlanEntry: (id: string, updates: Partial<MealPlanEntry>) => void;
  addGroceryItem: (item: GroceryItem) => void;
  toggleGroceryItem: (id: string) => void;
  deleteGroceryItem: (id: string) => void;
}

// Mock data generator
const generateMockUser = (): User => ({
  id: '1',
  username: 'cookmaster',
  displayName: 'Chef Alex',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  bio: 'Love cooking on a budget! 🍳',
  followers: 1234,
  following: 567,
  mealsShared: 89,
  wasteReduced: 12500,
  avgCostPerServing: 2.45,
  badges: [],
});

const generateMockPosts = (): Post[] => {
  const users: User[] = [
    generateMockUser(),
    {
      id: '2',
      username: 'budgetchef',
      displayName: 'Sarah M.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      bio: 'Student cooking enthusiast',
      followers: 890,
      following: 234,
      mealsShared: 45,
      wasteReduced: 8900,
      avgCostPerServing: 1.95,
      badges: [],
    },
  ];

  return [
    {
      id: '1',
      userId: '1',
      user: users[0],
      type: 'meal',
      media: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'],
      caption: 'Made this amazing chickpea curry using spinach and tomatoes that were about to expire! Zero waste win 🎉',
      recipeId: '1',
      stats: {
        costPerServing: 2.50,
        wasteSaved: 350,
        expiringItemsUsed: 3,
        macros: { calories: 420, protein: 18, carbs: 55, fat: 12 },
      },
      badges: ['NO-WASTE', 'UNDER-$3', 'VEGAN'],
      likes: 234,
      comments: 12,
      reCooks: 8,
      createdAt: new Date(Date.now() - 3600000),
    },
    {
      id: '2',
      userId: '2',
      user: users[1],
      type: 'tip',
      media: ['https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400'],
      caption: 'Pro tip: Freeze leftover herbs in olive oil! They last months and add instant flavor to any dish.',
      badges: ['TIP', 'ZERO-WASTE'],
      likes: 567,
      comments: 23,
      reCooks: 0,
      createdAt: new Date(Date.now() - 7200000),
    },
  ];
};

// Helper to serialize/deserialize dates in posts
const serializePosts = (posts: Post[]): string => {
  return JSON.stringify(posts, (key, value) => {
    if (key === 'createdAt' && value instanceof Date) {
      return value.toISOString();
    }
    return value;
  });
};

// Helper to clean blob URLs from posts (they become invalid after refresh)
const cleanBlobUrls = (posts: any[]): Post[] => {
  return posts.map((post: any) => {
    // If media contains blob URLs, remove them (they're invalid)
    const cleanedMedia = post.media?.filter((url: string) => {
      // Keep data URLs and regular URLs, remove blob URLs
      if (typeof url === 'string' && url.startsWith('blob:')) {
        return false; // Remove blob URLs
      }
      return true; // Keep data URLs and regular URLs
    }) || [];
    
    return {
      ...post,
      media: cleanedMedia, // Remove blob URLs
      createdAt: new Date(post.createdAt),
    };
  });
};

const deserializePosts = (json: string): Post[] => {
  const parsed = JSON.parse(json);
  return cleanBlobUrls(parsed);
};

// Load initial posts from localStorage or use mock data
const getInitialPosts = (): Post[] => {
  try {
    const stored = localStorage.getItem('cookd_posts');
    if (stored) {
      const parsed = deserializePosts(stored);
      
      // One-time migration: Clean blob URLs from existing posts and save back
      const hasBlobUrls = parsed.some((p: Post) => 
        p.media?.some((url: string) => typeof url === 'string' && url.startsWith('blob:'))
      );
      
      if (hasBlobUrls) {
        const cleaned = cleanBlobUrls(parsed);
        // Save cleaned posts back to localStorage
        try {
          localStorage.setItem('cookd_posts', serializePosts(cleaned));
        } catch (error) {
          console.error('Error saving cleaned posts to localStorage:', error);
        }
        // Merge with mock posts
        const mockPosts = generateMockPosts();
        const existingIds = new Set(cleaned.map((p: Post) => p.id));
        const newMockPosts = mockPosts.filter((p: Post) => !existingIds.has(p.id));
        return [...cleaned, ...newMockPosts];
      }
      
      // Merge with mock posts if localStorage is empty or has fewer posts
      const mockPosts = generateMockPosts();
      const existingIds = new Set(parsed.map((p: Post) => p.id));
      const newMockPosts = mockPosts.filter((p: Post) => !existingIds.has(p.id));
      return [...parsed, ...newMockPosts];
    }
  } catch (error) {
    console.error('Error loading posts from localStorage:', error);
  }
  return generateMockPosts();
};

// Load initial meal plan from localStorage
const getInitialMealPlan = (): MealPlanEntry[] => {
  try {
    const stored = localStorage.getItem('cookd_meal_plan');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((e: any) => ({
        ...e,
        date: new Date(e.date),
        cookedAt: e.cookedAt ? new Date(e.cookedAt) : undefined,
      }));
    }
  } catch (error) {
    console.error('Error loading meal plan from localStorage:', error);
  }
  return [];
};

// Load initial grocery list from localStorage
const getInitialGroceryList = (): GroceryItem[] => {
  try {
    const stored = localStorage.getItem('cookd_grocery_list');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading grocery list from localStorage:', error);
  }
  return [];
};

// Load initial comments from localStorage
const getInitialComments = (): Comment[] => {
  try {
    const stored = localStorage.getItem('cookd_comments');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((c: any) => ({
        ...c,
        createdAt: new Date(c.createdAt),
      }));
    }
  } catch (error) {
    console.error('Error loading comments from localStorage:', error);
  }
  return [];
};

// Load initial inventory from localStorage
const getInitialInventory = (): InventoryItem[] => {
  try {
    const stored = localStorage.getItem('cookd_inventory');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((item: any) => ({
        ...item,
        expiryDate: item.expiryDate ? new Date(item.expiryDate) : undefined,
        purchaseDate: item.purchaseDate ? new Date(item.purchaseDate) : undefined,
      }));
    }
  } catch (error) {
    console.error('Error loading inventory from localStorage:', error);
  }
  return [];
};

const getInitialSavedPosts = (): string[] => {
  try {
    const stored = localStorage.getItem('cookd_saved_posts');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const getInitialSavedRecipes = (): string[] => {
  try {
    const stored = localStorage.getItem('cookd_saved_recipes');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const getInitialFollowingUsers = (): string[] => {
  try {
    const stored = localStorage.getItem('cookd_following_users');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const useAppStore = create<AppState>((set) => ({
  currentUser: generateMockUser(),
  posts: getInitialPosts(),
  comments: getInitialComments(),
  recipes: [],
  inventory: getInitialInventory(),
  mealPlan: getInitialMealPlan(),
  groceryList: getInitialGroceryList(),
  savedPosts: getInitialSavedPosts(),
  savedRecipes: getInitialSavedRecipes(),
  followingUsers: getInitialFollowingUsers(),
  
  setCurrentUser: (user) => set({ currentUser: user }),
  
  followUser: (userId) => {
    set((state) => {
      if (state.followingUsers.includes(userId)) return state;
      const newFollowing = [...state.followingUsers, userId];
      try {
        localStorage.setItem('cookd_following_users', JSON.stringify(newFollowing));
      } catch (error) {
        console.error('Error saving following users to localStorage:', error);
      }
      return { followingUsers: newFollowing };
    });
  },
  
  unfollowUser: (userId) => {
    set((state) => {
      const newFollowing = state.followingUsers.filter((id) => id !== userId);
      try {
        localStorage.setItem('cookd_following_users', JSON.stringify(newFollowing));
      } catch (error) {
        console.error('Error saving following users to localStorage:', error);
      }
      return { followingUsers: newFollowing };
    });
  },
  
  addPost: (post) => {
    set((state) => {
      // Clean blob URLs from the new post before saving
      const cleanedPost = {
        ...post,
        media: post.media.filter((url: string) => !url.startsWith('blob:')),
      };
      const newPosts = [cleanedPost, ...state.posts];
      // Save to localStorage
      try {
        localStorage.setItem('cookd_posts', serializePosts(newPosts));
      } catch (error) {
        console.error('Error saving posts to localStorage:', error);
      }
      return { posts: newPosts };
    });
  },
  
  likePost: (postId) => set((state) => {
    const updatedPosts = state.posts.map((p) =>
      p.id === postId
        ? { ...p, likes: p.likes + (p.isLiked ? -1 : 1), isLiked: !p.isLiked }
        : p
    );
    // Save to localStorage
    try {
      localStorage.setItem('cookd_posts', serializePosts(updatedPosts));
    } catch (error) {
      console.error('Error saving posts to localStorage:', error);
    }
    return { posts: updatedPosts };
  }),
  
  addComment: (comment) => {
    set((state) => {
      const newComments = [...state.comments, comment];
      // Update post comment count
      const updatedPosts = state.posts.map((p) =>
        p.id === comment.postId
          ? { ...p, comments: p.comments + 1 }
          : p
      );
      // Save to localStorage
      try {
        localStorage.setItem('cookd_comments', JSON.stringify(newComments.map(c => ({
          ...c,
          createdAt: c.createdAt.toISOString(),
        }))));
        localStorage.setItem('cookd_posts', serializePosts(updatedPosts));
      } catch (error) {
        console.error('Error saving comments to localStorage:', error);
      }
      return { comments: newComments, posts: updatedPosts };
    });
  },
  
  reCookPost: (postId) => {
    set((state) => {
      const updatedPosts = state.posts.map((p) =>
        p.id === postId
          ? { ...p, reCooks: p.reCooks + 1 }
          : p
      );
      // Save to localStorage
      try {
        localStorage.setItem('cookd_posts', serializePosts(updatedPosts));
      } catch (error) {
        console.error('Error saving posts to localStorage:', error);
      }
      return { posts: updatedPosts };
    });
  },
  
  addInventoryItem: (item) => {
    set((state) => {
      const newInventory = [...state.inventory, item];
      // Save to localStorage
      try {
        localStorage.setItem('cookd_inventory', JSON.stringify(newInventory.map(i => ({
          ...i,
          expiryDate: i.expiryDate?.toISOString(),
          purchaseDate: i.purchaseDate?.toISOString(),
        }))));
      } catch (error) {
        console.error('Error saving inventory to localStorage:', error);
      }
      return { inventory: newInventory };
    });
  },
  
  updateInventoryItem: (id, updates) => {
    set((state) => {
      const updatedInventory = state.inventory.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      );
      // Save to localStorage
      try {
        localStorage.setItem('cookd_inventory', JSON.stringify(updatedInventory.map(i => ({
          ...i,
          expiryDate: i.expiryDate?.toISOString(),
          purchaseDate: i.purchaseDate?.toISOString(),
        }))));
      } catch (error) {
        console.error('Error saving inventory to localStorage:', error);
      }
      return { inventory: updatedInventory };
    });
  },
  
  deleteInventoryItem: (id) => {
    set((state) => {
      const updatedInventory = state.inventory.filter((item) => item.id !== id);
      // Save to localStorage
      try {
        localStorage.setItem('cookd_inventory', JSON.stringify(updatedInventory.map(i => ({
          ...i,
          expiryDate: i.expiryDate?.toISOString(),
          purchaseDate: i.purchaseDate?.toISOString(),
        }))));
      } catch (error) {
        console.error('Error saving inventory to localStorage:', error);
      }
      return { inventory: updatedInventory };
    });
  },
  
  addMealPlanEntry: (entry) => {
    set((state) => {
      const newMealPlan = [...state.mealPlan, entry];
      // Save to localStorage
      try {
        localStorage.setItem('cookd_meal_plan', JSON.stringify(newMealPlan.map(e => ({
          ...e,
          date: e.date.toISOString(),
          cookedAt: e.cookedAt?.toISOString(),
        }))));
      } catch (error) {
        console.error('Error saving meal plan to localStorage:', error);
      }
      return { mealPlan: newMealPlan };
    });
  },
  
  updateMealPlanEntry: (id, updates) => {
    set((state) => {
      const updatedMealPlan = state.mealPlan.map((entry) =>
        entry.id === id ? { ...entry, ...updates } : entry
      );
      // Save to localStorage
      try {
        localStorage.setItem('cookd_meal_plan', JSON.stringify(updatedMealPlan.map(e => ({
          ...e,
          date: e.date.toISOString(),
          cookedAt: e.cookedAt?.toISOString(),
        }))));
      } catch (error) {
        console.error('Error saving meal plan to localStorage:', error);
      }
      return { mealPlan: updatedMealPlan };
    });
  },
  
  addGroceryItem: (item) => {
    set((state) => {
      // Check if item already exists in grocery list (case-insensitive name match)
      const existingIndex = state.groceryList.findIndex(
        (existing) => existing.name.toLowerCase() === item.name.toLowerCase() && !existing.isChecked
      );
      
      let newGroceryList: GroceryItem[];
      if (existingIndex >= 0) {
        // Merge quantities if item already exists
        newGroceryList = state.groceryList.map((existing, index) => {
          if (index === existingIndex) {
            return {
              ...existing,
              quantity: existing.quantity + item.quantity,
            };
          }
          return existing;
        });
      } else {
        // Add new item
        newGroceryList = [...state.groceryList, item];
      }
      
      // Save to localStorage
      try {
        localStorage.setItem('cookd_grocery_list', JSON.stringify(newGroceryList));
      } catch (error) {
        console.error('Error saving grocery list to localStorage:', error);
      }
      return { groceryList: newGroceryList };
    });
  },
  
  toggleGroceryItem: (id) => {
    set((state) => {
      const updatedList = state.groceryList.map((item) =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      );
      // Save to localStorage
      try {
        localStorage.setItem('cookd_grocery_list', JSON.stringify(updatedList));
      } catch (error) {
        console.error('Error saving grocery list to localStorage:', error);
      }
      return { groceryList: updatedList };
    });
  },
  
  deleteGroceryItem: (id) => {
    set((state) => {
      const updatedList = state.groceryList.filter((item) => item.id !== id);
      // Save to localStorage
      try {
        localStorage.setItem('cookd_grocery_list', JSON.stringify(updatedList));
      } catch (error) {
        console.error('Error saving grocery list to localStorage:', error);
      }
      return { groceryList: updatedList };
    });
  },
  
  savePost: (postId) => {
    set((state) => {
      const newSavedPosts = [...state.savedPosts, postId];
      // Save to localStorage
      try {
        localStorage.setItem('cookd_saved_posts', JSON.stringify(newSavedPosts));
      } catch (error) {
        console.error('Error saving saved posts to localStorage:', error);
      }
      return { savedPosts: newSavedPosts };
    });
  },
  
  unsavePost: (postId) => {
    set((state) => {
      const newSavedPosts = state.savedPosts.filter((id) => id !== postId);
      // Save to localStorage
      try {
        localStorage.setItem('cookd_saved_posts', JSON.stringify(newSavedPosts));
      } catch (error) {
        console.error('Error saving saved posts to localStorage:', error);
      }
      return { savedPosts: newSavedPosts };
    });
  },
  
  saveRecipe: (recipeId) => {
    set((state) => {
      const newSavedRecipes = [...state.savedRecipes, recipeId];
      // Save to localStorage
      try {
        localStorage.setItem('cookd_saved_recipes', JSON.stringify(newSavedRecipes));
      } catch (error) {
        console.error('Error saving saved recipes to localStorage:', error);
      }
      return { savedRecipes: newSavedRecipes };
    });
  },
  
  unsaveRecipe: (recipeId) => {
    set((state) => {
      const newSavedRecipes = state.savedRecipes.filter((id) => id !== recipeId);
      // Save to localStorage
      try {
        localStorage.setItem('cookd_saved_recipes', JSON.stringify(newSavedRecipes));
      } catch (error) {
        console.error('Error saving saved recipes to localStorage:', error);
      }
      return { savedRecipes: newSavedRecipes };
    });
  },
}));

