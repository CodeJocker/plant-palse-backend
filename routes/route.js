const express = require("express");
const router = express.Router();
const marketplaceRoutes = require("./MarketPlaceRoutes");
const geminiRoutes = require("./GeminiRoutes");

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check if the API is running and get system status
 *     tags: [🏥 Health]
 *     responses:
 *       200:
 *         description: API is healthy and running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "API is running successfully"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds
 *                   example: 3600
 */
// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running successfully",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Marketplace routes
router.use("/marketplace", marketplaceRoutes);

// AI/Gemini routes
router.use("/ai", geminiRoutes);

/**
 * @swagger
 * /:
 *   get:
 *     summary: API documentation and overview
 *     description: Get comprehensive API documentation with all available endpoints and features
 *     tags: [🏥 Health]
 *     responses:
 *       200:
 *         description: API documentation retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Welcome to Hackathon 2025 Plant Disease Medicine Marketplace API"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 description:
 *                   type: string
 *                 endpoints:
 *                   type: object
 *                   description: Complete list of available endpoints organized by category
 */
// Default route for API documentation
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Hackathon 2025 Plant Disease Medicine Marketplace API",
    version: "1.0.0",
    description:
      "A marketplace for plant disease medicines to help farmers and gardeners find treatments for diseases like Early Blight, Late Blight, and other plant diseases detected on leaves.",
    documentation: {
      swagger: "http://localhost:4000/api-docs",
      description: "Interactive API documentation with Swagger UI",
    },
    endpoints: {
      health: "GET /api/health",
      ai: {
        base: "/api/ai",
        description:
          "AI-powered plant disease diagnosis and recommendations using Gemini",
        specialization:
          "Tuned specifically for plant pathology, disease identification, and treatment recommendations",
        // MAIN FEATURES - Primary endpoints for your DL model integration
        mainEndpoints: [
          "🎯 POST /api/ai/disease-info - Get disease info from DL model detection (PRIMARY)",
          "💊 POST /api/ai/ai-treatment - Get treatment for DL detected disease (PRIMARY)",
          "🩺 POST /api/ai/prompt - General plant disease AI consultation",
        ],

        // ADDITIONAL FEATURES - Secondary endpoints
        additionalEndpoints: [
          "POST /api/ai/diagnose - Specialized disease diagnosis based on symptoms",
          "POST /api/ai/treatment - Get treatment recommendations for specific diseases",
          "POST /api/ai/prevention - Get prevention strategies for plant diseases",
          "GET /api/ai/prompts - Get all prompts with pagination",
          "GET /api/ai/prompts/:id - Get specific prompt by ID",
          "DELETE /api/ai/prompts/:id - Delete prompt by ID",
        ],
        dlModelIntegration: {
          description:
            "Specialized endpoints for deep learning model integration",
          workflow: [
            "1. Frontend sends plant image to DL model",
            "2. DL model returns disease name and confidence",
            "3. Frontend sends disease name to /api/ai/disease-info",
            "4. AI provides comprehensive disease information",
            "5. Optional: Get specific treatment with /api/ai/ai-treatment",
          ],
          endpoints: {
            diseaseInfo:
              "POST /api/ai/disease-info - Requires: diseaseName, optional: plantType, confidence",
            aiTreatment:
              "POST /api/ai/ai-treatment - Requires: diseaseName, optional: plantType, confidence, severity, organicPreference",
          },
        },
        expertiseAreas: [
          "Disease identification and diagnosis",
          "Treatment recommendations (organic & chemical)",
          "Prevention strategies and best practices",
          "Medicine and fungicide recommendations",
          "Application methods and timing",
          "Integrated pest management (IPM)",
        ],
        supportedDiseases: [
          "Early Blight",
          "Late Blight",
          "Powdery Mildew",
          "Downy Mildew",
          "Black Spot",
          "Rust",
          "Anthracnose",
          "Bacterial Wilt",
          "Fusarium Wilt",
          "Verticillium Wilt",
          "Root Rot",
          "Leaf Spot",
          "Canker",
          "Fire Blight",
          "Scab",
          "Mosaic Virus",
          "and many others",
        ],
      },
      marketplace: {
        base: "/api/marketplace",
        description:
          "🛒 Plant Disease Medicine Marketplace (SECONDARY FEATURE)",
        status: "⚠️  Requires MongoDB database connection",
        note: "Currently not working - database connection needed",
        endpoints: [
          "GET /api/marketplace - Get all medicines with filtering (medicineType, targetDisease, targetPlant, etc.)",
          "POST /api/marketplace - Create new medicine listing",
          "GET /api/marketplace/:id - Get medicine by ID",
          "PUT /api/marketplace/:id - Update medicine",
          "DELETE /api/marketplace/:id - Delete medicine",
          "GET /api/marketplace/featured - Get featured medicines",
          "GET /api/marketplace/search?q=query - Search medicines by name, active ingredient, etc.",
          "GET /api/marketplace/type/:medicineType - Get medicines by type (Fungicide, Bactericide, etc.)",
          "GET /api/marketplace/disease/:disease - Get medicines for specific disease (Early Blight, Late Blight, etc.)",
          "GET /api/marketplace/plant/:plant - Get medicines for specific plant (Tomato, Potato, etc.)",
        ],
        supportedDiseases: [
          "Early Blight",
          "Late Blight",
          "Powdery Mildew",
          "Downy Mildew",
          "Black Spot",
          "Rust",
          "Anthracnose",
          "Bacterial Wilt",
          "Fusarium Wilt",
          "Verticillium Wilt",
          "Root Rot",
          "Leaf Spot",
          "Canker",
          "Fire Blight",
          "Scab",
          "Mosaic Virus",
          "Other",
        ],
        supportedPlants: [
          "Tomato",
          "Potato",
          "Pepper",
          "Cucumber",
          "Lettuce",
          "Cabbage",
          "Carrot",
          "Onion",
          "Bean",
          "Pea",
          "Corn",
          "Wheat",
          "Rice",
          "Apple",
          "Grape",
          "Rose",
          "Citrus",
          "Strawberry",
          "General Vegetables",
          "General Fruits",
          "General Ornamentals",
          "All Plants",
        ],
        medicineTypes: [
          "Fungicide",
          "Bactericide",
          "Organic Treatment",
          "Biological Control",
          "Chemical Pesticide",
          "Preventive Treatment",
          "Systemic Treatment",
          "Contact Treatment",
          "Copper-based",
          "Sulfur-based",
        ],
      },
    },
  });
});

module.exports = router;
