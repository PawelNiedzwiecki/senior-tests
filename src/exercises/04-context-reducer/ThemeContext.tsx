import { createContext, useContext, useState, ReactNode } from 'react';

// TODO 1: Define the theme type
type Theme = 'light' | 'dark';

// TODO 2: Define the context type
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// TODO 3: Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// TODO 4: Implement the ThemeProvider
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // YOUR CODE HERE
  // - Create theme state
  // - Create toggleTheme function
  // - Return provider with value

  return (
    <ThemeContext.Provider value={{ theme: 'light', toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
};

// TODO 5: Implement the useTheme hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  // YOUR CODE HERE
  return context;
};

export default ThemeContext;
