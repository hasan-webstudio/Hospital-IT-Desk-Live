/**
 * Hospital IT Desk — LocalStorage Preferences Adapter
 * Strictly reserved for user preferences and lightweight demo session flags.
 */

const STORAGE_KEYS = {
  LANGUAGE: 'hitd_language',
  THEME: 'hitd_theme',
  SIDEBAR_COLLAPSED: 'hitd_sidebar_collapsed',
  ACTIVE_ROLE: 'hitd_active_role',
  ONBOARDING_DISMISSED: 'hitd_onboarding_dismissed'
};

export const storage = {
  getLanguage() {
    try {
      return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'bn';
    } catch (e) {
      return 'bn';
    }
  },

  setLanguage(lang) {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch (e) {
      console.warn('Failed to save language preference:', e);
    }
  },

  getTheme() {
    try {
      return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    } catch (e) {
      return 'light';
    }
  },

  setTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {
      console.warn('Failed to save theme preference:', e);
    }
  },

  getActiveRole() {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE) || 'IT_OFFICER';
    } catch (e) {
      return 'IT_OFFICER';
    }
  },

  setActiveRole(roleCode) {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, roleCode);
    } catch (e) {
      console.warn('Failed to save active role preference:', e);
    }
  },

  isOnboardingDismissed() {
    try {
      return localStorage.getItem(STORAGE_KEYS.ONBOARDING_DISMISSED) === 'true';
    } catch (e) {
      return false;
    }
  },

  setOnboardingDismissed(dismissed = true) {
    try {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_DISMISSED, String(dismissed));
    } catch (e) {
      console.warn('Failed to save onboarding dismissed state:', e);
    }
  }
};

