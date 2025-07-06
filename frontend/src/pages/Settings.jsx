import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { usePreferences } from '../context/PreferencesContext';
import { validatePassword, validateDisplayName } from '../utils/validation';
import { User, Shield, Save, Eye, EyeOff, Settings as SettingsIcon, Trash2, Bot, FileText, Zap, ChevronDown } from 'lucide-react';

const Settings = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { preferences, updatePreferences, clearPreferences } = usePreferences();
  
  // User profile settings
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Feature toggles
  const [aiEnabled, setAiEnabled] = useState(preferences.aiEnabled);
  const [previewEnabled, setPreviewEnabled] = useState(preferences.previewEnabled);
  const [autoSave, setAutoSave] = useState(preferences.autoSave);
  const [smartSuggestions, setSmartSuggestions] = useState(preferences.smartSuggestions);
  
  // Privacy settings
  const [profileVisibility, setProfileVisibility] = useState(preferences.profileVisibility);
  const [dataSharing, setDataSharing] = useState(preferences.dataSharing);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Loading states
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Dropdown options
  const visibilityOptions = [
    { value: 'private', label: 'Private' },
    { value: 'public', label: 'Public' },
    { value: 'friends', label: 'Friends Only' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update local state when preferences change
  useEffect(() => {
    setAiEnabled(preferences.aiEnabled);
    setPreviewEnabled(preferences.previewEnabled);
    setAutoSave(preferences.autoSave);
    setSmartSuggestions(preferences.smartSuggestions);
    setProfileVisibility(preferences.profileVisibility);
    setDataSharing(preferences.dataSharing);
  }, [preferences]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      // Validate display name
      const nameValidation = validateDisplayName(displayName);
      if (!nameValidation.isValid) {
        setMessage(nameValidation.messages.join('. '));
        setSaving(false);
        return;
      }

      // Update Firebase profile
      await updateUserProfile({
        displayName: displayName.trim()
      });
      
      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match.');
      setSaving(false);
      return;
    }
    
    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      setMessage(passwordValidation.messages.join('. '));
      setSaving(false);
      return;
    }
    
    try {
      // TODO: Implement actual password change logic with Firebase
      // This would involve reauthenticating the user first
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage('Error changing password. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      // Update preferences using context
      updatePreferences({
        aiEnabled,
        previewEnabled,
        autoSave,
        smartSuggestions,
        profileVisibility,
        dataSharing
      });
      
      setMessage('Preferences saved successfully!');
    } catch (error) {
      console.error('Preferences save error:', error);
      setMessage('Error saving preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setSaving(true);
    setMessage('');
    
    try {
      // Clear user preferences
      clearPreferences();
      
      // Here you would implement actual account deletion
      // This might involve:
      // 1. Deleting user data from Firestore
      // 2. Deleting the Firebase auth user
      // 3. Clearing all local storage
      
      setMessage('Account deletion initiated. You will be logged out shortly.');
      
      // For now, just simulate the process
      setTimeout(() => {
        // In a real implementation, you would call logout here
        // logout();
      }, 3000);
      
    } catch (error) {
      console.error('Account deletion error:', error);
      setMessage('Error deleting account. Please try again or contact support.');
    } finally {
      setSaving(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-primary/10 rounded-lg">
          <User className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm">Manage your account and preferences</p>
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded-lg border ${message.includes('Error') 
          ? 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800' 
          : 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
        }`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}

      <div className="grid gap-4">
        {/* Profile Settings */}
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-medium text-foreground">Profile Information</h2>
          </div>
          
          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="displayName" className="block text-sm font-medium text-foreground">
                Display Name
              </label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                placeholder="Enter your display name"
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                placeholder="Enter your email"
              />
            </div>
            
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>

        {/* Password Change */}
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-medium text-foreground">Change Password</h2>
          </div>
          
          <form onSubmit={handleChangePassword} className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="currentPassword" className="block text-sm font-medium text-foreground">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="newPassword" className="block text-sm font-medium text-foreground">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <Shield className="h-4 w-4" />
              {saving ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Feature Toggles */}
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <SettingsIcon className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-medium text-foreground">Features</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">AI Assistant</label>
                  <p className="text-xs text-muted-foreground">Enable AI-powered note suggestions and analysis</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={aiEnabled}
                  onChange={(e) => setAiEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-400 dark:after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:after:border-white"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">Note Preview</label>
                  <p className="text-xs text-muted-foreground">Show live preview while editing notes</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={previewEnabled}
                  onChange={(e) => setPreviewEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-400 dark:after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:after:border-white"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <Save className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">Auto Save</label>
                  <p className="text-xs text-muted-foreground">Automatically save notes as you type</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-400 dark:after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:after:border-white"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">Smart Suggestions</label>
                  <p className="text-xs text-muted-foreground">Get intelligent content and tag suggestions</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={smartSuggestions}
                  onChange={(e) => setSmartSuggestions(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-400 dark:after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:after:border-white"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-medium text-foreground">Privacy</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-foreground">
                Profile Visibility
              </label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-3 py-2 pr-10 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors hover:border-primary/50 text-left"
                >
                  {visibilityOptions.find(option => option.value === profileVisibility)?.label || 'Private'}
                  <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-lg shadow-lg">
                    {visibilityOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setProfileVisibility(option.value);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-sm text-left hover:bg-primary/10 focus:outline-none focus:bg-primary/10 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                          profileVisibility === option.value 
                            ? 'bg-primary/20 text-primary font-medium' 
                            : 'text-foreground'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <label className="block text-sm font-medium text-foreground">Data Sharing</label>
                <p className="text-xs text-muted-foreground">Allow anonymous usage data collection</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={dataSharing}
                  onChange={(e) => setDataSharing(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-400 dark:after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:after:border-white"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Account Management */}
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Trash2 className="h-5 w-5 text-red-500" />
            <h2 className="text-lg font-medium text-foreground">Danger Zone</h2>
          </div>
          
          <div className="space-y-3">
            <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-lg">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">Delete Account</h3>
              <p className="text-xs text-red-600 dark:text-red-400 mb-3">
                This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
              </p>
              
              {showDeleteConfirm ? (
                <div className="space-y-2">
                  <p className="text-xs text-red-800 dark:text-red-300 font-medium">
                    Are you absolutely sure? This action cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={saving}
                      className="px-4 py-3 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
                    >
                      {saving ? 'Deleting...' : 'Yes, delete my account'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={saving}
                      className="px-4 py-3 bg-gray-200 text-gray-800 text-xs font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-3 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                >
                  Delete Account
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Save All Preferences */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSavePreferences}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save All Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
