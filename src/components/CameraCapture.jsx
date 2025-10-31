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
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Please select an image file (JPEG, PNG, etc.)' };
  }

  // 检查具体类型
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Please select a supported image format (${allowedTypes.join(', ')})`
    };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Image size cannot exceed 10MB' };
  }
  
  return { valid: true };
};

const CameraCapture = ({ onImageCapture }) => {
  const [mode, setMode] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const fileInputRef = useRef(null);
  const videoReadyTimeoutRef = useRef(null);
  const { t, currentLanguage } = useLanguage();
  
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
      if (videoReadyTimeoutRef.current) {
        clearTimeout(videoReadyTimeoutRef.current);
      }
    };
  }, [isCameraActive, previewUrl, stopCamera]);

  // 监听视频元素准备状态
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      console.log('✅ Video can play - camera is ready');
      setIsVideoReady(true);
      setCameraLoading(false);
      if (videoReadyTimeoutRef.current) {
        clearTimeout(videoReadyTimeoutRef.current);
      }
    };

    const handleLoadStart = () => {
      console.log('🔄 Video load started');
      setCameraLoading(true);
    };

    const handleError = () => {
      console.error('❌ Video error');
      setCameraLoading(false);
      setIsVideoReady(false);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('error', handleError);
    };
  }, [videoRef, mode]);

  // 启动摄像头
  const handleStartCamera = async () => {
    try {
      setError(null);
      setIsVideoReady(false);
      setCameraLoading(true);
      setMode('camera');
      
      console.log('🔄 Starting camera...');
      await startCamera();
      
      // 设置超时，如果摄像头在5秒内没有就绪，显示错误
      videoReadyTimeoutRef.current = setTimeout(() => {
        if (!isVideoReady) {
          console.error('❌ Camera timeout - taking too long to start');
          setError(t('camera.timeout', 'Camera is taking too long to start. Please check permissions and try again.'));
          setCameraLoading(false);
        }
      }, 5000);

    } catch (err) {
      console.error('❌ Camera start error:', err);
      setError(err.message || t('camera.startError', 'Failed to start camera'));
      setMode(null);
      setCameraLoading(false);
    }
  };

  // 停止摄像头并清理
  const handleStopCamera = () => {
    stopCamera();
    setMode(null);
    setIsVideoReady(false);
    setCameraLoading(false);
    if (videoReadyTimeoutRef.current) {
      clearTimeout(videoReadyTimeoutRef.current);
    }
  };

  // 拍照
  const handleTakePhoto = async () => {
    try {
      setError(null);
      console.log('📸 Attempting to take photo...');
      
      if (!isVideoReady) {
        throw new Error('Camera is not ready, please wait for video to load');
      }

      const photoBlob = await takePhoto();
      console.log('✅ Photo taken, compressing...');
      
      const compressedBlob = await compressImage(photoBlob);
      const url = URL.createObjectURL(compressedBlob);
      
      setPreviewUrl(url);
      handleStopCamera();
    } catch (err) {
      console.error('❌ Photo capture error:', err);
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
    setCameraLoading(false);
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
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('Upload Photo')}</h2>
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
          {/* 改为橙色主题 */}
          <button
            onClick={handleStartCamera}
            className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition-colors shadow-md"
          >
            <Camera className="w-5 h-5" />
            {t('camera.takePhoto', 'Take Photo')}
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
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
        <div className="relative bg-black rounded-xl overflow-hidden mb-6 max-w-2xl mx-auto shadow-lg">
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
          
          {/* 摄像头状态指示 - 修复：只在摄像头加载中显示 */}
          {cameraLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
                <div>{t('camera.starting', 'Starting camera...')}</div>
              </div>
            </div>
          )}
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <button
              onClick={handleTakePhoto}
              disabled={!isVideoReady}
              className={`rounded-full p-4 shadow-lg transition-all ${
                isVideoReady 
                  ? 'bg-white hover:bg-gray-100 cursor-pointer' 
                  : 'bg-gray-400 opacity-50 cursor-not-allowed'
              }`}
              title={isVideoReady ? t('camera.takePhoto', 'Take Photo') : t('camera.cameraNotReady', 'Camera not ready')}
            >
              <Circle className="w-8 h-8 text-orange-500" fill={isVideoReady ? "currentColor" : "none"} />
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
            {/* 改为橙色主题 */}
            <button
              onClick={handleConfirmImage}
              className="bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors shadow-md"
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
            {/*<li>• {t('camera.tip3', 'Avoid wearing hats or sunglasses')}</li>
            <li>• {t('camera.tip4', 'Maintain natural expression')}</li>
            <li>• {t('camera.tip5', 'Use Chrome or Edge for best camera compatibility')}</li>*/}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;