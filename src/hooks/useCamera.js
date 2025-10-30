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
      
      // 请求摄像头权限 - 简化配置提高兼容性
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          // 移除分辨率限制，让浏览器自动选择
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false // 明确关闭音频
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
            if (video.readyState >= 1) { // HAVE_ENOUGH_DATA
              resolve(mediaStream);
            }
          }, 3000);
        });
      }
      
      return mediaStream;
    } catch (err) {
      console.error('摄像头启动失败:', err);
      let errorMessage = '无法访问摄像头';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = '摄像头权限被拒绝，请在浏览器设置中允许摄像头访问';
      } else if (err.name === 'NotFoundError') {
        errorMessage = '未找到摄像头设备';
      } else if (err.name === 'NotSupportedError') {
        errorMessage = '浏览器不支持摄像头功能';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = '无法满足摄像头配置要求，请尝试其他浏览器';
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

  // 拍照 - 增强错误处理
  const takePhoto = useCallback(async (quality = 0.8) => {
    if (!videoRef.current) {
      throw new Error('视频元素未就绪');
    }

    const video = videoRef.current;
    
    // 检查视频是否已准备好
    if (video.readyState !== 4) { // HAVE_ENOUGH_DATA
      throw new Error('视频尚未准备好，请稍后重试');
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      throw new Error('视频流异常，请重新启动摄像头');
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
              reject(new Error('图片生成失败'));
            }
          },
          'image/jpeg',
          quality
        );
      });
    } catch (drawError) {
      console.error('Canvas draw error:', drawError);
      throw new Error('拍照失败：无法处理视频帧');
    }
  }, []);

  // 从文件输入获取图片
  const getImageFromFile = useCallback((file) => {
    return new Promise((resolve, reject) => {
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        reject(new Error('请选择图片文件'));
        return;
      }

      // 验证文件大小（最大 10MB）
      if (file.size > 10 * 1024 * 1024) {
        reject(new Error('图片大小不能超过10MB'));
        return;
      }

      // 创建 Blob URL
      const blobUrl = URL.createObjectURL(file);
      resolve(blobUrl);
    });
  }, []);

  // 压缩图片
  const compressImage = useCallback((blob, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onerror = () => {
        reject(new Error('图片加载失败'));
      };
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // 计算新尺寸
          let { width, height } = img;
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          // 绘制压缩后的图片
          ctx.drawImage(img, 0, 0, width, height);

          // 转换为 Blob
          canvas.toBlob(
            (compressedBlob) => {
              if (compressedBlob) {
                resolve(compressedBlob);
              } else {
                reject(new Error('图片压缩失败'));
              }
            },
            'image/jpeg',
            quality
          );
        } catch (error) {
          reject(new Error('图片处理失败: ' + error.message));
        }
      };
      
      img.src = URL.createObjectURL(blob);
    });
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