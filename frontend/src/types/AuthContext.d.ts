// This file provides TypeScript types for the AuthContext
declare module '../context/AuthContext' {
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

  export function useAuth(): AuthContextType;
  export const AuthProvider: React.FC<{ children: React.ReactNode }>;
}
