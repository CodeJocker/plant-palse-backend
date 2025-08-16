const mongoose = require("mongoose");

const PromptSchema = new mongoose.Schema({
  userPrompt: { type: String, required: true },
  aiResponse: { type: String, required: true },
  promptType: {
    type: String,
    enum: [
      "general",
      "diagnosis",
      "treatment",
      "prevention",
      "disease_info",
      "ai_treatment",
    ],
    default: "general",
  },
  plantType: { type: String },
  diseaseType: { type: String },
  region: { type: String },
  severity: { type: String },
  confidence: { type: Number }, // AI model confidence percentage
  organicOnly: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Prompt", PromptSchema);
