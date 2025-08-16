const app = require("./app.js");
const connectDb = require("./db.js");

const startServer = async () => {
  try {
    await connectDb();
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`API Documentation: http://localhost:${port}/api`);
      console.log(`Health Check: http://localhost:${port}/api/health`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

// Start the server
startServer();
