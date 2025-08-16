const PlantDiseaseMedicine = require("../models/MarketplaceItem");
const Joi = require("joi");

// Validation schemas for plant disease medicine
const createMedicineSchema = Joi.object({
  name: Joi.string().required().max(100).trim(),
  description: Joi.string().required().max(1000).trim(),
  price: Joi.number().required().min(0),
  currency: Joi.string()
    .valid("USD", "EUR", "GBP", "RWF", "KES", "UGX", "TZS")
    .default("USD"),
  medicineType: Joi.string()
    .required()
    .valid(
      "Fungicide",
      "Bactericide",
      "Organic Treatment",
      "Biological Control",
      "Chemical Pesticide",
      "Preventive Treatment",
      "Systemic Treatment",
      "Contact Treatment",
      "Copper-based",
      "Sulfur-based"
    ),
  targetDiseases: Joi.array()
    .items(
      Joi.string().valid(
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
        "Yellowing",
        "Blight",
        "Other"
      )
    )
    .min(1)
    .required(),
  targetPlants: Joi.array()
    .items(
      Joi.string().valid(
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
        "All Plants"
      )
    )
    .min(1)
    .required(),
  activeIngredient: Joi.string().required().max(200).trim(),
  concentration: Joi.string().required().max(50).trim(),
  applicationMethod: Joi.string()
    .required()
    .valid(
      "Foliar Spray",
      "Soil Drench",
      "Seed Treatment",
      "Root Dip",
      "Injection",
      "Dusting",
      "Granular Application",
      "Systemic Application"
    ),
  packageSize: Joi.object({
    value: Joi.number().required().min(0),
    unit: Joi.string()
      .required()
      .valid("ml", "L", "g", "kg", "oz", "lb", "tablets", "sachets"),
  }).required(),
  condition: Joi.string()
    .required()
    .valid("New", "Like New", "Good", "Fair", "Poor"),
  images: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().uri().required(),
        alt: Joi.string().allow("").default(""),
      })
    )
    .min(1)
    .required(),
  seller: Joi.object({
    name: Joi.string().required().trim(),
    email: Joi.string().email().required(),
    phone: Joi.string().allow("").trim(),
    location: Joi.object({
      city: Joi.string().allow(""),
      country: Joi.string().allow(""),
      coordinates: Joi.object({
        latitude: Joi.number().min(-90).max(90),
        longitude: Joi.number().min(-180).max(180),
      }),
    }),
    businessType: Joi.string()
      .valid(
        "Agricultural Store",
        "Pharmacy",
        "Online Retailer",
        "Manufacturer",
        "Distributor",
        "Individual Seller"
      )
      .default("Agricultural Store"),
    certifications: Joi.array().items(
      Joi.string().valid(
        "Organic Certified",
        "EPA Registered",
        "FDA Approved",
        "ISO Certified",
        "Local Authority Approved"
      )
    ),
  }).required(),
  quantity: Joi.number().min(0).default(1),
  tags: Joi.array().items(Joi.string().trim()),
  specifications: Joi.object().pattern(Joi.string(), Joi.string()),
  negotiable: Joi.boolean().default(true),
});

const updateMedicineSchema = Joi.object({
  name: Joi.string().max(100).trim(),
  description: Joi.string().max(1000).trim(),
  price: Joi.number().min(0),
  currency: Joi.string().valid("USD", "EUR", "GBP", "RWF", "KES", "UGX", "TZS"),
  medicineType: Joi.string().valid(
    "Fungicide",
    "Bactericide",
    "Organic Treatment",
    "Biological Control",
    "Chemical Pesticide",
    "Preventive Treatment",
    "Systemic Treatment",
    "Contact Treatment",
    "Copper-based",
    "Sulfur-based"
  ),
  targetDiseases: Joi.array().items(
    Joi.string().valid(
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
      "Yellowing",
      "Blight",
      "Other"
    )
  ),
  targetPlants: Joi.array().items(
    Joi.string().valid(
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
      "All Plants"
    )
  ),
  activeIngredient: Joi.string().max(200).trim(),
  concentration: Joi.string().max(50).trim(),
  applicationMethod: Joi.string().valid(
    "Foliar Spray",
    "Soil Drench",
    "Seed Treatment",
    "Root Dip",
    "Injection",
    "Dusting",
    "Granular Application",
    "Systemic Application"
  ),
  packageSize: Joi.object({
    value: Joi.number().min(0),
    unit: Joi.string().valid(
      "ml",
      "L",
      "g",
      "kg",
      "oz",
      "lb",
      "tablets",
      "sachets"
    ),
  }),
  condition: Joi.string().valid("New", "Like New", "Good", "Fair", "Poor"),
  images: Joi.array().items(
    Joi.object({
      url: Joi.string().uri().required(),
      alt: Joi.string().allow("").default(""),
    })
  ),
  availability: Joi.string().valid(
    "Available",
    "Sold",
    "Reserved",
    "Unavailable"
  ),
  quantity: Joi.number().min(0),
  tags: Joi.array().items(Joi.string().trim()),
  specifications: Joi.object().pattern(Joi.string(), Joi.string()),
  negotiable: Joi.boolean(),
  featured: Joi.boolean(),
});

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

// CREATE - Add new plant disease medicine
const createMedicine = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = createMedicineSchema.validate(req.body);
    if (error) {
      return sendErrorResponse(res, 400, "Validation error", error.details);
    }

    // Create new plant disease medicine
    const newMedicine = new PlantDiseaseMedicine(value);
    const savedMedicine = await newMedicine.save();

    return sendSuccessResponse(
      res,
      201,
      "Medicine created successfully",
      savedMedicine
    );
  } catch (error) {
    console.error("Error creating medicine:", error);
    return sendErrorResponse(res, 500, "Internal server error", error.message);
  }
};

// READ - Get all plant disease medicines with filtering and pagination
const getAllMedicines = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      medicineType,
      targetDisease,
      targetPlant,
      minPrice,
      maxPrice,
      condition,
      availability = "Available",
      location,
      applicationMethod,
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
      featured,
    } = req.query;

    // Build query object
    let query = {};

    if (availability) query.availability = availability;
    if (medicineType) query.medicineType = medicineType;
    if (targetDisease) query.targetDiseases = targetDisease;
    if (targetPlant) query.targetPlants = targetPlant;
    if (applicationMethod) query.applicationMethod = applicationMethod;
    if (condition) query.condition = condition;
    if (location)
      query["seller.location.city"] = { $regex: location, $options: "i" };
    if (featured !== undefined) query.featured = featured === "true";

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { activeIngredient: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortDirection = sortOrder === "desc" ? -1 : 1;

    // Execute query
    const medicines = await PlantDiseaseMedicine.find(query)
      .sort({ [sortBy]: sortDirection })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    // Get total count for pagination
    const totalMedicines = await PlantDiseaseMedicine.countDocuments(query);
    const totalPages = Math.ceil(totalMedicines / parseInt(limit));

    const pagination = {
      currentPage: parseInt(page),
      totalPages,
      totalItems: totalMedicines,
      hasNextPage: parseInt(page) < totalPages,
      hasPrevPage: parseInt(page) > 1,
    };

    return sendSuccessResponse(res, 200, "Medicines retrieved successfully", {
      medicines,
      pagination,
    });
  } catch (error) {
    console.error("Error fetching medicines:", error);
    return sendErrorResponse(res, 500, "Internal server error", error.message);
  }
};

// READ - Get single plant disease medicine by ID
const getMedicineById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find medicine by ID
    const medicine = await PlantDiseaseMedicine.findById(id);

    if (!medicine) {
      return sendErrorResponse(res, 404, "Medicine not found");
    }

    // Increment view count
    await medicine.incrementViews();

    return sendSuccessResponse(
      res,
      200,
      "Medicine retrieved successfully",
      medicine
    );
  } catch (error) {
    console.error("Error fetching medicine:", error);
    if (error.name === "CastError") {
      return sendErrorResponse(res, 400, "Invalid medicine ID format");
    }
    return sendErrorResponse(res, 500, "Internal server error", error.message);
  }
};

// UPDATE - Update plant disease medicine
const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate request body
    const { error, value } = updateMedicineSchema.validate(req.body);
    if (error) {
      return sendErrorResponse(res, 400, "Validation error", error.details);
    }

    // Find and update medicine
    const updatedMedicine = await PlantDiseaseMedicine.findByIdAndUpdate(
      id,
      { ...value, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedMedicine) {
      return sendErrorResponse(res, 404, "Medicine not found");
    }

    return sendSuccessResponse(
      res,
      200,
      "Medicine updated successfully",
      updatedMedicine
    );
  } catch (error) {
    console.error("Error updating medicine:", error);
    if (error.name === "CastError") {
      return sendErrorResponse(res, 400, "Invalid medicine ID format");
    }
    return sendErrorResponse(res, 500, "Internal server error", error.message);
  }
};

// DELETE - Delete plant disease medicine
const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete medicine
    const deletedMedicine = await PlantDiseaseMedicine.findByIdAndDelete(id);

    if (!deletedMedicine) {
      return sendErrorResponse(res, 404, "Medicine not found");
    }

    return sendSuccessResponse(res, 200, "Medicine deleted successfully", {
      deletedMedicine: {
        id: deletedMedicine._id,
        name: deletedMedicine.name,
      },
    });
  } catch (error) {
    console.error("Error deleting medicine:", error);
    if (error.name === "CastError") {
      return sendErrorResponse(res, 400, "Invalid medicine ID format");
    }
    return sendErrorResponse(res, 500, "Internal server error", error.message);
  }
};

// ADDITIONAL UTILITY FUNCTIONS

// Get medicines by medicine type
const getMedicinesByType = async (req, res) => {
  try {
    const { medicineType } = req.params;
    const {
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortDirection = sortOrder === "desc" ? -1 : 1;

    const medicines = await PlantDiseaseMedicine.findByMedicineType(
      medicineType
    )
      .sort({ [sortBy]: sortDirection })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const totalMedicines = await PlantDiseaseMedicine.countDocuments({
      medicineType,
      availability: "Available",
    });

    const pagination = {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalMedicines / parseInt(limit)),
      totalItems: totalMedicines,
      hasNextPage: parseInt(page) < Math.ceil(totalMedicines / parseInt(limit)),
      hasPrevPage: parseInt(page) > 1,
    };

    return sendSuccessResponse(
      res,
      200,
      `Medicines of type ${medicineType} retrieved successfully`,
      {
        medicines,
        pagination,
        medicineType,
      }
    );
  } catch (error) {
    console.error("Error fetching medicines by type:", error);
    return sendErrorResponse(res, 500, "Internal server error", error.message);
  }
};

// Get medicines by disease
const getMedicinesByDisease = async (req, res) => {
  try {
    const { disease } = req.params;
    const {
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortDirection = sortOrder === "desc" ? -1 : 1;

    const medicines = await PlantDiseaseMedicine.findByDisease(disease)
      .sort({ [sortBy]: sortDirection })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const totalMedicines = await PlantDiseaseMedicine.countDocuments({
      targetDiseases: disease,
      availability: "Available",
    });

    const pagination = {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalMedicines / parseInt(limit)),
      totalItems: totalMedicines,
      hasNextPage: parseInt(page) < Math.ceil(totalMedicines / parseInt(limit)),
      hasPrevPage: parseInt(page) > 1,
    };

    return sendSuccessResponse(
      res,
      200,
      `Medicines for ${disease} retrieved successfully`,
      {
        medicines,
        pagination,
        disease,
      }
    );
  } catch (error) {
    console.error("Error fetching medicines by disease:", error);
    return sendErrorResponse(res, 500, "Internal server error", error.message);
  }
};

// Get medicines by plant
const getMedicinesByPlant = async (req, res) => {
  try {
    const { plant } = req.params;
    const {
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortDirection = sortOrder === "desc" ? -1 : 1;

    const medicines = await PlantDiseaseMedicine.findByPlant(plant)
      .sort({ [sortBy]: sortDirection })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const totalMedicines = await PlantDiseaseMedicine.countDocuments({
      targetPlants: plant,
      availability: "Available",
    });

    const pagination = {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalMedicines / parseInt(limit)),
      totalItems: totalMedicines,
      hasNextPage: parseInt(page) < Math.ceil(totalMedicines / parseInt(limit)),
      hasPrevPage: parseInt(page) > 1,
    };

    return sendSuccessResponse(
      res,
      200,
      `Medicines for ${plant} retrieved successfully`,
      {
        medicines,
        pagination,
        plant,
      }
    );
  } catch (error) {
    console.error("Error fetching medicines by plant:", error);
    return sendErrorResponse(res, 500, "Internal server error", error.message);
  }
};

// Search medicines
const searchMedicines = async (req, res) => {
  try {
    const { q: query } = req.query;

    if (!query || query.trim().length === 0) {
      return sendErrorResponse(res, 400, "Search query is required");
    }

    const {
      medicineType,
      targetDisease,
      targetPlant,
      minPrice,
      maxPrice,
      condition,
      location,
      applicationMethod,
      activeIngredient,
      sortBy = "createdAt",
      sortOrder = "desc",
      limit = 20,
      page = 1,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const searchOptions = {
      medicineType,
      targetDisease,
      targetPlant,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      condition,
      location,
      applicationMethod,
      activeIngredient,
      sortBy,
      sortOrder,
      limit: parseInt(limit),
      skip,
    };

    const medicines = await PlantDiseaseMedicine.searchMedicines(
      query.trim(),
      searchOptions
    );

    // Get total count for the search - use a separate query without limit/skip
    const countQuery = {
      availability: "Available",
      $or: [
        { name: { $regex: query.trim(), $options: "i" } },
        { description: { $regex: query.trim(), $options: "i" } },
        { activeIngredient: { $regex: query.trim(), $options: "i" } },
        { tags: { $in: [new RegExp(query.trim(), "i")] } },
      ],
    };

    if (searchOptions.medicineType)
      countQuery.medicineType = searchOptions.medicineType;
    if (searchOptions.targetDisease)
      countQuery.targetDiseases = searchOptions.targetDisease;
    if (searchOptions.targetPlant)
      countQuery.targetPlants = searchOptions.targetPlant;
    if (searchOptions.applicationMethod)
      countQuery.applicationMethod = searchOptions.applicationMethod;
    if (searchOptions.activeIngredient)
      countQuery.activeIngredient = {
        $regex: searchOptions.activeIngredient,
        $options: "i",
      };
    if (searchOptions.minPrice !== undefined)
      countQuery.price = { ...countQuery.price, $gte: searchOptions.minPrice };
    if (searchOptions.maxPrice !== undefined)
      countQuery.price = { ...countQuery.price, $lte: searchOptions.maxPrice };
    if (searchOptions.condition) countQuery.condition = searchOptions.condition;
    if (searchOptions.location)
      countQuery["seller.location.city"] = {
        $regex: searchOptions.location,
        $options: "i",
      };

    const totalMedicines = await PlantDiseaseMedicine.countDocuments(
      countQuery
    );

    const pagination = {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalMedicines / parseInt(limit)),
      totalItems: totalMedicines,
      hasNextPage: parseInt(page) < Math.ceil(totalMedicines / parseInt(limit)),
      hasPrevPage: parseInt(page) > 1,
    };

    return sendSuccessResponse(res, 200, "Search completed successfully", {
      medicines,
      pagination,
      searchQuery: query,
      filters: searchOptions,
    });
  } catch (error) {
    console.error("Error searching items:", error);
    return sendErrorResponse(res, 500, "Internal server error", error.message);
  }
};

// Get featured medicines
const getFeaturedMedicines = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const medicines = await PlantDiseaseMedicine.find({
      featured: true,
      availability: "Available",
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    return sendSuccessResponse(
      res,
      200,
      "Featured medicines retrieved successfully",
      medicines
    );
  } catch (error) {
    console.error("Error fetching featured medicines:", error);
    return sendErrorResponse(res, 500, "Internal server error", error.message);
  }
};

// Export all controller functions
module.exports = {
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
};
