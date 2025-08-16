const express = require("express");
const router = express.Router();
const {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  getMedicinesByType,
  getMedicinesByDisease,
  getMedicinesByPlant,
  searchMedicines,
  getFeaturedMedicines,
} = require("../controllers/MarkteplaceController");

// Base route: /api/marketplace (Plant Disease Medicine Marketplace)

// CREATE - Add new plant disease medicine
// POST /api/marketplace
router.post("/", createMedicine);

// READ - Get all plant disease medicines with filtering and pagination
// GET /api/marketplace?page=1&limit=20&medicineType=Fungicide&targetDisease=Early%20Blight&targetPlant=Tomato&minPrice=10&maxPrice=100
router.get("/", getAllMedicines);

// READ - Get featured medicines
// GET /api/marketplace/featured?limit=10
router.get("/featured", getFeaturedMedicines);

// READ - Search medicines
// GET /api/marketplace/search?q=copper&medicineType=Fungicide&targetDisease=Late%20Blight&targetPlant=Potato
router.get("/search", searchMedicines);

// READ - Get medicines by medicine type
// GET /api/marketplace/type/Fungicide?page=1&limit=20
router.get("/type/:medicineType", getMedicinesByType);

// READ - Get medicines by disease
// GET /api/marketplace/disease/Early%20Blight?page=1&limit=20
router.get("/disease/:disease", getMedicinesByDisease);

// READ - Get medicines by plant
// GET /api/marketplace/plant/Tomato?page=1&limit=20
router.get("/plant/:plant", getMedicinesByPlant);

// READ - Get single plant disease medicine by ID (must be last among GET routes)
// GET /api/marketplace/:id
router.get("/:id", getMedicineById);

// UPDATE - Update plant disease medicine
// PUT /api/marketplace/:id
router.put("/:id", updateMedicine);

// DELETE - Delete plant disease medicine
// DELETE /api/marketplace/:id
router.delete("/:id", deleteMedicine);

module.exports = router;
