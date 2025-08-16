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

/**
 * @swagger
 * /marketplace:
 *   post:
 *     summary: Create new plant disease medicine listing
 *     description: Add a new medicine to the marketplace for plant disease treatment
 *     tags: [🛒 Marketplace (SECONDARY)]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - medicineType
 *               - targetDiseases
 *               - targetPlants
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *                 description: Medicine name
 *                 example: "Copper Fungicide Pro"
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *                 description: Detailed medicine description
 *                 example: "Effective copper-based fungicide for early and late blight control"
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 description: Price in specified currency
 *                 example: 25.99
 *               currency:
 *                 type: string
 *                 enum: [USD, EUR, GBP, RWF, KES, UGX, TZS]
 *                 default: USD
 *                 description: Currency code
 *               medicineType:
 *                 type: string
 *                 enum: [Fungicide, Bactericide, Organic Treatment, Biological Control, Chemical Pesticide, Preventive Treatment, Systemic Treatment, Contact Treatment, Copper-based, Sulfur-based]
 *                 description: Type of medicine
 *                 example: "Fungicide"
 *               targetDiseases:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [Early Blight, Late Blight, Powdery Mildew, Downy Mildew, Black Spot, Rust, Anthracnose, Bacterial Wilt, Fusarium Wilt, Verticillium Wilt, Root Rot, Leaf Spot, Canker, Fire Blight, Scab, Mosaic Virus, Yellowing, Blight, Other]
 *                 description: Diseases this medicine treats
 *                 example: ["Early Blight", "Late Blight"]
 *               targetPlants:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Plants this medicine is suitable for
 *                 example: ["Tomato", "Potato", "Pepper"]
 *     responses:
 *       201:
 *         description: Medicine created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     summary: Get all plant disease medicines with filtering
 *     description: Retrieve all medicines with optional filtering and pagination
 *     tags: [🛒 Marketplace (SECONDARY)]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of items per page
 *       - in: query
 *         name: medicineType
 *         schema:
 *           type: string
 *           enum: [Fungicide, Bactericide, Organic Treatment, Biological Control, Chemical Pesticide, Preventive Treatment, Systemic Treatment, Contact Treatment, Copper-based, Sulfur-based]
 *         description: Filter by medicine type
 *       - in: query
 *         name: targetDisease
 *         schema:
 *           type: string
 *         description: Filter by target disease
 *         example: "Early Blight"
 *       - in: query
 *         name: targetPlant
 *         schema:
 *           type: string
 *         description: Filter by target plant
 *         example: "Tomato"
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Maximum price filter
 *     responses:
 *       200:
 *         description: Medicines retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         medicines:
 *                           type: array
 *                           items:
 *                             type: object
 *                         pagination:
 *                           type: object
 *                           properties:
 *                             currentPage:
 *                               type: integer
 *                             totalPages:
 *                               type: integer
 *                             totalItems:
 *                               type: integer
 *                             hasNext:
 *                               type: boolean
 *                             hasPrev:
 *                               type: boolean
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// CREATE - Add new plant disease medicine
// POST /api/marketplace
router.post("/", createMedicine);

// READ - Get all plant disease medicines with filtering and pagination
// GET /api/marketplace?page=1&limit=20&medicineType=Fungicide&targetDisease=Early%20Blight&targetPlant=Tomato&minPrice=10&maxPrice=100
router.get("/", getAllMedicines);

/**
 * @swagger
 * /marketplace/featured:
 *   get:
 *     summary: Get featured plant disease medicines
 *     description: Retrieve featured medicines that are highlighted in the marketplace
 *     tags: [🛒 Marketplace (SECONDARY)]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of featured medicines to return
 *     responses:
 *       200:
 *         description: Featured medicines retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           price:
 *                             type: number
 *                           medicineType:
 *                             type: string
 *                           targetDiseases:
 *                             type: array
 *                             items:
 *                               type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// READ - Get featured medicines
// GET /api/marketplace/featured?limit=10
router.get("/featured", getFeaturedMedicines);

/**
 * @swagger
 * /marketplace/search:
 *   get:
 *     summary: Search plant disease medicines
 *     description: Search medicines by name, description, active ingredients, or other criteria
 *     tags: [🛒 Marketplace (SECONDARY)]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query (name, description, active ingredients)
 *         example: "copper"
 *       - in: query
 *         name: medicineType
 *         schema:
 *           type: string
 *           enum: [Fungicide, Bactericide, Organic Treatment, Biological Control, Chemical Pesticide, Preventive Treatment, Systemic Treatment, Contact Treatment, Copper-based, Sulfur-based]
 *         description: Filter by medicine type
 *       - in: query
 *         name: targetDisease
 *         schema:
 *           type: string
 *         description: Filter by target disease
 *         example: "Late Blight"
 *       - in: query
 *         name: targetPlant
 *         schema:
 *           type: string
 *         description: Filter by target plant
 *         example: "Potato"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         medicines:
 *                           type: array
 *                           items:
 *                             type: object
 *                         searchQuery:
 *                           type: string
 *                         totalResults:
 *                           type: integer
 *                         pagination:
 *                           type: object
 *       400:
 *         description: Missing search query
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// READ - Search medicines
// GET /api/marketplace/search?q=copper&medicineType=Fungicide&targetDisease=Late%20Blight&targetPlant=Potato
router.get("/search", searchMedicines);

/**
 * @swagger
 * /marketplace/type/{medicineType}:
 *   get:
 *     summary: Get medicines by medicine type
 *     description: Retrieve medicines filtered by specific medicine type
 *     tags: [🛒 Marketplace (SECONDARY)]
 *     parameters:
 *       - in: path
 *         name: medicineType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Fungicide, Bactericide, Organic Treatment, Biological Control, Chemical Pesticide, Preventive Treatment, Systemic Treatment, Contact Treatment, Copper-based, Sulfur-based]
 *         description: Type of medicine to filter by
 *         example: "Fungicide"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Medicines retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// READ - Get medicines by medicine type
// GET /api/marketplace/type/Fungicide?page=1&limit=20
router.get("/type/:medicineType", getMedicinesByType);

/**
 * @swagger
 * /marketplace/disease/{disease}:
 *   get:
 *     summary: Get medicines by target disease
 *     description: Retrieve medicines that treat a specific plant disease
 *     tags: [🛒 Marketplace (SECONDARY)]
 *     parameters:
 *       - in: path
 *         name: disease
 *         required: true
 *         schema:
 *           type: string
 *         description: Disease name to filter by
 *         example: "Early Blight"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Medicines retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// READ - Get medicines by disease
// GET /api/marketplace/disease/Early%20Blight?page=1&limit=20
router.get("/disease/:disease", getMedicinesByDisease);

/**
 * @swagger
 * /marketplace/plant/{plant}:
 *   get:
 *     summary: Get medicines by target plant
 *     description: Retrieve medicines suitable for a specific plant type
 *     tags: [🛒 Marketplace (SECONDARY)]
 *     parameters:
 *       - in: path
 *         name: plant
 *         required: true
 *         schema:
 *           type: string
 *         description: Plant name to filter by
 *         example: "Tomato"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Medicines retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// READ - Get medicines by plant
// GET /api/marketplace/plant/Tomato?page=1&limit=20
router.get("/plant/:plant", getMedicinesByPlant);

/**
 * @swagger
 * /marketplace/{id}:
 *   get:
 *     summary: Get plant disease medicine by ID
 *     description: Retrieve detailed information about a specific medicine
 *     tags: [🛒 Marketplace (SECONDARY)]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Medicine ID
 *         example: "60d5ecb74b24a1234567890a"
 *     responses:
 *       200:
 *         description: Medicine retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         description:
 *                           type: string
 *                         price:
 *                           type: number
 *                         medicineType:
 *                           type: string
 *                         targetDiseases:
 *                           type: array
 *                           items:
 *                             type: string
 *                         targetPlants:
 *                           type: array
 *                           items:
 *                             type: string
 *       404:
 *         description: Medicine not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update plant disease medicine
 *     description: Update an existing medicine listing
 *     tags: [🛒 Marketplace (SECONDARY)]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Medicine ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *               price:
 *                 type: number
 *                 minimum: 0
 *               medicineType:
 *                 type: string
 *                 enum: [Fungicide, Bactericide, Organic Treatment, Biological Control, Chemical Pesticide, Preventive Treatment, Systemic Treatment, Contact Treatment, Copper-based, Sulfur-based]
 *               targetDiseases:
 *                 type: array
 *                 items:
 *                   type: string
 *               targetPlants:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Medicine updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Medicine not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete plant disease medicine
 *     description: Remove a medicine listing from the marketplace
 *     tags: [🛒 Marketplace (SECONDARY)]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Medicine ID
 *     responses:
 *       200:
 *         description: Medicine deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Medicine not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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
