// routes/templateRoutes.js
import express from "express";
import {
  getTemplates,
  getTemplateById,
  updateTemplate,
  createTemplate
} from "../controllers/templateController.js";

const router = express.Router();

router.get("/", getTemplates);            // GET /api/templates
router.get("/:id", getTemplateById);      // ✅ GET /api/templates/:id
router.put("/:id", updateTemplate);       // PUT /api/templates/:id
router.post("/", createTemplate);         // POST /api/templates

export default router;
