import mongoose from "mongoose";

// Schema for transformed audio versions
const transformedAudioSchema = new mongoose.Schema({
  url: {
    type: String, // Transformed audio URL
    required: true,
  },
  bitrate: String,       // e.g., "128kbps", "320kbps"
  format: String,        // e.g., "mp3", "wav", "aac"
  transformationName: String, // e.g., "compress", "trim", "normalize"
  parameters: Object,         // Optional: { start: 0, end: 30, normalize: true }
}, { _id: false });

const audioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  originalUrl: {
    type: String,
    required: true,
  },
  transformedAudios: [transformedAudioSchema], // Multiple transformed versions
  fileName: String,
  fileType: String,
  fileSize: Number, // in bytes
  duration: Number, // in seconds
  isPublic: {
    type: Boolean,
    default: true,
  },
  tags: [String],       // e.g., ["podcast", "music"]
  categories: [String], // e.g., ["technology", "entertainment", "education"]
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Audio = mongoose.model("Audio", audioSchema);
export default Audio;
