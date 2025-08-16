const express = require("express");
const router = express.Router();
const marketplaceRoutes = require("./MarketPlaceRoutes");

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running successfully",
    timestamp: new Date().toISOString(),
  });
});

// Marketplace routes
router.use("/marketplace", marketplaceRoutes);

// Default route for API documentation
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Hackathon 2025 Plant Disease Medicine Marketplace API",
    version: "1.0.0",
    description:
      "A marketplace for plant disease medicines to help farmers and gardeners find treatments for diseases like Early Blight, Late Blight, and other plant diseases detected on leaves.",
    endpoints: {
      health: "GET /api/health",
      marketplace: {
        base: "/api/marketplace",
        description: "Plant Disease Medicine Marketplace",
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
