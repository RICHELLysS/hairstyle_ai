import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Lightbulb, Scissors, Clock, Star, Zap } from 'lucide-react';
import { useChromeAI } from '../hooks/useChromeAI';

const HairRecommender = ({ faceAnalysis, selectedHairstyle, onRecommendationGenerated }) => {
  const [recommendation, setRecommendation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  
  const { generateRecommendation: generateAISuggestion, isLoading } = useChromeAI();

  // 使用 useCallback 避免重复创建函数
  const handleGenerateRecommendation = useCallback(async () => {
    // 检查必要的参数是否存在
    if (!faceAnalysis || !selectedHairstyle) {
      console.error('Missing required parameters:', { faceAnalysis, selectedHairstyle });
      setError('缺少必要的信息，请确保已选择发型');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      console.log('Generating recommendation with:', { faceAnalysis, selectedHairstyle });
      const result = await generateAISuggestion(faceAnalysis, selectedHairstyle);
      console.log('Recommendation result:', result);
      
      setRecommendation(result);
      if (onRecommendationGenerated) {
        onRecommendationGenerated(result);
      }
    } catch (err) {
      console.error('Error generating recommendation:', err);
      setError(err.message || '生成建议时出错，请重试');
    } finally {
      setIsGenerating(false);
    }
  }, [faceAnalysis, selectedHairstyle, generateAISuggestion, onRecommendationGenerated]);

  // 修复 useEffect 依赖
  useEffect(() => {
    // 只有当 faceAnalysis 和 selectedHairstyle 都存在时才生成推荐
    if (faceAnalysis && selectedHairstyle && !recommendation) {
      handleGenerateRecommendation();
    }
  }, [faceAnalysis, selectedHairstyle, handleGenerateRecommendation, recommendation]);

  // 添加调试信息
  console.log('HairRecommender state:', {
    faceAnalysis,
    selectedHairstyle,
    recommendation,
    isGenerating,
    error
  });

  // 解析建议文本为结构化内容
  const parseRecommendation = (text) => {
    if (!text || typeof text !== 'string') return null;

    const sections = {
      reason: '',
      maintenance: '',
      styling: '',
      caution: ''
    };

    try {
      const lines = text.split('\n').filter(line => line.trim());
      let currentSection = 'reason';
      
      lines.forEach(line => {
        const lowerLine = line.toLowerCase();
        
        // 简单的关键词匹配逻辑
        if (lowerLine.includes('why') || lowerLine.includes('reason') || lowerLine.includes('suitable') || lowerLine.includes('适合')) {
          currentSection = 'reason';
        } else if (lowerLine.includes('maintenance') || lowerLine.includes('care') || lowerLine.includes('daily') || lowerLine.includes('打理')) {
          currentSection = 'maintenance';
        } else if (lowerLine.includes('styling') || lowerLine.includes('match') || lowerLine.includes('outfit') || lowerLine.includes('搭配')) {
          currentSection = 'styling';
        } else if (lowerLine.includes('caution') || lowerLine.includes('attention') || lowerLine.includes('avoid') || lowerLine.includes('注意')) {
          currentSection = 'caution';
        }

        if (currentSection && line.trim()) {
          sections[currentSection] += line + '\n';
        }
      });

      return sections;
    } catch (err) {
      console.error('Error parsing recommendation:', err);
      return null;
    }
  };

  const parsedRecommendation = parseRecommendation(recommendation);

  // 获取章节标题
  const getSectionTitle = (section) => {
    const titles = {
      reason: 'Why It Suits You',
      maintenance: 'Maintenance Tips',
      styling: 'Styling Suggestions',
      caution: 'Things to Note'
    };
    return titles[section];
  };

  // 获取章节图标
  const getSectionIcon = (section) => {
    const icons = {
      reason: <Star className="w-4 h-4 text-green-600" />,
      maintenance: <Scissors className="w-4 h-4 text-blue-600" />,
      styling: <Sparkles className="w-4 h-4 text-purple-600" />,
      caution: <Lightbulb className="w-4 h-4 text-orange-600" />
    };
    return icons[section];
  };

  // 如果没有必要的参数，显示提示
  if (!faceAnalysis || !selectedHairstyle) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-800">AI Hairstyle Recommendation</h3>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <Lightbulb className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h4 className="text-yellow-800 font-medium mb-2">信息不完整</h4>
          <p className="text-yellow-700">
            {!faceAnalysis && !selectedHairstyle 
              ? '请先完成面部分析并选择发型' 
              : !faceAnalysis 
                ? '请先完成面部分析' 
                : '请先选择发型'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-800">AI Hairstyle Recommendation</h3>
      </div>

      {/* 生成状态 */}
      {(isGenerating || isLoading) ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-purple-600">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
            <span>AI is generating personalized advice...</span>
          </div>
          
          {/* 加载动画 */}
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-700 mb-2">
            <Lightbulb className="w-4 h-4" />
            <span className="font-medium">Generation Failed</span>
          </div>
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={handleGenerateRecommendation}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : recommendation ? (
        <div className="space-y-6">
          {/* 结构化建议 */}
          {parsedRecommendation ? (
            <div className="space-y-4">
              {Object.entries(parsedRecommendation).map(([section, content]) => 
                content.trim() && (
                  <div key={section} className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      {getSectionIcon(section)}
                      <h4 className="font-semibold text-gray-800">{getSectionTitle(section)}</h4>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {content.trim()}
                    </p>
                  </div>
                )
              )}
            </div>
          ) : (
            /* 原始文本显示 */
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {recommendation}
              </p>
            </div>
          )}

          {/* 重新生成按钮 */}
          <div className="text-center">
            <button
              onClick={handleGenerateRecommendation}
              className="flex items-center gap-2 mx-auto bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Regenerate Recommendation
            </button>
          </div>
        </div>
      ) : (
        /* 初始状态 */
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h4 className="text-gray-600 font-medium mb-2">Ready to Generate Advice</h4>
          <p className="text-gray-500 text-sm mb-4">
            Based on your {faceAnalysis.faceShape} face shape and selected {selectedHairstyle.name}
          </p>
          <button
            onClick={handleGenerateRecommendation}
            className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors"
          >
            Generate AI Advice
          </button>
        </div>
      )}

      {/* 技术支持说明 */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-2 text-blue-800 mb-2">
          <Zap className="w-4 h-4" />
          <span className="font-medium">About AI Recommendations</span>
        </div>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Personalized advice based on face shape and hairstyle features</li>
          <li>• Includes daily care, styling, and precautions</li>
          <li>• Consult a professional stylist for final decisions</li>
        </ul>
      </div>
    </div>
  );
};

export default HairRecommender;