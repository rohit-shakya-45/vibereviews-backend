import express from "express";
import VideoReview from "../models/VideoReview.js";

const router = express.Router();

// ✅ Add video review
router.post("/", async (req, res) => {
  try {
    const { user, rating, video, verified, themeColor } = req.body;
    if (!video || !user || !rating) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newVideo = new VideoReview({
      user,
      rating,
      video,
      verified,
      themeColor
    });

    await newVideo.save();
    res.status(201).json({ success: true, message: "Video review added", review: newVideo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Get all video reviews
router.get("/", async (req, res) => {
  try {
    const videos = await VideoReview.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
