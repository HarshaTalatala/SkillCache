import { usePreferences } from '../context/PreferencesContext';

/**
 * Custom hook for accessing AI-related preferences and capabilities
 */
export const useAI = () => {
  const { preferences, hasApiKey, canUseAI } = usePreferences();
  
  return {
    isEnabled: preferences.aiEnabled,
    hasApiKey: hasApiKey(),
    canUse: canUseAI(),
    apiKey: preferences.geminiApiKey,
    smartSuggestions: preferences.smartSuggestions,
  };
};

/**
 * Custom hook for accessing editor preferences
 */
export const useEditorPreferences = () => {
  const { preferences } = usePreferences();
  
  return {
    previewEnabled: preferences.previewEnabled,
    autoSave: preferences.autoSave,
    smartSuggestions: preferences.smartSuggestions,
  };
};

/**
 * Custom hook for accessing notification preferences
 */
export const useNotificationPreferences = () => {
  const { preferences } = usePreferences();
  
  return {
    emailNotifications: preferences.emailNotifications,
    pushNotifications: preferences.pushNotifications,
    weeklyDigest: preferences.weeklyDigest,
  };
};

/**
 * Custom hook for accessing privacy preferences
 */
export const usePrivacyPreferences = () => {
  const { preferences } = usePreferences();
  
  return {
    profileVisibility: preferences.profileVisibility,
    dataSharing: preferences.dataSharing,
  };
};
