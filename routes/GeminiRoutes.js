const express = require("express");
const router = express.Router();
const {
  promptGemini,
  diagnosePlantDisease,
  getTreatmentRecommendations,
  getPreventionStrategies,
  getDiseaseInfo,
  getTreatmentForDetectedDisease,
  getAllPrompts,
  getPromptById,
  deletePrompt,
} = require("../controllers/GeminiController");

// Base route: /api/ai

// POST /api/ai/prompt - General plant disease AI consultation
router.post("/prompt", promptGemini);

// POST /api/ai/diagnose - Specialized disease diagnosis
router.post("/diagnose", diagnosePlantDisease);

// POST /api/ai/treatment - Get treatment recommendations for specific disease
router.post("/treatment", getTreatmentRecommendations);

// POST /api/ai/prevention - Get prevention strategies for plant diseases
router.post("/prevention", getPreventionStrategies);

// POST /api/ai/disease-info - Get comprehensive disease information from DL model detection
router.post("/disease-info", getDiseaseInfo);

// POST /api/ai/ai-treatment - Get treatment recommendations for DL model detected disease
router.post("/ai-treatment", getTreatmentForDetectedDisease);

// GET /api/ai/prompts - Get all prompts with pagination
router.get("/prompts", getAllPrompts);

// GET /api/ai/prompts/:id - Get a specific prompt by ID
router.get("/prompts/:id", getPromptById);

// DELETE /api/ai/prompts/:id - Delete a prompt by ID
router.delete("/prompts/:id", deletePrompt);

module.exports = router;
