import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// 动态导入服务
const faceAnalysisService = (await import('../services/faceAnalysisService.js')).default;

// 面部分析API
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('收到面部分析请求');
    console.log('文件信息:', req.file);
    console.log('请求体:', req.body);
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: '请上传图片文件'
      });
    }
    console.log('文件路径:', req.file.path);
    console.log('文件大小:', req.file.size);

    // 调用面部分析服务
    const analysisResult = await faceAnalysisService.analyzeFace(req.file.path);

    // 清理临时文件
    const fs = await import('fs');
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      analysis: analysisResult
    });

  } catch (error) {
    console.error('面部分析错误:', error);
    
    // 清理临时文件（如果存在）
    if (req.file && req.file.path) {
      const fs = await import('fs');
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.error('清理文件错误:', e);
      }
    }

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;