import { useState, useRef, useCallback } from 'react';

/**
 * Camera management hook for photo capture functionality
 * Provides camera control, photo capture, and image processing capabilities
 */
export const useCamera = () => {
  const [stream, setStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  /**
   * Initializes camera stream and starts video capture
   * @returns {Promise<MediaStream>} Camera media stream
   */
  const startCamera = useCallback(async () => {
    try {
      setError(null);
      console.log('Starting camera...');
      
      // Request camera permissions
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
      
      // Wait for video element to be ready before setting srcObject
      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = mediaStream;
        
        // Wait for video metadata to load
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
                // Continue processing even if playback fails
                resolve(mediaStream);
              });
          };
          
          // Set timeout in case onloadedmetadata doesn't trigger
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

  /**
   * Stops camera stream and cleans up resources
   */
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

  /**
   * Captures photo from current video frame
   * @param {number} quality - JPEG quality (0-1)
   * @returns {Promise<Blob>} Captured image blob
   */
  const takePhoto = useCallback(async (quality = 0.8) => {
    if (!videoRef.current) {
      throw new Error('Video element not ready');
    }

    const video = videoRef.current;
    
    // Check if video is ready
    if (video.readyState !== 4) {
      throw new Error('Video not ready yet, please try again later');
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      throw new Error('Video stream abnormal, please restart camera');
    }

    console.log('Taking photo, video dimensions:', video.videoWidth, 'x', video.videoHeight);

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    try {
      // Draw current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      console.log('Image drawn to canvas');

      // Convert to Blob
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

  /**
   * Processes image file for upload
   * @param {File} file - Image file to process
   * @returns {Promise<string>} Blob URL for the image
   */
  const getImageFromFile = useCallback((file) => {
    return new Promise((resolve, reject) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please select an image file'));
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        reject(new Error('Image size cannot exceed 10MB'));
        return;
      }

      // Create Blob URL
      const blobUrl = URL.createObjectURL(file);
      resolve(blobUrl);
    });
  }, []);

  /**
   * Compresses image using shared image utilities
   * @param {Blob} blob - Image blob to compress
   * @param {number} maxWidth - Maximum width for resizing
   * @param {number} quality - JPEG quality (0-1)
   * @returns {Promise<Blob>} Compressed image blob
   */
  const compressImage = useCallback(async (blob, maxWidth = 800, quality = 0.7) => {
    // Import unified compression function
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