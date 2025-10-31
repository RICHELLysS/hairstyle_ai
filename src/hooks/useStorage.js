import { useState, useEffect, useCallback } from 'react';

// 本地存储 Hook
export const useStorage = () => {
  const [history, setHistory] = useState([]);
  const [settings, setSettings] = useState({});

  // 初始化 - 从 localStorage 加载数据
  useEffect(() => {
    loadFromStorage();
  }, []);

  // 从 localStorage 加载数据
  const loadFromStorage = useCallback(() => {
    try {
      // 加载历史记录
      const savedHistory = localStorage.getItem('hairstyle-ai-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }

      // 加载设置
      const savedSettings = localStorage.getItem('hairstyle-ai-settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Failed to load local storage data:', error);
    }
  }, []);

  // 保存历史记录
  const saveHistory = useCallback((record) => {
    try {
      const newHistory = [record, ...history.slice(0, 49)]; // 最多保存50条记录
      setHistory(newHistory);
      localStorage.setItem('hairstyle-ai-history', JSON.stringify(newHistory));
      return true;
    } catch (error) {
      console.error('Failed to save history:', error);
      return false;
    }
  }, [history]);

  // 清空历史记录
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

  // 更新设置
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

  // 保存用户偏好
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

  // 加载用户偏好
  const loadUserPreferences = useCallback(() => {
    try {
      const userData = localStorage.getItem('hairstyle-ai-user-preferences');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to load user preferences:', error);
      return null;
    }
  }, []);

  // 获取存储使用情况
  const getStorageUsage = useCallback(() => {
    let totalSize = 0;
    
    // 计算所有相关键的存储大小
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

  // 导出历史记录
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

  // 导入历史记录
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
    // 数据
    history,
    settings,
    
    // 历史记录操作
    saveHistory,
    clearHistory,
    exportHistory,
    importHistory,
    
    // 设置操作
    updateSettings,
    
    // 用户偏好
    saveUserPreferences,
    loadUserPreferences,
    
    // 工具函数
    getStorageUsage
  };
};