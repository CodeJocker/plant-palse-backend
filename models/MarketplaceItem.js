const mongoose = require("mongoose");

const plantDiseaseMedicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Medicine name is required"],
      trim: true,
      maxlength: [100, "Medicine name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Medicine description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    currency: {
      type: String,
      default: "USD",
      enum: ["USD", "EUR", "GBP", "RWF", "KES", "UGX", "TZS"],
    },
    medicineType: {
      type: String,
      required: [true, "Medicine type is required"],
      enum: [
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
    targetDiseases: [
      {
        type: String,
        required: [true, "At least one target disease is required"],
        enum: [
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
          "Other",
        ],
      },
    ],
    targetPlants: [
      {
        type: String,
        required: [true, "At least one target plant is required"],
        enum: [
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
      },
    ],
    activeIngredient: {
      type: String,
      required: [true, "Active ingredient is required"],
      trim: true,
      maxlength: [200, "Active ingredient cannot exceed 200 characters"],
    },
    concentration: {
      type: String,
      required: [true, "Concentration is required"],
      trim: true,
      maxlength: [50, "Concentration cannot exceed 50 characters"],
    },
    applicationMethod: {
      type: String,
      required: [true, "Application method is required"],
      enum: [
        "Foliar Spray",
        "Soil Drench",
        "Seed Treatment",
        "Root Dip",
        "Injection",
        "Dusting",
        "Granular Application",
        "Systemic Application",
      ],
    },
    packageSize: {
      value: {
        type: Number,
        required: [true, "Package size value is required"],
        min: [0, "Package size cannot be negative"],
      },
      unit: {
        type: String,
        required: [true, "Package size unit is required"],
        enum: ["ml", "L", "g", "kg", "oz", "lb", "tablets", "sachets"],
      },
    },
    condition: {
      type: String,
      required: [true, "Product condition is required"],
      enum: ["New", "Like New", "Good", "Fair", "Poor"],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          default: "",
        },
      },
    ],
    seller: {
      name: {
        type: String,
        required: [true, "Seller name is required"],
        trim: true,
      },
      email: {
        type: String,
        required: [true, "Seller email is required"],
        lowercase: true,
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          "Please enter a valid email",
        ],
      },
      phone: {
        type: String,
        trim: true,
      },
      location: {
        city: String,
        country: String,
        coordinates: {
          latitude: Number,
          longitude: Number,
        },
      },
      businessType: {
        type: String,
        enum: [
          "Agricultural Store",
          "Pharmacy",
          "Online Retailer",
          "Manufacturer",
          "Distributor",
          "Individual Seller",
        ],
        default: "Agricultural Store",
      },
      certifications: [
        {
          type: String,
          enum: [
            "Organic Certified",
            "EPA Registered",
            "FDA Approved",
            "ISO Certified",
            "Local Authority Approved",
          ],
        },
      ],
    },
    availability: {
      type: String,
      default: "Available",
      enum: ["Available", "Sold", "Reserved", "Unavailable"],
    },
    quantity: {
      type: Number,
      default: 1,
      min: [0, "Quantity cannot be negative"],
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    specifications: {
      type: Map,
      of: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    negotiable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
plantDiseaseMedicineSchema.index({ medicineType: 1, availability: 1 });
plantDiseaseMedicineSchema.index({ targetDiseases: 1, availability: 1 });
plantDiseaseMedicineSchema.index({ targetPlants: 1, availability: 1 });
plantDiseaseMedicineSchema.index({ price: 1 });
plantDiseaseMedicineSchema.index({ "seller.email": 1 });
plantDiseaseMedicineSchema.index({ createdAt: -1 });
plantDiseaseMedicineSchema.index({ featured: -1, createdAt: -1 });
plantDiseaseMedicineSchema.index({ activeIngredient: 1 });
plantDiseaseMedicineSchema.index({ applicationMethod: 1 });

// Virtual for formatted price
plantDiseaseMedicineSchema.virtual("formattedPrice").get(function () {
  return `${this.currency} ${this.price.toFixed(2)}`;
});

// Virtual for formatted package size
plantDiseaseMedicineSchema.virtual("formattedPackageSize").get(function () {
  return `${this.packageSize.value} ${this.packageSize.unit}`;
});

// Virtual for time since creation
plantDiseaseMedicineSchema.virtual("timeAgo").get(function () {
  const now = new Date();
  const diff = now - this.createdAt;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
});

// Virtual for disease summary
plantDiseaseMedicineSchema.virtual("diseaseSummary").get(function () {
  if (this.targetDiseases.length <= 3) {
    return this.targetDiseases.join(", ");
  }
  return `${this.targetDiseases
    .slice(0, 3)
    .join(", ")} and ${this.targetDiseases.length - 3} more`;
});

// Virtual for plant summary
plantDiseaseMedicineSchema.virtual("plantSummary").get(function () {
  if (this.targetPlants.length <= 3) {
    return this.targetPlants.join(", ");
  }
  return `${this.targetPlants
    .slice(0, 3)
    .join(", ")} and ${this.targetPlants.length - 3} more`;
});

// Pre-save middleware to increment views
plantDiseaseMedicineSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Static method to find by medicine type
plantDiseaseMedicineSchema.statics.findByMedicineType = function (
  medicineType
) {
  return this.find({ medicineType, availability: "Available" });
};

// Static method to find by disease
plantDiseaseMedicineSchema.statics.findByDisease = function (disease) {
  return this.find({ targetDiseases: disease, availability: "Available" });
};

// Static method to find by plant
plantDiseaseMedicineSchema.statics.findByPlant = function (plant) {
  return this.find({ targetPlants: plant, availability: "Available" });
};

// Static method to search medicines
plantDiseaseMedicineSchema.statics.searchMedicines = function (
  query,
  options = {}
) {
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
    sortOrder = -1,
    limit = 20,
    skip = 0,
  } = options;

  let searchQuery = {
    availability: "Available",
    $or: [
      { name: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { activeIngredient: { $regex: query, $options: "i" } },
      { tags: { $in: [new RegExp(query, "i")] } },
    ],
  };

  if (medicineType) searchQuery.medicineType = medicineType;
  if (targetDisease) searchQuery.targetDiseases = targetDisease;
  if (targetPlant) searchQuery.targetPlants = targetPlant;
  if (applicationMethod) searchQuery.applicationMethod = applicationMethod;
  if (activeIngredient)
    searchQuery.activeIngredient = { $regex: activeIngredient, $options: "i" };
  if (minPrice !== undefined)
    searchQuery.price = { ...searchQuery.price, $gte: minPrice };
  if (maxPrice !== undefined)
    searchQuery.price = { ...searchQuery.price, $lte: maxPrice };
  if (condition) searchQuery.condition = condition;
  if (location)
    searchQuery["seller.location.city"] = { $regex: location, $options: "i" };

  return this.find(searchQuery)
    .sort({ [sortBy]: sortOrder })
    .limit(limit)
    .skip(skip);
};

module.exports = mongoose.model(
  "PlantDiseaseMedicine",
  plantDiseaseMedicineSchema
);
