import { useState, useEffect, useCallback } from 'react';

/**
 * Local storage management hook for user data persistence
 * Provides storage operations for history, settings, and user preferences
 */
export const useStorage = () => {
  const [history, setHistory] = useState([]);
  const [settings, setSettings] = useState({});

  /**
   * Initializes storage by loading data from localStorage
   */
  useEffect(() => {
    loadFromStorage();
  }, []);

  /**
   * Loads data from localStorage into state
   */
  const loadFromStorage = useCallback(() => {
    try {
      // Load history
      const savedHistory = localStorage.getItem('hairstyle-ai-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }

      // Load settings
      const savedSettings = localStorage.getItem('hairstyle-ai-settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Failed to load local storage data:', error);
    }
  }, []);

  /**
   * Saves analysis history record
   * @param {Object} record - History record to save
   * @returns {boolean} Success status
   */
  const saveHistory = useCallback((record) => {
    try {
      const newHistory = [record, ...history.slice(0, 49)]; // Keep max 50 records
      setHistory(newHistory);
      localStorage.setItem('hairstyle-ai-history', JSON.stringify(newHistory));
      return true;
    } catch (error) {
      console.error('Failed to save history:', error);
      return false;
    }
  }, [history]);

  /**
   * Clears all history records
   * @returns {boolean} Success status
   */
  const clearHistory = useCallback(() => {
    try {
      setHistory([]);
      localStorage.removeItem('hairstyle-ai-history');
      return true;
    } catch (error) {
      console.error('Failed to clear history:', error);
      return false;
    }
  }, []);

  /**
   * Updates application settings
   * @param {Object} newSettings - Settings to update
   * @returns {boolean} Success status
   */
  const updateSettings = useCallback((newSettings) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      localStorage.setItem('hairstyle-ai-settings', JSON.stringify(updatedSettings));
      return true;
    } catch (error) {
      console.error('Failed to update settings:', error);
      return false;
    }
  }, [settings]);

  /**
   * Saves user preferences
   * @param {Object} preferences - User preferences object
   * @returns {boolean} Success status
   */
  const saveUserPreferences = useCallback((preferences) => {
    try {
      const userData = {
        preferences,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('hairstyle-ai-user-preferences', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Failed to save user preferences:', error);
      return false;
    }
  }, []);

  /**
   * Loads user preferences from storage
   * @returns {Object|null} User preferences data
   */
  const loadUserPreferences = useCallback(() => {
    try {
      const userData = localStorage.getItem('hairstyle-ai-user-preferences');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to load user preferences:', error);
      return null;
    }
  }, []);

  /**
   * Calculates storage usage statistics
   * @returns {Object} Storage usage information
   */
  const getStorageUsage = useCallback(() => {
    let totalSize = 0;
    
    // Calculate storage size for all relevant keys
    const keys = [
      'hairstyle-ai-history',
      'hairstyle-ai-settings',
      'hairstyle-ai-user-preferences'
    ];
    
    keys.forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += new Blob([item]).size;
      }
    });
    
    return {
      totalBytes: totalSize,
      totalMB: (totalSize / (1024 * 1024)).toFixed(2),
      message: `Storage usage: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`
    };
  }, []);

  /**
   * Exports history data as downloadable blob URL
   * @returns {string|null} Blob URL for download
   */
  const exportHistory = useCallback(() => {
    try {
      const dataStr = JSON.stringify(history, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      return URL.createObjectURL(dataBlob);
    } catch (error) {
      console.error('Failed to export history:', error);
      return null;
    }
  }, [history]);

  /**
   * Imports history data from JSON string
   * @param {string} jsonData - JSON string of history data
   * @returns {boolean} Success status
   */
  const importHistory = useCallback((jsonData) => {
    try {
      const importedHistory = JSON.parse(jsonData);
      if (Array.isArray(importedHistory)) {
        setHistory(importedHistory);
        localStorage.setItem('hairstyle-ai-history', JSON.stringify(importedHistory));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import history:', error);
      return false;
    }
  }, []);

  return {
    // Data
    history,
    settings,
    
    // History operations
    saveHistory,
    clearHistory,
    exportHistory,
    importHistory,
    
    // Settings operations
    updateSettings,
    
    // User preferences
    saveUserPreferences,
    loadUserPreferences,
    
    // Utility functions
    getStorageUsage
  };
};