import { useState, useCallback, useEffect } from 'react';

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

  // 检查 Chrome Language Detection API 是否可用
  const isLanguageDetectionAvailable = useCallback(() => {
    return typeof LanguageDetector !== 'undefined';
  }, []);

  // 检查 Chrome Translator API 是否可用
  const isTranslatorAvailable = useCallback(() => {
    return typeof Translator !== 'undefined';
  }, []);

  // 自动检测用户语言
  const detectLanguage = useCallback(async () => {
    if (!isLanguageDetectionAvailable()) {
      console.log('Language Detection API not available');
      return null;
    }

    try {
      setError(null);
      const detector = await LanguageDetector.create();
      const detectionResult = await detector.detect(navigator.language || 'en');
      
      console.log('Language detection result:', detectionResult);
      
      if (detectionResult && detectionResult.language) {
        const detectedLang = detectionResult.language;
        setDetectedLanguage(detectedLang);
        
        // 检查是否支持检测到的语言
        const supportedLang = SUPPORTED_LANGUAGES.find(
          lang => lang.code === detectedLang || detectedLang.startsWith(lang.code)
        );
        
        if (supportedLang) {
          return supportedLang.code;
        }
      }
      
      return null;
    } catch (err) {
      console.error('Language detection failed:', err);
      setError('Language detection failed');
      return null;
    }
  }, [isLanguageDetectionAvailable]);

  // 翻译文本
  const translateText = useCallback(async (text, targetLang = currentLanguage) => {
    if (!isTranslatorAvailable() || targetLang === 'en') {
      return text; // 如果不可用或目标语言是英语，返回原文
    }

    try {
      setIsTranslating(true);
      const translator = await Translator.create();
      const translation = await translator.translate(text, { targetLanguage: targetLang });
      
      console.log(`Translation: "${text}" -> "${translation}" (${targetLang})`);
      return translation;
    } catch (err) {
      console.error('Translation failed:', err, text);
      return text; // 失败时返回原文
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage, isTranslatorAvailable]);

  // 批量翻译（用于初始化）
  const batchTranslate = useCallback(async (texts, targetLang) => {
    if (!isTranslatorAvailable() || targetLang === 'en') {
      return DEFAULT_TRANSLATIONS.en; // 回退到英语
    }

    try {
      setIsTranslating(true);
      setError(null);
      
      const translator = await Translator.create();
      const translated = { ...DEFAULT_TRANSLATIONS.en };
      
      // 批量翻译所有文本
      for (const [key, text] of Object.entries(DEFAULT_TRANSLATIONS.en)) {
        try {
          const translation = await translator.translate(text, { 
            targetLanguage: targetLang 
          });
          translated[key] = translation;
        } catch (err) {
          console.error(`Failed to translate "${key}":`, err);
          translated[key] = text; // 失败时使用英语
        }
      }
      
      return translated;
    } catch (err) {
      console.error('Batch translation failed:', err);
      setError('Translation failed, using English');
      return DEFAULT_TRANSLATIONS.en;
    } finally {
      setIsTranslating(false);
    }
  }, [isTranslatorAvailable]);

  // 切换语言
  const switchLanguage = useCallback(async (langCode) => {
    if (langCode === currentLanguage) return;
    
    console.log(`Switching language to: ${langCode}`);
    
    if (langCode === 'en') {
      // 如果是英语，直接使用默认翻译
      setTranslations(DEFAULT_TRANSLATIONS.en);
      setCurrentLanguage('en');
      localStorage.setItem('preferred-language', 'en');
      return;
    }
    
    // 对于其他语言，进行翻译
    try {
      setIsTranslating(true);
      const translated = await batchTranslate(DEFAULT_TRANSLATIONS.en, langCode);
      
      setTranslations(translated);
      setCurrentLanguage(langCode);
      localStorage.setItem('preferred-language', langCode);
      
      console.log(`Language switched to: ${langCode}`);
    } catch (err) {
      console.error('Language switch failed:', err);
      setError(`Failed to switch to ${langCode}`);
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage, batchTranslate]);

  // 获取翻译文本（带参数替换）
  const t = useCallback((key, params = {}) => {
    let text = translations[key] || key;
    
    // 替换参数 {key} -> value
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), paramValue);
    });
    
    return text;
  }, [translations]);

  // 初始化语言设置
  useEffect(() => {
    const initializeLanguage = async () => {
      // 1. 检查本地存储的用户偏好
      const savedLanguage = localStorage.getItem('preferred-language');
      if (savedLanguage && SUPPORTED_LANGUAGES.some(lang => lang.code === savedLanguage)) {
        await switchLanguage(savedLanguage);
        return;
      }
      
      // 2. 尝试自动检测语言
      const detectedLang = await detectLanguage();
      if (detectedLang && detectedLang !== 'en') {
        await switchLanguage(detectedLang);
        return;
      }
      
      // 3. 使用英语作为默认
      setCurrentLanguage('en');
      setTranslations(DEFAULT_TRANSLATIONS.en);
    };
    
    initializeLanguage();
  }, [detectLanguage, switchLanguage]);

  return {
    // 状态
    currentLanguage,
    isTranslating,
    error,
    detectedLanguage,
    
    // 方法
    t,
    switchLanguage,
    translateText,
    detectLanguage,
    
    // 可用性检查
    isLanguageDetectionAvailable: isLanguageDetectionAvailable(),
    isTranslatorAvailable: isTranslatorAvailable(),
    
    // 工具
    supportedLanguages: SUPPORTED_LANGUAGES
  };
};

export default useLanguage;