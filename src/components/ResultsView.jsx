import React, { useState, useEffect } from 'react';
import { Download, Share2, RotateCcw, Star, Calendar, Bookmark } from 'lucide-react';
import HairRecommender from './HairRecommender';
import { useStorage } from '../hooks/useStorage';

const ResultsView = ({
  userImage,
  faceAnalysis,
  selectedHairstyle,
  onRecommendationGenerated,
  onRestart
}) => {
  const [userImageUrl, setUserImageUrl] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const { saveHistory } = useStorage();

  // 创建用户图片URL
  useEffect(() => {
    if (userImage) {
      const url = URL.createObjectURL(userImage);
      setUserImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [userImage]);

  // 处理建议生成完成
  const handleRecommendationGenerated = (rec) => {
    setRecommendation(rec);
    if (onRecommendationGenerated) {
      onRecommendationGenerated(rec);
    }

    // 保存到历史记录
    saveHistory({
      timestamp: new Date().toISOString(),
      faceShape: faceAnalysis.faceShape,
      hairstyle: selectedHairstyle.name,
      recommendation: rec,
      userImage: userImageUrl // 注意：这里实际应该存储base64或引用
    });
  };

  // 分享结果
  const handleShare = async () => {
    const shareData = {
      title: 'AI发型建议',
      text: `基于我的${faceAnalysis.faceShape}脸型，AI推荐了${selectedHairstyle.name}发型！`,
      url: window.location.href
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('分享取消:', err);
      }
    } else {
      // 备用方案：复制到剪贴板
      const text = `我的${faceAnalysis.faceShape}脸型适合${selectedHairstyle.name}发型！\n\n${recommendation?.substring(0, 100)}...`;
      navigator.clipboard.writeText(text).then(() => {
        alert('建议已复制到剪贴板！');
      });
    }
  };

  // 下载结果
  const handleDownload = () => {
    // 创建可下载的内容
    const content = `
AI发型建议报告
===============================

脸型分析: ${faceAnalysis.faceShape}
推荐发型: ${selectedHairstyle.name}
推荐时间: ${new Date().toLocaleString()}

详细建议:
${recommendation}

特点:
${selectedHairstyle.features.join(', ')}

适合脸型:
${selectedHairstyle.suitableFaceShapes.join(', ')}

维护难度: ${selectedHairstyle.difficulty}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `发型建议-${selectedHairstyle.name}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* 头部 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">第四步：您的专属发型建议</h2>
        <p className="text-gray-600">基于AI分析生成的个性化发型方案</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧：用户信息和发型信息 */}
        <div className="lg:col-span-1 space-y-6">
          {/* 用户照片 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-purple-600" />
              您的照片
            </h3>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {userImageUrl && (
                <img
                  src={userImageUrl}
                  alt="用户照片"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          {/* 脸型信息 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              脸型分析
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">检测脸型</span>
                <span className="font-medium text-gray-800">{faceAnalysis.faceShape}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">置信度</span>
                <span className="font-medium text-gray-800">{faceAnalysis.features.confidence}</span>
              </div>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {faceAnalysis.description}
              </div>
            </div>
          </div>

          {/* 发型信息 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-green-600" />
              选择发型
            </h3>
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={selectedHairstyle.image}
                  alt={selectedHairstyle.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-lg mb-2">
                  {selectedHairstyle.name}
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  {selectedHairstyle.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">维护难度</span>
                    <span className="font-medium text-gray-800">{selectedHairstyle.difficulty}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">适合脸型</span>
                    <span className="font-medium text-gray-800">
                      {selectedHairstyle.suitableFaceShapes.join(', ')}
                    </span>
                  </div>
                </div>

                {/* 标签 */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {selectedHairstyle.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：AI建议 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6 h-full">
            <HairRecommender
              faceAnalysis={faceAnalysis}
              selectedHairstyle={selectedHairstyle}
              onRecommendationGenerated={handleRecommendationGenerated}
            />
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-4 justify-center pt-6 border-t border-gray-200">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          下载建议
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          分享结果
        </button>

        <button
          onClick={onRestart}
          className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-300 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          重新开始
        </button>
      </div>

      {/* 温馨提示 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-center gap-2 text-yellow-800 mb-2">
          <Star className="w-4 h-4" />
          <span className="font-medium">温馨提示</span>
        </div>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>• 此建议基于AI分析生成，仅供参考</li>
          <li>• 实际效果可能因个人发质、脸型细节等因素有所不同</li>
          <li>• 建议咨询专业发型师获取最适合您的发型方案</li>
          <li>• 您的照片和数据分析完全在本地处理，保护隐私安全</li>
        </ul>
      </div>
    </div>
  );
};

export default ResultsView;