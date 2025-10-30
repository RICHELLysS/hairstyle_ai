import React, { useState, useEffect } from 'react';
import { Scan, CheckCircle2, AlertCircle, User } from 'lucide-react';
import { useChromeAI } from '../hooks/useChromeAI';
import { getFaceShapeIcon, getFaceShapeColor, processFaceAnalysis } from '../utils/faceAnalysis';

const FaceAnalyzer = ({ userImage, onAnalysisComplete }) => {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  
  const { analyzeFace, isLoading, isChromeAISupported } = useChromeAI();

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
      setError(err.message || '面部分析失败');
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
            <div className="font-medium">AI正在分析面部特征...</div>
            <div className="text-sm text-blue-500">使用{isChromeAISupported ? 'Chrome AI' : '模拟'}技术</div>
          </div>
        </div>
      );
    }

    if (analysis) {
      return (
        <div className="flex items-center gap-3 text-green-600">
          <CheckCircle2 className="w-6 h-6" />
          <div>
            <div className="font-medium">分析完成</div>
            <div className="text-sm text-green-500">已识别您的脸型特征</div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle className="w-6 h-6" />
          <div>
            <div className="font-medium">分析失败</div>
            <div className="text-sm text-red-500">{error}</div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3 text-gray-500">
        <User className="w-6 h-6" />
        <div>
          <div className="font-medium">等待分析</div>
          <div className="text-sm">准备好开始面部分析</div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">第二步：AI面部分析</h2>
        <p className="text-gray-600">正在使用AI技术分析您的脸型特征...</p>
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
            <span>检测面部轮廓</span>
            <span>分析脸型特征</span>
            <span>生成建议</span>
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
                <span className="font-medium">演示模式</span>
              </div>
              <p className="text-yellow-700 text-sm mt-1">
                当前使用模拟数据展示效果。在支持Chrome AI的浏览器中可获得真实分析。
              </p>
            </div>
          )}

          {/* 脸型结果 */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">检测结果</h3>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getFaceShapeColor(analysis.faceShape)}`}>
                <span className="text-lg">{getFaceShapeIcon(analysis.faceShape)}</span>
                <span className="font-medium">{analysis.faceShape}脸型</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">脸型描述</span>
                <span className="text-gray-800 font-medium">{analysis.description}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">分析置信度</span>
                <span className="text-gray-800 font-medium">{analysis.features.confidence}</span>
              </div>
              
              {analysis.features.symmetry && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">面部对称性</span>
                  <span className="text-gray-800 font-medium">{analysis.features.symmetry}</span>
                </div>
              )}
            </div>
          </div>

          {/* 下一步提示 */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-medium">分析完成！</span>
            </div>
            <p className="text-blue-700 text-sm">
              基于您的{analysis.faceShape}脸型，接下来将为您推荐合适的发型。
            </p>
          </div>
        </div>
      )}

      {/* 技术支持说明 */}
      <div className="text-center text-xs text-gray-500">
        <p>Powered by {isChromeAISupported ? 'Chrome Built-in AI' : 'Simulated AI Technology'}</p>
        <p className="mt-1">数据完全在本地处理，保护您的隐私</p>
      </div>
    </div>
  );
};

export default FaceAnalyzer;