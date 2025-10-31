import React, { useState } from 'react';
import { Camera, Sparkles, Shield, WifiOff, ChevronLeft, ChevronRight } from 'lucide-react';
import LanguageSelector from './components/LanguageSelector';
import useLanguage from './hooks/useLanguage';
import CameraCapture from './components/CameraCapture';
import FaceAnalyzer from './components/FaceAnalyzer';
import StyleGallery from './components/StyleGallery';
import ResultsView from './components/ResultsView';
import { useStorage } from './hooks/useStorage';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userImage, setUserImage] = useState(null);
  const [faceAnalysis, setFaceAnalysis] = useState(null);
  const [selectedHairstyle, setSelectedHairstyle] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const { saveHistory } = useStorage();
  
  // 使用 useLanguage Hook - 移除不需要的 props
  const { t, isTranslating, currentLanguage } = useLanguage();

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

  // 使用 t 函数获取步骤信息
  const steps = [
    { 
      number: 1, 
      title: t('navigation.steps.camera'), 
      description: t('step.camera.description', 'Upload or take photo') 
    },
    { 
      number: 2, 
      title: t('navigation.steps.analysis'), 
      description: t('step.analysis.description', 'AI analyzes face shape') 
    },
    { 
      number: 3, 
      title: t('navigation.steps.selection'), 
      description: t('step.selection.description', 'Browse hairstyles') 
    },
    { 
      number: 4, 
      title: t('navigation.steps.results'), 
      description: t('step.results.description', 'Get recommendations') 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* 全局翻译加载状态 */}
      {isTranslating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-700">
              {t('common.translating', 'Translating to')} {currentLanguage}...
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="glass-effect sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold gradient-text">
                  {t('app.title', 'AI Hairstyle Advisor')}
                </h1>
                <p className="text-sm text-gray-600">
                  {t('app.subtitle', 'Using Chrome Built-in AI · Privacy Protection · Offline Available')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>{t('common.privacy', 'Data Never Leaves Device')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <WifiOff className="w-4 h-4 text-blue-600" />
                  <span>{t('common.offline', 'Offline Available')}</span>
                </div>
              </div>
              
              {/* 移除错误的 props 传递 */}
              <LanguageSelector />
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
                  <div className="text-xs text-gray-500 max-w-[120px]">
                    {step.description}
                  </div>
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
            {t('navigation.back', 'Back')}
          </button>
          
          <button
            onClick={handleRestart}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {t('navigation.restart', 'Restart')}
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentStep === 4 || 
              (currentStep === 1 && !userImage) ||
              (currentStep === 2 && (!faceAnalysis || !faceAnalysis.faceDetected)) ||
              (currentStep === 3 && !selectedHairstyle)}
            className="flex items-center gap-2 px-6 py-3 text-purple-600 hover:text-purple-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {t('navigation.next', 'Next')}
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
              // 不需要传递 currentLanguage，组件内部会使用 useLanguage
            />
          )}
        </div>

        {/* Technical Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            ✨ {t('common.poweredBy', 'Powered by {technology}', { technology: 'Chrome Built-in AI' })} · 
            🛡️ {t('common.privacy', 'Data Never Leaves Device')} · 
            📱 {t('common.offline', 'Offline Available')}
          </p>
          <p className="mt-1">
            {t('app.builtFor', 'Built for Google Chrome Built-in AI Challenge 2025')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;