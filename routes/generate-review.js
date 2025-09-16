const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

/**
 * @route   POST /api/generate-review
 * @desc    Generate a product review using OpenRouter (AI)
 * @access  Public (but you can protect it with API keys or auth if needed)
 */
router.post('/generate-review', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const aiResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant generating personalized product reviews for e-commerce platforms.",
          },
          {
            role: "user",
            content: `Write a creative and engaging product review for this product: ${prompt}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const generatedText = aiResponse.data?.choices?.[0]?.message?.content || "No review generated.";

    res.status(200).json({
      name: "AI Reviewer",
      rating: 5,
      review: generatedText,
      image: "https://source.unsplash.com/400x400/?jewelry",
    });
  } catch (error) {
    console.error("❌ AI Generation Failed:", error?.response?.data || error.message);
    res.status(500).json({
      error: "Failed to generate review from AI.",
      details: error?.response?.data || error.message,
    });
  }
});

module.exports = router;
