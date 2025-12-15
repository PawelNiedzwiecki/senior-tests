import { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';

// SOLUTION 1: Define the theme type
type Theme = 'light' | 'dark';

// SOLUTION 2: Define the context type
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// SOLUTION 3: Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// SOLUTION 4: Implement the ThemeProvider
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Memoize context value
  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// SOLUTION 5: Implement the useTheme hook
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

export default ThemeContext;
