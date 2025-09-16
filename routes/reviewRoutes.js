const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

router.post('/generate-review', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          { role: "system", content: "You are a helpful assistant generating product reviews." },
          { role: "user", content: `Write a product review for this input: ${prompt}` }
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const responseText = response.data.choices[0].message.content;

    return res.json({
      name: "AI Reviewer",
      rating: 5,
      review: responseText,
      image: "https://source.unsplash.com/400x400/?jewelry"
    });

  } catch (err) {
    console.error("❌ AI Error:", err.message || err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
