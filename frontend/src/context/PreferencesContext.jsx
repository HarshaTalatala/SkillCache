import React, { createContext, useContext, useState, useEffect } from 'react';

const PreferencesContext = createContext();

// Hook to use preferences context
// eslint-disable-next-line react-refresh/only-export-components
export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};

export const PreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({
    // API Configuration
    geminiApiKey: '',
    
    // Feature toggles
    aiEnabled: true,
    previewEnabled: true,
    autoSave: true,
    smartSuggestions: false,
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    
    // Privacy settings
    profileVisibility: 'private',
    dataSharing: false,
  });

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(prevPreferences => ({
          ...prevPreferences,
          ...parsed
        }));
      } catch (error) {
        console.error('Error loading user preferences:', error);
      }
    }
  }, []);

  // Save preferences to localStorage whenever they change
  const updatePreferences = (newPreferences) => {
    const updatedPreferences = {
      ...preferences,
      ...newPreferences,
      lastUpdated: new Date().toISOString()
    };
    
    setPreferences(updatedPreferences);
    localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
  };

  // Update a single preference
  const updatePreference = (key, value) => {
    updatePreferences({ [key]: value });
  };

  // Clear all preferences
  const clearPreferences = () => {
    const defaultPreferences = {
      geminiApiKey: '',
      aiEnabled: true,
      previewEnabled: true,
      autoSave: true,
      smartSuggestions: false,
      emailNotifications: true,
      pushNotifications: false,
      weeklyDigest: true,
      profileVisibility: 'private',
      dataSharing: false,
    };
    
    setPreferences(defaultPreferences);
    localStorage.removeItem('userPreferences');
  };

  // Helper functions for common preferences
  const isFeatureEnabled = (feature) => {
    return preferences[feature] || false;
  };

  const hasApiKey = () => {
    return preferences.geminiApiKey && preferences.geminiApiKey.trim() !== '';
  };

  const canUseAI = () => {
    return preferences.aiEnabled && hasApiKey();
  };

  const value = {
    preferences,
    updatePreferences,
    updatePreference,
    clearPreferences,
    isFeatureEnabled,
    hasApiKey,
    canUseAI,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export default PreferencesContext;
