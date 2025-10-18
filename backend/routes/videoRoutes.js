import express from 'express';
import multer from 'multer';
import {
  rotate, crop, scale, trim,
  mute, extractAudio, thumbnail,
  cleanup
} from '../utils/ffmpegWorker.mjs';

const router = express.Router();
const upload = multer({ dest: 'tmp' });

// Example: Rotate
router.post('/rotate', upload.single('file'), async (req, res) => {
  const degrees = Number(req.body.degrees || 0);
  try {
    const { outPath, inputPath } = await rotate({ file: req.file, url: req.body.url, degrees });
    res.download(outPath, () => cleanup(outPath, inputPath));
  } catch (err) {
    cleanup(req.file?.path);
    res.status(500).json({ error: err.message });
  }
});

// Example: Crop
router.post('/crop', upload.single('file'), async (req, res) => {
  const { width, height, x, y } = req.body;
  try {
    const { outPath, inputPath } = await crop({ file: req.file, url: req.body.url, width, height, x, y });
    res.download(outPath, () => cleanup(outPath, inputPath));
  } catch (err) {
    cleanup(req.file?.path);
    res.status(500).json({ error: err.message });
  }
});

// Add similar routes for scale, trim, mute, extractAudio, thumbnail

export default router;
