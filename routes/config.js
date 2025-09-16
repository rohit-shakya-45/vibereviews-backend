import express from "express";
const router = express.Router();

// Ye config DB/metafield se bhi fetch kar sakte ho
// Abhi static JSON example de raha hoon
const reviewConfig = {
  cardsCarousel: {
    maximumWidth: "1100px",
    cornerRadius: "12px",
    reviewsOnDesktop: 4,
    reviewsOnMobile: 1,
    maxCharacters: 100,
    imageRatio: "3:4",
    colors: {
      reviewerName: "#000000",
      text: "#000000",
      textBackground: "#FFFFFF",
      stars: "#FFD700",
      arrow: "#9A9A9A"
    },
    shadowAndBorder: {
      dropShadowStyle: "0px 2px 10px rgba(0,0,0,0.1)",
      showBorder: false
    }
  }
};

// GET endpoint → React frontend yahan call karega
router.get("/", async (req, res) => {
  try {
    res.json(reviewConfig);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch config" });
  }
});

export default router;
