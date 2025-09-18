const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require("./routes/route.js");
const { swaggerUi, specs } = require("./config/swagger.js");
// Load environment variables
dotenv.config();

const app = express();

// Middleware - Order is important!
// 1. CORS middleware should be first
app.use(
  cors({
    origin: "*",
    // origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

// 2. Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 3. Request logging middleware (optional)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 4. Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Plant Disease API Documentation",
    swaggerOptions: {
      docExpansion: "none",
      filter: true,
      showRequestDuration: true,
    },
  })
);

// 5. Routes
app.use("/api", routes);
app.get("/", (req, res) => {
  console.log("Plant palse health check hit");
  res.send("🌱 Plant Disease Detection Server is running ✅");
});

// 5. Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { error: err.message }),
  });
});

// 6. 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

module.exports = app;
