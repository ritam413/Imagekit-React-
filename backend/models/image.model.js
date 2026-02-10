import mongoose from "mongoose";

const transformedSchema = new mongoose.Schema({
  url: {
    type: String, // Transformed image URL
    required: true,
  },
  width: Number,  // Optional width
  height: Number, // Optional height
  transformationName: String, // e.g., "resize", "crop", "ai-bg-remove"
  parameters: Object,        // Optional: { width: 200, height: 200, mode: 'fill' }
}, { _id: false });

const imageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  originalUrl: {
    type: String,
    required: true,
  },
  transformedImages: [transformedSchema], // Store multiple transformed URLs
  fileName: String,
  fileType: String,
  fileSize: Number, // in bytes
  isPublic: {
    type: Boolean,
    default: false, // default public
  },
  tags: [String],       // e.g., ["profile", "banner", "product"]
  categories: [String], // e.g., ["nature", "people", "tech"]
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Image = mongoose.model("Image", imageSchema,"Images");
export default Image;
