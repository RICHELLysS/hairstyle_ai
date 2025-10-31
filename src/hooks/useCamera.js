import { useState, useRef, useCallback } from 'react';

// 摄像头 Hook
export const useCamera = () => {
  const [stream, setStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  // 启动摄像头
  const startCamera = useCallback(async () => {
    try {
      setError(null);
      console.log('Starting camera...');
      
      // 请求摄像头权限
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      setStream(mediaStream);
      setIsCameraActive(true);
      
      console.log('Camera stream obtained:', mediaStream);
      
      // 等待 video 元素准备好再设置 srcObject
      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = mediaStream;
        
        // 等待视频元数据加载
        return new Promise((resolve) => {
          video.onloadedmetadata = () => {
            console.log('Video metadata loaded, starting playback...');
            video.play()
              .then(() => {
                console.log('Video playback started successfully');
                resolve(mediaStream);
              })
              .catch(playError => {
                console.error('Video play failed:', playError);
                // 即使播放失败，也继续处理
                resolve(mediaStream);
              });
          };
          
          // 设置超时，防止 onloadedmetadata 不触发
          setTimeout(() => {
            if (video.readyState >= 1) {
              resolve(mediaStream);
            }
          }, 3000);
        });
      }
      
      return mediaStream;
    } catch (err) {
      console.error('Camera startup failed:', err);
      let errorMessage = 'Unable to access camera';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied, please allow camera access in browser settings';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No camera device found';
      } else if (err.name === 'NotSupportedError') {
        errorMessage = 'Browser does not support camera functionality';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Cannot meet camera configuration requirements, please try another browser';
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // 停止摄像头
  const stopCamera = useCallback(() => {
    if (stream) {
      console.log('Stopping camera...');
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped track:', track.kind);
      });
      setStream(null);
      setIsCameraActive(false);
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream]);

  // 拍照
  const takePhoto = useCallback(async (quality = 0.8) => {
    if (!videoRef.current) {
      throw new Error('Video element not ready');
    }

    const video = videoRef.current;
    
    // 检查视频是否已准备好
    if (video.readyState !== 4) {
      throw new Error('Video not ready yet, please try again later');
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      throw new Error('Video stream abnormal, please restart camera');
    }

    console.log('Taking photo, video dimensions:', video.videoWidth, 'x', video.videoHeight);

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // 设置 canvas 尺寸与视频一致
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    try {
      // 绘制当前视频帧到 canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      console.log('Image drawn to canvas');

      // 转换为 Blob
      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              console.log('Photo captured, blob size:', blob.size);
              resolve(blob);
            } else {
              reject(new Error('Image generation failed'));
            }
          },
          'image/jpeg',
          quality
        );
      });
    } catch (drawError) {
      console.error('Canvas draw error:', drawError);
      throw new Error('Photo capture failed: unable to process video frame');
    }
  }, []);

  // 从文件输入获取图片
  const getImageFromFile = useCallback((file) => {
    return new Promise((resolve, reject) => {
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please select an image file'));
        return;
      }

      // 验证文件大小（最大 10MB）
      if (file.size > 10 * 1024 * 1024) {
        reject(new Error('Image size cannot exceed 10MB'));
        return;
      }

      // 创建 Blob URL
      const blobUrl = URL.createObjectURL(file);
      resolve(blobUrl);
    });
  }, []);

  // 压缩图片 - 简化版本，使用统一的 imageUtils
  const compressImage = useCallback(async (blob, maxWidth = 800, quality = 0.7) => {
    // 导入统一的压缩函数
    const { compressImage: compress } = await import('../utils/imageUtils');
    return compress(blob, maxWidth, quality);
  }, []);

  return {
    videoRef,
    stream,
    isCameraActive,
    error,
    startCamera,
    stopCamera,
    takePhoto,
    getImageFromFile,
    compressImage
  };
};