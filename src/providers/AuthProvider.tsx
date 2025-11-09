import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, extraProfile?: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Bootstrap auth on mount
  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        setLoading(true);
        // Check localStorage for existing auth
        const storedUser = localStorage.getItem('mock_auth_user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Ensure required fields are set
          if (!parsedUser.displayName) {
            parsedUser.displayName = parsedUser.username || 'User';
          }
          if (!parsedUser.username) {
            parsedUser.username = 'user';
          }
          if (!parsedUser.badges) {
            parsedUser.badges = [];
          }
          setUser(parsedUser);
        }
      } catch (err) {
        console.error('Auth bootstrap error:', err);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const login = async (_email: string, _password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock login - in production, call API
      // For now, create/use mock user
      const mockUser: User = {
        id: '1',
        username: _email.split('@')[0],
        displayName: _email.split('@')[0],
        avatar: undefined,
        bio: undefined,
        followers: 0,
        following: 0,
        mealsShared: 0,
        wasteReduced: 0,
        avgCostPerServing: 0,
        badges: [],
      };

      localStorage.setItem('mock_auth_user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (_email: string, _password: string, extraProfile?: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock signup - in production, call API
      const mockUser: User = {
        id: crypto.randomUUID(),
        username: extraProfile?.username || _email.split('@')[0],
        displayName: extraProfile?.displayName || _email.split('@')[0],
        avatar: extraProfile?.avatar,
        bio: extraProfile?.bio,
        followers: 0,
        following: 0,
        mealsShared: 0,
        wasteReduced: 0,
        avgCostPerServing: 0,
        badges: [],
        ...extraProfile,
      };

      localStorage.setItem('mock_auth_user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      localStorage.removeItem('mock_auth_user');
      setUser(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const updatedUser = { ...user, ...updates };
      localStorage.setItem('mock_auth_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Update failed';
      setError(errorMessage);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

