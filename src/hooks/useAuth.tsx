import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiGet, apiPost } from '../api/client';
import { useAuthStore, AuthUser } from '../state/authStore';

type MeResponse = { user: AuthUser | null };

// Development mode: use mock auth if API is not available
const USE_MOCK_AUTH = import.meta.env.DEV; // Use mock in development

function getStoredUser(): AuthUser | null {
  try {
    const stored = localStorage.getItem('mock_auth_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function storeUser(user: AuthUser | null) {
  if (user) {
    localStorage.setItem('mock_auth_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('mock_auth_user');
  }
}

export function useBootstrapAuth() {
  const { setUser, setLoading } = useAuthStore();

  const { data, isLoading, isError } = useQuery<MeResponse>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      if (USE_MOCK_AUTH) {
        // Check localStorage for mock user
        const mockUser = getStoredUser();
        return { user: mockUser };
      }
      return apiGet<MeResponse>('/auth/me');
    },
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setUser(data.user);
      setLoading(false);
    } else if (isError) {
      // If auth check fails, check for mock user in dev mode
      if (USE_MOCK_AUTH) {
        const mockUser = getStoredUser();
        setUser(mockUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    } else if (!isLoading) {
      setLoading(false);
    }
  }, [data, isLoading, isError, setUser, setLoading]);
}

export function useAuth() {
  const { user, isLoading, setUser } = useAuthStore();

  async function login(email: string, password: string) {
    if (USE_MOCK_AUTH) {
      // Mock login - accept any email/password in dev mode
      const mockUser: AuthUser = {
        id: 'mock-user-1',
        name: email.split('@')[0] || 'User',
        username: email.split('@')[0] || 'user',
        avatarUrl: null,
      };
      storeUser(mockUser);
      setUser(mockUser);
      return;
    }

    try {
      const res = await apiPost<{ user: AuthUser }>('/auth/login', {
        email,
        password,
      });
      setUser(res.user);
    } catch (error: any) {
      throw new Error(error?.message || 'Login failed');
    }
  }

  async function signup(name: string, email: string, password: string) {
    if (USE_MOCK_AUTH) {
      // Mock signup - create user from form data
      const mockUser: AuthUser = {
        id: `mock-user-${Date.now()}`,
        name: name || email.split('@')[0],
        username: email.split('@')[0] || 'user',
        avatarUrl: null,
      };
      storeUser(mockUser);
      setUser(mockUser);
      return;
    }

    try {
      const res = await apiPost<{ user: AuthUser }>('/auth/signup', {
        name,
        email,
        password,
      });
      setUser(res.user);
    } catch (error: any) {
      throw new Error(error?.message || 'Signup failed');
    }
  }

  async function logout() {
    if (USE_MOCK_AUTH) {
      storeUser(null);
      setUser(null);
      return;
    }

    try {
      await apiPost('/auth/logout', {});
    } catch (error) {
      // Even if logout fails, clear local state
    } finally {
      setUser(null);
    }
  }

  return { user, isLoading, login, signup, logout };
}

