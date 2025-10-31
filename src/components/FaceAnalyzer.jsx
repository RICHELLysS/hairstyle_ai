import React, { useState, useEffect } from 'react';
import { Scan, CheckCircle2, AlertCircle, User, RotateCcw, X } from 'lucide-react';
import { useChromeAI } from '../hooks/useChromeAI';
import useLanguage from '../hooks/useLanguage';

/**
 * Face analysis component using AI to determine face shape and features
 * Provides analysis status, error handling, and retry mechanisms
 */
const FaceAnalyzer = ({ userImage, onAnalysisComplete, onCancel, isActive = true }) => {
  const [analysis, setAnalysis] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showCancelOption, setShowCancelOption] = useState(false);
  const { t, currentLanguage } = useLanguage();
  const { 
    analyzeFace, 
    isLoading: aiLoading, 
    error: aiError, 
    isChromeAIAvailable, 
    clearError,
    cancelOperation 
  } = useChromeAI();

  // Reset all component state
  const resetState = () => {
    setAnalysis(null);
    setShowCancelOption(false);
    clearError();
  };

  useEffect(() => {
    // Only analyze when component is active with user image and no existing results
    if (isActive && userImage && !analysis && !aiError) {
      startAnalysis();
    }
  }, [userImage, isActive]);

  // Show cancel option after error appears
  useEffect(() => {
    if (aiError && !aiLoading) {
      const timer = setTimeout(() => {
        setShowCancelOption(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [aiError, aiLoading]);

  /**
   * Initiates face analysis process
   */
  const startAnalysis = async () => {
    if (!isActive) return;
    
    resetState();
    
    try {
      console.log('🔄 Starting face analysis...');
      const result = await analyzeFace(userImage);
      console.log('✅ Analysis completed successfully');
      
      const processedAnalysis = processFaceAnalysis(result);
      setAnalysis(processedAnalysis);
      onAnalysisComplete(processedAnalysis);
    } catch (err) {
      console.error('❌ Analysis failed:', err);
      setRetryCount(prev => prev + 1);
    }
  };

  /**
   * Retries analysis after failure
   */
  const handleRetry = async () => {
    console.log('🔄 Retrying analysis...');
    resetState();
    await startAnalysis();
  };

  /**
   * Cancels ongoing analysis operation
   */
  const handleCancel = () => {
    console.log('🛑 Cancelling analysis...');
    cancelOperation();
    if (onCancel) {
      onCancel();
    }
  };

  /**
   * Uses mock data when AI analysis is unavailable
   */
  const handleSkipAnalysis = () => {
    console.log('⏭️ Skipping analysis with mock data...');
    const mockAnalysis = {
      faceShape: 'Oval',
      features: {
        confidence: '85%',
        symmetry: 'Good',
        proportions: 'Balanced'
      },
      description: t('faceShape.Oval', 'Standard face shape, suitable for almost all hairstyles'),
      isMock: true
    };
    
    setAnalysis(mockAnalysis);
    onAnalysisComplete(mockAnalysis);
  };

  /**
   * Processes raw analysis results into structured format
   */
  const processFaceAnalysis = (result) => {
    const faceShape = result.faceShape || 'Oval';
    return {
      faceShape: faceShape,
      features: {
        confidence: result.confidence || '85%',
        symmetry: result.features?.symmetry || 'Good',
        proportions: result.features?.proportions || 'Balanced'
      },
      description: getFaceShapeDescription(faceShape),
      isMock: result.isMock || false
    };
  };

  /**
   * Returns localized description for face shape
   */
  const getFaceShapeDescription = (faceShape) => {
    const descriptions = {
      'Oval': t('faceShape.Oval', 'Standard face shape, suitable for almost all hairstyles'),
      'Round': t('faceShape.Round', 'Face length and width are similar, need to elongate face shape through hairstyle'),
      'Square': t('faceShape.Square', 'Obvious jaw angle, need to soften contours through hairstyle'),
      'Heart': t('faceShape.Heart', 'Wider forehead, sharper chin, need to balance upper and lower proportions'),
      'Long': t('faceShape.Long', 'Face length is significantly greater than face width, need to increase width through hairstyle')
    };
    return descriptions[faceShape] || t('faceShape.default', 'Versatile face shape suitable for various styles');
  };

  const getFaceShapeIcon = (shape) => {
    return '😊';
  };

  const getFaceShapeColor = (shape) => {
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  /**
   * Analysis status indicator component
   * Shows different states: loading, error, success, or ready
   */
  const AnalysisStatus = () => {
    // Analysis in progress - shows progress bar
    if (aiLoading && !aiError) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-orange-600">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
            <div>
              <div className="font-medium">{t('analysis.analyzing', 'AI is analyzing facial features...')}</div>
              <div className="text-sm text-orange-500">
                {t('analysis.detecting', 'Analyzing your facial features to recommend the perfect hairstyle...')}
              </div>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full animate-pulse"></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{t('analysis.processingImage', 'Processing image')}</span>
              <span>{t('analysis.analyzingFeatures', 'Analyzing features')}</span>
              <span>{t('analysis.generatingResults', 'Generating results')}</span>
            </div>
          </div>
        </div>
      );
    }

    // Error state - shows after loading completes
    if (aiError && !aiLoading) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="w-6 h-6" />
            <div className="flex-1">
              <div className="font-medium">{t('analysis.failed', 'Analysis failed')}</div>
              <div className="text-sm text-red-500 mt-1">{aiError}</div>
            </div>
          </div>
          
          {/* Error details */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="text-sm text-red-700">
              <div className="font-medium mb-1">{t('analysis.errorDetails', 'Error Details:')}</div>
              <div className="font-mono text-xs">
                {aiError.includes('LanguageModel') ? 
                  t('analysis.languageModelError', "Failed to execute 'prompt' on 'LanguageModel': Required member is undefined.") 
                  : aiError
                }
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRetry}
              className="flex-1 flex items-center justify-center gap-2 bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              {retryCount > 0 ? 
                t('analysis.tryAgainCount', 'Try Again ({count})', { count: retryCount }) 
                : t('analysis.tryAgain', 'Try Again')
              }
            </button>
            
            {showCancelOption && (
              <button
                onClick={handleSkipAnalysis}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors border"
              >
                <X className="w-4 h-4" />
                {t('analysis.skip', 'Skip Analysis')}
              </button>
            )}
          </div>

          {/* Troubleshooting tips */}
          {!aiError.includes('cancelled') && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">{t('analysis.troubleshootingTips', 'Troubleshooting Tips:')}</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• {t('analysis.tip1', 'Ensure you\'re using Chrome 138+ on desktop')}</li>
                <li>• {t('analysis.tip2', 'Check that AI features are enabled in chrome://flags')}</li>
                <li>• {t('analysis.tip3', 'Try a different, clear front-facing photo')}</li>
                <li>• {t('analysis.tip4', 'Ensure good lighting in your photo')}</li>
              </ul>
            </div>
          )}
        </div>
      );
    }

    // Analysis completed successfully
    if (analysis) {
      return (
        <div className="flex items-center gap-3 text-green-600">
          <CheckCircle2 className="w-6 h-6" />
          <div>
            <div className="font-medium">{t('analysis.complete', 'Analysis complete')}</div>
            <div className="text-sm text-green-500">{t('analysis.featuresIdentified', 'Your facial features have been identified')}</div>
          </div>
        </div>
      );
    }

    // Initial ready state
    return (
      <div className="flex items-center gap-3 text-gray-500">
        <User className="w-6 h-6" />
        <div>
          <div className="font-medium">{t('analysis.ready', 'Ready for analysis')}</div>
          <div className="text-sm">{t('analysis.clickToStart', 'Click to start face analysis')}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Analysis status display */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <AnalysisStatus />
      </div>

      {/* Analysis results */}
      {analysis && (
        <div className="space-y-6">
          {/* Face shape results */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{t('analysis.results', 'Detection Results')}</h3>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getFaceShapeColor(analysis.faceShape)}`}>
                <span className="text-lg">{getFaceShapeIcon(analysis.faceShape)}</span>
                <span className="font-medium">{analysis.faceShape} {t('analysis.faceShape', 'Face Shape')}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('analysis.faceShapeDescription', 'Face shape description')}</span>
                <span className="text-gray-800 font-medium">{analysis.description}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('analysis.confidence', 'Analysis confidence')}</span>
                <span className="text-gray-800 font-medium">{analysis.features.confidence}</span>
              </div>

              {analysis.isMock && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <Scan className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('analysis.usingDemoData', 'Using demo data')}</span>
                  </div>
                  <p className="text-yellow-700 text-xs mt-1">
                    {t('analysis.demoDataDescription', 'Chrome AI is not available. Using sample data to demonstrate the experience.')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Next steps提示 */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-green-800 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-medium">{t('analysis.completeShort', 'Analysis complete!')}</span>
            </div>
            <p className="text-green-700 text-sm">
              {t('analysis.nextStep', 'Based on your {faceShape} face shape, suitable hairstyles will be recommended next.', {
                faceShape: analysis.faceShape
              })}
            </p>
          </div>
        </div>
      )}

      {/* Technical support information */}
      <div className="text-center text-xs text-gray-500">
        <p>
          {t('analysis.poweredBy', 'Powered by {aiType}', {
            aiType: isChromeAIAvailable ? t('analysis.chromeAI', 'Chrome Built-in AI') : t('analysis.demoMode', 'Demo Mode')
          })}
        </p>
        <p className="mt-1">{t('analysis.dataProcessedLocally', 'Data is processed locally to protect your privacy')}</p>
      </div>
    </div>
  );
};

export default FaceAnalyzer;