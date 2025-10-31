import { useState, useCallback, useEffect, useRef } from 'react';

// 支持的语言列表
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'zh-CN', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' }
];

// 默认的英语翻译
const DEFAULT_TRANSLATIONS = {
  en: {
    // 通用
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.tryAgain': 'Try Again',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    
    // 导航
    'nav.home': 'Home',
    'nav.analyze': 'Analyze',
    'nav.gallery': 'Gallery',
    'nav.results': 'Results',
    
    // 相机页面
    'camera.title': 'Step 1: Upload Photo',
    'camera.subtitle': 'Take or upload a clear front-facing photo for AI face analysis',
    'camera.takePhoto': 'Take Photo',
    'camera.uploadPhoto': 'Upload Photo',
    'camera.useThisPhoto': 'Use This Photo',
    'camera.retake': 'Retake',
    'camera.tips': 'Photo Tips',
    'camera.tip1': 'Choose a well-lit environment',
    'camera.tip2': 'Face the camera directly, keep face clear',
    'camera.tip3': 'Avoid wearing hats or sunglasses',
    'camera.tip4': 'Maintain natural expression',
    'camera.captureError': 'Photo capture failed: ',
    'camera.processingError': 'Image processing failed: ',
    'camera.starting': 'Starting camera...',
    'camera.cameraNotReady': 'Camera not ready',

    'common.privacy': 'Data Never Leaves Device',
    'common.offline': 'Offline Available',
    'common.poweredBy': 'Powered by {technology}',
    'common.translating': 'Translating to',

    'difficulty.easy': 'Easy',
    'difficulty.medium': 'Medium', 
    'difficulty.hard': 'Hard',


    
    // 分析页面
    'analysis.analyzing': 'Analyzing your face...',
    'analysis.detecting': 'Detecting facial features',
    'analysis.shape': 'Face Shape',
    'analysis.features': 'Features',
    'analysis.confidence': 'Confidence',
    'analysis.failed': 'Face analysis failed',
    'analysis.analyzing': 'AI is analyzing facial features...',
    
    // 发型推荐
    'recommender.title': 'AI Hairstyle Recommendation',
    'recommender.generating': 'AI is generating personalized advice...',
    'recommender.generationFailed': 'Generation Failed',
    'recommender.regenerate': 'Regenerate Recommendation',
    'recommender.ready': 'Ready to Generate Advice',
    'recommender.basedOn': 'Based on your {faceShape} face shape and selected {hairstyle}',
    'recommender.generate': 'Generate AI Advice',
    'recommender.about': 'About AI Recommendations',
    'recommender.feature1': 'Personalized advice based on face shape and hairstyle features',
    'recommender.feature2': 'Includes daily care, styling, and precautions',
    'recommender.feature3': 'Consult a professional stylist for final decisions',
    'recommender.sections.reason': 'Why It Suits You',
    'recommender.sections.maintenance': 'Maintenance Tips',
    'recommender.sections.styling': 'Styling Suggestions',
    'recommender.sections.caution': 'Things to Note',
    
    // 发型库
    'gallery.title': 'Step 3: Choose Your Favorite Hairstyle',
    'gallery.subtitle': 'Based on your {faceShape} face shape, these hairstyles are recommended for you',
    'gallery.recommended': 'Recommended',
    'gallery.all': 'All',
    'gallery.search': 'Search hairstyle names, types...',
    'gallery.filterByTag': 'Filter by tag:',
    'gallery.filterByDifficulty': 'Filter by difficulty:',
    'gallery.difficulty.easy': 'Easy',
    'gallery.difficulty.medium': 'Medium',
    'gallery.difficulty.hard': 'Hard',
    'gallery.noResults': 'No matching hairstyles found',
    'gallery.tryAdjusting': 'Try adjusting search or filter conditions',
    'gallery.title': 'Step 3: Choose Your Favorite Hairstyle',
    'gallery.subtitle': 'Based on your {faceShape} face shape, these hairstyles are recommended for you. AI analyzes facial features to suggest the most flattering styles.',
    'gallery.all': 'All',
    'gallery.recommended': 'Recommended',
    'gallery.showingResults': 'Showing {count} of {total} hairstyles',
    'gallery.tagsSelected': 'tags selected',

    'faceShape.Oval': 'Standard face shape, suitable for almost all hairstyles',
    'faceShape.Round': 'Face length and width are similar, need to elongate face shape through hairstyle',
    'faceShape.Square': 'Obvious jaw angle, need to soften contours through hairstyle', 
    'faceShape.Heart': 'Wider forehead, sharper chin, need to balance upper and lower proportions',
    'faceShape.Long': 'Face length is significantly greater than face width, need to increase width through hairstyle',

    'results.title': 'Step 4: Your Personalized Hairstyle Recommendation',
    'results.subtitle': 'Personalized hairstyle plan generated based on AI analysis',
    // 语言切换
    'language.current': 'Current Language',
    'language.autoDetect': 'Auto Detect',
    'language.autoDetecting': 'Detecting language...',
    'language.select': 'Select language',
    'language.current': 'Current Language', 
    'language.apiUnavailable': 'API Unavailable',
    'language.autoDetect': 'Auto Detect',

    'app.title': 'AI Hairstyle Advisor',
    'app.subtitle': 'Using Chrome Built-in AI · Privacy Protection · Offline Available',
    'app.builtFor': 'Built for Google Chrome Built-in AI Challenge 2025',
    
    'recommender.missingInfo': 'Missing necessary information, please ensure you have selected a hairstyle',
    'recommender.generationError': 'Error generating recommendation, please try again',
    
    'navigation.back': 'Back',
    'navigation.next': 'Next',
    'navigation.restart': 'Restart',
    'navigation.steps.camera': 'Take Photo',
    'navigation.steps.analysis': 'AI Analysis',
    'navigation.steps.selection': 'Browse Styles',
    'navigation.steps.results': 'Get Advice',
    
    'step.camera.description': 'Upload or take photo',
    'step.analysis.description': 'AI analyzes face shape',
    'step.selection.description': 'Browse hairstyles',
    'step.results.description': 'Get recommendations',

    'storage.export': 'Export History',
    'storage.import': 'Import History',
    'storage.clear': 'Clear History',
    'storage.usage': 'Storage Usage: {size} MB'
  }
};

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);
  const [translations, setTranslations] = useState(DEFAULT_TRANSLATIONS.en);
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [fallbackToEnglish, setFallbackToEnglish] = useState(false);

  // 检查 Chrome Language Detection API 是否可用
  const isLanguageDetectionAvailable = useCallback(() => {
    return typeof window !== 'undefined' && 
           'LanguageDetector' in window && 
           typeof window.LanguageDetector === 'function';
  }, []);

  // 检查 Chrome Translator API 是否可用
  const isTranslatorAvailable = useCallback(() => {
    return typeof window !== 'undefined' && 
           'Translator' in window && 
           typeof window.Translator === 'function';
  }, []);

  // 检查翻译模型是否可用
  const checkTranslationAvailable = useCallback(async (sourceLang, targetLang) => {
    if (!isTranslatorAvailable()) {
      return false;
    }

    try {
      const availability = await window.Translator.availability({
        sourceLanguage: sourceLang,
        targetLanguage: targetLang
      });
      console.log(`Translation availability for ${sourceLang}->${targetLang}:`, availability);
      return availability === 'readily' || availability === 'available' || availability === 'downloadable';
    } catch (err) {
      console.error('❌ Translation availability check failed:', err);
      return false;
    }
  }, [isTranslatorAvailable]);

  // 自动检测用户语言 - 修复API调用
  const detectLanguage = useCallback(async () => {
    if (!isLanguageDetectionAvailable()) {
      console.log('❌ Language Detection API not available');
      return null;
    }

    try {
      setError(null);
      console.log('🔍 Starting language detection...');
      
      // 创建语言检测器实例
      const detector = await window.LanguageDetector.create();
      console.log('✅ Language detector created');
      
      // 使用简单的英文文本进行检测
      const textToDetect = 'Hello world';
      console.log('📝 Detecting language for text:', textToDetect);
      
      // 执行语言检测 - 根据官方文档，detect返回候选语言列表[citation:2]
      const detectionResults = await detector.detect(textToDetect);
      console.log('🎯 Language detection results:', detectionResults);
      
      if (detectionResults && detectionResults.length > 0) {
        const topResult = detectionResults[0];
        console.log('✅ Top detected language:', topResult.detectedLanguage, 'confidence:', topResult.confidence);
        
        // 检查是否支持检测到的语言
        const supportedLang = SUPPORTED_LANGUAGES.find(
          lang => lang.code === topResult.detectedLanguage
        );
        
        if (supportedLang && topResult.confidence > 0.5) {
          setDetectedLanguage(supportedLang.code);
          return supportedLang.code;
        }
      }
      
      console.log('❌ No supported language detected with sufficient confidence');
      return null;
    } catch (err) {
      console.error('❌ Language detection failed:', err);
      setError('Language detection failed, using English');
      return null;
    }
  }, [isLanguageDetectionAvailable]);

  // 翻译单个文本
  const translateText = useCallback(async (text, targetLang = currentLanguage) => {
    // 如果是英语或API不可用，直接返回原文本
    if (targetLang === 'en' || !isTranslatorAvailable() || !text || fallbackToEnglish) {
      return text;
    }

    try {
      setIsTranslating(true);
      console.log(`🔄 Translating: "${text}" to ${targetLang}`);
      
      // 检查翻译是否可用
      const isAvailable = await checkTranslationAvailable('en', targetLang);
      if (!isAvailable) {
        console.log(`❌ Translation not available for en->${targetLang}, using English`);
        return text;
      }

      // 创建翻译器实例 - 修复：提供必需的参数[citation:3]
      const translator = await window.Translator.create({
        sourceLanguage: 'en',
        targetLanguage: targetLang
      });
      console.log('✅ Translator created');
      
      // 执行翻译
      const translationResult = await translator.translate(text);
      
      console.log(`✅ Translation: "${text}" -> "${translationResult}" (${targetLang})`);
      return translationResult;
    } catch (err) {
      console.error('❌ Translation failed:', err, 'Text:', text);
      // 翻译失败时返回原文本
      return text;
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage, isTranslatorAvailable, checkTranslationAvailable, fallbackToEnglish]);

  // 批量翻译（用于初始化）- 修复API调用
  const batchTranslate = useCallback(async (texts, targetLang) => {
    // 如果是英语或API不可用或已回退到英语，返回默认英语翻译
    if (targetLang === 'en' || !isTranslatorAvailable() || fallbackToEnglish) {
      console.log('🔄 Using default English translations');
      return DEFAULT_TRANSLATIONS.en;
    }

    try {
      setIsTranslating(true);
      setError(null);
      console.log(`🔄 Starting batch translation to ${targetLang}`);
      
      // 检查翻译是否可用
      const isAvailable = await checkTranslationAvailable('en', targetLang);
      if (!isAvailable) {
        throw new Error(`Translation not available for en->${targetLang}`);
      }

      // 创建翻译器实例 - 修复：提供必需的参数
      const translator = await window.Translator.create({
        sourceLanguage: 'en',
        targetLanguage: targetLang
      });
      console.log('✅ Translator created for batch translation');
      
      const translated = {};
      const translationPromises = [];
      
      // 创建所有翻译任务
      Object.entries(texts).forEach(([key, text]) => {
        if (text && typeof text === 'string') {
          const promise = translator.translate(text).then(translation => {
            translated[key] = translation;
          }).catch(err => {
            console.error(`❌ Failed to translate "${key}":`, err);
            translated[key] = text; // 失败时使用原文本
          });
          translationPromises.push(promise);
        } else {
          translated[key] = text; // 非字符串直接复制
        }
      });
      
      // 等待所有翻译完成
      await Promise.all(translationPromises);
      console.log(`✅ Batch translation completed for ${targetLang}`);
      
      return translated;
    } catch (err) {
      console.error('❌ Batch translation failed:', err);
      setError(`Translation to ${targetLang} failed, using English`);
      setFallbackToEnglish(true);
      // 批量翻译失败时返回英语
      return DEFAULT_TRANSLATIONS.en;
    } finally {
      setIsTranslating(false);
    }
  }, [isTranslatorAvailable, checkTranslationAvailable, fallbackToEnglish]);

  // 切换语言 - 修复状态同步问题
  const switchLanguage = useCallback(async (langCode) => {
    if (langCode === currentLanguage && !fallbackToEnglish) return;
    
    console.log(`🔄 Switching language to: ${langCode}`);
    
    // 如果是英语，直接使用默认翻译
    if (langCode === 'en') {
      setTranslations(DEFAULT_TRANSLATIONS.en);
      setCurrentLanguage('en');
      setFallbackToEnglish(false);
      localStorage.setItem('preferred-language', 'en');
      setError(null);
      return;
    }
    
    try {
      setIsTranslating(true);
      setError(null);
      setFallbackToEnglish(false);
      
      // 尝试翻译
      const translated = await batchTranslate(DEFAULT_TRANSLATIONS.en, langCode);
      
      // 检查是否有有效的翻译结果
      const hasValidTranslations = Object.values(translated).some(
        text => text && typeof text === 'string' && text !== ''
      );
      
      if (hasValidTranslations) {
        setTranslations(translated);
        setCurrentLanguage(langCode);
        localStorage.setItem('preferred-language', langCode);
        console.log(`✅ Language switched to: ${langCode}`);
      } else {
        // 如果没有有效翻译，回退到英语
        throw new Error('No valid translations received');
      }
      
    } catch (err) {
      console.error('❌ Language switch failed:', err);
      setError(`Failed to switch to ${langCode}, using English`);
      
      // 失败时自动切换到英语 - 确保状态同步
      setTranslations(DEFAULT_TRANSLATIONS.en);
      setCurrentLanguage('en'); // 关键修复：确保当前语言状态也重置为英语
      setFallbackToEnglish(true);
      localStorage.setItem('preferred-language', 'en');
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage, batchTranslate, fallbackToEnglish]);

  // 获取翻译文本（带参数替换）
  const t = useCallback((key, fallback = '', params = {}) => {
    let text = translations[key] || fallback || key;
    
    // 如果翻译文本为空，使用回退或键名
    if (!text || text.trim() === '') {
      text = fallback || key;
    }
    
    // 替换参数 {key} -> value
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      const placeholder = `{${paramKey}}`;
      if (text.includes(placeholder)) {
        text = text.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), paramValue);
      }
    });
    
    return text;
  }, [translations]);

  // 重置到英语
  const resetToEnglish = useCallback(() => {
    setTranslations(DEFAULT_TRANSLATIONS.en);
    setCurrentLanguage('en');
    setFallbackToEnglish(true);
    localStorage.setItem('preferred-language', 'en');
    setError(null);
  }, []);

  // 初始化语言设置
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // 1. 检查本地存储的用户偏好
        const savedLanguage = localStorage.getItem('preferred-language');
        if (savedLanguage && SUPPORTED_LANGUAGES.some(lang => lang.code === savedLanguage)) {
          console.log(`📝 Using saved language preference: ${savedLanguage}`);
          await switchLanguage(savedLanguage);
          return;
        }
        
        // 2. 尝试自动检测语言
        console.log('🔍 No saved preference, detecting language...');
        const detectedLang = await detectLanguage();
        if (detectedLang && detectedLang !== 'en') {
          console.log(`🎯 Using detected language: ${detectedLang}`);
          await switchLanguage(detectedLang);
          return;
        }
        
        // 3. 使用英语作为默认
        console.log('🌐 Using default English language');
        setCurrentLanguage('en');
        setTranslations(DEFAULT_TRANSLATIONS.en);
        
      } catch (err) {
        console.error('❌ Language initialization failed:', err);
        // 初始化失败时使用英语
        resetToEnglish();
      }
    };
    
    initializeLanguage();
  }, [detectLanguage, switchLanguage, resetToEnglish]);

  return {
    // 状态
    currentLanguage,
    isTranslating,
    error,
    detectedLanguage,
    fallbackToEnglish,
    
    // 方法
    t,
    switchLanguage,
    translateText,
    detectLanguage,
    resetToEnglish,
    
    // 可用性检查
    isLanguageDetectionAvailable: isLanguageDetectionAvailable(),
    isTranslatorAvailable: isTranslatorAvailable(),
    
    // 工具
    supportedLanguages: SUPPORTED_LANGUAGES
  };
};

export default useLanguage;