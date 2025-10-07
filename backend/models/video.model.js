import mongoose from "mongoose";

const transformedVideoSchema = new mongoose.Schema({
  url: {
    type: String, // Transformed video URL
    required: true,
  },
  resolution: String, // e.g., "720p", "1080p"
  format: String,     // e.g., "mp4", "webm"
  transformationName: String, // e.g., "compress", "trim"
  parameters: Object,        // Optional: { start: 0, end: 30, bitrate: "2mbps" }
}, { _id: false });

const videoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  originalUrl: {
    type: String,
    required: true,
  },
  transformedVideos: [transformedVideoSchema], // Multiple transformed versions
  fileName: String,
  fileType: String,
  fileSize: Number, // in bytes
  isPublic: {
    type: Boolean,
    default: true,
  },
  tags: [String],       // e.g., ["tutorial", "promo"]
  categories: [String], // e.g., ["technology", "entertainment"]
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
