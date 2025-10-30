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
      console.error('加载本地存储数据失败:', error);
    }
  }, []);

  // 保存历史记录
  const saveHistory = useCallback((record) => {
    try {
      const newHistory = [record, ...history.slice(0, 49)]; // 最多保存50条记录
      setHistory(newHistory);
      localStorage.setItem('hairstyle-ai-history', JSON.stringify(newHistory));
    } catch (error) {
      console.error('保存历史记录失败:', error);
    }
  }, [history]);

  // 清空历史记录
  const clearHistory = useCallback(() => {
    try {
      setHistory([]);
      localStorage.removeItem('hairstyle-ai-history');
    } catch (error) {
      console.error('清空历史记录失败:', error);
    }
  }, []);

  // 更新设置
  const updateSettings = useCallback((newSettings) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      localStorage.setItem('hairstyle-ai-settings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('更新设置失败:', error);
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
    } catch (error) {
      console.error('保存用户偏好失败:', error);
    }
  }, []);

  // 加载用户偏好
  const loadUserPreferences = useCallback(() => {
    try {
      const userData = localStorage.getItem('hairstyle-ai-user-preferences');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('加载用户偏好失败:', error);
      return null;
    }
  }, []);

  // 保存图片到本地（可选功能）
  const saveImageToStorage = useCallback(async (imageBlob, filename) => {
    try {
      // 将 Blob 转换为 Base64
      const base64 = await blobToBase64(imageBlob);
      const imageData = {
        data: base64,
        filename,
        timestamp: new Date().toISOString()
      };

      // 获取现有图片库或创建新的
      const existingLibrary = JSON.parse(localStorage.getItem('hairstyle-ai-image-library') || '[]');
      const newLibrary = [imageData, ...existingLibrary.slice(0, 9)]; // 最多保存10张图片

      localStorage.setItem('hairstyle-ai-image-library', JSON.stringify(newLibrary));
      return true;
    } catch (error) {
      console.error('保存图片失败:', error);
      return false;
    }
  }, []);

  // 从本地存储加载图片
  const loadImagesFromStorage = useCallback(() => {
    try {
      const imageLibrary = localStorage.getItem('hairstyle-ai-image-library');
      return imageLibrary ? JSON.parse(imageLibrary) : [];
    } catch (error) {
      console.error('加载图片失败:', error);
      return [];
    }
  }, []);

  // Blob 转 Base64 工具函数
  const blobToBase64 = (blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  // Base64 转 Blob 工具函数
  const base64ToBlob = (base64) => {
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], { type: mimeString });
  };

  // 获取存储使用情况
  const getStorageUsage = useCallback(() => {
    let totalSize = 0;
    
    // 计算所有相关键的存储大小
    const keys = [
      'hairstyle-ai-history',
      'hairstyle-ai-settings',
      'hairstyle-ai-user-preferences',
      'hairstyle-ai-image-library'
    ];
    
    keys.forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += new Blob([item]).size;
      }
    });
    
    return {
      totalBytes: totalSize,
      totalMB: (totalSize / (1024 * 1024)).toFixed(2)
    };
  }, []);

  return {
    history,
    settings,
    saveHistory,
    clearHistory,
    updateSettings,
    saveUserPreferences,
    loadUserPreferences,
    saveImageToStorage,
    loadImagesFromStorage,
    getStorageUsage,
    blobToBase64,
    base64ToBlob
  };
};