import Template from "../models/Template.js";

// ✅ नया टेम्पलेट सेव करें
export const createTemplate = async (req, res) => {
  try {
    const { name, layout, fields } = req.body;
    const newTemplate = new Template({ name, layout, fields });
    const saved = await newTemplate.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Template create नहीं हुआ" });
  }
};

// ✅ सभी टेम्पलेट्स लाएं
export const getTemplates = async (req, res) => {
  try {
    const templates = await Template.find().sort({ updatedAt: -1 });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: "Templates लोड नहीं हो पाए" });
  }
};

// ✅ एक टेम्पलेट लाएं (ID से)
export const getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ error: "Template नहीं मिला" });
    res.json(template);
  } catch (err) {
    res.status(500).json({ error: "Template लोड नहीं हुआ" });
  }
};

// ✅ टेम्पलेट अपडेट करें
export const updateTemplate = async (req, res) => {
  try {
    const { name, layout, fields } = req.body;
    const updated = await Template.findByIdAndUpdate(
      req.params.id,
      { name, layout, fields, updatedAt: new Date() },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Template अपडेट नहीं हुआ" });
  }
};
