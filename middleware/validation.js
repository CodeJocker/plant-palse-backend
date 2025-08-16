const Joi = require("joi");

// Validation schemas for plant disease medicines
const createMedicineSchema = Joi.object({
  name: Joi.string().required().max(100).trim().messages({
    "string.empty": "Medicine name is required",
    "string.max": "Medicine name cannot exceed 100 characters",
    "any.required": "Medicine name is required",
  }),
  description: Joi.string().required().max(1000).trim().messages({
    "string.empty": "Medicine description is required",
    "string.max": "Description cannot exceed 1000 characters",
    "any.required": "Medicine description is required",
  }),
  price: Joi.number().required().min(0).messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
    "any.required": "Price is required",
  }),
  currency: Joi.string()
    .valid("USD", "EUR", "GBP", "RWF", "KES", "UGX", "TZS")
    .default("USD")
    .messages({
      "any.only": "Currency must be one of: USD, EUR, GBP, RWF, KES, UGX, TZS",
    }),
  category: Joi.string()
    .required()
    .valid(
      "Electronics",
      "Clothing",
      "Home & Garden",
      "Sports & Outdoors",
      "Books",
      "Automotive",
      "Health & Beauty",
      "Toys & Games",
      "Food & Beverages",
      "Services",
      "Other"
    )
    .messages({
      "any.only":
        "Category must be one of: Electronics, Clothing, Home & Garden, Sports & Outdoors, Books, Automotive, Health & Beauty, Toys & Games, Food & Beverages, Services, Other",
      "any.required": "Category is required",
    }),
  condition: Joi.string()
    .required()
    .valid("New", "Like New", "Good", "Fair", "Poor")
    .messages({
      "any.only": "Condition must be one of: New, Like New, Good, Fair, Poor",
      "any.required": "Item condition is required",
    }),
  images: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().uri().required().messages({
          "string.uri": "Image URL must be a valid URL",
          "any.required": "Image URL is required",
        }),
        alt: Joi.string().allow("").default(""),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one image is required",
      "any.required": "Images are required",
    }),
  seller: Joi.object({
    name: Joi.string().required().trim().messages({
      "string.empty": "Seller name is required",
      "any.required": "Seller name is required",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Seller email is required",
    }),
    phone: Joi.string().allow("").trim(),
    location: Joi.object({
      city: Joi.string().allow(""),
      country: Joi.string().allow(""),
      coordinates: Joi.object({
        latitude: Joi.number().min(-90).max(90).messages({
          "number.min": "Latitude must be between -90 and 90",
          "number.max": "Latitude must be between -90 and 90",
        }),
        longitude: Joi.number().min(-180).max(180).messages({
          "number.min": "Longitude must be between -180 and 180",
          "number.max": "Longitude must be between -180 and 180",
        }),
      }),
    }),
  })
    .required()
    .messages({
      "any.required": "Seller information is required",
    }),
  quantity: Joi.number().min(0).default(1).messages({
    "number.min": "Quantity cannot be negative",
  }),
  tags: Joi.array().items(Joi.string().trim()),
  specifications: Joi.object().pattern(Joi.string(), Joi.string()),
  negotiable: Joi.boolean().default(true),
});

const updateItemSchema = Joi.object({
  name: Joi.string().max(100).trim().messages({
    "string.max": "Item name cannot exceed 100 characters",
  }),
  description: Joi.string().max(1000).trim().messages({
    "string.max": "Description cannot exceed 1000 characters",
  }),
  price: Joi.number().min(0).messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
  }),
  currency: Joi.string()
    .valid("USD", "EUR", "GBP", "RWF", "KES", "UGX", "TZS")
    .messages({
      "any.only": "Currency must be one of: USD, EUR, GBP, RWF, KES, UGX, TZS",
    }),
  category: Joi.string()
    .valid(
      "Electronics",
      "Clothing",
      "Home & Garden",
      "Sports & Outdoors",
      "Books",
      "Automotive",
      "Health & Beauty",
      "Toys & Games",
      "Food & Beverages",
      "Services",
      "Other"
    )
    .messages({
      "any.only":
        "Category must be one of: Electronics, Clothing, Home & Garden, Sports & Outdoors, Books, Automotive, Health & Beauty, Toys & Games, Food & Beverages, Services, Other",
    }),
  condition: Joi.string()
    .valid("New", "Like New", "Good", "Fair", "Poor")
    .messages({
      "any.only": "Condition must be one of: New, Like New, Good, Fair, Poor",
    }),
  images: Joi.array().items(
    Joi.object({
      url: Joi.string().uri().required().messages({
        "string.uri": "Image URL must be a valid URL",
        "any.required": "Image URL is required",
      }),
      alt: Joi.string().allow("").default(""),
    })
  ),
  availability: Joi.string()
    .valid("Available", "Sold", "Reserved", "Unavailable")
    .messages({
      "any.only":
        "Availability must be one of: Available, Sold, Reserved, Unavailable",
    }),
  quantity: Joi.number().min(0).messages({
    "number.min": "Quantity cannot be negative",
  }),
  tags: Joi.array().items(Joi.string().trim()),
  specifications: Joi.object().pattern(Joi.string(), Joi.string()),
  negotiable: Joi.boolean(),
  featured: Joi.boolean(),
});

// Query parameter validation schemas
const queryParamsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  category: Joi.string().valid(
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Sports & Outdoors",
    "Books",
    "Automotive",
    "Health & Beauty",
    "Toys & Games",
    "Food & Beverages",
    "Services",
    "Other"
  ),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  condition: Joi.string().valid("New", "Like New", "Good", "Fair", "Poor"),
  availability: Joi.string()
    .valid("Available", "Sold", "Reserved", "Unavailable")
    .default("Available"),
  location: Joi.string(),
  sortBy: Joi.string()
    .valid("createdAt", "price", "name", "views")
    .default("createdAt"),
  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
  search: Joi.string(),
  featured: Joi.boolean(),
});

const searchQuerySchema = Joi.object({
  q: Joi.string().required().min(1).messages({
    "string.empty": "Search query is required",
    "any.required": "Search query is required",
    "string.min": "Search query cannot be empty",
  }),
}).concat(queryParamsSchema.fork(["q"], (schema) => schema.optional()));

// Validation middleware functions
const validateCreateItem = (req, res, next) => {
  const { error, value } = createItemSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      })),
    });
  }

  req.body = value;
  next();
};

const validateUpdateItem = (req, res, next) => {
  const { error, value } = updateItemSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      })),
    });
  }

  req.body = value;
  next();
};

const validateQueryParams = (req, res, next) => {
  const { error, value } = queryParamsSchema.validate(req.query, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid query parameters",
      errors: error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      })),
    });
  }

  req.query = value;
  next();
};

const validateSearchQuery = (req, res, next) => {
  const { error, value } = searchQuerySchema.validate(req.query, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid search parameters",
      errors: error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      })),
    });
  }

  req.query = value;
  next();
};

module.exports = {
  createItemSchema,
  updateItemSchema,
  queryParamsSchema,
  searchQuerySchema,
  validateCreateItem,
  validateUpdateItem,
  validateQueryParams,
  validateSearchQuery,
};
