import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiPost, apiDelete } from '../../api/client';
import { useToast } from '../ui/ToastContext';
import { UserPlus, UserCheck } from 'lucide-react';

type FollowButtonProps = {
  userId: string;
  isFollowing: boolean;
};

export const FollowButton: React.FC<FollowButtonProps> = ({ userId, isFollowing }) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: () =>
      isFollowing ? apiDelete(`/social/follow/${userId}`) : apiPost(`/social/follow/${userId}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      showToast(isFollowing ? 'Unfollowed' : 'Following', 'success');
    },
    onError: () => {
      showToast('Could not update follow state', 'error');
    },
  });

  return (
    <button
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium touch-target transition-colors ${
        isFollowing 
          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
          : 'bg-brand-teal text-white hover:bg-brand-teal/90'
      } disabled:opacity-50`}
    >
      {isFollowing ? (
        <>
          <UserCheck size={16} />
          <span>Following</span>
        </>
      ) : (
        <>
          <UserPlus size={16} />
          <span>Follow</span>
        </>
      )}
    </button>
  );
};

