import { useAppStore } from '../store/appStore';

export function usePostActions() {
  const likePost = useAppStore((state) => state.likePost);

  return {
    likePost,
    isLoading: false,
  };
}

