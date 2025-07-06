// This file provides TypeScript types for the ThemeContext
declare module '../context/ThemeContext' {
  export interface ThemeContextType {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
  }

  export function useTheme(): ThemeContextType;
  export const ThemeProvider: React.FC<{ children: React.ReactNode }>;
}
