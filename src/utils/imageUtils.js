// 图片处理工具函数

/**
 * 压缩图片
 * @param {File|Blob} file - 图片文件
 * @param {number} maxWidth - 最大宽度
 * @param {number} quality - 图片质量 (0-1)
 * @returns {Promise<Blob>} 压缩后的图片Blob
 */
export const compressImage = (file, maxWidth = 800, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
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
 * 验证图片文件
 * @param {File} file - 图片文件
 * @returns {Object} 验证结果
 */
export const validateImage = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  // 检查文件类型
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Please select an image file (${allowedTypes.join(', ')})`
    };
  }

  // 检查文件大小
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Image size cannot exceed 10MB`
    };
  }

  return { valid: true };
};

/**
 * 创建图片URL（用于预览）
 * @param {File|Blob} file - 图片文件
 * @returns {string} 图片URL
 */
export const createImageUrl = (file) => {
  return URL.createObjectURL(file);
};

/**
 * 释放图片URL（避免内存泄漏）
 * @param {string} url - 图片URL
 */
export const revokeImageUrl = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};