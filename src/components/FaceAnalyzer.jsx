import React, { useState, useEffect } from 'react';
import { Scan, CheckCircle2, AlertCircle, User } from 'lucide-react';
import { useChromeAI } from '../hooks/useChromeAI';
import useLanguage from '../hooks/useLanguage';
// 修正：添加缺失的导入
import { getFaceShapeIcon, getFaceShapeColor, processFaceAnalysis } from '../utils/faceAnalysis';

const FaceAnalyzer = ({ userImage, onAnalysisComplete }) => {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  
  const { t } = useLanguage();
  const { analyzeFace, isLoading, isChromeAIAvailable } = useChromeAI(); // 修正：变量名

  useEffect(() => {
    if (userImage) {
      startAnalysis();
    }
  }, [userImage]);

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await analyzeFace(userImage);
      const processedAnalysis = processFaceAnalysis(result);
      
      setAnalysis(processedAnalysis);
      onAnalysisComplete(processedAnalysis);
    } catch (err) {
      setError(err.message || t('analysis.failed', 'Face analysis failed'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 分析状态指示器
  const AnalysisStatus = () => {
    if (isAnalyzing || isLoading) {
      return (
        <div className="flex items-center gap-3 text-blue-600">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <div>
            <div className="font-medium">{t('analysis.analyzing', 'AI is analyzing facial features...')}</div>
            <div className="text-sm text-blue-500">
              {t('analysis.usingTech', 'Using {technology} technology', { 
                technology: isChromeAIAvailable ? 'Chrome AI' : 'simulated' 
              })}
            </div>
          </div>
        </div>
      );
    }

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

    if (error) {
      return (
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle className="w-6 h-6" />
          <div>
            <div className="font-medium">{t('analysis.failed', 'Analysis failed')}</div>
            <div className="text-sm text-red-500">{error}</div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3 text-gray-500">
        <User className="w-6 h-6" />
        <div>
          <div className="font-medium">{t('analysis.waiting', 'Waiting for analysis')}</div>
          <div className="text-sm">{t('analysis.readyToStart', 'Ready to start face analysis')}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('analysis.title', 'Step 2: AI Face Analysis')}</h2>
        <p className="text-gray-600">{t('analysis.subtitle', 'Using AI technology to analyze your facial features...')}</p>
      </div>

      {/* 分析状态 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <AnalysisStatus />
      </div>

      {/* 分析进度条 */}
      {(isAnalyzing || isLoading) && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse"></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{t('analysis.detectingContour', 'Detecting facial contour')}</span>
            <span>{t('analysis.analyzingFeatures', 'Analyzing facial features')}</span>
            <span>{t('analysis.generatingSuggestions', 'Generating suggestions')}</span>
          </div>
        </div>
      )}

      {/* 分析结果 */}
      {analysis && (
        <div className="space-y-6">
          {/* 模拟数据提示 */}
          {analysis.isMock && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <Scan className="w-4 h-4" />
                <span className="font-medium">{t('analysis.demoMode', 'Demo Mode')}</span>
              </div>
              <p className="text-yellow-700 text-sm mt-1">
                {t('analysis.demoDescription', 'Currently using simulated data to demonstrate effects. Real analysis available in Chrome AI supported browsers.')}
              </p>
            </div>
          )}

          {/* 脸型结果 */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{t('analysis.results', 'Detection Results')}</h3>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getFaceShapeColor(analysis.faceShape)}`}>
                <span className="text-lg">{getFaceShapeIcon(analysis.faceShape)}</span>
                <span className="font-medium">{analysis.faceShape} {t('analysis.faceShape', 'Face Shape')}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('analysis.shapeDescription', 'Face shape description')}</span>
                <span className="text-gray-800 font-medium">{analysis.description}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('analysis.confidence', 'Analysis confidence')}</span>
                <span className="text-gray-800 font-medium">{analysis.features.confidence}</span>
              </div>
              
              {analysis.features.symmetry && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('analysis.facialSymmetry', 'Facial symmetry')}</span>
                  <span className="text-gray-800 font-medium">{analysis.features.symmetry}</span>
                </div>
              )}
            </div>
          </div>

          {/* 下一步提示 */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-medium">{t('analysis.complete', 'Analysis complete!')}</span>
            </div>
            <p className="text-blue-700 text-sm">
              {t('analysis.nextStep', 'Based on your {faceShape} face shape, suitable hairstyles will be recommended next.', {
                faceShape: analysis.faceShape
              })}
            </p>
          </div>
        </div>
      )}

      {/* 技术支持说明 */}
      <div className="text-center text-xs text-gray-500">
        <p>
          {t('common.poweredBy', 'Powered by {technology}', { 
            technology: isChromeAIAvailable ? 'Chrome Built-in AI' : 'Simulated AI Technology' 
          })}
        </p>
        <p className="mt-1">{t('analysis.privacyNote', 'Data is processed completely locally to protect your privacy')}</p>
      </div>
    </div>
  );
};

export default FaceAnalyzer;