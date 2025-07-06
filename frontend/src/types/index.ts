// Global type declarations for the app
export interface User {
  displayName?: string;
  email?: string;
  uid: string;
}

export interface AuthContextType {
  currentUser: User | null;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

export interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
