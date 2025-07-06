// This file provides TypeScript types for the SearchContext
declare module '../context/SearchContext' {
  export interface SearchContextType {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
  }

  export function useSearch(): SearchContextType;
  export const SearchProvider: React.FC<{ children: React.ReactNode }>;
}
