import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ChevronRight, Minimize2, Send } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/forms/TextField';
import { cn } from '../../lib/utils';
import type { Recipe } from '../../types';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
};

export function PantryOverviewScreen() {
  const navigate = useNavigate();
  const inventory = useAppStore((state) => state.inventory);
  const mealPlan = useAppStore((state) => state.mealPlan);
  const posts = useAppStore((state) => state.posts);
  const savedRecipes = useAppStore((state) => state.savedRecipes);
  const [chatInput, setChatInput] = useState('');
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const favoritesScrollRef = useRef<HTMLDivElement>(null);

  const expiringSoon = useMemo(() => {
    return inventory.filter(item => {
      if (!item.expiryDate) return false;
      const daysUntil = Math.floor(
        (new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return daysUntil <= 7 && daysUntil >= 0;
    });
  }, [inventory]);

  // Calculate meals left this week from meal plan
  const mealsLeftThisWeek = useMemo(() => {
    const today = new Date();
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
    
    return mealPlan.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= today && entryDate <= endOfWeek && !entry.cookedAt;
    }).length;
  }, [mealPlan]);

  // Get sample inventory items for preview
  const inventoryPreview = useMemo(() => {
    return inventory.slice(0, 6);
  }, [inventory]);

  // Get saved recipes from posts
  const favoriteRecipes = useMemo(() => {
    const recipes: (Recipe & { postId?: string })[] = [];
    
    // Get recipes from posts that have recipes
    // savedRecipes contains recipe IDs
    posts.forEach(post => {
      if (post.recipe && savedRecipes.includes(post.recipe.id)) {
        recipes.push({
          ...post.recipe,
          postId: post.id,
        });
      }
    });

    // If we have no saved recipes, show some sample recipes from posts with recipes
    if (recipes.length === 0) {
      const postsWithRecipes = posts.filter(p => p.recipe).slice(0, 5);
      postsWithRecipes.forEach(post => {
        if (post.recipe) {
          recipes.push({
            ...post.recipe,
            postId: post.id,
          });
        }
      });
    }

    // Always show at least 5 items for the horizontal scroll to work properly
    const defaultRecipes = [
      {
        id: 'sample-1',
        title: 'Pasta Primavera',
        description: 'Fresh vegetables with pasta',
        ingredients: [],
        steps: [],
        servings: 4,
        prepTime: 15,
        cookTime: 20,
        costEstimate: 3.50,
        tags: ['vegetarian', 'quick'],
        reCookCount: 0,
        createdAt: new Date(),
      },
      {
        id: 'sample-2',
        title: 'Chicken Curry',
        description: 'Spicy and flavorful',
        ingredients: [],
        steps: [],
        servings: 4,
        prepTime: 20,
        cookTime: 30,
        costEstimate: 5.00,
        tags: ['spicy', 'comfort'],
        reCookCount: 0,
        createdAt: new Date(),
      },
      {
        id: 'sample-3',
        title: 'Veggie Stir Fry',
        description: 'Quick and healthy',
        ingredients: [],
        steps: [],
        servings: 3,
        prepTime: 10,
        cookTime: 15,
        costEstimate: 4.00,
        tags: ['healthy', 'quick'],
        reCookCount: 0,
        createdAt: new Date(),
      },
      {
        id: 'sample-4',
        title: 'Beef Tacos',
        description: 'Classic Mexican flavors',
        ingredients: [],
        steps: [],
        servings: 4,
        prepTime: 15,
        cookTime: 20,
        costEstimate: 6.00,
        tags: ['mexican', 'comfort'],
        reCookCount: 0,
        createdAt: new Date(),
      },
      {
        id: 'sample-5',
        title: 'Salmon Bowl',
        description: 'Healthy and protein-packed',
        ingredients: [],
        steps: [],
        servings: 2,
        prepTime: 10,
        cookTime: 15,
        costEstimate: 7.50,
        tags: ['healthy', 'protein'],
        reCookCount: 0,
        createdAt: new Date(),
      },
    ];
    
    return recipes.length > 0 ? recipes : defaultRecipes;
  }, [posts, savedRecipes]);

  // Scroll to bottom when chat expands or new message added
  useEffect(() => {
    if (isChatExpanded && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isChatExpanded, chatMessages]);

  // Expand chat when user starts typing
  useEffect(() => {
    if (chatInput.trim().length > 0 && !isChatExpanded) {
      setIsChatExpanded(true);
    }
  }, [chatInput, isChatExpanded]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: chatInput,
      createdAt: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Based on your pantry with ${inventory.length} items, I can suggest some great recipes! Would you like me to generate a recipe using your available ingredients?`,
        createdAt: new Date(),
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const handleSurpriseMe = () => {
    navigate('/chef/ai-recipes', {
      state: {
        surpriseMe: true,
        surpriseKey: Date.now(),
      },
    });
  };

  const handleMinimizeChat = () => {
    setIsChatExpanded(false);
    setChatInput('');
  };

  return (
    <Screen background="default">
      <div className="min-h-screen pb-32 safe-area-bottom">
        {/* Header */}
        <div className="px-4 pt-4 pb-2">
          <h1 className="text-2xl font-bold text-brand-brown">Cookd assistant</h1>
        </div>

        {/* Summary Statistics */}
        <div className="px-4 py-4">
          <div className="bg-brand-sage/30 rounded-2xl p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-brand-brown mb-1">{inventory.length}</p>
                <p className="text-xs text-brand-sage">items in stock</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-brand-brown mb-1">{expiringSoon.length}</p>
                <p className="text-xs text-brand-sage">items expiring</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-brand-brown mb-1">{mealsLeftThisWeek}</p>
                <p className="text-xs text-brand-sage">meals left this week</p>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Preview */}
        {inventory.length > 0 && (
          <div className="px-4 py-4">
            <div className="bg-brand-bg rounded-2xl p-4">
              <div 
                className="flex gap-3 overflow-x-auto overflow-y-hidden pb-2 scrollbar-hide"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch',
                  scrollBehavior: 'smooth'
                }}
              >
                {inventoryPreview.map((item) => (
                  <div key={item.id} className="flex-shrink-0 flex-grow-0 text-center w-16">
                    <div className="w-16 h-16 bg-brand-sage/30 rounded-xl mb-2 flex items-center justify-center">
                      <span className="text-2xl">🥕</span>
                    </div>
                    <p className="text-xs font-medium text-brand-brown mb-1 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-brand-sage">{item.quantity} {item.unit}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/chef')}
                className="flex items-center justify-center gap-1 text-sm font-medium text-brand-brown mt-3 w-full"
              >
                go to inventory
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Favorite Recipes */}
        <div className="px-4 py-4">
          <div className="bg-brand-bg rounded-2xl p-4">
            <div className="relative w-full">
              <div 
                ref={favoritesScrollRef}
                className="flex gap-3"
                style={{
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch',
                  scrollBehavior: 'smooth',
                  touchAction: 'pan-x',
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'nowrap',
                  position: 'relative'
                }}
              >
                {favoriteRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    onClick={() => {
                      if (recipe.postId) {
                        navigate(`/post/${recipe.postId}`);
                      } else {
                        navigate(`/recipe/${recipe.id}`, { state: { recipe } });
                      }
                    }}
                    className="text-center cursor-pointer select-none"
                    style={{ 
                      width: '80px',
                      minWidth: '80px',
                      flexShrink: 0,
                      flexGrow: 0
                    }}
                  >
                    <div className="w-16 h-16 bg-brand-sage/30 rounded-xl mb-2 flex items-center justify-center relative overflow-hidden mx-auto">
                      {/* Grid pattern background - 2x2 grid */}
                      <div className="absolute inset-0 grid grid-cols-2 gap-0.5 p-1 opacity-60">
                        <div className="bg-brand-bg/50 rounded-sm border border-brand-sage/20"></div>
                        <div className="bg-brand-bg/50 rounded-sm border border-brand-sage/20"></div>
                        <div className="bg-brand-bg/50 rounded-sm border border-brand-sage/20"></div>
                        <div className="bg-brand-bg/50 rounded-sm border border-brand-sage/20"></div>
                      </div>
                      {/* Center circle */}
                      <div className="w-8 h-8 bg-brand-sage rounded-full z-10 relative"></div>
                    </div>
                    <p className="text-xs font-medium text-brand-brown mb-1">
                      favorites
                    </p>
                    <p className="text-xs text-brand-sage">
                      {favoriteRecipes.length} {favoriteRecipes.length === 1 ? 'recipe' : 'recipes'}
                    </p>
                  </div>
                ))}
              </div>
              <style>{`
                div[style*="overflowX"]::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
            </div>
          </div>
        </div>

        {/* What do you want to eat? Section */}
        <div className="px-4 py-4">
          <h2 className="text-lg font-bold text-brand-teal mb-1">What do you want to eat?</h2>
          <p className="text-sm text-brand-sage mb-4">Ask for recipes you want to try.</p>
          
          <div className="flex gap-2 mb-4">
            <Button
              variant="primary"
              onClick={handleSurpriseMe}
              className="bg-brand-sage text-brand-bg rounded-xl px-4 py-2"
            >
              Surprise Me!
            </Button>
            <div className="flex gap-2">
              {['Quick', 'Healthy', 'Budget'].map((tag) => (
                <button
                  key={tag}
                  className="px-3 py-2 bg-brand-sage/30 text-slate-800 rounded-xl text-xs font-medium"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input - Expandable */}
          <div
            ref={chatContainerRef}
            className={cn(
              "bg-white border-2 border-slate-300 rounded-2xl transition-all duration-300 ease-in-out overflow-hidden",
              isChatExpanded ? "h-96" : "h-12"
            )}
          >
            {isChatExpanded ? (
              <div className="flex flex-col h-full">
                {/* Chat Header */}
                <div className="flex items-center justify-between p-3 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-teal/20 flex items-center justify-center">
                      <Sparkles size={16} className="text-brand-teal" />
                    </div>
                    <span className="text-sm font-semibold text-slate-800">Cookd Assistant</span>
                  </div>
                  <button
                    onClick={handleMinimizeChat}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Minimize chat"
                  >
                    <Minimize2 size={18} className="text-gray-600" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.length === 0 && (
                    <div className="text-center text-sm text-gray-500 py-8">
                      <Sparkles size={24} className="mx-auto mb-2 text-brand-teal opacity-50" />
                      <p>Start a conversation with your cooking assistant!</p>
                    </div>
                  )}
                  {chatMessages.map((message) => {
                    const isUser = message.role === 'user';
                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex",
                          isUser ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[80%] rounded-2xl p-3",
                            isUser
                              ? "bg-brand-teal text-white"
                              : "bg-gray-100 text-slate-800"
                          )}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <TextField
                      value={chatInput}
                      onChange={setChatInput}
                      placeholder="Type your message..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="flex-1"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim()}
                      className="p-2 bg-brand-teal text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed touch-target"
                      aria-label="Send message"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center px-4">
                <TextField
                  value={chatInput}
                  onChange={setChatInput}
                  placeholder="start typing"
                  className="flex-1 border-0 focus:ring-0"
                  onFocus={() => setIsChatExpanded(true)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Screen>
  );
}
