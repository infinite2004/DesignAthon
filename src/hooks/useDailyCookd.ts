import { useState, useEffect } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useAppStore } from '../store/appStore';

export interface DailyCookdStats {
  hasPostedToday: boolean;
  streak: number;
  timeRemaining: number | null;
  lastPostDate: string | null;
}

export function useDailyCookd(): DailyCookdStats {
  const { user } = useAuth();
  const posts = useAppStore((state) => state.posts);
  const [hasPostedToday, setHasPostedToday] = useState(false);
  const [streak, setStreak] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [lastPostDate, setLastPostDate] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const updateStats = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayEnd = new Date(today);
      todayEnd.setHours(23, 59, 59, 999);

      // Check if user has posted today
      const todayPosts = posts.filter(post => {
        if (post.userId !== user.id) return false;
        const postDate = new Date(post.createdAt);
        return postDate >= today && postDate <= todayEnd;
      });

      const postedToday = todayPosts.length > 0;
      setHasPostedToday(postedToday);

      // Get last post date
      const userPosts = posts
        .filter(p => p.userId === user.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      if (userPosts.length > 0) {
        const lastPost = userPosts[0];
        const lastDate = new Date(lastPost.createdAt);
        setLastPostDate(lastDate.toDateString());
      }

      // Calculate streak
      if (userPosts.length === 0) {
        setStreak(0);
      } else {
        let currentStreak = 0;
        const postsByDate = new Map<string, boolean>();
        
        userPosts.forEach(post => {
          const postDate = new Date(post.createdAt);
          postDate.setHours(0, 0, 0, 0);
          const dateKey = postDate.toDateString();
          if (!postsByDate.has(dateKey)) {
            postsByDate.set(dateKey, true);
          }
        });

        let checkDate = new Date(today);
        while (postsByDate.has(checkDate.toDateString())) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        }
        
        setStreak(currentStreak);
      }

      // Calculate time remaining if not posted today
      if (!postedToday) {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        const remaining = Math.floor((midnight.getTime() - now.getTime()) / 1000);
        setTimeRemaining(remaining > 0 ? remaining : 0);
      } else {
        setTimeRemaining(null);
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 1000); // Update every second

    return () => clearInterval(interval);
  }, [posts, user]);

  return {
    hasPostedToday,
    streak,
    timeRemaining,
    lastPostDate,
  };
}

