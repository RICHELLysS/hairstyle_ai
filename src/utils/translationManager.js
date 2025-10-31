// translationManager.js
import translationData from '../translations.json';

class TranslationManager {
  constructor() {
    this.translations = { ...translationData };
    this.initializeFromStorage();
  }

  // 从 localStorage 初始化翻译数据
  initializeFromStorage() {
    try {
      const storedTranslations = localStorage.getItem('app-translations');
      if (storedTranslations) {
        const parsed = JSON.parse(storedTranslations);
        this.translations = { ...this.translations, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load translations from storage:', error);
    }
  }

  // 获取翻译
  getTranslation(langCode) {
    return this.translations[langCode] || this.translations.en;
  }

  // 检查是否有翻译
  hasTranslation(langCode) {
    return !!this.translations[langCode];
  }

  // 保存翻译到内存和存储
  saveTranslation(langCode, translation) {
    this.translations[langCode] = translation;
    
    // 保存到 localStorage
    try {
      localStorage.setItem('app-translations', JSON.stringify(this.translations));
    } catch (error) {
      console.warn('Failed to save translations to storage:', error);
    }
  }

  // 获取所有可用的语言代码
  getAvailableLanguages() {
    return Object.keys(this.translations);
  }

  // 清除所有翻译缓存（除了英语）
  clearCache() {
    this.translations = { en: this.translations.en };
    try {
      localStorage.setItem('app-translations', JSON.stringify(this.translations));
    } catch (error) {
      console.warn('Failed to clear translation cache:', error);
    }
  }
}

// 创建单例实例
export const translationManager = new TranslationManager();