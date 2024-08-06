const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bulkActionRoutes = require("./routes/bulkActionRoutes");

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api/bulk-actions", bulkActionRoutes);

// Database connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log("Error connecting to MongoDB", err);
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
