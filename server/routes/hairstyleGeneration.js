import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// 动态导入服务
const hairstyleGenerationService = (await import('../services/hairstyleGenerationService.js')).default;

router.post('/', upload.fields([
  { name: 'person', maxCount: 1 },
  { name: 'hairstyle', maxCount: 1 }
]), async (req, res) => {
  try {
    if (!req.files.person || !req.files.hairstyle) {
      return res.status(400).json({
        success: false,
        error: '请上传人像和发型两张图片'
      });
    }

    const personImage = req.files.person[0];
    const hairstyleImage = req.files.hairstyle[0];
    const faceAnalysis = JSON.parse(req.body.faceAnalysis || '{}');

    // 调用发型生成服务
    const result = await hairstyleGenerationService.generateHairstyle(
      personImage.path,
      hairstyleImage.path,
      faceAnalysis
    );

    // 清理临时文件
    const fs = await import('fs');
    fs.unlinkSync(personImage.path);
    fs.unlinkSync(hairstyleImage.path);

    res.json(result);

  } catch (error) {
    console.error('发型生成路由错误:', error);
    
    // 清理临时文件
    if (req.files) {
      const fs = await import('fs');
      Object.values(req.files).forEach(files => {
        files.forEach(file => {
          try {
            fs.unlinkSync(file.path);
          } catch (e) {
            console.error('清理文件错误:', e);
          }
        });
      });
    }

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;