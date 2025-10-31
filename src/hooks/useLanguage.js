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
    'common.translating': 'Translating...',

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
    
    // 发型推荐
    'recommender.title': 'AI Hairstyle Recommendation',
    'recommender.generating': 'AI is generating personalized advice...',
    'recommender.generationFailed': 'Generation Failed',
    'recommender.regenerate': 'Regenerate Recommendation',
    'recommender.ready': 'Ready to Generate Advice',
    'recommender.basedOn': 'Based on your {faceShape} face shape and selected {hairstyle}',
    'recommender.generate': 'Generate AI Advice',
    'recommender.about': 'AI Recommendations',
    'recommender.feature': 'AI-generated advice based on face shape and hairstyle features',
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
    'language.select': 'Select language',
    'language.apiUnavailable': 'API Unavailable',
    'language.autoDetect': 'Auto Detect',

    'app.title': 'AI Hairstyle Advisor',
    'app.statements': 'Chrome Built-in AI  |  Privacy Protection  |  Offline Available',
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
    'storage.usage': 'Storage Usage: {size} MB',

    'analysis.analyzing': 'AI is analyzing facial features...',
    'analysis.detecting': 'Analyzing your facial features to recommend the perfect hairstyle...',
    'analysis.processingImage': 'Processing image',
    'analysis.analyzingFeatures': 'Analyzing features',
    'analysis.generatingResults': 'Generating results',
    'analysis.cancel': 'Cancel Analysis',
    'analysis.failed': 'Analysis failed',
    'analysis.errorDetails': 'Error Details:',
    'analysis.languageModelError': "Failed to execute 'prompt' on 'LanguageModel': Required member is undefined.",
    'analysis.tryAgain': 'Try Again',
    'analysis.tryAgainCount': 'Try Again ({count})',
    'analysis.skip': 'Skip Analysis',
    'analysis.troubleshootingTips': 'Troubleshooting Tips:',
    'analysis.tip1': 'Ensure you\'re using Chrome 138+ on desktop',
    'analysis.tip2': 'Check that AI features are enabled in chrome://flags',
    'analysis.tip3': 'Try a different, clear front-facing photo',
    'analysis.tip4': 'Ensure good lighting in your photo',
    'analysis.complete': 'Analysis complete',
    'analysis.featuresIdentified': 'Your facial features have been identified',
    'analysis.ready': 'Ready for analysis',
    'analysis.clickToStart': 'Click to start face analysis',
    'analysis.results': 'Detection Results',
    'analysis.faceShapeDescription': 'Face shape description',
    'analysis.faceShape': 'Face Shape',
    'analysis.usingDemoData': 'Using demo data',
    'analysis.demoDataDescription': 'Chrome AI is not available. Using sample data to demonstrate the experience.',
    'analysis.completeShort': 'Analysis complete!',
    'analysis.nextStep': 'Based on your {faceShape} face shape, suitable hairstyles will be recommended next.',
    'analysis.poweredBy': 'Powered by {aiType}',
    'analysis.chromeAI': 'Chrome Built-in AI',
    'analysis.demoMode': 'Demo Mode',
    'analysis.dataProcessedLocally': 'Data is processed locally to protect your privacy',
    'faceShape.default': 'Versatile face shape suitable for various styles',

    // ResultsView 新增翻译
    'results.shareTitle': 'AI Hairstyle Recommendation',
    'results.shareText': 'Based on my {faceShape} face shape, AI recommended {hairstyle} hairstyle!',
    'results.clipboardText': 'My {faceShape} face shape is suitable for {hairstyle} hairstyle!\n\n{recommendation}...',
    'results.copiedToClipboard': 'Recommendation copied to clipboard!',
    'results.downloadContent': `AI Hairstyle Recommendation Report\n==================================================\n\nFace Analysis: {faceShape}\nRecommended Hairstyle: {hairstyle}\nRecommendation Time: {timestamp}\n\nDetailed Advice:\n{recommendation}\n\nFeatures:\n{features}\n\nSuitable Face Shapes:\n{suitableShapes}\n\nMaintenance Difficulty: {difficulty}`,
    'results.notAvailable': 'N/A',
    'results.downloadFilename': 'Hairstyle-Recommendation-{hairstyle}.txt',
    'results.title': 'Hairstyle Recommendation',
    'results.subtitle': 'Personalized hairstyle plan generated based on AI analysis',
    'results.yourPhoto': 'Your Photo',
    'results.photoAlt': 'User photo',
    'results.faceAnalysis': 'Face Analysis',
    'results.detectedFaceShape': 'Detected Face Shape',
    'results.selectedHairstyle': 'Selected Hairstyle',
    'results.recommendationLevel': 'Recommendation Level',
    'results.suitableFaceShapes': 'Suitable Face Shapes',
    'results.download': 'Download Recommendation',
    'results.share': 'Share Results',
    'results.notice': 'Notice',
    'results.note1': 'This recommendation is generated based on AI analysis and is for reference only',
    'results.note2': 'Actual results may vary depending on hair texture, facial details, and other factors',
    'results.note3': 'We recommend consulting with a professional hairstylist for the best hairstyle solution',
    'results.note4': 'Your photos and data analysis are processed completely locally to protect your privacy',

  // StyleGallery 新增翻译
    'gallery.title': 'Choose Your Favorite Hairstyle',
    'gallery.yourFaceShape': 'Your Face Shape: {faceShape}',
    'gallery.recommendedStyles': 'Recommended Styles',
    'gallery.search': 'Search hairstyle names, types...',
    'gallery.filterByTag': 'Filter by tag:',
    'gallery.filterByDifficulty': 'Filter by difficulty:',
    'gallery.all': 'All',
    'gallery.recommended': 'Recommended',
    'gallery.noResults': 'No matching hairstyles found',
    'gallery.tryAdjusting': 'Try adjusting search or filter conditions',
    'gallery.showingResults': 'Showing {count} of {total} hairstyles',
    'gallery.tagsSelected': '{count} tags selected',
    'gallery.recommendationLevel': 'Recommendation: {level}',

    // 发型维护级别
    'maintenance.low': 'Low',
    'maintenance.medium': 'Medium',
    'maintenance.high': 'High',

    // 发型难度选项标签
    'difficulty.easyMaintenance': 'Easy Maintenance',
    'difficulty.mediumMaintenance': 'Medium Maintenance',
    'difficulty.highMaintenance': 'High Maintenance',

    // 发型标签
    'hairstyle.tag.short': 'Short',
    'hairstyle.tag.classic': 'Classic',
    'hairstyle.tag.easyMaintenance': 'Easy Maintenance',
    'hairstyle.tag.long': 'Long',
    'hairstyle.tag.straight': 'Straight',
    'hairstyle.tag.elegant': 'Elegant',
    'hairstyle.tag.curly': 'Curly',
    'hairstyle.tag.romantic': 'Romantic',
    'hairstyle.tag.feminine': 'Feminine',
    'hairstyle.tag.mediumLength': 'Medium Length',
    'hairstyle.tag.popular': 'Popular',
    'hairstyle.tag.versatile': 'Versatile',
    'hairstyle.tag.ultraShort': 'Ultra Short',
    'hairstyle.tag.personality': 'Personality',
    'hairstyle.tag.fashion': 'Fashion',
    'hairstyle.tag.bangs': 'Bangs',
    'hairstyle.tag.french': 'French',
    'hairstyle.tag.layered': 'Layered',
    'hairstyle.tag.threeDimensional': 'Three-dimensional',
    'hairstyle.tag.vintage': 'Vintage',

  // Bob Cut 发型
    'hairstyle.bob.name': 'Bob Cut',
    'hairstyle.bob.description': 'Classic short hair, length between ears and shoulders, suitable for various face shapes',
    'hairstyle.bob.feature1': 'Face shape modification',
    'hairstyle.bob.feature2': 'Youthful look',
    'hairstyle.bob.feature3': 'Suitable for workplace',

  // Long Straight 发型
    'hairstyle.longStraight.name': 'Long Straight',
    'hairstyle.longStraight.description': 'Naturally smooth long straight hair, showing elegant temperament',
    'hairstyle.longStraight.feature1': 'Elegant temperament',
    'hairstyle.longStraight.feature2': 'Versatile',
    'hairstyle.longStraight.feature3': 'Suitable for various occasions',

  // Wavy Hair 发型
    'hairstyle.wavy.name': 'Wavy Hair',
    'hairstyle.wavy.description': 'Romantic wavy hair, increasing hair volume and three-dimensional sense',
    'hairstyle.wavy.feature1': 'Increase hair volume',
    'hairstyle.wavy.feature2': 'Modify face shape',
    'hairstyle.wavy.feature3': 'Strong fashion sense',

  // Lob Cut 发型
    'hairstyle.lob.name': 'Lob Cut',
    'hairstyle.lob.description': 'Hair length at shoulder position, combining the crispness of short hair and the softness of long hair',
    'hairstyle.lob.feature1': 'Fashionable',
    'hairstyle.lob.feature2': 'Easy maintenance',
    'hairstyle.lob.feature3': 'Suitable for various ages',

  // Pixie Cut 发型
    'hairstyle.pixie.name': 'Pixie Cut',
    'hairstyle.pixie.description': 'Ultra-short hairstyle, highlighting facial contours, showing personality',
    'hairstyle.pixie.feature1': 'Highlight facial features',
    'hairstyle.pixie.feature2': 'Show personality',
    'hairstyle.pixie.feature3': 'Refreshing and neat',

    // French Bangs 发型
    'hairstyle.frenchBangs.name': 'French Bangs',
    'hairstyle.frenchBangs.description': 'Casual and casual bangs, adding fashion sense with various hairstyles',
    'hairstyle.frenchBangs.feature1': 'Modify forehead',
    'hairstyle.frenchBangs.feature2': 'Anti-aging',
    'hairstyle.frenchBangs.feature3': 'Increase fashion sense',

  // Layered Long Hair 发型
    'hairstyle.layeredLong.name': 'Layered Long Hair',
    'hairstyle.layeredLong.description': 'Long hair with a sense of layers, increasing the dynamics and three-dimensional sense of the hairstyle',
    'hairstyle.layeredLong.feature1': 'Increase dynamics',
    'hairstyle.layeredLong.feature2': 'Modify face shape',
    'hairstyle.layeredLong.feature3': 'Show hair volume',

  // Vintage Curls 发型
    'hairstyle.vintageCurls.name': 'Vintage Curls',
    'hairstyle.vintageCurls.description': 'Small curly hair in retro style, showing retro charm',
    'hairstyle.vintageCurls.feature1': 'Retro style',
    'hairstyle.vintageCurls.feature2': 'Show personality',
    'hairstyle.vintageCurls.feature3': 'Suitable for special occasions',

  // StyleGallery 新增翻译
    'gallery.difficultyLevel': 'Difficulty: {level}',
    // AI 相关翻译
    'ai.faceAnalysisPrompt': `Analyze this face image and identify the face shape from: Oval, Round, Square, Heart, Long.

    Return JSON format:
    {
      "faceShape": "detected_shape",
      "confidence": "percentage",
      "features": {
        "symmetry": "description",
        "proportions": "description"
      }
    }
  
    If no face detected: {"error": "No face detected"}`,
  
      'ai.invalidResponseFormat': 'Invalid response format from AI',
      'ai.responseFormatError': 'AI response format error',
      'ai.analysisCancelled': 'Analysis cancelled by user',
      'ai.chromeAINotAvailable': 'Chrome AI is not available. Please use Chrome 138+ on desktop.',
      'ai.noFaceDetected': 'No face detected in the image. Please upload a clear front-facing photo.',
      'ai.analysisFailed': 'AI analysis failed. Please try again or skip to continue.',
    
      'ai.recommendationPrompt': `You are a professional hair style advisor, generate hairstyle recommendations based on:
  
    Face shape: {faceShape}
    Hairstyle: {hairstyleName}
    Features: {hairstyleDescription}
  
    Include:
    1. Why it suits the face shape
    2. Maintenance tips
    3. Styling suggestions
    4. Some popular persons with this hairstyle
    5. How to speak to barber
    Please do not include any Markdown formatted text in your answer.
    Answer in corresponding concise 5 paragraphs within 50 words, use short sentences or bullet points if possible to prevent reading difficulty.`,
  
    'ai.recommendationNotAvailable': 'Chrome AI is not available for generating recommendations.',
    'ai.recommendationCancelled': 'Recommendation generation cancelled',
    'ai.recommendationFailed': 'Recommendation generation failed. Please try again.'
  }
};

// 创建全局状态管理
let globalTranslations = { ...DEFAULT_TRANSLATIONS };
let globalCurrentLanguage = 'en';
let listeners = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState(globalCurrentLanguage);
  const [translations, setTranslations] = useState(globalTranslations[globalCurrentLanguage] || DEFAULT_TRANSLATIONS.en);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState(null);

  // 监听全局状态变化
  useEffect(() => {
    const listener = () => {
      setCurrentLanguage(globalCurrentLanguage);
      setTranslations(globalTranslations[globalCurrentLanguage] || DEFAULT_TRANSLATIONS.en);
    };
    
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  // 检查 Chrome Translator API 是否可用
  const isTranslatorAvailable = useCallback(() => {
    return typeof window !== 'undefined' && 'Translator' in window;
  }, []);

  // 从 localStorage 获取缓存的翻译
  const getCachedTranslation = useCallback((langCode) => {
    try {
      const cached = localStorage.getItem(`translation-${langCode}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.warn('Failed to get cached translation:', error);
      return null;
    }
  }, []);

  // 保存翻译到 localStorage
  const saveTranslationToCache = useCallback((langCode, translation) => {
    try {
      localStorage.setItem(`translation-${langCode}`, JSON.stringify(translation));
      console.log(`💾 Saved translation for ${langCode} to cache`);
    } catch (error) {
      console.warn('Failed to save translation to cache:', error);
    }
  }, []);

  // 批量翻译
  const batchTranslate = useCallback(async (sourceTexts, targetLang) => {
    if (targetLang === 'en') {
      return DEFAULT_TRANSLATIONS.en;
    }

    if (!isTranslatorAvailable()) {
      throw new Error('Translator API not available');
    }

    try {
      console.log(`🔄 Translating to ${targetLang}...`);
      
      const translator = await window.Translator.create({
        sourceLanguage: 'en',
        targetLanguage: targetLang
      });
      
      const translated = {};
      const keys = Object.keys(sourceTexts);
      
      // 顺序翻译以确保稳定性
      for (const key of keys) {
        const text = sourceTexts[key];
        if (text && typeof text === 'string') {
          try {
            translated[key] = await translator.translate(text);
            console.log(`✅ Translated: "${text.substring(0, 30)}..." -> "${translated[key].substring(0, 30)}..."`);
          } catch (err) {
            console.warn(`Translation failed for key "${key}":`, err);
            translated[key] = text;
          }
        } else {
          translated[key] = text;
        }
      }
      
      console.log(`✅ Translation to ${targetLang} completed`);
      return translated;
      
    } catch (err) {
      console.error(`❌ Translation to ${targetLang} failed:`, err);
      throw err;
    }
  }, [isTranslatorAvailable]);

  // 切换语言 - 修复全局状态更新
  const switchLanguage = useCallback(async (targetLang) => {
    if (targetLang === globalCurrentLanguage) {
      return;
    }
    
    setIsTranslating(true);
    setTranslationError(null);
    
    try {
      let newTranslations;
      
      if (targetLang === 'en') {
        newTranslations = DEFAULT_TRANSLATIONS.en;
        console.log(`🔤 Switched to English (built-in)`);
      } else {
        const cachedTranslation = getCachedTranslation(targetLang);
        
        if (cachedTranslation) {
          newTranslations = cachedTranslation;
          console.log(`📁 Using cached translation for ${targetLang}`);
        } else {
          console.log(`🌐 Translating to ${targetLang} for the first time`);
          newTranslations = await batchTranslate(DEFAULT_TRANSLATIONS.en, targetLang);
          saveTranslationToCache(targetLang, newTranslations);
          console.log(`💾 Cached translation for ${targetLang}`);
        }
      }
      
      // 更新全局状态
      globalTranslations[targetLang] = newTranslations;
      globalCurrentLanguage = targetLang;
      
      // 保存偏好设置
      localStorage.setItem('preferred-language', targetLang);
      
      // 通知所有监听器
      notifyListeners();
      
      console.log(`🎯 Global language updated to: ${targetLang}`);
      
    } catch (err) {
      console.error('Language switch failed:', err);
      setTranslationError(err.message);
      
      // 出错时回退到英语
      globalTranslations.en = DEFAULT_TRANSLATIONS.en;
      globalCurrentLanguage = 'en';
      localStorage.setItem('preferred-language', 'en');
      notifyListeners();
    } finally {
      setIsTranslating(false);
    }
  }, [batchTranslate, getCachedTranslation, saveTranslationToCache]);

  // 获取翻译文本
  const t = useCallback((key, fallback = '', params = {}) => {
    let text = translations[key] || fallback || key;
    
    // 替换参数
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      const placeholder = `{${paramKey}}`;
      text = text.replace(new RegExp(placeholder, 'g'), paramValue);
    });
    
    return text;
  }, [translations]);

  // 手动清除翻译缓存
  const clearTranslationCache = useCallback(() => {
    SUPPORTED_LANGUAGES.forEach(lang => {
      if (lang.code !== 'en') {
        localStorage.removeItem(`translation-${lang.code}`);
      }
    });
    
    globalTranslations = { en: DEFAULT_TRANSLATIONS.en };
    globalCurrentLanguage = 'en';
    localStorage.setItem('preferred-language', 'en');
    notifyListeners();
    
    console.log('🧹 Cleared all translation cache');
  }, []);

  // 获取已缓存的语言列表
  const getCachedLanguages = useCallback(() => {
    return SUPPORTED_LANGUAGES.filter(lang => {
      if (lang.code === 'en') return true;
      return getCachedTranslation(lang.code) !== null;
    }).map(lang => lang.code);
  }, [getCachedTranslation]);

  // 初始化语言设置
  useEffect(() => {
    const initializeLanguage = async () => {
      const savedLanguage = localStorage.getItem('preferred-language');
      
      if (savedLanguage && SUPPORTED_LANGUAGES.some(lang => lang.code === savedLanguage)) {
        if (savedLanguage !== 'en') {
          const cached = getCachedTranslation(savedLanguage);
          if (cached) {
            globalTranslations[savedLanguage] = cached;
            globalCurrentLanguage = savedLanguage;
            notifyListeners();
          } else {
            await switchLanguage(savedLanguage);
          }
        }
      }
    };
    
    initializeLanguage();
  }, [getCachedTranslation, switchLanguage]);

  return {
    currentLanguage,
    isTranslating,
    translationError,
    t,
    switchLanguage,
    clearTranslationCache,
    getCachedLanguages,
    supportedLanguages: SUPPORTED_LANGUAGES,
    isTranslatorAvailable: isTranslatorAvailable()
  };
};

export default useLanguage;