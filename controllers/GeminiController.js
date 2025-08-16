const { client } = require("../config/gemini.js");
const Prompt = require("../models/PromptItem.js");

// Helper function for error responses
const sendErrorResponse = (res, statusCode, message, details = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
  });
};

// Helper function for success responses
const sendSuccessResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data && { data }),
  });
};

// Plant Disease Expert System Prompt Template
const createPlantDiseasePrompt = (userPrompt) => {
  return `You are a specialized Plant Disease Expert AI assistant focused exclusively on plant pathology, disease diagnosis, and treatment recommendations. Your expertise covers:

CORE FOCUS AREAS:
- Plant disease identification and diagnosis
- Fungal, bacterial, viral, and pest-related plant diseases
- Disease symptoms, causes, and progression
- Treatment recommendations (organic and chemical)
- Prevention strategies and best practices
- Crop-specific disease management
- Medicine and fungicide recommendations
- Application methods and timing
- Integrated pest management (IPM)

SUPPORTED DISEASES INCLUDE:
Early Blight, Late Blight, Powdery Mildew, Downy Mildew, Black Spot, Rust, Anthracnose, Bacterial Wilt, Fusarium Wilt, Verticillium Wilt, Root Rot, Leaf Spot, Canker, Fire Blight, Scab, Mosaic Virus, and many others.

SUPPORTED PLANTS INCLUDE:
Tomato, Potato, Pepper, Cucumber, Lettuce, Cabbage, Carrot, Onion, Bean, Pea, Corn, Wheat, Rice, Apple, Grape, Rose, Citrus, Strawberry, and other vegetables, fruits, and ornamental plants.

RESPONSE GUIDELINES:
1. Always provide specific, actionable advice
2. Include disease identification criteria when relevant
3. Recommend specific medicines/treatments with application methods
4. Mention prevention strategies
5. Consider both organic and conventional treatment options
6. Include timing and frequency of treatments
7. Warn about safety precautions when using chemicals
8. If the question is not related to plant diseases, politely redirect to plant health topics

USER QUESTION: ${userPrompt}

Please provide a comprehensive, expert-level response focused specifically on plant disease management:`;
};

// Generate content using Gemini AI
const promptGemini = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return sendErrorResponse(res, 400, "Prompt is required");
    }

    // Create specialized plant disease prompt
    const specializedPrompt = createPlantDiseasePrompt(prompt);

    // Generate content using Gemini
    const response = await client.generateContent(specializedPrompt);
    const aiResponse = response.response.text();

    // Try to save the prompt and response to database
    let promptRecord = null;
    try {
      promptRecord = new Prompt({
        userPrompt: prompt,
        aiResponse: aiResponse,
      });

      await promptRecord.save();
    } catch (dbError) {
      console.warn(
        "Database save failed, but AI response generated successfully:",
        dbError.message
      );
    }

    return sendSuccessResponse(res, 200, "Content generated successfully", {
      prompt: prompt,
      response: aiResponse,
      id: promptRecord ? promptRecord._id : null,
      saved: promptRecord !== null,
    });
  } catch (error) {
    console.error("Error generating content:", error);

    if (error.message.includes("API key")) {
      return sendErrorResponse(res, 401, "Invalid or missing API key");
    }

    return sendErrorResponse(
      res,
      500,
      "Failed to generate content",
      error.message
    );
  }
};

// Get all prompts with pagination
const getAllPrompts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const prompts = await Prompt.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const totalPrompts = await Prompt.countDocuments();
    const totalPages = Math.ceil(totalPrompts / parseInt(limit));

    const pagination = {
      currentPage: parseInt(page),
      totalPages,
      totalItems: totalPrompts,
      hasNextPage: parseInt(page) < totalPages,
      hasPrevPage: parseInt(page) > 1,
    };

    return sendSuccessResponse(res, 200, "Prompts retrieved successfully", {
      prompts,
      pagination,
    });
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return sendErrorResponse(
      res,
      500,
      "Failed to fetch prompts",
      error.message
    );
  }
};

// Get a specific prompt by ID
const getPromptById = async (req, res) => {
  try {
    const { id } = req.params;

    const prompt = await Prompt.findById(id);

    if (!prompt) {
      return sendErrorResponse(res, 404, "Prompt not found");
    }

    return sendSuccessResponse(
      res,
      200,
      "Prompt retrieved successfully",
      prompt
    );
  } catch (error) {
    console.error("Error fetching prompt:", error);
    if (error.name === "CastError") {
      return sendErrorResponse(res, 400, "Invalid prompt ID format");
    }
    return sendErrorResponse(res, 500, "Failed to fetch prompt", error.message);
  }
};

// Delete a prompt by ID
const deletePrompt = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPrompt = await Prompt.findByIdAndDelete(id);

    if (!deletedPrompt) {
      return sendErrorResponse(res, 404, "Prompt not found");
    }

    return sendSuccessResponse(res, 200, "Prompt deleted successfully", {
      deletedPrompt: {
        id: deletedPrompt._id,
        userPrompt: deletedPrompt.userPrompt.substring(0, 50) + "...",
      },
    });
  } catch (error) {
    console.error("Error deleting prompt:", error);
    if (error.name === "CastError") {
      return sendErrorResponse(res, 400, "Invalid prompt ID format");
    }
    return sendErrorResponse(
      res,
      500,
      "Failed to delete prompt",
      error.message
    );
  }
};

// Specialized plant disease diagnosis function
const diagnosePlantDisease = async (req, res) => {
  try {
    const { symptoms, plantType, location, images } = req.body;

    if (!symptoms || symptoms.trim().length === 0) {
      return sendErrorResponse(res, 400, "Disease symptoms are required");
    }

    const diagnosisPrompt = `You are a Plant Disease Diagnostic Expert. Based on the following information, provide a detailed diagnosis:

PLANT TYPE: ${plantType || "Not specified"}
LOCATION/CLIMATE: ${location || "Not specified"}
SYMPTOMS OBSERVED: ${symptoms}
IMAGES PROVIDED: ${images ? "Yes" : "No"}

Please provide:
1. MOST LIKELY DISEASE(S): List 2-3 most probable diseases with confidence levels
2. DIAGNOSTIC CRITERIA: Key symptoms that support your diagnosis
3. DISEASE PROGRESSION: How the disease typically develops
4. IMMEDIATE ACTIONS: What to do right now to prevent spread
5. TREATMENT RECOMMENDATIONS: Specific medicines and application methods
6. PREVENTION STRATEGIES: How to prevent future occurrences
7. MONITORING: What to watch for during treatment

Format your response clearly with numbered sections for easy reading.`;

    const response = await client.generateContent(diagnosisPrompt);
    const aiResponse = response.response.text();

    // Try to save the diagnosis to database
    let promptRecord = null;
    try {
      promptRecord = new Prompt({
        userPrompt: `DIAGNOSIS REQUEST - Plant: ${plantType}, Symptoms: ${symptoms}`,
        aiResponse: aiResponse,
        promptType: "diagnosis",
      });
      await promptRecord.save();
    } catch (dbError) {
      console.warn("Database save failed:", dbError.message);
    }

    return sendSuccessResponse(res, 200, "Disease diagnosis completed", {
      plantType,
      symptoms,
      diagnosis: aiResponse,
      id: promptRecord ? promptRecord._id : null,
      saved: promptRecord !== null,
    });
  } catch (error) {
    console.error("Error in disease diagnosis:", error);
    return sendErrorResponse(
      res,
      500,
      "Failed to diagnose disease",
      error.message
    );
  }
};

// Get treatment recommendations for a specific disease
const getTreatmentRecommendations = async (req, res) => {
  try {
    const { disease, plantType, severity, organicOnly } = req.body;

    if (!disease || disease.trim().length === 0) {
      return sendErrorResponse(res, 400, "Disease name is required");
    }

    const treatmentPrompt = `You are a Plant Disease Treatment Specialist. Provide comprehensive treatment recommendations for:

DISEASE: ${disease}
PLANT TYPE: ${plantType || "General"}
SEVERITY LEVEL: ${severity || "Not specified"}
ORGANIC TREATMENT ONLY: ${organicOnly ? "Yes" : "No"}

Please provide detailed treatment recommendations including:

1. IMMEDIATE TREATMENT ACTIONS:
   - Emergency steps to take right now
   - Isolation and sanitation measures

2. MEDICINE RECOMMENDATIONS:
   ${
     organicOnly
       ? "- Focus on organic and biological treatments only"
       : "- Both organic and conventional options"
   }
   - Specific product names and active ingredients
   - Application rates and concentrations
   - Frequency and timing of applications

3. APPLICATION METHODS:
   - How to apply treatments (foliar spray, soil drench, etc.)
   - Equipment needed
   - Safety precautions

4. TREATMENT SCHEDULE:
   - Week-by-week treatment plan
   - When to expect results
   - Signs of improvement to watch for

5. PREVENTION STRATEGIES:
   - How to prevent reoccurrence
   - Cultural practices to implement
   - Resistant varieties to consider

6. MONITORING AND FOLLOW-UP:
   - What to monitor during treatment
   - When to adjust treatment approach
   - Long-term management strategies

Provide specific, actionable advice with exact product recommendations where possible.`;

    const response = await client.generateContent(treatmentPrompt);
    const aiResponse = response.response.text();

    // Try to save the treatment recommendation to database
    let promptRecord = null;
    try {
      promptRecord = new Prompt({
        userPrompt: `TREATMENT REQUEST - Disease: ${disease}, Plant: ${plantType}`,
        aiResponse: aiResponse,
        promptType: "treatment",
      });
      await promptRecord.save();
    } catch (dbError) {
      console.warn("Database save failed:", dbError.message);
    }

    return sendSuccessResponse(
      res,
      200,
      "Treatment recommendations generated",
      {
        disease,
        plantType,
        organicOnly,
        recommendations: aiResponse,
        id: promptRecord ? promptRecord._id : null,
        saved: promptRecord !== null,
      }
    );
  } catch (error) {
    console.error("Error generating treatment recommendations:", error);
    return sendErrorResponse(
      res,
      500,
      "Failed to generate treatment recommendations",
      error.message
    );
  }
};

// Get prevention strategies for plant diseases
const getPreventionStrategies = async (req, res) => {
  try {
    const { plantType, region, season, commonDiseases } = req.body;

    if (!plantType || plantType.trim().length === 0) {
      return sendErrorResponse(res, 400, "Plant type is required");
    }

    const preventionPrompt = `You are a Plant Disease Prevention Expert. Provide comprehensive prevention strategies for:

PLANT TYPE: ${plantType}
REGION/CLIMATE: ${region || "Not specified"}
GROWING SEASON: ${season || "Not specified"}
COMMON DISEASES IN AREA: ${commonDiseases || "Not specified"}

Please provide a detailed prevention plan including:

1. CULTURAL PRACTICES:
   - Proper spacing and air circulation
   - Watering techniques and timing
   - Soil management and drainage
   - Crop rotation strategies

2. PREVENTIVE TREATMENTS:
   - Prophylactic spraying schedules
   - Soil amendments and treatments
   - Seed treatments and plant selection

3. ENVIRONMENTAL MANAGEMENT:
   - Humidity and temperature control
   - Sanitation practices
   - Tool and equipment sterilization

4. RESISTANT VARIETIES:
   - Recommended disease-resistant cultivars
   - Where to source resistant plants/seeds
   - Performance characteristics

5. MONITORING PROTOCOLS:
   - Early detection methods
   - Regular inspection schedules
   - Warning signs to watch for

6. SEASONAL CALENDAR:
   - Month-by-month prevention activities
   - Critical timing for preventive measures
   - Weather-based adjustments

7. INTEGRATED APPROACH:
   - Combining multiple prevention strategies
   - Balancing organic and conventional methods
   - Cost-effective prevention plans

Focus on practical, implementable strategies that prevent disease before it starts.`;

    const response = await client.generateContent(preventionPrompt);
    const aiResponse = response.response.text();

    // Try to save the prevention strategy to database
    let promptRecord = null;
    try {
      promptRecord = new Prompt({
        userPrompt: `PREVENTION REQUEST - Plant: ${plantType}, Region: ${region}`,
        aiResponse: aiResponse,
        promptType: "prevention",
      });
      await promptRecord.save();
    } catch (dbError) {
      console.warn("Database save failed:", dbError.message);
    }

    return sendSuccessResponse(res, 200, "Prevention strategies generated", {
      plantType,
      region,
      season,
      strategies: aiResponse,
      id: promptRecord ? promptRecord._id : null,
      saved: promptRecord !== null,
    });
  } catch (error) {
    console.error("Error generating prevention strategies:", error);
    return sendErrorResponse(
      res,
      500,
      "Failed to generate prevention strategies",
      error.message
    );
  }
};

// Get comprehensive disease information based on disease name from DL model
const getDiseaseInfo = async (req, res) => {
  try {
    const { diseaseName, plantType, confidence, additionalInfo } = req.body;

    if (!diseaseName || diseaseName.trim().length === 0) {
      return sendErrorResponse(res, 400, "Disease name is required");
    }

    const diseaseInfoPrompt = `You are a Plant Disease Expert AI. A deep learning model has identified a plant disease from an image. Provide comprehensive information about this disease:

IDENTIFIED DISEASE: ${diseaseName}
PLANT TYPE: ${plantType || "Not specified"}
MODEL CONFIDENCE: ${confidence ? `${confidence}%` : "Not provided"}
ADDITIONAL INFO: ${additionalInfo || "None"}

Please provide a complete disease profile including:

1. **DISEASE OVERVIEW:**
   - Scientific name and common names
   - Type of pathogen (fungal, bacterial, viral, etc.)
   - Brief description of the disease

2. **SYMPTOMS AND IDENTIFICATION:**
   - Detailed symptom description
   - How to distinguish from similar diseases
   - Disease progression stages
   - Affected plant parts

3. **CAUSES AND CONDITIONS:**
   - Environmental conditions that favor the disease
   - How the disease spreads
   - Risk factors and triggers

4. **IMMEDIATE ACTIONS:**
   - Emergency steps to take right now
   - Isolation and containment measures
   - What NOT to do

5. **TREATMENT OPTIONS:**
   - Organic treatment methods
   - Chemical treatment options
   - Biological control agents
   - Specific product recommendations with active ingredients

6. **APPLICATION GUIDELINES:**
   - How to apply treatments (foliar spray, soil drench, etc.)
   - Timing and frequency of applications
   - Dosage and concentration guidelines
   - Safety precautions

7. **PREVENTION STRATEGIES:**
   - Cultural practices to prevent reoccurrence
   - Resistant varieties to consider
   - Environmental management
   - Crop rotation recommendations

8. **MONITORING AND PROGNOSIS:**
   - What to monitor during treatment
   - Expected recovery timeline
   - Signs of improvement vs. worsening
   - When to seek professional help

9. **RELATED MARKETPLACE MEDICINES:**
   - Types of medicines effective for this disease
   - Active ingredients to look for
   - Application methods suitable for this disease

Provide specific, actionable advice that farmers and gardeners can implement immediately.`;

    const response = await client.generateContent(diseaseInfoPrompt);
    const aiResponse = response.response.text();

    // Try to save the disease info request to database
    let promptRecord = null;
    try {
      promptRecord = new Prompt({
        userPrompt: `DISEASE INFO REQUEST - Disease: ${diseaseName}, Plant: ${plantType}, Confidence: ${confidence}%`,
        aiResponse: aiResponse,
        promptType: "disease_info",
        plantType: plantType,
        diseaseType: diseaseName,
        confidence: confidence,
      });
      await promptRecord.save();
    } catch (dbError) {
      console.warn("Database save failed:", dbError.message);
    }

    return sendSuccessResponse(
      res,
      200,
      "Disease information generated successfully",
      {
        diseaseName,
        plantType,
        confidence,
        diseaseInfo: aiResponse,
        id: promptRecord ? promptRecord._id : null,
        saved: promptRecord !== null,
      }
    );
  } catch (error) {
    console.error("Error generating disease information:", error);
    return sendErrorResponse(
      res,
      500,
      "Failed to generate disease information",
      error.message
    );
  }
};

// Get treatment recommendations specifically for DL model detected disease
const getTreatmentForDetectedDisease = async (req, res) => {
  try {
    const {
      diseaseName,
      plantType,
      confidence,
      severity,
      organicPreference,
      location,
    } = req.body;

    if (!diseaseName || diseaseName.trim().length === 0) {
      return sendErrorResponse(res, 400, "Disease name is required");
    }

    const treatmentPrompt = `You are a Plant Disease Treatment Specialist. A deep learning model has detected a plant disease from an image analysis. Provide targeted treatment recommendations:

DETECTED DISEASE: ${diseaseName}
PLANT TYPE: ${plantType || "Not specified"}
DETECTION CONFIDENCE: ${confidence ? `${confidence}%` : "Not provided"}
DISEASE SEVERITY: ${severity || "Not specified"}
ORGANIC PREFERENCE: ${
      organicPreference
        ? "Organic treatments preferred"
        : "All treatment options"
    }
LOCATION: ${location || "Not specified"}

Based on this AI-detected disease, provide a comprehensive treatment plan:

1. **IMMEDIATE RESPONSE PROTOCOL:**
   - Critical actions to take within 24-48 hours
   - Emergency containment measures
   - Assessment of spread risk

2. **TARGETED TREATMENT PLAN:**
   ${
     organicPreference
       ? "- Focus on organic and biological treatments"
       : "- Include both organic and conventional options"
   }
   - Specific medicines effective against ${diseaseName}
   - Active ingredients proven effective for this disease
   - Product recommendations with brand names where possible

3. **APPLICATION SCHEDULE:**
   - Week 1-2: Initial treatment protocol
   - Week 3-4: Follow-up treatments
   - Ongoing maintenance schedule
   - Weather-dependent adjustments

4. **DOSAGE AND APPLICATION:**
   - Exact concentrations and mixing ratios
   - Application methods (foliar spray, soil drench, injection)
   - Coverage requirements and techniques
   - Equipment recommendations

5. **MONITORING PROTOCOL:**
   - Daily observation checklist
   - Signs of treatment effectiveness
   - Warning signs of treatment failure
   - When to adjust treatment approach

6. **MARKETPLACE MEDICINE RECOMMENDATIONS:**
   - Specific medicine types to search for in marketplace
   - Key active ingredients to look for
   - Application methods compatible with this disease
   - Price ranges and package sizes to consider

7. **INTEGRATION WITH AI DETECTION:**
   - How to use continued image monitoring
   - When to re-analyze with DL model
   - Tracking treatment progress with photos

8. **SUCCESS METRICS:**
   - Expected timeline for improvement
   - Measurable indicators of recovery
   - When treatment can be considered successful

Provide actionable, specific recommendations that can be implemented immediately based on the AI disease detection.`;

    const response = await client.generateContent(treatmentPrompt);
    const aiResponse = response.response.text();

    // Try to save the treatment recommendation to database
    let promptRecord = null;
    try {
      promptRecord = new Prompt({
        userPrompt: `AI TREATMENT REQUEST - Disease: ${diseaseName}, Plant: ${plantType}, Confidence: ${confidence}%`,
        aiResponse: aiResponse,
        promptType: "ai_treatment",
        plantType: plantType,
        diseaseType: diseaseName,
        confidence: confidence,
        organicOnly: organicPreference || false,
      });
      await promptRecord.save();
    } catch (dbError) {
      console.warn("Database save failed:", dbError.message);
    }

    return sendSuccessResponse(
      res,
      200,
      "AI-based treatment recommendations generated",
      {
        diseaseName,
        plantType,
        confidence,
        severity,
        organicPreference,
        treatmentPlan: aiResponse,
        id: promptRecord ? promptRecord._id : null,
        saved: promptRecord !== null,
      }
    );
  } catch (error) {
    console.error(
      "Error generating AI-based treatment recommendations:",
      error
    );
    return sendErrorResponse(
      res,
      500,
      "Failed to generate treatment recommendations",
      error.message
    );
  }
};

module.exports = {
  promptGemini,
  diagnosePlantDisease,
  getTreatmentRecommendations,
  getPreventionStrategies,
  getDiseaseInfo,
  getTreatmentForDetectedDisease,
  getAllPrompts,
  getPromptById,
  deletePrompt,
};
