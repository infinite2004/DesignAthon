import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import { useAuth } from '../../providers/AuthProvider';
import { useAppStore } from '../../store/appStore';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/forms/TextField';
import { formatTimeAgo } from '../../lib/utils';
import type { DMMessage } from '../../types/chef';

export function RecipeRequestDMThreadScreen() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const posts = useAppStore((state) => state.posts);
  const post = posts.find(p => p.id === postId);
  
  const [messages, setMessages] = useState<DMMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showAIFormat, setShowAIFormat] = useState(false);
  const [aiFormattedRecipe, setAIFormattedRecipe] = useState<{ ingredients: string[]; steps: string[] } | null>(null);

  useEffect(() => {
    // Load messages from store or API
    // For now, create initial message
    if (post && user && post.userId !== user.id) {
      setMessages([{
        id: '1',
        threadId: `thread-${postId}`,
        senderId: user.id,
        content: `Hi! Could you share the recipe for "${post.caption.substring(0, 50)}..."?`,
        createdAt: new Date(),
      }]);
    }
  }, [postId, post, user]);

  const handleSend = () => {
    if (!newMessage.trim() || !user) return;

    const message: DMMessage = {
      id: crypto.randomUUID(),
      threadId: `thread-${postId}`,
      senderId: user.id,
      content: newMessage,
      createdAt: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleAIFormat = () => {
    // Simulate AI formatting
    setShowAIFormat(true);
    setTimeout(() => {
      setAIFormattedRecipe({
        ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'],
        steps: ['Step 1: Do this', 'Step 2: Then that', 'Step 3: Finally this'],
      });
    }, 2000);
  };

  const handleAcceptAIRecipe = () => {
    if (!aiFormattedRecipe || !post) return;
    
    // Send formatted recipe back
    const recipeMessage: DMMessage = {
      id: crypto.randomUUID(),
      threadId: `thread-${postId}`,
      senderId: post.userId,
      content: 'Here\'s the formatted recipe:',
      recipeDraft: aiFormattedRecipe,
      createdAt: new Date(),
    };

    setMessages([...messages, recipeMessage]);
    setShowAIFormat(false);
    setAIFormattedRecipe(null);
  };

  if (!post) {
    return (
      <Screen>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">Post not found</p>
        </div>
      </Screen>
    );
  }

  const isCreator = user?.id === post.userId;

  return (
    <Screen>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 touch-target"
            aria-label="Back"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-sm font-semibold text-teal">Recipe Request</h1>
          <div className="w-8" />
        </div>
      </header>

      {/* Post Preview */}
      <div className="p-4 bg-beige border-b border-gray-200">
        <div className="flex items-center gap-3">
          {post.media[0] && (
            <img
              src={post.media[0]}
              alt={post.caption}
              className="w-16 h-16 rounded-xl object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 line-clamp-2">
              {post.caption}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              by {post.user.displayName}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwn = message.senderId === user?.id;
          
          return (
            <div
              key={message.id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-3 ${
                  isOwn
                    ? 'bg-teal text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {message.recipeDraft && (
                  <div className="mt-2 p-2 bg-white/20 rounded-lg">
                    <p className="text-xs font-semibold mb-1">Recipe:</p>
                    <ul className="text-xs space-y-1">
                      {message.recipeDraft.ingredients.map((ing, i) => (
                        <li key={i}>• {ing}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="text-xs opacity-70 mt-1">
                  {formatTimeAgo(message.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Format Button (for creator) */}
      {isCreator && !showAIFormat && (
        <div className="px-4 py-2 border-t border-gray-200">
          <Button
            variant="ghost"
            fullWidth
            onClick={handleAIFormat}
            iconLeft={<Sparkles size={18} />}
            className="text-teal"
          >
            Let AI format my recipe
          </Button>
        </div>
      )}

      {/* AI Formatting Preview */}
      {showAIFormat && aiFormattedRecipe && (
        <div className="px-4 py-4 bg-beige border-t border-gray-200 space-y-3">
          <h4 className="font-semibold text-sm">AI Formatted Recipe</h4>
          <div className="bg-white rounded-xl p-3 space-y-2">
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">Ingredients:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                {aiFormattedRecipe.ingredients.map((ing, i) => (
                  <li key={i}>• {ing}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">Steps:</p>
              <ol className="text-xs text-gray-600 space-y-1">
                {aiFormattedRecipe.steps.map((step, i) => (
                  <li key={i}>{i + 1}. {step}</li>
                ))}
              </ol>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              fullWidth
              onClick={() => {
                setShowAIFormat(false);
                setAIFormattedRecipe(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleAcceptAIRecipe}
            >
              Send Recipe
            </Button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-gray-200 safe-area-bottom">
        <div className="flex items-center gap-2">
          <TextField
            value={newMessage}
            onChange={setNewMessage}
            placeholder="Type a message..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="p-2 bg-teal text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed touch-target"
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </Screen>
  );
}

