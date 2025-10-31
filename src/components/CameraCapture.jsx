import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, RotateCcw, Circle, X, AlertCircle } from 'lucide-react';
import { useCamera } from '../hooks/useCamera';
import useLanguage from '../hooks/useLanguage';

// 简单的图片压缩工具函数
const compressImage = async (blob, maxWidth = 800, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onerror = () => reject(new Error('Image loading failed'));
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (compressedBlob) => {
          if (compressedBlob) {
            resolve(compressedBlob);
          } else {
            reject(new Error('Image compression failed'));
          }
        },
        'image/jpeg',
        quality
      );
    };
    
    img.src = URL.createObjectURL(blob);
  });
};

// 图片验证函数
const validateImage = (file) => {
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Please select an image file (JPEG, PNG, etc.)' };
  }
  
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, error: 'Image size cannot exceed 10MB' };
  }
  
  return { valid: true };
};

const CameraCapture = ({ onImageCapture }) => {
  const [mode, setMode] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const fileInputRef = useRef(null);
  
  const { t } = useLanguage();
  
  const {
    videoRef,
    isCameraActive,
    error: cameraError,
    startCamera,
    stopCamera,
    takePhoto
  } = useCamera();

  // 组件卸载时停止摄像头
  useEffect(() => {
    return () => {
      if (isCameraActive) {
        stopCamera();
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [isCameraActive, previewUrl, stopCamera]);

  // 启动摄像头
  const handleStartCamera = async () => {
    try {
      setError(null);
      setIsVideoReady(false); // 修正：应该初始化为false
      setMode('camera');
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await startCamera();
      
      // 监听视频是否就绪
      if (videoRef.current) {
        videoRef.current.onloadeddata = () => {
          console.log('Video data loaded');
          setIsVideoReady(true);
        };
        
        videoRef.current.oncanplay = () => {
          console.log('Video can play');
          setIsVideoReady(true);
        };
      }
    } catch (err) {
      console.error('Camera start error:', err);
      setError(err.message);
      setMode(null);
    }
  };

  // 停止摄像头并清理
  const handleStopCamera = () => {
    stopCamera();
    setMode(null);
    setIsVideoReady(false);
  };

  // 拍照
  const handleTakePhoto = async () => {
    try {
      setError(null);
      console.log('Attempting to take photo...');
      
      if (!isVideoReady) {
        throw new Error('Camera is not ready, please wait for video to load');
      }

      const photoBlob = await takePhoto();
      console.log('Photo taken, compressing...');
      
      const compressedBlob = await compressImage(photoBlob);
      const url = URL.createObjectURL(compressedBlob);
      
      setPreviewUrl(url);
      handleStopCamera();
    } catch (err) {
      console.error('Photo capture error:', err);
      setError(t('camera.captureError', 'Photo capture failed: ') + err.message);
    }
  };

  // 处理文件选择
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validation = validateImage(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    try {
      setError(null);
      setMode('upload');
      const compressedBlob = await compressImage(file);
      const url = URL.createObjectURL(compressedBlob);
      
      setPreviewUrl(url);
    } catch (err) {
      setError(t('camera.processingError', 'Image processing failed: ') + err.message);
      setMode(null);
    }
  };

  // 确认使用当前图片
  const handleConfirmImage = async () => {
    if (previewUrl) {
      try {
        const response = await fetch(previewUrl);
        const blob = await response.blob();
        
        onImageCapture(blob);
        // 清理 URL
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setMode(null);
      } catch (err) {
        setError(t('camera.processingError', 'Image processing failed: ') + err.message);
      }
    }
  };

  // 重新选择
  const handleRetake = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setMode(null);
    setError(null);
    setIsVideoReady(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 关闭摄像头模式
  const handleCloseCamera = () => {
    handleStopCamera();
    setMode(null);
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('camera.title', 'Step 1: Upload Photo')}</h2>
      <p className="text-gray-600 mb-8">{t('camera.subtitle', 'Take or upload a clear front-facing photo for AI face analysis')}</p>

      {/* 错误显示 */}
      {(error || cameraError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="text-left">
            <div className="font-medium">{t('common.error', 'Error')}</div>
            <div>{error || cameraError}</div>
          </div>
        </div>
      )}

      {/* 初始选择模式 */}
      {!mode && !previewUrl && (
        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={handleStartCamera}
            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors"
          >
            <Camera className="w-5 h-5" />
            {t('camera.takePhoto', 'Take Photo')}
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-full hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-5 h-5" />
            {t('camera.uploadPhoto', 'Upload Photo')}
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* 摄像头预览 */}
      {mode === 'camera' && (
        <div className="relative bg-black rounded-xl overflow-hidden mb-6 max-w-2xl mx-auto">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleCloseCamera}
              className="bg-white/90 rounded-full p-2 hover:bg-white transition-colors"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>
          
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-96 object-cover"
          />
          
          {/* 摄像头状态指示 */}
          {!isVideoReady && isCameraActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <div>{t('camera.starting', 'Starting camera...')}</div>
              </div>
            </div>
          )}
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <button
              onClick={handleTakePhoto}
              disabled={!isVideoReady}
              className={`bg-white rounded-full p-4 shadow-lg transition-all ${
                isVideoReady 
                  ? 'hover:bg-gray-100 cursor-pointer' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
              title={isVideoReady ? t('camera.takePhoto', 'Take Photo') : t('camera.cameraNotReady', 'Camera not ready')}
            >
              <Circle className="w-8 h-8 text-red-500" fill="currentColor" />
            </button>
          </div>
        </div>
      )}

      {/* 图片预览 */}
      {previewUrl && (
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="bg-gray-100 rounded-xl overflow-hidden relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-96 object-contain"
            />
          </div>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleConfirmImage}
              className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors"
            >
              {t('camera.useThisPhoto', 'Use This Photo')}
            </button>
            
            <button
              onClick={handleRetake}
              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              {t('camera.retake', 'Retake')}
            </button>
          </div>
        </div>
      )}

      {/* 使用提示 */}
      {!previewUrl && !isCameraActive && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8 max-w-2xl mx-auto">
          <h3 className="font-semibold text-blue-800 mb-2">{t('camera.tips', 'Photo Tips')}</h3>
          <ul className="text-blue-700 text-sm text-left space-y-1">
            <li>• {t('camera.tip1', 'Choose a well-lit environment')}</li>
            <li>• {t('camera.tip2', 'Face the camera directly, keep face clear')}</li>
            <li>• {t('camera.tip3', 'Avoid wearing hats or sunglasses')}</li>
            <li>• {t('camera.tip4', 'Maintain natural expression')}</li>
            <li>• {t('camera.tip5', 'Use Chrome or Edge for best camera compatibility')}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;