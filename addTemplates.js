import mongoose from "mongoose";
import Template from "./models/Template.js";

// MongoDB se connect
mongoose.connect("mongodb://localhost:27017/vibereviews", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 20 template ready karo
const templates = [];

for (let i = 1; i <= 20; i++) {
  templates.push({
    name: `Template ${i}`,
    layout: i % 2 === 0 ? "card" : "rating-first", // even = card, odd = rating-first
    fields: [
      { label: "Rating", type: "star", required: true },
      { label: "Name", type: "text", required: true },
      { label: "Email", type: "email", required: false },
      { label: "Review", type: "textarea", required: true },
      { label: "Product Image", type: "image", required: false },
      { label: "Color", type: "dropdown", required: false },
      { label: "Verified", type: "checkbox", required: false },
      { label: "Video", type: "video", required: false }
    ]
  });
}

// Templates ko database me save karo
async function seedTemplates() {
  try {
    await Template.insertMany(templates);
    console.log("✅ 20 templates database mein insert ho gaye!");
  } catch (error) {
    console.error("❌ Error aaya:", error);
  } finally {
    mongoose.disconnect();
  }
}

seedTemplates();
