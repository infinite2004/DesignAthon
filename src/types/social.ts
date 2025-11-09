export type ReactionType = 'cooked' | 'youre_cooked' | 'like';

export interface Reaction {
  id: string;
  postId: string;
  userId: string;
  type: ReactionType;
  createdAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  content: string;
  createdAt: Date;
  parentId?: string; // For nested replies
}

export type FeedType = 'home' | 'discover';

// Re-export Post and User from main types
export type { Post, User } from './index';
