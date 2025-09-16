import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
// import OpenAI from "openai";
import Review from "./models/Review.js";
import Template from "./models/Template.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ OpenAI Setup (v4+)
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("✅ VibeReviews Backend Running with MongoDB!");
});

// ================== 📌 Reviews API ==================
app.get("/api/reviews", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/reviews", async (req, res) => {
  try {
    const { product, user, rating, text, images, video, verified } = req.body;
    if (!product || !user || !rating || !text) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

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
    res.json({ success: true, message: "Review added successfully", review: newReview });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete("/api/reviews/:id", async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    res.json({ success: true, message: "Review deleted", deleted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ================== 🤖 AI Review Generator ==================
// ================== 🤖 AI Review Generator (OpenRouter Version) ==================
import axios from "axios";

app.post("/api/generate-review", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ success: false, message: "Prompt is required" });
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant generating product reviews.",
          },
          {
            role: "user",
            content: `Write a customer review in JSON with fields: name, rating, review, and image. Review prompt: ${prompt}`,
          },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const responseText = response.data.choices[0].message.content;

    try {
      const reviewData = JSON.parse(responseText);
      res.json({ success: true, data: reviewData });
    } catch (err) {
      res.json({
        success: true,
        data: {
          name: "AI Customer",
          rating: 5,
          review: responseText,
          image: "https://source.unsplash.com/400x400/?jewelry",
        },
      });
    }
  } catch (err) {
    console.error("❌ AI Error:", err.message || err);
    res.status(500).json({ success: false, message: "Failed to generate review" });
  }
});


// ================== 🎡 Carousel API ==================
app.get("/api/carousel", async (req, res) => {
  try {
    const carouselReviews = await Review.find({ isCarousel: true });
    res.json(carouselReviews);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/carousel/:id", async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isCarousel: true },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    res.json({ success: true, message: "Added to carousel", review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete("/api/carousel/:id", async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isCarousel: false },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    res.json({ success: true, message: "Removed from carousel", review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ================== ⚙️ Config API ==================
app.get("/api/config", (req, res) => {
  try {
    const configPath = path.resolve("./src/config/reviewConfig.json");
    const configData = fs.readFileSync(configPath, "utf-8");
    const config = JSON.parse(configData);
    res.json(config);
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to load config", error: err.message });
  }
});

app.post("/api/config", (req, res) => {
  try {
    const newConfig = req.body;
    const configPath = path.resolve("./src/config/reviewConfig.json");
    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2), "utf-8");
    res.json({ success: true, message: "Config updated", config: newConfig });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update config", error: err.message });
  }
});

// ================== 🎥 Video Reviews API ==================
app.get("/api/videoreviews", async (req, res) => {
  try {
    const videoReviews = await Review.find({ video: { $ne: "" }, isCarousel: true }).sort({ createdAt: -1 });
    res.json(videoReviews);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/videoreviews", async (req, res) => {
  try {
    const { product, user, video, text, rating, verified } = req.body;
    if (!product || !user || !video) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newReview = new Review({
      product,
      user,
      video,
      text: text || "",
      rating: rating || 5,
      images: [],
      verified: verified === true || verified === "true",
      isCarousel: true,
    });

    await newReview.save();
    res.json({ success: true, message: "Video review saved", review: newReview });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ================== 📋 Review Form Templates API ==================
app.get("/api/templates", async (req, res) => {
  try {
    const templates = await Template.find().sort({ updatedAt: -1 });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/api/templates/:id", async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, message: "Template not found" });
    }
    res.json(template);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/templates", async (req, res) => {
  try {
    const { name, layout, fields } = req.body;
    const newTemplate = new Template({ name, layout, fields });
    await newTemplate.save();
    res.json({ success: true, message: "Template created", template: newTemplate });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put("/api/templates/:id", async (req, res) => {
  try {
    const { name, layout, fields } = req.body;
    const updated = await Template.findByIdAndUpdate(
      req.params.id,
      { name, layout, fields, updatedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Template not found" });
    }

    res.json({ success: true, message: "Template updated", template: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete("/api/templates/:id", async (req, res) => {
  try {
    const deleted = await Template.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Template not found" });
    }
    res.json({ success: true, message: "Template deleted", deleted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ================== 🔥 Start Server ==================
const PORT = 5000;
mongoose.connect("mongodb://127.0.0.1:27017/vibereviews", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => console.log(`🚀 Backend running at http://localhost:${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
