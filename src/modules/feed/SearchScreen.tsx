import React, { useState, useMemo } from 'react';
import { Screen } from '../../components/layout/Screen';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { SearchBar } from '../../components/ui/SearchBar';
import { PostCard } from '../../components/social/PostCard';
import { RecipeTile } from '../../components/recipe/RecipeTile';
import { Avatar } from '../../components/media/Avatar';
import { EmptyState } from '../../components/ui/EmptyState';
import { DietFilterBar } from '../../components/filters/DietFilterBar';
import { TagFilterBar } from '../../components/filters/TagFilterBar';

type SearchTab = 'all' | 'posts' | 'recipes' | 'users';
type DietFilter = 'all' | 'vegan' | 'vegetarian' | 'pescatarian' | 'keto' | 'paleo' | 'halal' | 'kosher';

export const SearchScreen: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('all');
  const [dietFilter, setDietFilter] = useState<DietFilter>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const posts = useAppStore((state) => state.posts);

  // Get all recipes from posts
  const allRecipes = useMemo(() => {
    const recipeMap = new Map();
    posts.forEach((post) => {
      if (post.recipe) {
        recipeMap.set(post.recipe.id, post.recipe);
      }
    });
    return Array.from(recipeMap.values());
  }, [posts]);

  // Get all unique tags from posts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((post) => {
      post.badges.forEach((badge) => tagSet.add(badge));
    });
    return Array.from(tagSet);
  }, [posts]);

  // Get all users from posts
  const allUsers = useMemo(() => {
    const userMap = new Map();
    posts.forEach((post) => {
      userMap.set(post.user.id, post.user);
    });
    return Array.from(userMap.values());
  }, [posts]);

  // Search function
  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return {
        posts: [],
        recipes: [],
        users: [],
      };
    }

    const lowerQuery = query.toLowerCase();

    // Search posts
    const filteredPosts = posts.filter((post) => {
      const matchesQuery =
        post.caption.toLowerCase().includes(lowerQuery) ||
        post.user.displayName.toLowerCase().includes(lowerQuery) ||
        post.recipe?.title.toLowerCase().includes(lowerQuery) ||
        post.badges.some((badge) => badge.toLowerCase().includes(lowerQuery));
      
      const matchesDiet = dietFilter === 'all' || 
        (post.recipe?.tags?.includes(dietFilter) ?? false);
      
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some((tag) => post.badges.includes(tag));

      return matchesQuery && matchesDiet && matchesTags;
    });

    // Search recipes
    const filteredRecipes = allRecipes.filter((recipe) => {
      const matchesQuery =
        recipe.title.toLowerCase().includes(lowerQuery) ||
        recipe.description.toLowerCase().includes(lowerQuery) ||
        recipe.ingredients.some((ing: { name: string }) =>
          ing.name.toLowerCase().includes(lowerQuery)
        );
      
      const matchesDiet = dietFilter === 'all' ||
        (recipe.tags?.includes(dietFilter) ?? false);

      return matchesQuery && matchesDiet;
    });

    // Search users
    const filteredUsers = allUsers.filter((user) => {
      return (
        user.displayName.toLowerCase().includes(lowerQuery) ||
        user.username.toLowerCase().includes(lowerQuery) ||
        (user.bio && user.bio.toLowerCase().includes(lowerQuery))
      );
    });

    return {
      posts: filteredPosts,
      recipes: filteredRecipes,
      users: filteredUsers,
    };
  }, [query, posts, allRecipes, allUsers, dietFilter, selectedTags]);

  const tabs: { key: SearchTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: searchResults.posts.length + searchResults.recipes.length + searchResults.users.length },
    { key: 'posts', label: 'Posts', count: searchResults.posts.length },
    { key: 'recipes', label: 'Recipes', count: searchResults.recipes.length },
    { key: 'users', label: 'Users', count: searchResults.users.length },
  ];

  const showResults = () => {
    if (activeTab === 'all') {
      return (
        <div className="space-y-6">
          {searchResults.posts.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Posts</h3>
              <div className="space-y-0">
                {searchResults.posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}
          {searchResults.recipes.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Recipes</h3>
              <div className="space-y-2">
                {searchResults.recipes.map((recipe) => (
                  <RecipeTile key={recipe.id} recipe={recipe} showStats />
                ))}
              </div>
            </div>
          )}
          {searchResults.users.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Users</h3>
              <div className="space-y-2">
                {searchResults.users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => navigate(`/user/${user.id}`)}
                    className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:border-brand-sage transition-colors touch-target"
                  >
                    <Avatar src={user.avatar} initials={user.displayName[0]} size={40} />
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-sm text-slate-900">{user.displayName}</p>
                      <p className="text-xs text-slate-600">@{user.username}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'posts') {
      if (searchResults.posts.length === 0) {
        return (
          <EmptyState
            title="No posts found"
            description={`No posts match "${query}". Try adjusting your search or filters.`}
            icon="📝"
          />
        );
      }
      return (
        <div className="space-y-0">
          {searchResults.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      );
    }

    if (activeTab === 'recipes') {
      if (searchResults.recipes.length === 0) {
        return (
          <EmptyState
            title="No recipes found"
            description={`No recipes match "${query}". Try a different search term or adjust your filters.`}
            icon="🍳"
          />
        );
      }
      return (
        <div className="space-y-2">
          {searchResults.recipes.map((recipe) => (
            <RecipeTile key={recipe.id} recipe={recipe} showStats />
          ))}
        </div>
      );
    }

    if (activeTab === 'users') {
      if (searchResults.users.length === 0) {
        return (
          <EmptyState
            title="No users found"
            description={`No users match "${query}". Try searching by username or display name.`}
            icon="👤"
          />
        );
      }
      return (
        <div className="space-y-2">
          {searchResults.users.map((user) => (
            <button
              key={user.id}
              onClick={() => navigate(`/user/${user.id}`)}
              className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:border-brand-sage transition-colors touch-target"
            >
              <Avatar src={user.avatar} initials={user.displayName[0]} size={40} />
              <div className="flex-1 text-left">
                <p className="font-semibold text-sm text-slate-900">{user.displayName}</p>
                <p className="text-xs text-slate-600">@{user.username}</p>
                {user.bio && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{user.bio}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <Screen>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 safe-area-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <button 
            className="p-2 -ml-2 touch-target" 
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Search posts, recipes, users..."
              autoFocus
            />
          </div>
        </div>
      </header>

      {query && (
        <>
          {/* Filters */}
          <div className="px-4 py-3 bg-white border-b border-gray-200 space-y-3">
            <DietFilterBar value={dietFilter} onChange={setDietFilter} />
            {allTags.length > 0 && (
              <TagFilterBar
                tags={allTags}
                selectedTags={selectedTags}
                onChange={setSelectedTags}
              />
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-white">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 text-center text-sm font-medium border-b-2 transition-colors touch-target ${
                  activeTab === tab.key
                    ? 'border-brand-teal text-brand-teal'
                    : 'border-transparent text-slate-600'
                }`}
              >
                {tab.label} {tab.count > 0 && `(${tab.count})`}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Results */}
      <div className="px-4 py-4">
        {!query ? (
          <EmptyState
            title="Start searching"
            description="Search for posts, recipes, or users to discover new content"
            icon="🔍"
          />
        ) : (
          showResults()
        )}
      </div>
    </Screen>
  );
};

