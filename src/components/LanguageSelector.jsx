import React, { useState } from 'react';
import { Globe, Check, Loader, AlertCircle } from 'lucide-react';
import useLanguage from '../hooks/useLanguage';

const LanguageSelector = () => {
  const {
    currentLanguage,
    isTranslating,
    translationError,
    switchLanguage,
    supportedLanguages,
    getCachedLanguages,
    t
  } = useLanguage();
  
  const [isOpen, setIsOpen] = useState(false);
  const [localTranslating, setLocalTranslating] = useState(false);

  const currentLang = supportedLanguages.find(lang => lang.code === currentLanguage);
  const cachedLanguages = getCachedLanguages();

  const handleLanguageSelect = async (langCode) => {
    if (langCode === currentLanguage) {
      setIsOpen(false);
      return;
    }
    
    setLocalTranslating(true);
    try {
      await switchLanguage(langCode);
    } finally {
      setLocalTranslating(false);
      setIsOpen(false);
    }
  };

  const isButtonTranslating = isTranslating || localTranslating;

  // 获取语言状态
  const getLanguageStatus = (langCode) => {
    if (langCode === 'en') return 'built-in';
    if (cachedLanguages.includes(langCode)) return 'cached';
    return 'needs-translation';
  };

  return (
    <div className="relative inline-block">
      {/* 翻译加载遮罩 */}
      {localTranslating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center min-w-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">
              {t('common.translating')}
            </p>
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {translationError && (
        <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg z-50 max-w-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 font-medium">Translation Failed</span>
          </div>
          <p className="text-red-600 text-sm mt-1">{translationError}</p>
        </div>
      )}

      {/* 语言切换按钮 */}
      <button
        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm font-medium shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isButtonTranslating}
        aria-label={t('language.select', 'Select language')}
      >
        {isButtonTranslating ? (
          <Loader className="w-4 h-4 animate-spin text-orange-500" />
        ) : (
          <Globe className="w-4 h-4 text-gray-600" />
        )}
        <span className="font-medium text-gray-800">
          {currentLang?.code.toUpperCase()}
        </span>
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl min-w-64 z-50 overflow-hidden">
          {/* 语言列表 */}
          <div className="max-h-80 overflow-y-auto">
            {supportedLanguages.map((language) => {
              const status = getLanguageStatus(language.code);
              const isCurrent = currentLanguage === language.code;
              
              return (
                <button
                  key={language.code}
                  className={`flex items-center justify-between w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                    isCurrent ? 'bg-orange-50 border-r-2 border-orange-500' : ''
                  }`}
                  onClick={() => handleLanguageSelect(language.code)}
                  disabled={isButtonTranslating}
                >
                  <div className="flex flex-col items-start flex-1">
                    <span className={`text-sm font-medium ${
                      isCurrent ? 'text-orange-700' : 'text-gray-800'
                    }`}>
                      {language.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {language.nativeName}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* 状态指示器 */}
                    <div className={`w-2 h-2 rounded-full ${
                      status === 'built-in' ? 'bg-blue-400' :
                      status === 'cached' ? 'bg-green-400' :
                      'bg-gray-300'
                    }`} />
                    
                    {isCurrent && (
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    )}
                    
                    {isButtonTranslating && isCurrent && (
                      <Loader className="w-4 h-4 animate-spin text-orange-500 flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;