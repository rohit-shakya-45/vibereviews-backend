import mongoose from "mongoose";

const videoReviewSchema = new mongoose.Schema({
  user: String,
  rating: Number,
  video: { type: String, required: true },
  verified: Boolean,
  themeColor: { type: String, default: "#facc15" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("VideoReview", videoReviewSchema);
