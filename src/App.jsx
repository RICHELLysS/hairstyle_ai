import React, { useState, useEffect, useMemo } from 'react';
import { Camera, Sparkles, Shield, WifiOff } from 'lucide-react';
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
  const [hasCompletedStep1, setHasCompletedStep1] = useState(false);
  const { saveHistory } = useStorage();
  
  const { t, isTranslating, currentLanguage } = useLanguage();

  useEffect(() => {
    console.log(`🔄 App: Current step changed to ${currentStep}`, {
      hasUserImage: !!userImage,
      hasFaceAnalysis: !!faceAnalysis,
      hasSelectedHairstyle: !!selectedHairstyle,
      hasRecommendation: !!recommendation,
      hasCompletedStep1: hasCompletedStep1
    });
  }, [currentStep, userImage, faceAnalysis, selectedHairstyle, recommendation, hasCompletedStep1]);

  const handleImageCapture = (image) => {
    console.log('📸 Step 1: Image captured, starting face analysis...');
    setUserImage(image);
    setHasCompletedStep1(true);
    
    // 自动开始面部分析，作为过渡步骤
    setTimeout(() => {
      console.log('🔍 Starting AI face analysis...');
    }, 100);
  };

  const handleFaceAnalysisComplete = (analysis) => {
    console.log('✅ Face analysis completed:', {
      faceShape: analysis.faceShape,
      faceDetected: analysis.faceDetected
    });
    setFaceAnalysis(analysis);
    setCurrentStep(2); // 直接进入步骤2（浏览发型）
  };

  const handleHairstyleSelect = (hairstyle) => {
    console.log('💇 Step 2: Hairstyle selected:', hairstyle.name);
    setSelectedHairstyle(hairstyle);
    setCurrentStep(3); // 进入步骤3（获取推荐）
  };

  const handleRecommendationGenerated = (rec) => {
    console.log('🎯 Step 3: Recommendation generated');
    setRecommendation(rec);
    saveHistory({
      timestamp: new Date().toISOString(),
      faceShape: faceAnalysis.faceShape,
      hairstyle: selectedHairstyle.name,
      recommendation: rec
    });
  };

  const handleRestart = () => {
    console.log('🔄 Restarting application...');
    setUserImage(null);
    setFaceAnalysis(null);
    setSelectedHairstyle(null);
    setRecommendation(null);
    setCurrentStep(1);
    setHasCompletedStep1(false);
  };

  const handleStepClick = (stepNumber) => {
    if (!isStepClickable(stepNumber)) return;
    
    console.log(`📝 Navigating to step ${stepNumber} from step ${currentStep}`);
    
    if (stepNumber === 1 && currentStep > 1) {
      console.log('↩️ Returning to step 1 - resetting analysis state');
      setHasCompletedStep1(false);
      setFaceAnalysis(null);
    }
    
    setCurrentStep(stepNumber);
  };

  // 使用 useMemo 优化步骤配置，确保语言切换时重新计算
  const steps = useMemo(() => [
    { 
      number: 1, 
      title: t('navigation.steps.camera', 'Upload or take photo'), 
      description: t('step.camera.description', 'Upload or take photo'),
      enabled: true
    },
    { 
      number: 2, 
      title: t('navigation.steps.selection', 'Browse hairstyles'), 
      description: t('step.selection.description', 'Browse hairstyles'),
      enabled: !!userImage && hasCompletedStep1 && !!faceAnalysis
    },
    { 
      number: 3, 
      title: t('navigation.steps.results', 'Get recommendations'), 
      description: t('step.results.description', 'Get recommendations'),
      enabled: !!userImage && !!selectedHairstyle
    }
  ], [t, userImage, hasCompletedStep1, faceAnalysis, selectedHairstyle]);

  const isStepClickable = (stepNumber) => {
    const step = steps.find(s => s.number === stepNumber);
    return step ? step.enabled : false;
  };

  return (
    <div className="min-h-screen bg-white">
      {isTranslating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-700">
              {t('common.translating', 'Translating to')} {currentLanguage}...
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="glass-effect sticky top-0 z-10 shadow-sm bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-orange-500" />
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
              <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-orange-600" />
                  <span>{t('common.privacy', 'Data Never Leaves Device')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <WifiOff className="w-4 h-4 text-orange-600" />
                  <span>{t('common.offline', 'Offline Available')}</span>
                </div>
              </div>
              
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="max-w-4xl mx-auto px-4 py-8 bg-white">
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4 md:gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center gap-2 md:gap-4">
                <button
                  onClick={() => handleStepClick(step.number)}
                  disabled={!isStepClickable(step.number)}
                  className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-2 font-semibold transition-all ${
                    currentStep === step.number
                      ? 'bg-orange-500 border-orange-500 text-white shadow-lg transform scale-110'
                      : isStepClickable(step.number)
                      ? 'bg-white text-orange-500 hover:shadow-md cursor-pointer'
                      : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {step.number}
                </button>
                <div className="text-center max-w-[100px] md:max-w-[120px]">
                  <div className={`font-medium text-sm md:text-base ${
                    currentStep === step.number 
                      ? 'text-orange-500 font-semibold' 
                      : isStepClickable(step.number)
                      ? 'text-gray-700'
                      : 'text-gray-400'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 hidden md:block">
                    {step.description}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-4 md:w-12 h-0.5 ${
                    isStepClickable(step.number + 1) ? 'bg-orange-300' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 在步骤3显示重新开始按钮 */}
        {currentStep === 3 && (
          <div className="flex justify-center mb-6">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-orange-600 transition-colors font-medium"
            >
              <Camera className="w-4 h-4" />
              {t('navigation.restart', 'Start Over')}
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {currentStep === 1 && (
            <div>
              <CameraCapture 
                onImageCapture={handleImageCapture}
                existingImage={userImage}
              />
              {/* 只有当用户点击了"use this photo"后才显示分析组件 */}
              {hasCompletedStep1 && userImage && (
                <div className="mt-6">
                  <FaceAnalyzer
                    userImage={userImage}
                    onAnalysisComplete={handleFaceAnalysisComplete}
                  />
                </div>
              )}
            </div>
          )}
          
          {currentStep === 2 && faceAnalysis && (
            <StyleGallery
              faceAnalysis={faceAnalysis}
              onHairstyleSelect={handleHairstyleSelect}
            />
          )}
          
          {currentStep === 3 && faceAnalysis && selectedHairstyle && (
            <ResultsView
              userImage={userImage}
              faceAnalysis={faceAnalysis}
              selectedHairstyle={selectedHairstyle}
              onRecommendationGenerated={handleRecommendationGenerated}
              onRestart={handleRestart}
            />
          )}
        </div>

        {/* Technical Info */}
        <div className="mt-8 text-center text-sm text-gray-500 bg-white py-4">
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