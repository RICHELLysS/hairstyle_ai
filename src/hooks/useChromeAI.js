import { useState, useCallback, useRef } from 'react';

export const useChromeAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  const retryCountRef = useRef(0);
  const maxRetries = 2;
  const abortControllerRef = useRef(null);

  // 检查 Chrome AI 可用性
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

  // 取消当前操作
  const cancelOperation = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      console.log('🛑 Operation cancelled by user');
    }
    setIsLoading(false);
    setError(null);
  }, []);

  // 真实的面部分析函数
// 真实的面部分析 - 修复会话配置
const analyzeFaceWithAI = useCallback(async (imageBlob, signal) => {
  try {
    console.log('🎯 Starting face analysis with Chrome AI...');
    
    // 修复：创建会话时指定期望的输入类型
    const session = await LanguageModel.create({ 
      signal,
      expectedInputs: [
        { 
          type: "image",  // 明确指定图像输入
          languages: ["en"]  // 可选：指定语言
        }
      ],
      expectedOutputs: [
        {
          type: "text",   // 输出为文本
          languages: ["en"]
        }
      ]
    });
    console.log('✅ LanguageModel session created with image support');
    
    const promptText = `Analyze this face image and identify the face shape from: Oval, Round, Square, Heart, Long.

Return JSON format:
{
  "faceShape": "detected_shape",
  "confidence": "percentage",
  "features": {
    "symmetry": "description",
    "proportions": "description"
  }
}

If no face detected: {"error": "No face detected"}`;

    console.log('📝 Sending prompt to Chrome AI...');
    
    // 使用正确的消息格式
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
            value: imageBlob  // 直接使用 Blob 对象
          }
        ]
      }
    ];

    console.log('📤 Sending messages with correct format');
    const analysisResult = await session.prompt(messages);
    console.log('✅ Chrome AI analysis result received:', analysisResult);

    // 解析响应
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
      throw new Error('Invalid response format from AI');
    } catch (parseError) {
      console.error('❌ Failed to parse AI response');
      throw new Error('AI response format error');
    }

  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('🛑 Analysis cancelled');
      throw new Error('Analysis cancelled by user');
    }
    console.error('❌ Chrome AI face analysis failed:', err);
    throw err;
  }
}, []);

  // 主分析函数 - 修复状态管理
  const analyzeFace = useCallback(async (imageBlob) => {
    // 在开始前清除之前的错误
    setError(null);
    setIsLoading(true);
    retryCountRef.current = 0;
    
    // 创建新的 AbortController
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      console.log('🚀 Starting face analysis process...');
      
      const isAvailable = await checkAIAvailability();
      
      if (!isAvailable) {
        throw new Error('Chrome AI is not available. Please use Chrome 138+ on desktop.');
      }

      console.log('✅ Chrome AI is available, proceeding with analysis...');
      
      const result = await analyzeFaceWithAI(imageBlob, signal);
      
      // 成功时清除loading
      setIsLoading(false);
      return result;

    } catch (err) {
      console.error('❌ Face analysis failed:', err);
      
      let errorMessage;
      if (err.message.includes('cancelled')) {
        errorMessage = 'Analysis was cancelled.';
      } else if (err.message.includes('No face detected')) {
        errorMessage = 'No face detected in the image. Please upload a clear front-facing photo.';
      } else {
        errorMessage = 'AI analysis failed. Please try again or skip to continue.';
      }
      
      // 错误时设置错误状态并清除loading
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    } finally {
      abortControllerRef.current = null;
    }
  }, [checkAIAvailability, analyzeFaceWithAI]);

// 生成发型建议 - 修复会话配置
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
      throw new Error('Chrome AI is not available for generating recommendations.');
    }

    console.log('🎯 Generating hairstyle recommendation with Chrome AI...');
    
    // 修复：对于纯文本会话也指定期望的输入输出类型
    const session = await LanguageModel.create({ 
      signal,
      expectedInputs: [
        { 
          type: "text",
          languages: ["en"]
        }
      ],
      expectedOutputs: [
        {
          type: "text",
          languages: ["en"]
        }
      ]
    });
    
    const promptText = `You are a professional hair style advisor, generate hairstyle recommendations based on:

Face shape: ${faceAnalysis.faceShape}
Hairstyle: ${hairstyle.name}
Features: ${hairstyle.description}

Include:
1. Why it suits the face shape
2. Maintenance tips
3. Styling suggestions
4. Some popular persons with this hairstyle
5. How to speak to barber
Please do not include any Markdown formatted text in your answer.
Answer in corresponding concise 5 paragraphs within 50 words, use short sentences or bullet points if possible to prevent reading difficulty.`;

    // 修复：使用正确的消息格式
    const messages = [
      {
        role: "user",
        content: promptText  // 纯文本可以直接使用字符串
      }
    ];

    const recommendation = await session.prompt(messages);

    return {
      text: recommendation,
      isMock: false
    };

  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Recommendation generation cancelled');
    }
    console.error('❌ Recommendation generation failed:', err);
    setError('Recommendation generation failed. Please try again.');
    throw err;
  } finally {
    setIsLoading(false);
    abortControllerRef.current = null;
  }
}, [checkAIAvailability]);

  // 重置错误状态
  const clearError = useCallback(() => {
    setError(null);
    retryCountRef.current = 0;
  }, []);

  // 初始化检查
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