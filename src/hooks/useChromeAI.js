import { useState, useCallback, useRef } from 'react';
import { useLanguage } from './useLanguage';

/**
 * Chrome AI integration hook for face analysis and recommendation generation
 * Provides AI-powered face shape detection and hairstyle advice
 */
export const useChromeAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  const retryCountRef = useRef(0);
  const maxRetries = 2;
  const abortControllerRef = useRef(null);
  
  const { t, currentLanguage } = useLanguage();

  /**
   * Checks Chrome AI API availability and status
   * @returns {Promise<boolean>} API availability status
   */
  const checkAIAvailability = useCallback(async () => {
    try {
      console.log('🔍 Checking Chrome AI availability...');
      
      if (typeof LanguageModel === 'undefined') {
        console.warn('❌ LanguageModel API is not available in this browser');
        setApiStatus('unavailable');
        return false;
      }

      const availability = await LanguageModel.availability();
      console.log('✅ Chrome AI availability:', availability);
      
      if (availability === 'readily' || availability === 'available') {
        setApiStatus('available');
        return true;
      } else {
        console.warn('⚠️ Chrome AI is not available:', availability);
        setApiStatus('unavailable');
        return false;
      }
    } catch (err) {
      console.error('❌ Failed to check Chrome AI availability:', err);
      setApiStatus('unavailable');
      return false;
    }
  }, []);

  /**
   * Cancels current AI operation
   */
  const cancelOperation = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      console.log('🛑 Operation cancelled by user');
    }
    setIsLoading(false);
    setError(null);
  }, []);

  /**
   * Generates face analysis prompt with current language support
   * @returns {string} Localized analysis prompt
   */
  const getFaceAnalysisPrompt = useCallback(() => {
    return t('ai.faceAnalysisPrompt', `Analyze this face image and identify the face shape from: Oval, Round, Square, Heart, Long.

Return JSON format:
{
  "faceShape": "detected_shape",
  "confidence": "percentage",
  "features": {
    "symmetry": "description",
    "proportions": "description"
  }
}

If no face detected: {"error": "No face detected"}`);
  }, [t]);

  /**
   * Performs face analysis using Chrome AI
   * @param {Blob} imageBlob - User's image for analysis
   * @param {AbortSignal} signal - Abort signal for cancellation
   * @returns {Promise<Object>} Analysis results
   */
  const analyzeFaceWithAI = useCallback(async (imageBlob, signal) => {
    try {
      console.log('🎯 Starting face analysis with Chrome AI...');
      
      // Create session with specified expected input types
      const session = await LanguageModel.create({ 
        signal,
        expectedInputs: [
          { 
            type: "image",
            languages: [currentLanguage]  // Use current language
          }
        ],
        expectedOutputs: [
          {
            type: "text",
            languages: [currentLanguage]  // Use current language
          }
        ]
      });
      console.log('✅ LanguageModel session created with image support');
      
      const promptText = getFaceAnalysisPrompt();
      console.log('📝 Sending prompt to Chrome AI in language:', currentLanguage);
      
      // Use correct message format
      const messages = [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              value: promptText 
            },
            {
              type: "image",
              value: imageBlob  // Use Blob object directly
            }
          ]
        }
      ];

      console.log('📤 Sending messages with correct format');
      const analysisResult = await session.prompt(messages);
      console.log('✅ Chrome AI analysis result received:', analysisResult);

      // Parse response
      try {
        const jsonMatch = analysisResult.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedResult = JSON.parse(jsonMatch[0]);
          
          if (parsedResult.error) {
            throw new Error(parsedResult.error);
          }
          
          console.log('✅ Successfully parsed AI response');
          return {
            ...parsedResult,
            isMock: false
          };
        }
        throw new Error(t('ai.invalidResponseFormat', 'Invalid response format from AI'));
      } catch (parseError) {
        console.error('❌ Failed to parse AI response');
        throw new Error(t('ai.responseFormatError', 'AI response format error'));
      }

    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('🛑 Analysis cancelled');
        throw new Error(t('ai.analysisCancelled', 'Analysis cancelled by user'));
      }
      console.error('❌ Chrome AI face analysis failed:', err);
      throw err;
    }
  }, [currentLanguage, getFaceAnalysisPrompt, t]);

  /**
   * Main face analysis function with state management
   * @param {Blob} imageBlob - User's image for analysis
   * @returns {Promise<Object>} Face analysis results
   */
  const analyzeFace = useCallback(async (imageBlob) => {
    // Clear previous errors before starting
    setError(null);
    setIsLoading(true);
    retryCountRef.current = 0;
    
    // Create new AbortController
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      console.log('🚀 Starting face analysis process...');
      
      const isAvailable = await checkAIAvailability();
      
      if (!isAvailable) {
        throw new Error(t('ai.chromeAINotAvailable', 'Chrome AI is not available. Please use Chrome 138+ on desktop.'));
      }

      console.log('✅ Chrome AI is available, proceeding with analysis...');
      
      const result = await analyzeFaceWithAI(imageBlob, signal);
      
      // Clear loading on success
      setIsLoading(false);
      return result;

    } catch (err) {
      console.error('❌ Face analysis failed:', err);
      
      let errorMessage;
      if (err.message.includes('cancelled')) {
        errorMessage = t('ai.analysisCancelled', 'Analysis was cancelled.');
      } else if (err.message.includes('No face detected')) {
        errorMessage = t('ai.noFaceDetected', 'No face detected in the image. Please upload a clear front-facing photo.');
      } else {
        errorMessage = t('ai.analysisFailed', 'AI analysis failed. Please try again or skip to continue.');
      }
      
      // Set error state and clear loading on failure
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    } finally {
      abortControllerRef.current = null;
    }
  }, [checkAIAvailability, analyzeFaceWithAI, t]);

  /**
   * Generates hairstyle recommendation prompt
   * @param {Object} faceAnalysis - User's face analysis results
   * @param {Object} hairstyle - Selected hairstyle data
   * @returns {string} Localized recommendation prompt
   */
  const getRecommendationPrompt = useCallback((faceAnalysis, hairstyle) => {
    return t('ai.recommendationPrompt', `You are a professional hair style advisor, generate hairstyle recommendations based on:

Face shape: {faceShape}
Hairstyle: {hairstyleName}
Features: {hairstyleDescription}

Include:
1. Why it suits the face shape
2. Maintenance tips
3. Styling suggestions
4. Some popular persons with this hairstyle
5. How to speak to barber
Please do not include any Markdown formatted text in your answer.
Answer in corresponding concise 5 paragraphs within 50 words, use short sentences or bullet points if possible to prevent reading difficulty.`, {
      faceShape: faceAnalysis.faceShape,
      hairstyleName: hairstyle.name,
      hairstyleDescription: hairstyle.description
    });
  }, [t]);

  /**
   * Generates hairstyle recommendations using Chrome AI
   * @param {Object} faceAnalysis - User's face analysis results
   * @param {Object} hairstyle - Selected hairstyle data
   * @returns {Promise<Object>} AI-generated recommendation
   */
  const generateRecommendation = useCallback(async (faceAnalysis, hairstyle) => {
    setIsLoading(true);
    setError(null);
    retryCountRef.current = 0;
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      console.log('🚀 Starting recommendation generation...');
      
      const isAvailable = await checkAIAvailability();
      
      if (!isAvailable) {
        throw new Error(t('ai.recommendationNotAvailable', 'Chrome AI is not available for generating recommendations.'));
      }

      console.log('🎯 Generating hairstyle recommendation with Chrome AI in language:', currentLanguage);
      
      // Create session with specified input/output types for text
      const session = await LanguageModel.create({ 
        signal,
        expectedInputs: [
          { 
            type: "text",
            languages: [currentLanguage]
          }
        ],
        expectedOutputs: [
          {
            type: "text",
            languages: [currentLanguage]
          }
        ]
      });
      
      const promptText = getRecommendationPrompt(faceAnalysis, hairstyle);

      // Use correct message format
      const messages = [
        {
          role: "user",
          content: promptText  // Plain text can use string directly
        }
      ];

      const recommendation = await session.prompt(messages);

      return {
        text: recommendation,
        isMock: false
      };

    } catch (err) {
      if (err.name === 'AbortError') {
        throw new Error(t('ai.recommendationCancelled', 'Recommendation generation cancelled'));
      }
      console.error('❌ Recommendation generation failed:', err);
      setError(t('ai.recommendationFailed', 'Recommendation generation failed. Please try again.'));
      throw err;
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [checkAIAvailability, currentLanguage, getRecommendationPrompt, t]);

  /**
   * Clears current error state
   */
  const clearError = useCallback(() => {
    setError(null);
    retryCountRef.current = 0;
  }, []);

  // Initialize availability check
  useState(() => {
    console.log('🔧 Initializing Chrome AI hook...');
    checkAIAvailability();
  }, [checkAIAvailability]);

  return {
    analyzeFace,
    generateRecommendation,
    isLoading,
    error,
    apiStatus,
    isChromeAIAvailable: apiStatus === 'available',
    clearError,
    cancelOperation,
    checkAIAvailability
  };
};

export default useChromeAI;