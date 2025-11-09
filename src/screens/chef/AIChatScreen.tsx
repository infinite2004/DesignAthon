import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import { Screen } from '../../components/layout/Screen';
import { TextField } from '../../components/forms/TextField';
import { Chip } from '../../components/forms/Chip';
import { Avatar } from '../../components/media/Avatar';
import { formatTimeAgo } from '../../lib/utils';
import { useAuth } from '../../providers/AuthProvider';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
};

const quickChips = [
  'Cheap meals',
  'Use only fridge',
  'Meal prep for 3 days',
  'Quick dinner ideas',
  'Vegetarian options',
];

export function AIChatScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your AI cooking assistant. What would you like to cook today?',
      createdAt: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Based on your pantry, I recommend trying a simple pasta dish. Would you like me to generate a recipe?`,
        createdAt: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const handleQuickChip = (chip: string) => {
    setInput(chip);
  };

  return (
    <Screen>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 touch-target"
            aria-label="Back"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-teal" />
            <h1 className="text-sm font-semibold text-teal">AI Assistant</h1>
          </div>
          <div className="w-8" />
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isUser = message.role === 'user';
          
          return (
            <div
              key={message.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-start gap-2 max-w-[80%]">
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={16} className="text-teal" />
                  </div>
                )}
                <div
                  className={`rounded-2xl p-3 ${
                    isUser
                      ? 'bg-teal text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${isUser ? 'text-white/70' : 'text-gray-500'}`}>
                    {formatTimeAgo(message.createdAt)}
                  </p>
                </div>
                {isUser && user && (
                  <Avatar
                    src={user.avatar}
                    initials={user.displayName[0]}
                    size={32}
                  />
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Chips */}
      {input === '' && (
        <div className="px-4 py-2 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {quickChips.map((chip) => (
              <Chip
                key={chip}
                label={chip}
                selected={false}
                onClick={() => handleQuickChip(chip)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-gray-200 safe-area-bottom">
        <div className="flex items-center gap-2">
          <TextField
            value={input}
            onChange={setInput}
            placeholder="Ask me anything..."
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
            disabled={!input.trim()}
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

