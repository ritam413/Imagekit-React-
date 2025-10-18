import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const TMP_DIR = path.join(process.cwd(), 'tmp');
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

function makeTempPath(ext = '') {
  return path.join(TMP_DIR, `${uuidv4()}${ext}`);
}

async function downloadUrlToFile(url) {
  const ext = path.extname(new URL(url).pathname) || '.mp4';
  const filePath = makeTempPath(ext);
  const writer = fs.createWriteStream(filePath);
  const response = await axios.get(url, { responseType: 'stream' });
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(filePath));
    writer.on('error', reject);
  });
}

async function getInput(file, url) {
  if (file) return file.path;
  if (url) return await downloadUrlToFile(url);
  throw new Error('No input provided.');
}


function cleanup(...files) {
  files.forEach(f => f && fs.existsSync(f) && fs.unlinkSync(f));
}

// ------------- FFmpeg Operations -------------

export async function rotate({ file, url, degrees = 0 }) {
  const inputPath = await getInput(file, url);
  const outPath = makeTempPath('.mp4');

  await new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoFilters(`rotate=${degrees * Math.PI / 180}`)
      .on('end', resolve)
      .on('error', reject)
      .save(outPath);
  });

  return { outPath, inputPath };
}

export async function crop({ file, url, width, height, x = 0, y = 0 }) {
  const inputPath = await getInput(file, url);
  const outPath = makeTempPath('.mp4');

  await new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoFilters(`crop=${width}:${height}:${x}:${y}`)
      .on('end', resolve)
      .on('error', reject)
      .save(outPath);
  });

  return { outPath, inputPath };
}

export async function scale({ file, url, width, height }) {
  const inputPath = await getInput(file, url);
  const outPath = makeTempPath('.mp4');

  await new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .size(`${width || -1}x${height || -1}`)
      .on('end', resolve)
      .on('error', reject)
      .save(outPath);
  });

  return { outPath, inputPath };
}

export async function trim({ file, url, start = 0, duration }) {
  const inputPath = await getInput(file, url);
  const outPath = makeTempPath('.mp4');

  await new Promise((resolve, reject) => {
    let cmd = ffmpeg(inputPath).setStartTime(start);
    if (duration) cmd = cmd.setDuration(duration);
    cmd.on('end', resolve).on('error', reject).save(outPath);
  });

  return { outPath, inputPath };
}

export async function mute({ file, url }) {
  const inputPath = await getInput(file, url);
  const outPath = makeTempPath('.mp4');

  await new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .noAudio()
      .on('end', resolve)
      .on('error', reject)
      .save(outPath);
  });

  return { outPath, inputPath };
}

export async function extractAudio({ file, url, format = 'mp3' }) {
  const inputPath = await getInput(file, url);
  const outPath = makeTempPath(`.${format}`);

  await new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .noVideo()
      .format(format)
      .on('end', resolve)
      .on('error', reject)
      .save(outPath);
  });

  return { outPath, inputPath };
}

export async function thumbnail({ file, url, time = 1, width, height }) {
  const inputPath = await getInput(file, url);
  const outPath = makeTempPath('.png');

  await new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .screenshots({
        timestamps: [time],
        filename: path.basename(outPath),
        folder: TMP_DIR,
        size: width && height ? `${width}x${height}` : undefined
      })
      .on('end', resolve)
      .on('error', reject);
  });

  return { outPath, inputPath };
}

export { cleanup };
