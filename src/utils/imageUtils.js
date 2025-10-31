/**
 * Image processing utility functions
 * Provides image compression, validation, and URL management
 */

/**
 * Compresses image file with resizing and quality adjustment
 * @param {File|Blob} file - Image file to compress
 * @param {number} maxWidth - Maximum width for resizing
 * @param {number} quality - JPEG quality (0-1)
 * @returns {Promise<Blob>} Compressed image blob
 */
export const compressImage = (file, maxWidth = 800, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw compressed image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to Blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Image compression failed'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Image loading failed'));
      img.src = event.target.result;
    };
    
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsDataURL(file);
  });
};

/**
 * Validates image file type and size
 * @param {File} file - Image file to validate
 * @returns {Object} Validation result with status and error message
 */
export const validateImage = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Please select an image file (${allowedTypes.join(', ')})`
    };
  }

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Image size cannot exceed 10MB`
    };
  }

  return { valid: true };
};

/**
 * Creates blob URL for image preview
 * @param {File|Blob} file - Image file
 * @returns {string} Blob URL for image display
 */
export const createImageUrl = (file) => {
  return URL.createObjectURL(file);
};

/**
 * Revokes blob URL to prevent memory leaks
 * @param {string} url - Blob URL to revoke
 */
export const revokeImageUrl = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};