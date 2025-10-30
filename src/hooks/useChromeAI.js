import { useState, useCallback } from 'react';

export const useChromeAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');

  // 检查 Chrome AI 可用性
  const checkAIAvailability = useCallback(async () => {
    try {
      if (typeof LanguageModel === 'undefined') {
        setApiStatus('unavailable');
        return false;
      }

      const availability = await LanguageModel.availability();
      console.log('🔍 Chrome AI 可用性:', availability);
      
      if (availability === 'readily') {
        setApiStatus('available');
        return true;
      } else {
        setApiStatus('unavailable');
        return false;
      }
    } catch (err) {
      console.error('检查 Chrome AI 可用性失败:', err);
      setApiStatus('unavailable');
      return false;
    }
  }, []);

  // 将图片转换为 base64（移除 Data URL 前缀）
  const imageToBase64 = useCallback((blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // 移除 "data:image/jpeg;base64," 前缀
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.readAsDataURL(blob);
    });
  }, []);

  // 模拟面部分析（降级方案）
  const simulateFaceAnalysis = useCallback((imageBlob) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const faceShapes = ['椭圆形', '圆形', '方形', '心形', '长形'];
        const randomShape = faceShapes[Math.floor(Math.random() * faceShapes.length)];
        
        resolve({
          faceShape: randomShape,
          features: {
            confidence: (85 + Math.random() * 15).toFixed(1) + '%',
            symmetry: '良好',
            proportions: '标准'
          },
          isMock: true,
          note: 'Chrome AI 不可用 - 使用模拟数据'
        });
      }, 1500);
    });
  }, []);

  // 真实的面部分析 - 使用 Chrome AI Prompt API
  const analyzeFaceWithAI = useCallback(async (imageBlob) => {
    try {
      console.log('🎯 使用 Chrome AI 分析人脸...');
      
      // 创建会话
      const session = await LanguageModel.create();
      
      // 转换图片为 base64
      const imageBase64 = await imageToBase64(imageBlob);
      
      // 构建提示词
      const promptText = `你是一个专业的形象顾问。请分析这张人脸图片，识别以下特征：
      1. 脸型（椭圆形、圆形、方形、心形、长形）
      2. 面部特征和轮廓
      
      请以 JSON 格式返回分析结果，包含以下字段：
      - faceShape: 脸型
      - confidence: 置信度百分比
      - features: 包含 symmetry（对称性）、proportions（比例）等特征描述
      
      如果没有检测到人脸，返回 { "error": "没有检测到人脸" }`;

      // 调用 Prompt API
      const analysisResult = await session.prompt([
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: promptText 
            },
            { 
              type: "image", 
              data: imageBase64 
            }
          ]
        }
      ]);

      console.log('✅ Chrome AI 分析结果:', analysisResult);

      // 解析响应
      try {
        // 尝试从响应中提取 JSON
        const jsonMatch = analysisResult.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedResult = JSON.parse(jsonMatch[0]);
          
          if (parsedResult.error) {
            throw new Error(parsedResult.error);
          }
          
          return {
            ...parsedResult,
            isMock: false,
            note: '由 Chrome AI Prompt API 生成'
          };
        }
        
        // 如果是纯文本响应，尝试提取脸型信息
        const faceShapes = ['椭圆形', '圆形', '方形', '心形', '长形'];
        const foundShape = faceShapes.find(shape => analysisResult.includes(shape));
        
        if (foundShape) {
          return {
            faceShape: foundShape,
            confidence: '85%',
            features: {
              symmetry: '良好',
              proportions: '标准'
            },
            isMock: false,
            note: '由 Chrome AI Prompt API 生成'
          };
        }
        
        throw new Error('无法解析 AI 响应');
        
      } catch (parseError) {
        console.error('解析 AI 响应失败:', parseError);
        throw new Error('AI 响应格式错误: ' + analysisResult);
      }

    } catch (err) {
      console.error('❌ Chrome AI 分析失败:', err);
      throw err;
    }
  }, [imageToBase64]);

  // 主分析函数
  const analyzeFace = useCallback(async (imageBlob) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 检查 AI 可用性
      const isAvailable = await checkAIAvailability();
      
      if (!isAvailable) {
        console.log('🔄 Chrome AI 不可用，使用模拟数据');
        return await simulateFaceAnalysis(imageBlob);
      }

      // 使用真实的 Chrome AI
      return await analyzeFaceWithAI(imageBlob);

    } catch (err) {
      console.error('❌ 面部分析失败:', err);
      
      // 优雅降级到模拟数据
      const errorMessage = err.message.includes('没有检测到人脸') 
        ? err.message 
        : `AI 分析失败: ${err.message}，使用模拟数据演示`;
      
      setError(errorMessage);
      
      if (!err.message.includes('没有检测到人脸')) {
        console.log('🔄 降级到模拟数据');
        return await simulateFaceAnalysis(imageBlob);
      }
      
      throw err; // 如果是"没有检测到人脸"错误，直接抛出
    } finally {
      setIsLoading(false);
    }
  }, [checkAIAvailability, analyzeFaceWithAI, simulateFaceAnalysis]);

  // 生成发型建议
  const generateRecommendation = useCallback(async (faceAnalysis, hairstyle) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 检查 AI 可用性
      const isAvailable = await checkAIAvailability();
      
      if (!isAvailable) {
        // 使用模拟建议
        return await simulateRecommendation(faceAnalysis, hairstyle);
      }

      // 使用真实的 Chrome AI Writer API
      console.log('🎯 使用 Chrome AI 生成发型建议...');
      
      const session = await LanguageModel.create();
      
      const promptText = `你是一个专业的发型师。基于以下信息生成个性化的发型建议：

用户脸型: ${faceAnalysis.faceShape}
选择发型: ${hairstyle.name}
发型特点: ${hairstyle.description}

请生成详细的建议，包含：
1. 为什么这个发型适合用户的脸型（具体原因）
2. 日常打理和维护建议
3. 搭配妆容和服装的建议
4. 需要注意的事项

请用自然、专业但友好的中文回答。`;

      const recommendation = await session.prompt([
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: promptText 
            }
          ]
        }
      ]);

      console.log('✅ Chrome AI 建议生成成功');

      return {
        text: recommendation,
        isMock: false,
        note: '由 Chrome AI 生成'
      };

    } catch (err) {
      console.error('❌ AI 建议生成失败:', err);
      
      // 降级到模拟数据
      setError(`AI 建议生成失败: ${err.message}，使用模拟数据演示`);
      console.log('🔄 降级到模拟数据');
      
      return await simulateRecommendation(faceAnalysis, hairstyle);
    } finally {
      setIsLoading(false);
    }
  }, [checkAIAvailability]);

  // 模拟建议生成（降级方案）
  const simulateRecommendation = useCallback(async (faceAnalysis, hairstyle) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const recommendations = {
          椭圆形: `您的${faceAnalysis.faceShape}脸型非常标准，${hairstyle.name}能够完美展现您的面部优势。${hairstyle.description} 建议定期修剪保持发型层次感。`,
          圆形: `${hairstyle.name}能够拉长您的${faceAnalysis.faceShape}脸型视觉效果，${hairstyle.description} 建议搭配侧分刘海增加立体感。`,
          方形: `这款${hairstyle.name}能够柔化您的${faceAnalysis.faceShape}脸型轮廓，${hairstyle.description} 建议保持发型蓬松度。`,
          心形: `${hairstyle.name}非常适合您的${faceAnalysis.faceShape}脸型，能够平衡额头和下巴的比例。${hairstyle.description}`,
          长形: `您的${faceAnalysis.faceShape}脸型适合${hairstyle.name}，建议保持发型宽度增加面部饱满感。${hairstyle.description}`
        };

        const recommendation = recommendations[faceAnalysis.faceShape] || 
          `这款${hairstyle.name}很适合您的${faceAnalysis.faceShape}脸型。${hairstyle.description} 建议咨询专业发型师获取更多建议。`;

        resolve({
          text: recommendation,
          isMock: true,
          note: 'Chrome AI 不可用 - 使用模拟数据'
        });
      }, 1000);
    });
  }, []);

  // 初始化检查
  useState(() => {
    checkAIAvailability();
  }, [checkAIAvailability]);

  return {
    analyzeFace,
    generateRecommendation,
    isLoading,
    error,
    apiStatus,
    isChromeAIAvailable: apiStatus === 'available',
    checkAIAvailability
  };
};

export default useChromeAI;