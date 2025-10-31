import React, { useState, useEffect } from 'react';
import { Globe, Check, Loader, AlertCircle, Languages, RefreshCw } from 'lucide-react';
import useLanguage from '../hooks/useLanguage';

const LanguageSelector = () => {
  const {
    currentLanguage,
    isTranslating,
    switchLanguage,
    supportedLanguages,
    isTranslatorAvailable,
    detectedLanguage,
    error,
    fallbackToEnglish,
    resetToEnglish,
    t
  } = useLanguage();
  
  const [isOpen, setIsOpen] = useState(false);
  const [localError, setLocalError] = useState(null);

  const currentLang = supportedLanguages.find(lang => lang.code === currentLanguage);

  // 同步错误状态
  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  const handleLanguageSelect = async (langCode) => {
    try {
      setLocalError(null);
      await switchLanguage(langCode);
      setIsOpen(false);
    } catch (err) {
      setLocalError('Failed to switch language');
      console.error('Language switch error:', err);
    }
  };

  const handleRetryEnglish = () => {
    setLocalError(null);
    resetToEnglish();
    setIsOpen(false);
  };

  // 如果回退到英语，显示英语而不是用户选择的语言
  const displayLanguage = fallbackToEnglish ? 'en' : currentLanguage;
  const displayLangInfo = supportedLanguages.find(lang => lang.code === displayLanguage);

  return (
    <div className="relative inline-block">
      {/* 错误提示 */}
      {localError && (
        <div className="absolute bottom-full mb-2 right-0 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs max-w-xs z-50 shadow-lg">
          <div className="flex items-center gap-1 mb-1">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            <span className="font-medium">Translation Failed</span>
          </div>
          <div className="mb-2">{localError}</div>
          <button
            onClick={handleRetryEnglish}
            className="w-full bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Switch to English
          </button>
        </div>
      )}

      {/* 语言切换按钮 */}
      <button
        className={`flex items-center gap-2 px-3 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-sm ${
          fallbackToEnglish ? 'border-amber-300 bg-amber-50' : 'border-gray-300'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isTranslating}
        aria-label={t('language.select', 'Select language')}
      >
        {isTranslating ? (
          <Loader className="w-4 h-4 animate-spin text-orange-500" />
        ) : (
          <Globe className={`w-4 h-4 ${fallbackToEnglish ? 'text-amber-600' : 'text-gray-600'}`} />
        )}
        <span className={`font-medium ${fallbackToEnglish ? 'text-amber-700' : 'text-gray-800'}`}>
          {displayLangInfo?.code.toUpperCase()}
        </span>
        {fallbackToEnglish && (
          <div className="w-2 h-2 bg-amber-500 rounded-full" title="Fallback to English"></div>
        )}
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl min-w-48 z-50 overflow-hidden">
          {/* 标题 */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Languages className="w-4 h-4" />
                {t('language.current', 'Language')}
              </span>
              {!isTranslatorAvailable && (
                <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                  <AlertCircle className="w-3 h-3" />
                  <span className="font-medium">Demo</span>
                </div>
              )}
            </div>
            {fallbackToEnglish && (
              <div className="mt-2 text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded">
                Using English (translation failed)
              </div>
            )}
          </div>
          
          {/* 语言列表 */}
          <div className="max-h-60 overflow-y-auto">
            {supportedLanguages.map((language) => (
              <button
                key={language.code}
                className={`flex items-center justify-between w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 group ${
                  displayLanguage === language.code 
                    ? 'bg-orange-50 border-r-2 border-orange-500' 
                    : ''
                } ${fallbackToEnglish && currentLanguage === language.code ? 'bg-red-50' : ''}`}
                onClick={() => handleLanguageSelect(language.code)}
                disabled={isTranslating}
              >
                <div className="flex flex-col items-start flex-1">
                  <span className={`text-sm font-medium ${
                    displayLanguage === language.code 
                      ? 'text-orange-700' 
                      : 'text-gray-800'
                  }`}>
                    {language.name}
                  </span>
                  <span className="text-xs text-gray-500 group-hover:text-gray-600">
                    {language.nativeName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {displayLanguage === language.code && (
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  )}
                  {fallbackToEnglish && currentLanguage === language.code && (
                    <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0" />
                  )}
                  {isTranslating && currentLanguage === language.code && (
                    <Loader className="w-3 h-3 animate-spin text-orange-500 flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
          
          {/* 自动检测部分 */}
          {detectedLanguage && detectedLanguage !== currentLanguage && !fallbackToEnglish && (
            <div className="border-t border-gray-100 px-4 py-3 bg-blue-50">
              <div className="text-xs text-blue-600 mb-2 font-medium">
                {t('language.autoDetect', 'Auto-detected')}
              </div>
              <button
                className="w-full px-3 py-2 text-sm border border-dashed border-blue-300 rounded-md bg-white text-blue-700 hover:border-blue-400 hover:bg-blue-25 transition-colors flex items-center justify-center gap-2"
                onClick={() => handleLanguageSelect(detectedLanguage)}
                disabled={isTranslating}
              >
                <Globe className="w-3 h-3" />
                <span className="font-medium">
                  {supportedLanguages.find(l => l.code === detectedLanguage)?.nativeName}
                </span>
              </button>
            </div>
          )}

          {/* 重置到英语选项 */}
          {fallbackToEnglish && (
            <div className="border-t border-gray-100 px-4 py-3 bg-amber-50">
              <button
                className="w-full px-3 py-2 text-sm bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 font-medium"
                onClick={handleRetryEnglish}
              >
                <RefreshCw className="w-3 h-3" />
                Confirm English
              </button>
            </div>
          )}

          {/* API 状态提示 */}
          <div className="border-t border-gray-100 px-4 py-2 bg-gray-50">
            <div className="text-xs text-gray-500 text-center">
              {isTranslatorAvailable 
                ? 'Using Chrome Translator API' 
                : 'Using demo translations'
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;