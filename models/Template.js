import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
  name: String,
  layout: String,
  fields: [Object],
  updatedAt: { type: Date, default: Date.now }
});

const Template = mongoose.model("Template", templateSchema);
export default Template;
