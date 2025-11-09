import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Clock } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { formatCurrency } from '../../lib/utils';
import type { Post, Recipe, User } from '../../types';

interface SearchAutocompleteProps {
  query: string;
  onSelect: (item: { type: 'post' | 'recipe' | 'user'; id: string }) => void;
  onClose: () => void;
  maxResults?: number;
}

export function SearchAutocomplete({
  query,
  onSelect,
  onClose,
  maxResults = 5,
}: SearchAutocompleteProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const posts = useAppStore((state) => state.posts);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Get suggestions based on query
  const suggestions = useMemo(() => {
    if (!query || query.length < 2) return { posts: [], recipes: [], users: [] };

    const queryLower = query.toLowerCase();
    const matchedPosts: Post[] = [];
    const matchedRecipes: Recipe[] = [];
    const matchedUsers: User[] = [];

    // Search posts
    posts.forEach((post) => {
      if (
        post.caption.toLowerCase().includes(queryLower) ||
        post.user.displayName.toLowerCase().includes(queryLower) ||
        post.user.username.toLowerCase().includes(queryLower) ||
        post.recipe?.title.toLowerCase().includes(queryLower) ||
        post.badges.some((badge) => badge.toLowerCase().includes(queryLower))
      ) {
        matchedPosts.push(post);
      }

      // Extract recipes from posts
      if (post.recipe) {
        if (
          post.recipe.title.toLowerCase().includes(queryLower) ||
          post.recipe.description?.toLowerCase().includes(queryLower) ||
          post.recipe.ingredients.some((ing) =>
            ing.name.toLowerCase().includes(queryLower)
          )
        ) {
          matchedRecipes.push(post.recipe);
        }
      }

      // Extract users from posts
      if (
        post.user.displayName.toLowerCase().includes(queryLower) ||
        post.user.username.toLowerCase().includes(queryLower)
      ) {
        if (!matchedUsers.find((u) => u.id === post.user.id)) {
          matchedUsers.push(post.user);
        }
      }
    });

    return {
      posts: matchedPosts.slice(0, maxResults),
      recipes: matchedRecipes.slice(0, maxResults),
      users: matchedUsers.slice(0, maxResults),
    };
  }, [query, posts, maxResults]);

  const allResults = [
    ...suggestions.posts.map((p) => ({ type: 'post' as const, id: p.id, data: p })),
    ...suggestions.recipes.map((r) => ({ type: 'recipe' as const, id: r.id, data: r })),
    ...suggestions.users.map((u) => ({ type: 'user' as const, id: u.id, data: u })),
  ].slice(0, maxResults);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, allResults.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && allResults[selectedIndex]) {
        e.preventDefault();
        onSelect({ type: allResults[selectedIndex].type, id: allResults[selectedIndex].id });
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    if (allResults.length > 0) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [allResults, selectedIndex, onSelect, onClose]);

  // Save to recent searches
  const handleSelect = (item: { type: 'post' | 'recipe' | 'user'; id: string }) => {
    if (query.trim()) {
      const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recent_searches', JSON.stringify(updated));
    }
    onSelect(item);
  };

  if (!query || query.length < 2) {
    // Show recent searches
    if (recentSearches.length === 0) return null;

    return (
      <div
        ref={containerRef}
        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 z-50 max-h-64 overflow-y-auto"
      >
        <div className="p-2">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
            Recent Searches
          </div>
          {recentSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => handleSelect({ type: 'post', id: '' })} // Will trigger search
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-left"
            >
              <Clock size={16} className="text-gray-400" />
              <span className="text-sm text-gray-700">{search}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (allResults.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto"
    >
      <div className="p-2">
        {suggestions.posts.length > 0 && (
          <>
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
              Posts
            </div>
            {suggestions.posts.slice(0, 3).map((post, index) => {
              const globalIndex = index;
              return (
                <button
                  key={post.id}
                  onClick={() => handleSelect({ type: 'post', id: post.id })}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedIndex === globalIndex ? 'bg-brand-teal/10' : 'hover:bg-gray-50'
                  }`}
                >
                  <Search size={16} className="text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {post.caption.substring(0, 50)}...
                    </p>
                    <p className="text-xs text-gray-500">by {post.user.displayName}</p>
                  </div>
                </button>
              );
            })}
          </>
        )}

        {suggestions.recipes.length > 0 && (
          <>
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase mt-2">
              Recipes
            </div>
            {suggestions.recipes.slice(0, 3).map((recipe, index) => {
              const globalIndex = suggestions.posts.length + index;
              return (
                <button
                  key={recipe.id}
                  onClick={() => handleSelect({ type: 'recipe', id: recipe.id })}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedIndex === globalIndex ? 'bg-brand-teal/10' : 'hover:bg-gray-50'
                  }`}
                >
                  <Search size={16} className="text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {recipe.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {recipe.servings} servings · {formatCurrency(recipe.costEstimate || 0)}/serving
                    </p>
                  </div>
                </button>
              );
            })}
          </>
        )}

        {suggestions.users.length > 0 && (
          <>
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase mt-2">
              Users
            </div>
            {suggestions.users.slice(0, 3).map((user, index) => {
              const globalIndex = suggestions.posts.length + suggestions.recipes.length + index;
              return (
                <button
                  key={user.id}
                  onClick={() => handleSelect({ type: 'user', id: user.id })}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedIndex === globalIndex ? 'bg-brand-teal/10' : 'hover:bg-gray-50'
                  }`}
                >
                  <Search size={16} className="text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{user.displayName}</p>
                    <p className="text-xs text-gray-500">@{user.username}</p>
                  </div>
                </button>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}


