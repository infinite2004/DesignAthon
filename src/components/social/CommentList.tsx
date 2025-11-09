import React from 'react';
import type { Comment } from '../../types';
import { Avatar } from '../media/Avatar';
import { formatTimeAgo } from '../../lib/utils';

type CommentListProps = {
  comments?: Comment[];
  postId?: string;
};

export const CommentList: React.FC<CommentListProps> = ({ comments = [] }) => {
  if (comments.length === 0) {
    return <p className="text-xs text-slate-400 px-4 py-2">Be the first to comment.</p>;
  }

  return (
    <ul className="space-y-2 px-4">
      {comments.map((comment) => (
        <li key={comment.id} className="flex gap-2">
          <Avatar 
            src={comment.user.avatar} 
            initials={comment.user.displayName ? comment.user.displayName.split(' ').map(n => n[0]).join('').toUpperCase() : comment.user.username?.charAt(0).toUpperCase() || 'U'} 
            size={28} 
          />
          <div className="flex-1 rounded-2xl bg-slate-50 px-3 py-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-slate-900">{comment.user.displayName || comment.user.username || 'User'}</span>
              <span className="text-xs text-slate-400">{formatTimeAgo(comment.createdAt)}</span>
            </div>
            <div className="text-xs text-slate-700">{comment.content}</div>
          </div>
        </li>
      ))}
    </ul>
  );
};

