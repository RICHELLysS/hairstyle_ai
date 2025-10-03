import React, { useState } from 'react';
import { Upload, Loader2, CheckCircle2 } from 'lucide-react';

export default function HairstyleAI() {
  const [personImg, setPersonImg] = useState(null);
  const [hairstyleImg, setHairstyleImg] = useState(null);
  const [personPreview, setPersonPreview] = useState(null);
  const [hairstylePreview, setHairstylePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'person') {
          setPersonImg(file);
          setPersonPreview(reader.result);
        } else {
          setHairstyleImg(file);
          setHairstylePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!personImg || !hairstyleImg) {
      setError('请先上传两张图片');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('person', personImg);
    formData.append('hairstyle', hairstyleImg);

    try {
      const response = await fetch('http://localhost:5000/api/generate-hairstyle', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.result_url);
      } else {
        setError(data.error || '生成失败');
      }
    } catch (err) {
      setError('网络错误: ' + err.message);
    } finally {
      setLoading(false);
    }
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
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">1. 上传你的照片</h3>
            <label className="block cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'person')}
                className="hidden"
              />
              <div className="border-2 border-dashed border-purple-300 rounded-xl h-64 flex items-center justify-center hover:border-purple-500 transition-colors">
                {personPreview ? (
                  <img src={personPreview} alt="预览" className="max-h-full max-w-full object-contain rounded-xl" />
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 mx-auto mb-2 text-purple-400" />
                    <p className="text-gray-500">点击上传照片</p>
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* 上传发型照片 */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">2. 上传发型参考</h3>
            <label className="block cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'hairstyle')}
                className="hidden"
              />
              <div className="border-2 border-dashed border-pink-300 rounded-xl h-64 flex items-center justify-center hover:border-pink-500 transition-colors">
                {hairstylePreview ? (
                  <img src={hairstylePreview} alt="预览" className="max-h-full max-w-full object-contain rounded-xl" />
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 mx-auto mb-2 text-pink-400" />
                    <p className="text-gray-500">点击上传发型图</p>
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* 生成按钮 */}
        <div className="text-center mb-8">
          <button
            onClick={handleGenerate}
            disabled={loading || !personImg || !hairstyleImg}
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
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <h3 className="text-2xl font-semibold text-gray-800">生成完成！</h3>
            </div>
            <div className="flex justify-center">
              <img
                src={result}
                alt="生成结果"
                className="max-w-full max-h-96 rounded-xl shadow-lg"
              />
            </div>
            <div className="mt-6 text-center">
              <a
                href={result}
                download="new-hairstyle.jpg"
                className="inline-block bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors"
              >
                下载图片
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}