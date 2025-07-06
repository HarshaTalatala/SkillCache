/**
 * Utility functions for form validation
 */

/**
 * Validate password strength
 * @param {string} password - The password to validate
 * @returns {object} Validation result with isValid boolean and messages array
 */
export const validatePassword = (password) => {
  const messages = [];
  let isValid = true;

  if (password.length < 6) {
    messages.push('Password must be at least 6 characters long');
    isValid = false;
  }

  if (password.length > 128) {
    messages.push('Password must be less than 128 characters');
    isValid = false;
  }

  if (!/[A-Z]/.test(password)) {
    messages.push('Password should contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    messages.push('Password should contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    messages.push('Password should contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    messages.push('Password should contain at least one special character');
  }

  return {
    isValid,
    messages,
    strength: calculatePasswordStrength(password)
  };
};

/**
 * Calculate password strength score
 * @param {string} password - The password to analyze
 * @returns {string} Strength level (weak, fair, good, strong)
 */
const calculatePasswordStrength = (password) => {
  let score = 0;
  
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
  if (password.length >= 16) score += 1;

  if (score <= 2) return 'weak';
  if (score <= 4) return 'fair';
  if (score <= 5) return 'good';
  return 'strong';
};

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} True if email is valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate display name
 * @param {string} name - The display name to validate
 * @returns {object} Validation result
 */
export const validateDisplayName = (name) => {
  const messages = [];
  let isValid = true;

  if (!name.trim()) {
    messages.push('Display name is required');
    isValid = false;
  }

  if (name.length < 2) {
    messages.push('Display name must be at least 2 characters long');
    isValid = false;
  }

  if (name.length > 50) {
    messages.push('Display name must be less than 50 characters');
    isValid = false;
  }

  if (!/^[a-zA-Z0-9\s._-]+$/.test(name)) {
    messages.push('Display name can only contain letters, numbers, spaces, dots, underscores, and hyphens');
    isValid = false;
  }

  return { isValid, messages };
};

/**
 * Validate API key format (basic validation)
 * @param {string} apiKey - The API key to validate
 * @returns {object} Validation result
 */
export const validateApiKey = (apiKey) => {
  const messages = [];
  let isValid = true;

  if (!apiKey.trim()) {
    messages.push('API key is required');
    isValid = false;
  }

  if (apiKey.length < 20) {
    messages.push('API key appears to be too short');
    isValid = false;
  }

  if (apiKey.includes(' ')) {
    messages.push('API key should not contain spaces');
    isValid = false;
  }

  return { isValid, messages };
};
