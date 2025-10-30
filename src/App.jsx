import React, { useState } from 'react';
import { Camera, Sparkles, Shield, WifiOff, ChevronLeft, ChevronRight } from 'lucide-react';
import LanguageSelector from './components/LanguageSelector';
import CameraCapture from './components/CameraCapture';
import FaceAnalyzer from './components/FaceAnalyzer';
import StyleGallery from './components/StyleGallery';
import ResultsView from './components/ResultsView';
import { useStorage } from './hooks/useStorage';

// 简单的翻译函数
const translations = {
  en: {
    app: {
      title: "AI Hairstyle Advisor",
      subtitle: "Using Chrome Built-in AI · Privacy Protection · Offline Available",
      builtFor: "Built for Google Chrome Built-in AI Challenge 2025"
    },
    navigation: {
      back: "Back",
      next: "Next", 
      restart: "Restart",
      steps: {
        camera: "Take Photo",
        analysis: "AI Analysis", 
        selection: "Browse Styles",
        results: "Get Advice"
      }
    },
    common: {
      privacy: "Data Never Leaves Device",
      offline: "Offline Available",
      poweredBy: "Powered by {technology}"
    }
  },
  zh: {
    app: {
      title: "AI发型顾问",
      subtitle: "使用Chrome内置AI技术 · 保护隐私 · 离线可用",
      builtFor: "Built for Google Chrome Built-in AI Challenge 2025"
    },
    navigation: {
      back: "上一步",
      next: "下一步",
      restart: "重新开始", 
      steps: {
        camera: "拍照",
        analysis: "AI分析",
        selection: "选择发型",
        results: "获取建议"
      }
    },
    common: {
      privacy: "数据不离设备",
      offline: "离线可用", 
      poweredBy: "技术支持: {technology}"
    }
  }
};

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userImage, setUserImage] = useState(null);
  const [faceAnalysis, setFaceAnalysis] = useState(null);
  const [selectedHairstyle, setSelectedHairstyle] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('en'); // 默认英文
  const { saveHistory } = useStorage();

  // 简单翻译函数
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        // 回退到英文
        let fallbackValue = translations.en;
        for (const fallbackKey of keys) {
          fallbackValue = fallbackValue?.[fallbackKey];
        }
        value = fallbackValue || key;
        break;
      }
    }

    // 参数替换
    if (typeof value === 'string' && params.technology) {
      return value.replace('{technology}', params.technology);
    }

    return value;
  };

  const handleImageCapture = (image) => {
    setUserImage(image);
    setCurrentStep(2);
  };

  const handleFaceAnalysisComplete = (analysis) => {
    setFaceAnalysis(analysis);
    setCurrentStep(3);
  };

  const handleHairstyleSelect = (hairstyle) => {
    setSelectedHairstyle(hairstyle);
    setCurrentStep(4);
  };

  const handleRecommendationGenerated = (rec) => {
    setRecommendation(rec);
    saveHistory({
      timestamp: new Date().toISOString(),
      faceShape: faceAnalysis.faceShape,
      hairstyle: selectedHairstyle.name,
      recommendation: rec
    });
  };

  const handleRestart = () => {
    setUserImage(null);
    setFaceAnalysis(null);
    setSelectedHairstyle(null);
    setRecommendation(null);
    setCurrentStep(1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const steps = [
    { number: 1, title: t('navigation.steps.camera'), description: "Upload or take photo" },
    { number: 2, title: t('navigation.steps.analysis'), description: "AI analyzes face shape" },
    { number: 3, title: t('navigation.steps.selection'), description: "Browse hairstyles" },
    { number: 4, title: t('navigation.steps.results'), description: "Get recommendations" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold gradient-text">
                  {t('app.title')}
                </h1>
                <p className="text-sm text-gray-600">
                  {t('app.subtitle')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>{t('common.privacy')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <WifiOff className="w-4 h-4 text-blue-600" />
                  <span>{t('common.offline')}</span>
                </div>
              </div>
              
              <LanguageSelector 
                currentLanguage={currentLanguage}
                onLanguageChange={setCurrentLanguage}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center gap-4">
                <button
                  onClick={() => {
                    if (step.number <= currentStep || step.number === currentStep + 1) {
                      setCurrentStep(step.number);
                    }
                  }}
                  disabled={step.number > currentStep + 1}
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 font-semibold transition-all ${
                    currentStep >= step.number 
                      ? 'bg-purple-600 border-purple-600 text-white hover:bg-purple-700 cursor-pointer' 
                      : step.number === currentStep + 1
                      ? 'bg-white border-purple-300 text-purple-600 hover:border-purple-500 cursor-pointer'
                      : 'bg-white border-gray-300 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {step.number}
                </button>
                <div className="text-center">
                  <div className={`font-medium ${
                    currentStep >= step.number ? 'text-purple-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 max-w-[120px]">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 ${
                    currentStep > step.number ? 'bg-purple-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mb-6">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            {t('navigation.back')}
          </button>
          
          <button
            onClick={handleRestart}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {t('navigation.restart')}
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentStep === 4 || 
              (currentStep === 1 && !userImage) ||
              (currentStep === 2 && (!faceAnalysis || !faceAnalysis.faceDetected)) ||
              (currentStep === 3 && !selectedHairstyle)}
            className="flex items-center gap-2 px-6 py-3 text-purple-600 hover:text-purple-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {t('navigation.next')}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {currentStep === 1 && (
            <CameraCapture onImageCapture={handleImageCapture} />
          )}
          
          {currentStep === 2 && userImage && (
            <FaceAnalyzer
              userImage={userImage}
              onAnalysisComplete={handleFaceAnalysisComplete}
            />
          )}
          
          {currentStep === 3 && faceAnalysis && (
            <StyleGallery
              faceAnalysis={faceAnalysis}
              onHairstyleSelect={handleHairstyleSelect}
            />
          )}
          
          {currentStep === 4 && faceAnalysis && selectedHairstyle && (
            <ResultsView
              userImage={userImage}
              faceAnalysis={faceAnalysis}
              selectedHairstyle={selectedHairstyle}
              onRecommendationGenerated={handleRecommendationGenerated}
              onRestart={handleRestart}
              currentLanguage={currentLanguage}
            />
          )}
        </div>

        {/* Technical Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>✨ {t('common.poweredBy', { technology: 'Chrome Built-in AI' })} · 🛡️ {t('common.privacy')} · 📱 {t('common.offline')}</p>
          <p className="mt-1">{t('app.builtFor')}</p>
        </div>
      </div>
    </div>
  );
}

export default App;