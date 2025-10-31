import React, { useState, useEffect, useRef, useMemo } from 'react';
import LanguageSelector from './components/LanguageSelector';
import useLanguage from './hooks/useLanguage';
import CameraCapture from './components/CameraCapture';
import FaceAnalyzer from './components/FaceAnalyzer';
import StyleGallery from './components/StyleGallery';
import ResultsView from './components/ResultsView';
import { useStorage } from './hooks/useStorage';

/**
 * Main application component orchestrating the hairstyle recommendation workflow
 * Manages multi-step process: photo capture → face analysis → style selection → results
 */
function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userImage, setUserImage] = useState(null);
  const [faceAnalysis, setFaceAnalysis] = useState(null);
  const [selectedHairstyle, setSelectedHairstyle] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [hasCompletedStep1, setHasCompletedStep1] = useState(false);
  const { saveHistory } = useStorage();
  
  const { t, currentLanguage, isTranslating } = useLanguage();

  // Language change listener for forcing re-renders of critical sections
  const [contentKey, setContentKey] = useState(0);
  const hasLoggedSupport = useRef(false);

  /**
   * Checks browser compatibility for Chrome AI features on component mount
   */
  useEffect(() => {
    const isChrome = /Chrome/.test(navigator.userAgent);
    const isSupported = typeof LanguageModel !== 'undefined';
    
    if (!isChrome || !isSupported) {
      console.warn('Chrome AI features require Chrome 138+');
      // Display fallback experience or informational message
    } else {
      console.log('✅ Chrome AI features are supported.');
    }
    hasLoggedSupport.current = true;
  }, []);

  /**
   * Forces content re-render on language changes
   */
  useEffect(() => {
    console.log(`🌐 Language changed to: ${currentLanguage}`);
    setContentKey(prev => prev + 1);
  }, [currentLanguage]);

  /**
   * Handles successful image capture and initiates analysis
   */
  const handleImageCapture = (image) => {
    setUserImage(image);
    setHasCompletedStep1(true);
  };

  /**
   * Processes completed face analysis and advances workflow
   */
  const handleFaceAnalysisComplete = (analysis) => {
    setFaceAnalysis(analysis);
    setCurrentStep(2);
  };

  /**
   * Handles hairstyle selection and advances to results
   */
  const handleHairstyleSelect = (hairstyle) => {
    setSelectedHairstyle(hairstyle);
    setCurrentStep(3);
  };

  /**
   * Processes AI-generated recommendations and saves to history
   */
  const handleRecommendationGenerated = (rec) => {
    setRecommendation(rec);
    saveHistory({
      timestamp: new Date().toISOString(),
      faceShape: faceAnalysis.faceShape,
      hairstyle: selectedHairstyle.name,
      recommendation: rec
    });
  };

  /**
   * Resets application to initial state for new session
   */
  const handleRestart = () => {
    setUserImage(null);
    setFaceAnalysis(null);
    setSelectedHairstyle(null);
    setRecommendation(null);
    setCurrentStep(1);
    setHasCompletedStep1(false);
  };

  /**
   * Handles step navigation with proper state management
   */
  const handleStepClick = (stepNumber) => {
    if (!isStepClickable(stepNumber)) return;
    
    if (stepNumber === 1 && currentStep > 1) {
      // Reset all related states to ensure proper step disabling
      setHasCompletedStep1(false);
      setFaceAnalysis(null);
      setSelectedHairstyle(null);
      setRecommendation(null);
    } else if (stepNumber === 2 && currentStep === 3) {
      // Reset only step 3 states when returning from step 3
      setSelectedHairstyle(null);
      setRecommendation(null);
    }
    
    setCurrentStep(stepNumber);
  };

  /**
   * Step configuration with internationalization support
   */
  const steps = useMemo(() => [
    { 
      number: 1, 
      title: t('navigation.steps.camera', 'Take Photo'), 
      description: t('step.camera.description', 'Upload or take photo'),
      enabled: true
    },
    { 
      number: 2, 
      title: t('navigation.steps.selection', 'Browse Styles'), 
      description: t('step.selection.description', 'Browse hairstyles'),
      enabled: !!userImage && hasCompletedStep1 && !!faceAnalysis
    },
    { 
      number: 3, 
      title: t('navigation.steps.results', 'Get Advice'), 
      description: t('step.results.description', 'Get recommendations'),
      enabled: !!userImage && !!selectedHairstyle
    }
  ], [t, userImage, hasCompletedStep1, faceAnalysis, selectedHairstyle, currentLanguage]);

  /**
   * Determines if a step is navigable based on completion status
   */
  const isStepClickable = (stepNumber) => {
    const step = steps.find(s => s.number === stepNumber);
    return step ? step.enabled : false;
  };

  /**
   * Renders appropriate content for current workflow step
   */
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div key={`camera-${contentKey}`}>
            <CameraCapture 
              onImageCapture={handleImageCapture}
              existingImage={userImage}
            />
            {hasCompletedStep1 && userImage && (
              <div className="mt-6">
                <FaceAnalyzer
                  userImage={userImage}
                  onAnalysisComplete={handleFaceAnalysisComplete}
                />
              </div>
            )}
          </div>
        );
      case 2:
        return faceAnalysis ? (
          <StyleGallery
            key={`gallery-${contentKey}`}
            faceAnalysis={faceAnalysis}
            onHairstyleSelect={handleHairstyleSelect}
          />
        ) : null;
      case 3:
        return faceAnalysis && selectedHairstyle ? (
          <ResultsView
            key={`results-${contentKey}`}
            userImage={userImage}
            faceAnalysis={faceAnalysis}
            selectedHairstyle={selectedHairstyle}
            onRecommendationGenerated={handleRecommendationGenerated}
            onRestart={handleRestart}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Header with forced re-render on language changes */}
      <header key={`header-${contentKey}`} className="glass-effect sticky top-0 z-10 shadow-sm bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
            <img src="/scissor.png" alt="Logo" className="w-10 h-10" />
              <div>
                <h1 className="text-2xl font-bold gradient-text">
                  {t('app.title', 'AI Hairstyle Advisor')}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      {/* Progress indicator with forced re-render on language changes */}
      <div key={`progress-${contentKey}`} className="max-w-4xl mx-auto px-4 py-8 bg-white">
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4 md:gap-8">
            {steps.map((step, index) => (
              <div key={`step-${step.number}-${contentKey}`} className="flex items-center gap-2 md:gap-4">
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
                  <div className="text-xs text-gray-500 mt-1 hidden md:block">
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

        {/* Main content area with forced re-render on language changes */}
        <div className="bg-white p-6">
          {renderStepContent()}
        </div>
      </div>

      {/* Global translation loading indicator */}
      {isTranslating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center min-w-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">
              {t('common.translating', 'Translating...')}
            </p>
          </div>
        </div>
      )}
      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 py-10 text-center">
       <p className="text-sm text-gray-600">
                  {t('app.statement', 'Chrome Built-in AI (require Chrome 138+) |  Privacy Protection  |  No Upload to Server')}
        </p>
        <p className="text-sm text-gray-600">
                  {t('app.builtFor', 'Built for Google Chrome Built-in AI Challenge 2025')}
        </p>
      </footer>
    </div>
  );
}

export default App;