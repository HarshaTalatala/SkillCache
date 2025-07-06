export interface UserPreferences {
  // API Configuration
  geminiApiKey: string;
  
  // Feature toggles
  aiEnabled: boolean;
  previewEnabled: boolean;
  autoSave: boolean;
  smartSuggestions: boolean;
  
  // Notification settings
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  
  // Privacy settings
  profileVisibility: 'private' | 'public' | 'friends';
  dataSharing: boolean;
  
  // Metadata
  lastUpdated?: string;
}

export interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  updatePreference: (key: keyof UserPreferences, value: any) => void;
  clearPreferences: () => void;
  isFeatureEnabled: (feature: keyof UserPreferences) => boolean;
  hasApiKey: () => boolean;
  canUseAI: () => boolean;
}
