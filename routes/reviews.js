import express from "express";
import Review from "../models/Review.js";

const router = express.Router();

// ✅ GET all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ GET only reviews with photos
router.get("/photo", async (req, res) => {
  try {
    const reviewsWithPhotos = await Review.find(
      { images: { $exists: true, $not: { $size: 0 } } }, // images[] must not be empty
      "_id product images user rating text verified createdAt"
    ).sort({ createdAt: -1 });

    res.json(reviewsWithPhotos);
  } catch (err) {
    console.error("Error fetching photo reviews:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// ✅ POST a new review
router.post("/", async (req, res) => {
  try {
    const { product, user, rating, text, images, video, verified } = req.body;

    const newReview = new Review({
      product,
      user,
      rating,
      text,
      images: images || [],
      video: video || "",
      verified: verified === true || verified === "true",
      isCarousel: false,
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ✅ DELETE a review by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Review not found" });

    res.json({ success: true, message: "Review deleted", deleted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Add to Carousel
router.post("/:id/addToCarousel", async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isCarousel: true },
      { new: true }
    );
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    res.json({ success: true, message: "Review added to carousel", review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Remove from Carousel
router.post("/:id/removeFromCarousel", async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isCarousel: false },
      { new: true }
    );
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    res.json({ success: true, message: "Review removed from carousel", review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});




// GET single review by ID
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
