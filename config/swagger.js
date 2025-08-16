const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Plant Disease Medicine Marketplace API",
      version: "1.0.0",
      description: `
        A comprehensive API for plant disease diagnosis, treatment recommendations, and medicine marketplace.
        
        ## Features
        - 🤖 **AI-Powered Disease Diagnosis** using Google Gemini
        - 🔬 **Deep Learning Model Integration** for image-based disease detection
        - 💊 **Medicine Marketplace** for plant disease treatments
        - 🌱 **Expert Treatment Recommendations** (organic & conventional)
        - 📊 **Confidence-Based Analysis** from ML model outputs
        
        ## Workflow
        1. **Image Analysis**: Frontend sends plant image to DL model
        2. **Disease Detection**: DL model returns disease name and confidence
        3. **AI Analysis**: Send disease info to AI endpoints for comprehensive analysis
        4. **Treatment Plans**: Get specific treatment recommendations
        5. **Marketplace**: Purchase recommended medicines
        
        ## AI Specialization
        The AI system is specifically tuned for plant pathology and provides expert-level advice on:
        - Disease identification and symptoms
        - Treatment options (organic/chemical)
        - Prevention strategies
        - Medicine recommendations
        - Application methods and timing
      `,
      contact: {
        name: "Hackathon 2025 Team",
        email: "support@plantdiseaseapi.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:4000/api",
        description: "Development server",
      },
      {
        url: "https://api.plantdiseasemarket.com/api",
        description: "Production server",
      },
    ],
    tags: [
      {
        name: "🎯 AI - DL Integration (PRIMARY)",
        description:
          "🔬 Main features: Deep Learning model integration endpoints - START HERE",
      },
      {
        name: "🤖 AI - General",
        description: "General AI consultation endpoints",
      },
      {
        name: "🩺 AI - Specialized",
        description: "Additional specialized diagnosis and treatment endpoints",
      },
      {
        name: "📊 AI - Data",
        description: "AI prompt history and data management",
      },
      {
        name: "🏥 Health",
        description: "API health check endpoints",
      },
      {
        name: "🛒 Marketplace (SECONDARY)",
        description:
          "⚠️ Plant disease medicine marketplace - Requires database connection",
      },
    ],
    components: {
      schemas: {
        // Common response schemas
        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Operation completed successfully",
            },
            data: {
              type: "object",
              description: "Response data",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message",
            },
            details: {
              type: "string",
              description: "Additional error details",
            },
          },
        },

        // AI-specific schemas
        DiseaseDetection: {
          type: "object",
          required: ["diseaseName"],
          properties: {
            diseaseName: {
              type: "string",
              description: "Name of the detected disease",
              example: "Early Blight",
            },
            plantType: {
              type: "string",
              description: "Type of plant affected",
              example: "Tomato",
            },
            confidence: {
              type: "number",
              minimum: 0,
              maximum: 100,
              description: "AI model confidence percentage",
              example: 87.5,
            },
            additionalInfo: {
              type: "string",
              description: "Additional information about the detection",
              example: "Detected from leaf image analysis",
            },
          },
        },

        TreatmentRequest: {
          type: "object",
          required: ["diseaseName"],
          properties: {
            diseaseName: {
              type: "string",
              description: "Name of the disease to treat",
              example: "Late Blight",
            },
            plantType: {
              type: "string",
              description: "Type of plant affected",
              example: "Potato",
            },
            confidence: {
              type: "number",
              minimum: 0,
              maximum: 100,
              description: "AI model confidence percentage",
              example: 92.3,
            },
            severity: {
              type: "string",
              enum: ["Mild", "Moderate", "Severe"],
              description: "Disease severity level",
              example: "Moderate",
            },
            organicPreference: {
              type: "boolean",
              description: "Prefer organic treatment options",
              example: true,
            },
            location: {
              type: "string",
              description: "Geographic location or climate type",
              example: "Humid greenhouse environment",
            },
          },
        },

        DiagnosisRequest: {
          type: "object",
          required: ["symptoms"],
          properties: {
            symptoms: {
              type: "string",
              description: "Detailed description of observed symptoms",
              example:
                "Brown spots with yellow halos on leaves, leaves turning yellow",
            },
            plantType: {
              type: "string",
              description: "Type of plant affected",
              example: "Tomato",
            },
            location: {
              type: "string",
              description: "Geographic location or growing environment",
              example: "Outdoor garden in humid climate",
            },
            images: {
              type: "boolean",
              description: "Whether images are available for analysis",
              example: false,
            },
          },
        },

        PreventionRequest: {
          type: "object",
          required: ["plantType"],
          properties: {
            plantType: {
              type: "string",
              description: "Type of plant to protect",
              example: "Tomato",
            },
            region: {
              type: "string",
              description: "Geographic region or climate type",
              example: "Mediterranean climate",
            },
            season: {
              type: "string",
              description: "Growing season",
              example: "Spring/Summer",
            },
            commonDiseases: {
              type: "string",
              description: "Common diseases in the area",
              example: "Early Blight, Late Blight, Powdery Mildew",
            },
          },
        },

        PromptItem: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Unique identifier",
              example: "60d5ecb74b24a1234567890a",
            },
            userPrompt: {
              type: "string",
              description: "Original user prompt or request",
              example: "What are the symptoms of Early Blight?",
            },
            aiResponse: {
              type: "string",
              description: "AI-generated response",
            },
            promptType: {
              type: "string",
              enum: [
                "general",
                "diagnosis",
                "treatment",
                "prevention",
                "disease_info",
                "ai_treatment",
              ],
              description: "Type of prompt/request",
              example: "disease_info",
            },
            plantType: {
              type: "string",
              description: "Plant type involved",
              example: "Tomato",
            },
            diseaseType: {
              type: "string",
              description: "Disease type involved",
              example: "Early Blight",
            },
            confidence: {
              type: "number",
              description: "AI model confidence (if applicable)",
              example: 87.5,
            },
            organicOnly: {
              type: "boolean",
              description: "Whether organic treatments were preferred",
              example: false,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js", "./controllers/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
