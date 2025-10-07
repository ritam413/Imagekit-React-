const dashboardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  media: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Media"
  }],
  totalImages: {
    type: Number,
    default: 0
  },
  totalVideos: {
    type: Number,
    default: 0
  },
  recentUploads: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Media"
  }],
  favoriteMedia: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Media"
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Dashboard = mongoose.model("Dashboard", dashboardSchema);
export default Dashboard;
