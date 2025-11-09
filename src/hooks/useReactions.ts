import { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { useAuth } from '../providers/AuthProvider';
import type { Reaction, ReactionType } from '../types/social';

export function useReactions(postId: string) {
  const { user } = useAuth();
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const likePost = useAppStore((state) => state.likePost);
  const reCookPost = useAppStore((state) => state.reCookPost);
  const post = useAppStore((state) => state.posts.find(p => p.id === postId));

  useEffect(() => {
    // Load reactions from store or localStorage
    // For now, create mock reactions from post data
    const mockReactions: Reaction[] = [];
    
    if (post?.isLiked && user) {
      mockReactions.push({
        id: crypto.randomUUID(),
        postId,
        userId: user.id,
        type: 'like',
        createdAt: new Date(),
      });
    }
    
    setReactions(mockReactions);
  }, [postId, post, user]);

  const react = (type: ReactionType) => {
    if (!user) return;
    
    if (type === 'like') {
      likePost(postId);
    } else if (type === 'cooked') {
      // Handle re-cook - increment count
      if (post) {
        reCookPost(postId);
      }
    } else if (type === 'youre_cooked') {
      // Handle "you're cooked" - just a reaction, no navigation
      // This is just a visual reaction
    }
    
    // Add reaction to local state
    const newReaction: Reaction = {
      id: crypto.randomUUID(),
      postId,
      userId: user.id,
      type,
      createdAt: new Date(),
    };
    
    setReactions(prev => {
      // Remove existing reaction from this user of the same type
      const filtered = prev.filter(r => r.userId !== newReaction.userId || r.type !== type);
      return [...filtered, newReaction];
    });
  };

  return { reactions, react };
}

