import React, { useState } from 'react';
import { Globe, Check, Loader, AlertCircle } from 'lucide-react';
import useLanguage from '../hooks/useLanguage';

const LanguageSelector = () => {
  const {
    currentLanguage,
    isTranslating,
    switchLanguage,
    supportedLanguages,
    isTranslatorAvailable,
    detectedLanguage,
    t
  } = useLanguage();
  
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = supportedLanguages.find(lang => lang.code === currentLanguage);

  const handleLanguageSelect = async (langCode) => {
    await switchLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      {/* 语言切换按钮 */}
      <button
        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isTranslating}
        aria-label={t('language.select', 'Select language')}
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-gray-800">{currentLang?.code.toUpperCase()}</span>
        {isTranslating && <Loader className="w-3 h-3 animate-spin text-gray-400" />}
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg min-w-48 z-50 overflow-hidden">
          {/* 标题 */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">
                {t('language.current', 'Current Language')}
              </span>
              {!isTranslatorAvailable && (
                <div className="flex items-center gap-1 text-xs text-amber-600">
                  <AlertCircle className="w-3 h-3" />
                  <span>{t('language.apiUnavailable', 'API Unavailable')}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* 语言列表 */}
          <div className="max-h-60 overflow-y-auto">
            {supportedLanguages.map((language) => (
              <button
                key={language.code}
                className={`flex items-center justify-between w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                  currentLanguage === language.code ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
                onClick={() => handleLanguageSelect(language.code)}
                disabled={isTranslating}
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-800">{language.name}</span>
                  <span className="text-xs text-gray-500">{language.nativeName}</span>
                </div>
                {currentLanguage === language.code && (
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
          
          {/* 自动检测部分 */}
          {detectedLanguage && detectedLanguage !== currentLanguage && (
            <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
              <button
                className="w-full px-3 py-2 text-sm border border-dashed border-gray-300 rounded-md bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                onClick={() => handleLanguageSelect(detectedLanguage)}
              >
                <Globe className="w-3 h-3" />
                <span>
                  {t('language.autoDetect', 'Auto Detect')}: {supportedLanguages.find(l => l.code === detectedLanguage)?.nativeName}
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;