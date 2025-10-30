import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import FaceAnalyzer from './FaceAnalyzer';
import PhotoUploader from './PhotoUploader';
import ResultViewer from './ResultViewer';
import { analyzeFace } from '../hooks/useChromeAI';
import { generateHairstyle } from '../hooks/useCamera';

export default function HairstyleAI() {
  const [personImg, setPersonImg] = useState(null);
  const [hairstyleImg, setHairstyleImg] = useState(null);
  const [personPreview, setPersonPreview] = useState(null);
  const [hairstylePreview, setHairstylePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [faceAnalysis, setFaceAnalysis] = useState(null);

  const handleImageUpload = (file, type) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'person') {
        setPersonImg(file);
        setPersonPreview(reader.result);
        // 重置面部分析结果
        setFaceAnalysis(null);
      } else {
        setHairstyleImg(file);
        setHairstylePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePersonUpload = (file) => {
    handleImageUpload(file, 'person');
  };

  const handleHairstyleUpload = (file) => {
    handleImageUpload(file, 'hairstyle');
  };

  const handleFaceAnalysisComplete = (result) => {
    setFaceAnalysis(result);
    console.log('面部分析完成:', result);
  };

  const handleFaceAnalysisError = (error) => {
    console.error('面部分析错误:', error);
    setError(`面部分析失败: ${error}`);
  };

  const handleGenerate = async () => {
    if (!personImg || !hairstyleImg) {
      setError('请先上传两张图片');
      return;
    }

    // 检查是否已完成面部分析
    if (!faceAnalysis || !faceAnalysis.faceDetected) {
      setError('请确保面部分析已完成且检测到人脸');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await generateHairstyle(personImg, hairstyleImg, faceAnalysis);
      setResult(data.result_url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleDownload = (resultUrl) => {
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = 'new-hairstyle.jpg';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          AI 发型换换
        </h1>
        <p className="text-center text-gray-600 mb-12">上传你的照片和喜欢的发型，AI帮你试试看</p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* 上传真人照片 */}
          <div className="space-y-4">
            <PhotoUploader
              onImageUpload={handlePersonUpload}
              type="person"
              previewUrl={personPreview}
              title="1. 上传你的照片"
            />
            
            {/* 面部分析组件 */}
            <FaceAnalyzer
              personImg={personImg}
              onAnalysisComplete={handleFaceAnalysisComplete}
              onAnalysisError={handleFaceAnalysisError}
            />
          </div>

          {/* 上传发型照片 */}
          <div>
            <PhotoUploader
              onImageUpload={handleHairstyleUpload}
              type="hairstyle"
              previewUrl={hairstylePreview}
              title="2. 上传发型参考"
            />
          </div>
        </div>

        {/* 生成按钮 */}
        <div className="text-center mb-8">
          <button
            onClick={handleGenerate}
            disabled={loading || !personImg || !hairstyleImg || !faceAnalysis || !faceAnalysis.faceDetected}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                AI 生成中...
              </span>
            ) : (
              '✨ 生成新发型'
            )}
          </button>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        {/* 结果展示 */}
        {result && (
          <ResultViewer
            result={result}
            onDownload={handleDownload}
            onRegenerate={handleRegenerate}
            isLoading={loading}
          />
        )}
      </div>
    </div>
  );
}