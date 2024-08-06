const express = require("express");

const bulkActionRoutes = require("./routes/bulkActionRoutes");

const app = express();

app.use(express.json());

app.use("/api/bulk-actions", bulkActionRoutes);

module.exports = app;
