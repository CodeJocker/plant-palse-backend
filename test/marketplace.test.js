// Simple test file to verify plant disease medicine marketplace CRUD operations
// This is a basic test that can be run manually or with a testing framework

const testData = {
  validMedicine: {
    name: "Copper Fungicide Pro",
    description:
      "Effective copper-based fungicide for controlling early blight and late blight in tomatoes and potatoes. Safe for organic farming.",
    price: 24.99,
    currency: "USD",
    medicineType: "Copper-based",
    targetDiseases: ["Early Blight", "Late Blight", "Leaf Spot"],
    targetPlants: ["Tomato", "Potato", "Pepper"],
    activeIngredient: "Copper sulfate pentahydrate",
    concentration: "25% w/w",
    applicationMethod: "Foliar Spray",
    packageSize: {
      value: 500,
      unit: "ml",
    },
    condition: "New",
    images: [
      {
        url: "https://example.com/copper-fungicide.jpg",
        alt: "Copper Fungicide Pro bottle",
      },
    ],
    seller: {
      name: "AgriCare Solutions",
      email: "sales@agricare.com",
      phone: "+1-555-0123",
      location: {
        city: "Des Moines",
        country: "USA",
        coordinates: {
          latitude: 41.5868,
          longitude: -93.625,
        },
      },
      businessType: "Agricultural Store",
      certifications: ["EPA Registered", "Organic Certified"],
    },
    quantity: 50,
    tags: ["organic", "copper", "fungicide", "blight"],
    specifications: {
      "Active Ingredient": "Copper sulfate pentahydrate",
      Concentration: "25% w/w",
      "pH Range": "6.0-8.0",
      "Shelf Life": "3 years",
      Storage: "Cool, dry place",
    },
    negotiable: true,
  },

  updateData: {
    price: 19.99,
    availability: "Available",
    featured: true,
    quantity: 75,
  },

  invalidMedicine: {
    name: "", // Invalid: empty name
    description: "Test description",
    price: -100, // Invalid: negative price
    medicineType: "InvalidType", // Invalid: not in enum
    targetDiseases: [], // Invalid: empty array
    targetPlants: [], // Invalid: empty array
    activeIngredient: "", // Invalid: empty
    concentration: "", // Invalid: empty
    applicationMethod: "InvalidMethod", // Invalid: not in enum
    packageSize: {
      value: -1, // Invalid: negative value
      unit: "InvalidUnit", // Invalid: not in enum
    },
    condition: "New",
    images: [], // Invalid: empty array
    seller: {
      name: "Test User",
      email: "invalid-email", // Invalid: not a valid email
    },
  },
};

// Test endpoints
const testEndpoints = {
  baseUrl: "http://localhost:4000/api",

  // Health check
  health: "/health",

  // Plant Disease Medicine Marketplace endpoints
  marketplace: "/marketplace",
  createMedicine: "/marketplace",
  getAllMedicines: "/marketplace",
  getMedicineById: (id) => `/marketplace/${id}`,
  updateMedicine: (id) => `/marketplace/${id}`,
  deleteMedicine: (id) => `/marketplace/${id}`,
  getFeatured: "/marketplace/featured",
  searchMedicines: "/marketplace/search",
  getByType: (medicineType) => `/marketplace/type/${medicineType}`,
  getByDisease: (disease) => `/marketplace/disease/${disease}`,
  getByPlant: (plant) => `/marketplace/plant/${plant}`,
};

// Test scenarios
const testScenarios = [
  {
    name: "Health Check",
    method: "GET",
    endpoint: testEndpoints.health,
    expectedStatus: 200,
  },
  {
    name: "Get API Documentation",
    method: "GET",
    endpoint: "/",
    expectedStatus: 200,
  },
  {
    name: "Create Valid Item",
    method: "POST",
    endpoint: testEndpoints.createItem,
    data: testData.validItem,
    expectedStatus: 201,
  },
  {
    name: "Create Invalid Item",
    method: "POST",
    endpoint: testEndpoints.createItem,
    data: testData.invalidItem,
    expectedStatus: 400,
  },
  {
    name: "Get All Items",
    method: "GET",
    endpoint: testEndpoints.getAllItems,
    expectedStatus: 200,
  },
  {
    name: "Get Items with Filters",
    method: "GET",
    endpoint: `${testEndpoints.getAllItems}?category=Electronics&minPrice=500&maxPrice=1500&page=1&limit=10`,
    expectedStatus: 200,
  },
  {
    name: "Search Items",
    method: "GET",
    endpoint: `${testEndpoints.searchItems}?q=iPhone&category=Electronics`,
    expectedStatus: 200,
  },
  {
    name: "Get Featured Items",
    method: "GET",
    endpoint: testEndpoints.getFeatured,
    expectedStatus: 200,
  },
  {
    name: "Get Items by Category",
    method: "GET",
    endpoint: testEndpoints.getByCategory("Electronics"),
    expectedStatus: 200,
  },
];

// Manual testing instructions
console.log(`
=== MARKETPLACE API TESTING GUIDE ===

1. Start the server:
   npm run dev

2. Test endpoints using curl or Postman:

HEALTH CHECK:
curl -X GET ${testEndpoints.baseUrl}${testEndpoints.health}

API DOCUMENTATION:
curl -X GET ${testEndpoints.baseUrl}/

CREATE ITEM:
curl -X POST ${testEndpoints.baseUrl}${testEndpoints.createItem} \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(testData.validItem, null, 2)}'

GET ALL ITEMS:
curl -X GET "${testEndpoints.baseUrl}${
  testEndpoints.getAllItems
}?page=1&limit=10"

SEARCH ITEMS:
curl -X GET "${testEndpoints.baseUrl}${testEndpoints.searchItems}?q=iPhone"

GET FEATURED ITEMS:
curl -X GET "${testEndpoints.baseUrl}${testEndpoints.getFeatured}"

GET BY CATEGORY:
curl -X GET "${testEndpoints.baseUrl}${testEndpoints.getByCategory(
  "Electronics"
)}"

UPDATE ITEM (replace {id} with actual item ID):
curl -X PUT ${testEndpoints.baseUrl}/marketplace/{id} \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(testData.updateData, null, 2)}'

DELETE ITEM (replace {id} with actual item ID):
curl -X DELETE ${testEndpoints.baseUrl}/marketplace/{id}

=== EXPECTED RESPONSES ===

All successful responses should have this structure:
{
  "success": true,
  "message": "...",
  "data": { ... }
}

Error responses should have this structure:
{
  "success": false,
  "message": "...",
  "details": "..." // optional
}

=== VALIDATION TESTS ===

Test these invalid requests to verify validation:

1. Empty name:
curl -X POST ${testEndpoints.baseUrl}${testEndpoints.createItem} \\
  -H "Content-Type: application/json" \\
  -d '{"name": "", "description": "test", "price": 100, "category": "Electronics", "condition": "New", "images": [{"url": "https://example.com/test.jpg"}], "seller": {"name": "Test", "email": "test@example.com"}}'

2. Negative price:
curl -X POST ${testEndpoints.baseUrl}${testEndpoints.createItem} \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Test Item", "description": "test", "price": -100, "category": "Electronics", "condition": "New", "images": [{"url": "https://example.com/test.jpg"}], "seller": {"name": "Test", "email": "test@example.com"}}'

3. Invalid category:
curl -X POST ${testEndpoints.baseUrl}${testEndpoints.createItem} \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Test Item", "description": "test", "price": 100, "category": "InvalidCategory", "condition": "New", "images": [{"url": "https://example.com/test.jpg"}], "seller": {"name": "Test", "email": "test@example.com"}}'

=== DATABASE REQUIREMENTS ===

Make sure MongoDB is running on localhost:27017
Database name: hangaTech
Collection: marketplaceitems (auto-created)

=== FEATURES IMPLEMENTED ===

✅ Full CRUD operations (Create, Read, Update, Delete)
✅ Advanced filtering and pagination
✅ Search functionality
✅ Category-based filtering
✅ Featured items
✅ Input validation with Joi
✅ Error handling
✅ Request logging
✅ CORS support
✅ Comprehensive data model with virtuals and indexes
✅ RESTful API design
✅ Proper HTTP status codes
✅ Consistent response format

`);

module.exports = {
  testData,
  testEndpoints,
  testScenarios,
};
