const mongoose = require("mongoose");

const bulkActionSchema = new mongoose.Schema({
  actionType: String,
  entityType: String,
  status: {
    type: String,
    enum: ["queued", "in-progress", "completed", "failed"],
    default: "queued",
  },
  totalEntities: Number,
  successCount: Number,
  failureCount: Number,
  skippedCount: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  logs: [
    {
      entityId: mongoose.Schema.Types.ObjectId,
      status: String,
      message: String,
    },
  ],
});

module.exports = mongoose.model("BulkAction", bulkActionSchema);
