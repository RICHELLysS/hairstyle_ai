import { faceShapeDescriptions } from '../data/hairstyles';

/**
 * Face analysis utility functions
 * Provides processing and formatting for AI face analysis results
 */

/**
 * Processes raw AI analysis response into standardized format
 * @param {Object} aiResponse - Raw response from AI API
 * @returns {Object} Standardized face analysis results
 */
export const processFaceAnalysis = (aiResponse) => {
  // Use standard format if AI returns it directly
  if (aiResponse.faceShape && aiResponse.features) {
    return {
      faceShape: aiResponse.faceShape,
      features: aiResponse.features,
      description: faceShapeDescriptions[aiResponse.faceShape] || 'No specific facial features detected',
      isMock: aiResponse.isMock || false,
      faceDetected: true
    };
  }

  // Parse text response if AI returns string
  if (typeof aiResponse === 'string') {
    return parseTextAnalysis(aiResponse);
  }

  // Fallback to mock data
  return getMockAnalysis();
};

/**
 * Parses text-based AI analysis response
 * @param {string} text - AI response text
 * @returns {Object} Parsed analysis results
 */
const parseTextAnalysis = (text) => {
  const faceShapes = ['Oval', 'Round', 'Square', 'Heart', 'Long'];
  let detectedFaceShape = 'Oval'; // Default value
  
  // Find face shape keywords in text
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
      analysis: 'AI analysis completed'
    },
    description: faceShapeDescriptions[detectedFaceShape],
    isMock: true,
    faceDetected: true
  };
};

/**
 * Generates mock analysis results for development
 * @returns {Object} Mock analysis results
 */
const getMockAnalysis = () => {
  const faceShapes = ['Oval', 'Round', 'Square', 'Heart', 'Long'];
  const randomShape = faceShapes[Math.floor(Math.random() * faceShapes.length)];
  
  return {
    faceShape: randomShape,
    features: {
      confidence: (85 + Math.random() * 15).toFixed(1) + '%',
      symmetry: 'Good',
      proportions: 'Standard'
    },
    description: faceShapeDescriptions[randomShape],
    isMock: true,
    faceDetected: true
  };
};

/**
 * Returns face shape icon representation
 * @param {string} faceShape - Face shape identifier
 * @returns {string} Icon character
 */
export const getFaceShapeIcon = (faceShape) => {
  const icons = {
    'Oval': '○',
    'Round': '●',
    'Square': '□',
    'Heart': '♥',
    'Long': '▭'
  };
  return icons[faceShape] || '○';
};

/**
 * Returns Tailwind CSS color classes for face shapes
 * @param {string} faceShape - Face shape identifier
 * @returns {string} Tailwind CSS color classes
 */
export const getFaceShapeColor = (faceShape) => {
  const colors = {
    'Oval': 'text-green-600 bg-green-50 border-green-200',
    'Round': 'text-blue-600 bg-blue-50 border-blue-200',
    'Square': 'text-purple-600 bg-purple-50 border-purple-200',
    'Heart': 'text-pink-600 bg-pink-50 border-pink-200',
    'Long': 'text-orange-600 bg-orange-50 border-orange-200'
  };
  return colors[faceShape] || 'text-gray-600 bg-gray-50 border-gray-200';
};