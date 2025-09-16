import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: { type: String, required: true },
    user: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    text: { type: String },
    images: [{ type: String }],
    video: { type: String },
    verified: { type: Boolean, default: false },
    isCarousel: { type: Boolean, default: false }
  },
  { timestamps: true } // ✅ auto add createdAt & updatedAt
);

export default mongoose.model("Review", reviewSchema);
