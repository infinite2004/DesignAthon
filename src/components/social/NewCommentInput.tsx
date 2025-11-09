import { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { useAuth } from '../../providers/AuthProvider';
import { useToast } from '../ui/ToastContext';
import { Send } from 'lucide-react';
import type { Comment } from '../../types';

type NewCommentInputProps = {
  postId: string;
};

export const NewCommentInput: React.FC<NewCommentInputProps> = ({ postId }) => {
  const [value, setValue] = useState('');
  const { showToast } = useToast();
  const { user } = useAuth();
  const addComment = useAppStore((state) => state.addComment);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim() || !user) return;

    const comment: Comment = {
      id: crypto.randomUUID(),
      postId,
      userId: user.id,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        mealsShared: user.mealsShared,
        wasteReduced: user.wasteReduced,
        avgCostPerServing: user.avgCostPerServing,
        badges: user.badges,
      },
      content: value.trim(),
      createdAt: new Date(),
    };

    addComment(comment);
    setValue('');
    showToast('Comment posted! 💬', 'success');
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-100 pt-2 px-4 pb-4">
      <input
        className="flex-1 rounded-full bg-slate-50 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-teal"
        placeholder="Add a comment..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="p-2 text-brand-teal disabled:text-gray-400 touch-target"
        aria-label="Post comment"
      >
        <Send size={18} />
      </button>
    </form>
  );
};

