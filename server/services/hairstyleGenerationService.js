import { ImageAnnotatorClient } from '@google-cloud/vision';

class HairstyleGenerationService {
  constructor() {
    this.visionClient = new ImageAnnotatorClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });
  }

  async generateHairstyle(personImagePath, hairstyleImagePath, faceAnalysis) {
    try {
      // 1. 分析发型图片，提取发型特征
      const hairstyleFeatures = await this.analyzeHairstyle(hairstyleImagePath);
      
      // 2. 基于面部分析和发型特征，调用AI模型生成新图片
      const resultImage = await this.synthesizeHairstyle(
        personImagePath, 
        hairstyleFeatures, 
        faceAnalysis
      );

      return {
        success: true,
        result_url: resultImage,
        features: {
          faceShape: faceAnalysis.features.faceShape,
          hairstyleType: hairstyleFeatures.type,
          compatibility: this.calculateCompatibility(faceAnalysis.features.faceShape, hairstyleFeatures.type)
        }
      };

    } catch (error) {
      console.error('发型生成错误:', error);
      throw new Error('发型生成失败: ' + error.message);
    }
  }

  async analyzeHairstyle(hairstyleImagePath) {
    try {
      // 使用Vision API分析发型图片
      const [result] = await this.visionClient.labelDetection(hairstyleImagePath);
      const labels = result.labelAnnotations;

      // 从标签中提取发型相关信息
      const hairLabels = labels.filter(label => 
        label.description.toLowerCase().includes('hair') ||
        label.description.toLowerCase().includes('hairstyle') ||
        label.description.toLowerCase().includes('curl') ||
        label.description.toLowerCase().includes('bang')
      );

      return {
        type: this.determineHairstyleType(hairLabels),
        confidence: hairLabels.length > 0 ? '高' : '中',
        features: hairLabels.map(label => label.description)
      };

    } catch (error) {
      console.error('发型分析错误:', error);
      // 如果分析失败，返回默认值
      return {
        type: '通用发型',
        confidence: '中',
        features: ['发型图片']
      };
    }
  }

  determineHairstyleType(hairLabels) {
    const descriptions = hairLabels.map(label => label.description.toLowerCase());
    
    if (descriptions.some(desc => desc.includes('curly') || desc.includes('curl'))) {
      return '卷发';
    }
    if (descriptions.some(desc => desc.includes('straight') || desc.includes('long'))) {
      return '直发';
    }
    if (descriptions.some(desc => desc.includes('short') || desc.includes('bob'))) {
      return '短发';
    }
    if (descriptions.some(desc => desc.includes('bang') || desc.includes('fringe'))) {
      return '刘海发型';
    }
    
    return '通用发型';
  }

  async synthesizeHairstyle(personImagePath, hairstyleFeatures, faceAnalysis) {
    // 这里应该是调用实际的AI模型进行发型合成
    // 由于我们使用的是原型，这里返回一个模拟结果
    
    // 模拟处理时间
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 返回模拟结果URL（在实际应用中，这里应该是生成的图片URL）
    return `http://localhost:5000/generated/hairstyle-${Date.now()}.jpg`;
  }

  calculateCompatibility(faceShape, hairstyleType) {
    const compatibilityMap = {
      '椭圆形': { '卷发': '高', '直发': '高', '短发': '高', '刘海发型': '高' },
      '圆形': { '卷发': '中', '直发': '高', '短发': '中', '刘海发型': '高' },
      '方形': { '卷发': '高', '直发': '中', '短发': '低', '刘海发型': '高' },
      '心形': { '卷发': '高', '直发': '中', '短发': '高', '刘海发型': '中' },
      '长形': { '卷发': '高', '直发': '中', '短发': '高', '刘海发型': '高' }
    };

    return compatibilityMap[faceShape]?.[hairstyleType] || '中';
  }
}

export default new HairstyleGenerationService();