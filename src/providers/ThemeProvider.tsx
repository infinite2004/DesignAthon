import { createContext, useContext, useState, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark';

type ThemeColors = {
  // Brand colors
  beige: string;
  mustard: string;
  sage: string;
  teal: string;
  
  // Semantic colors
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
};

const lightTheme: ThemeColors = {
  beige: '#FFF6EB',
  mustard: '#FFD07B',
  sage: '#7EB09B',
  teal: '#00635D',
  background: '#FFF6EB',
  surface: '#FFFFFF',
  text: '#4C2719',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
};

const darkTheme: ThemeColors = {
  beige: '#1F2937',
  mustard: '#FCD34D',
  sage: '#6EE7B7',
  teal: '#14B8A6',
  background: '#111827',
  surface: '#1F2937',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#374151',
  error: '#F87171',
  success: '#34D399',
  warning: '#FBBF24',
};

type ThemeContextType = {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');
  
  const colors = mode === 'light' ? lightTheme : darkTheme;
  
  const toggleMode = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ mode, colors, toggleMode, setMode }}>
      <div 
        className={mode}
        style={{
          backgroundColor: colors.background,
          color: colors.text,
          minHeight: '100vh',
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

