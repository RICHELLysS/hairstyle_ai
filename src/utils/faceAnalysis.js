import { faceShapeDescriptions } from '../data/hairstyles';

// 面部分析工具函数

/**
 * 处理AI分析结果
 * @param {Object} aiResponse - AI API返回的结果
 * @returns {Object} 标准化的面部分析结果
 */
export const processFaceAnalysis = (aiResponse) => {
  // 如果AI返回了标准格式，直接使用
  if (aiResponse.faceShape && aiResponse.features) {
    return {
      faceShape: aiResponse.faceShape,
      features: aiResponse.features,
      description: faceShapeDescriptions[aiResponse.faceShape] || '未识别到特定脸型特征',
      isMock: aiResponse.isMock || false
    };
  }

  // 如果AI返回的是文本，尝试解析
  if (typeof aiResponse === 'string') {
    return parseTextAnalysis(aiResponse);
  }

  // 默认返回模拟数据
  return getMockAnalysis();
};

/**
 * 解析文本分析结果
 * @param {string} text - AI返回的文本
 * @returns {Object} 解析后的分析结果
 */
const parseTextAnalysis = (text) => {
  const faceShapes = ['椭圆形', '圆形', '方形', '心形', '长形'];
  let detectedFaceShape = '椭圆形'; // 默认值
  
  // 在文本中查找脸型关键词
  for (const shape of faceShapes) {
    if (text.includes(shape)) {
      detectedFaceShape = shape;
      break;
    }
  }

  return {
    faceShape: detectedFaceShape,
    features: {
      confidence: '85%',
      analysis: 'AI分析完成'
    },
    description: faceShapeDescriptions[detectedFaceShape],
    isMock: true
  };
};

/**
 * 生成模拟分析结果（开发用）
 * @returns {Object} 模拟分析结果
 */
const getMockAnalysis = () => {
  const faceShapes = ['椭圆形', '圆形', '方形', '心形', '长形'];
  const randomShape = faceShapes[Math.floor(Math.random() * faceShapes.length)];
  
  return {
    faceShape: randomShape,
    features: {
      confidence: (85 + Math.random() * 15).toFixed(1) + '%',
      symmetry: '良好',
      proportions: '标准'
    },
    description: faceShapeDescriptions[randomShape],
    isMock: true
  };
};

/**
 * 获取脸型图标
 * @param {string} faceShape - 脸型
 * @returns {string} 图标名称
 */
export const getFaceShapeIcon = (faceShape) => {
  const icons = {
    '椭圆形': '○',
    '圆形': '●',
    '方形': '□',
    '心形': '♥',
    '长形': '▭'
  };
  return icons[faceShape] || '○';
};

/**
 * 获取脸型颜色
 * @param {string} faceShape - 脸型
 * @returns {string} Tailwind CSS 颜色类
 */
export const getFaceShapeColor = (faceShape) => {
  const colors = {
    '椭圆形': 'text-green-600 bg-green-50 border-green-200',
    '圆形': 'text-blue-600 bg-blue-50 border-blue-200',
    '方形': 'text-purple-600 bg-purple-50 border-purple-200',
    '心形': 'text-pink-600 bg-pink-50 border-pink-200',
    '长形': 'text-orange-600 bg-orange-50 border-orange-200'
  };
  return colors[faceShape] || 'text-gray-600 bg-gray-50 border-gray-200';
};