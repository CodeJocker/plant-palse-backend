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

/**
 * @swagger
 * /ai/prompt:
 *   post:
 *     summary: General plant disease AI consultation
 *     description: Get expert AI advice on plant diseases with specialized prompting for plant pathology
 *     tags: [AI - General]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: Your plant disease question or concern
 *                 example: "My tomato plants have brown spots with yellow halos. What could this be?"
 *           examples:
 *             disease_question:
 *               summary: Disease identification question
 *               value:
 *                 prompt: "My tomato plants have brown spots with yellow halos. What could this be?"
 *             treatment_question:
 *               summary: Treatment advice question
 *               value:
 *                 prompt: "What are the best organic treatments for powdery mildew on roses?"
 *     responses:
 *       200:
 *         description: AI consultation completed successfully
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
 *                         prompt:
 *                           type: string
 *                           description: Original user prompt
 *                         response:
 *                           type: string
 *                           description: AI-generated expert response
 *                         id:
 *                           type: string
 *                           description: Database record ID (if saved)
 *                         saved:
 *                           type: boolean
 *                           description: Whether the prompt was saved to database
 *       400:
 *         description: Bad request - missing or invalid prompt
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
// POST /api/ai/prompt - General plant disease AI consultation
router.post("/prompt", promptGemini);

/**
 * @swagger
 * /ai/diagnose:
 *   post:
 *     summary: Specialized disease diagnosis based on symptoms
 *     description: |
 *       **Expert Disease Diagnosis**
 *
 *       Get professional-level disease diagnosis based on observed symptoms. This endpoint provides
 *       detailed analysis including most likely diseases, diagnostic criteria, and immediate actions.
 *
 *       **Use this when:**
 *       - You have observed symptoms but no image analysis
 *       - You want expert confirmation of suspected disease
 *       - You need differential diagnosis between similar diseases
 *     tags: [AI - Specialized]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DiagnosisRequest'
 *           examples:
 *             leaf_spots:
 *               summary: Leaf spot symptoms
 *               value:
 *                 symptoms: "Brown spots with yellow halos on leaves, leaves turning yellow and wilting"
 *                 plantType: "Tomato"
 *                 location: "Outdoor garden in humid climate"
 *                 images: false
 *             powdery_coating:
 *               summary: Powdery coating symptoms
 *               value:
 *                 symptoms: "White powdery coating on leaves, leaves curling and yellowing"
 *                 plantType: "Rose"
 *                 location: "Greenhouse environment"
 *                 images: true
 *     responses:
 *       200:
 *         description: Disease diagnosis completed successfully
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
 *                         plantType:
 *                           type: string
 *                           example: "Tomato"
 *                         symptoms:
 *                           type: string
 *                           example: "Brown spots with yellow halos on leaves"
 *                         diagnosis:
 *                           type: string
 *                           description: Detailed diagnosis with 7 sections including likely diseases, criteria, and recommendations
 *                         id:
 *                           type: string
 *                           description: Database record ID
 *                         saved:
 *                           type: boolean
 *                           description: Whether the diagnosis was saved to database
 *       400:
 *         description: Bad request - missing symptoms
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
// POST /api/ai/diagnose - Specialized disease diagnosis
router.post("/diagnose", diagnosePlantDisease);

// POST /api/ai/treatment - Get treatment recommendations for specific disease
router.post("/treatment", getTreatmentRecommendations);

// POST /api/ai/prevention - Get prevention strategies for plant diseases
router.post("/prevention", getPreventionStrategies);

/**
 * @swagger
 * /ai/disease-info:
 *   post:
 *     summary: Get comprehensive disease information from DL model detection
 *     description: |
 *       **Deep Learning Integration Endpoint**
 *
 *       This endpoint is designed to work with your deep learning model output. After your DL model
 *       analyzes a plant image and returns a disease name, send that information here to get
 *       comprehensive expert-level disease information.
 *
 *       **Workflow:**
 *       1. Frontend sends plant image to DL model
 *       2. DL model returns disease name and confidence
 *       3. Frontend sends disease info to this endpoint
 *       4. AI provides comprehensive disease analysis
 *     tags: [AI - DL Integration]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DiseaseDetection'
 *           examples:
 *             high_confidence:
 *               summary: High confidence detection
 *               value:
 *                 diseaseName: "Early Blight"
 *                 plantType: "Tomato"
 *                 confidence: 87.5
 *                 additionalInfo: "Detected from leaf image analysis"
 *             moderate_confidence:
 *               summary: Moderate confidence detection
 *               value:
 *                 diseaseName: "Powdery Mildew"
 *                 plantType: "Cucumber"
 *                 confidence: 65.8
 *                 additionalInfo: "White coating visible on leaves"
 *     responses:
 *       200:
 *         description: Disease information generated successfully
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
 *                         diseaseName:
 *                           type: string
 *                           example: "Early Blight"
 *                         plantType:
 *                           type: string
 *                           example: "Tomato"
 *                         confidence:
 *                           type: number
 *                           example: 87.5
 *                         diseaseInfo:
 *                           type: string
 *                           description: Comprehensive disease information with 9 detailed sections
 *                         id:
 *                           type: string
 *                           description: Database record ID
 *                         saved:
 *                           type: boolean
 *                           description: Whether the request was saved to database
 *       400:
 *         description: Bad request - missing disease name
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
// POST /api/ai/disease-info - Get comprehensive disease information from DL model detection
router.post("/disease-info", getDiseaseInfo);

/**
 * @swagger
 * /ai/ai-treatment:
 *   post:
 *     summary: Get treatment recommendations for DL model detected disease
 *     description: |
 *       **AI-Powered Treatment Planning**
 *
 *       Get specific, actionable treatment recommendations based on your DL model's disease detection.
 *       This endpoint provides comprehensive treatment plans including immediate actions, medicine
 *       recommendations, application schedules, and marketplace integration.
 *
 *       **Features:**
 *       - Confidence-aware recommendations
 *       - Organic vs conventional treatment options
 *       - Location-specific advice
 *       - Marketplace medicine suggestions
 *       - Monitoring and follow-up guidance
 *     tags: [AI - DL Integration]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TreatmentRequest'
 *           examples:
 *             organic_treatment:
 *               summary: Organic treatment preference
 *               value:
 *                 diseaseName: "Late Blight"
 *                 plantType: "Potato"
 *                 confidence: 92.3
 *                 severity: "Moderate"
 *                 organicPreference: true
 *                 location: "Humid climate region"
 *             conventional_treatment:
 *               summary: Conventional treatment options
 *               value:
 *                 diseaseName: "Early Blight"
 *                 plantType: "Tomato"
 *                 confidence: 87.5
 *                 severity: "Severe"
 *                 organicPreference: false
 *                 location: "Greenhouse environment"
 *     responses:
 *       200:
 *         description: Treatment recommendations generated successfully
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
 *                         diseaseName:
 *                           type: string
 *                           example: "Late Blight"
 *                         plantType:
 *                           type: string
 *                           example: "Potato"
 *                         confidence:
 *                           type: number
 *                           example: 92.3
 *                         severity:
 *                           type: string
 *                           example: "Moderate"
 *                         organicPreference:
 *                           type: boolean
 *                           example: true
 *                         treatmentPlan:
 *                           type: string
 *                           description: Comprehensive treatment plan with 8 detailed sections
 *                         id:
 *                           type: string
 *                           description: Database record ID
 *                         saved:
 *                           type: boolean
 *                           description: Whether the request was saved to database
 *       400:
 *         description: Bad request - missing disease name
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
// POST /api/ai/ai-treatment - Get treatment recommendations for DL model detected disease
router.post("/ai-treatment", getTreatmentForDetectedDisease);

/**
 * @swagger
 * /ai/prompts:
 *   get:
 *     summary: Get all AI prompts with pagination
 *     description: Retrieve all AI consultation history with filtering and pagination options
 *     tags: [AI - Data]
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
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: promptType
 *         schema:
 *           type: string
 *           enum: [general, diagnosis, treatment, prevention, disease_info, ai_treatment]
 *         description: Filter by prompt type
 *       - in: query
 *         name: plantType
 *         schema:
 *           type: string
 *         description: Filter by plant type
 *       - in: query
 *         name: diseaseType
 *         schema:
 *           type: string
 *         description: Filter by disease type
 *     responses:
 *       200:
 *         description: Prompts retrieved successfully
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
 *                         prompts:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/PromptItem'
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
// GET /api/ai/prompts - Get all prompts with pagination
router.get("/prompts", getAllPrompts);

/**
 * @swagger
 * /ai/prompts/{id}:
 *   get:
 *     summary: Get a specific AI prompt by ID
 *     description: Retrieve detailed information about a specific AI consultation
 *     tags: [AI - Data]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the prompt
 *         example: "60d5ecb74b24a1234567890a"
 *     responses:
 *       200:
 *         description: Prompt retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PromptItem'
 *       404:
 *         description: Prompt not found
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
 *     summary: Delete a specific AI prompt by ID
 *     description: Remove an AI consultation record from the database
 *     tags: [AI - Data]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the prompt to delete
 *         example: "60d5ecb74b24a1234567890a"
 *     responses:
 *       200:
 *         description: Prompt deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Prompt not found
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
// GET /api/ai/prompts/:id - Get a specific prompt by ID
router.get("/prompts/:id", getPromptById);

// DELETE /api/ai/prompts/:id - Delete a prompt by ID
router.delete("/prompts/:id", deletePrompt);

module.exports = router;
