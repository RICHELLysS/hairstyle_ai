import { ImageAnnotatorClient } from '@google-cloud/vision';

class FaceAnalysisService {
  constructor() {
    // 初始化Google Cloud Vision客户端
    this.client = new ImageAnnotatorClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || './google-cloud-key.json'
    });
  }

  async analyzeFace(imagePath) {
    try {
      // 调用Google Cloud Vision API进行面部检测
      const [result] = await this.client.faceDetection(imagePath);
      const faces = result.faceAnnotations;

      if (!faces || faces.length === 0) {
        throw new Error('未检测到人脸，请上传包含清晰正面人脸的图片');
      }

      if (faces.length > 1) {
        throw new Error('检测到多张人脸，请上传只包含单人的照片');
      }

      const face = faces[0];
      
      // 分析面部特征
      const features = this.extractFaceFeatures(face);

      return {
        faceDetected: true,
        features: features,
        bounds: this.calculateFaceBounds(face.boundingPoly.vertices)
      };

    } catch (error) {
      console.error('Google Cloud Vision API错误:', error);
      
      // 如果是API密钥或认证问题
      if (error.message.includes('API key') || error.message.includes('auth')) {
        throw new Error('Google Cloud API配置错误，请检查API密钥');
      }
      
      throw error;
    }
  }

  extractFaceFeatures(face) {
    const faceShape = this.determineFaceShape(face);
    const recommendedStyles = this.getRecommendedStyles(faceShape);

    return {
      faceShape: faceShape,
      recommendedStyles: recommendedStyles,
      confidence: this.calculateConfidence(face),
      landmarks: face.landmarks ? face.landmarks.length : 0
    };
  }

  determineFaceShape(face) {
    const bounds = face.boundingPoly.vertices;
    const width = Math.abs(bounds[1].x - bounds[0].x);
    const height = Math.abs(bounds[3].y - bounds[0].y);
    const ratio = width / height;

    // 基于宽高比判断脸型
    if (ratio < 0.75) return '长形';
    if (ratio > 0.9) return '圆形';
    if (ratio > 0.85) return '方形';
    if (ratio > 0.8) return '心形';
    return '椭圆形'; // 默认脸型
  }

  getRecommendedStyles(faceShape) {
    const styleMap = {
      '椭圆形': '所有发型',
      '圆形': '长发、层次剪',
      '方形': '波浪、蓬松',
      '心形': '短发、刘海',
      '长形': '齐肩、卷发'
    };
    return styleMap[faceShape] || '多种发型';
  }

  calculateConfidence(face) {
    const detectionConfidence = face.detectionConfidence || 0;
    const landmarkConfidence = face.landmarkingConfidence || 0;
    return ((detectionConfidence + landmarkConfidence) / 2 * 100).toFixed(1) + '%';
  }

  calculateFaceBounds(vertices) {
    return {
      left: vertices[0].x || 0,
      top: vertices[0].y || 0,
      right: vertices[2].x || 0,
      bottom: vertices[2].y || 0,
      width: Math.abs((vertices[2].x || 0) - (vertices[0].x || 0)),
      height: Math.abs((vertices[2].y || 0) - (vertices[0].y || 0))
    };
  }
}

export default new FaceAnalysisService();