/**
 * Hospital IT Desk — Application State Management
 * Provides centralized reactive state and observer subscriptions.
 */

import { storage } from './storage.js';

class AppState {
  constructor() {
    this.language = storage.getLanguage();
    this.theme = storage.getTheme();
    this.activeRole = storage.getActiveRole();
    this.currentRoute = { path: '', params: {} };
    this.listeners = new Map();
  }

  getLanguage() {
    return this.language;
  }

  setLanguage(lang) {
    if (this.language !== lang) {
      this.language = lang;
      storage.setLanguage(lang);
      this.emit('languageChanged', lang);
    }
  }

  getTheme() {
    return this.theme;
  }

  setTheme(theme) {
    if (this.theme !== theme) {
      this.theme = theme;
      storage.setTheme(theme);
      document.documentElement.setAttribute('data-theme', theme);
      this.emit('themeChanged', theme);
    }
  }

  getActiveRole() {
    return this.activeRole;
  }

  setActiveRole(roleCode) {
    if (this.activeRole !== roleCode) {
      this.activeRole = roleCode;
      storage.setActiveRole(roleCode);
      this.emit('roleChanged', roleCode);
    }
  }

  setCurrentRoute(route) {
    this.currentRoute = route;
    this.emit('routeChanged', route);
  }

  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.listeners.get(event).delete(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((cb) => {
        try {
          cb(data);
        } catch (e) {
          console.error(`State listener error on event [${event}]:`, e);
        }
      });
    }
  }
}

export const state = new AppState();

