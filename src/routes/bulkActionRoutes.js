const express = require("express");
const {
  createBulkAction,
  getBulkActions,
  getBulkActionStatus,
  getBulkActionStats,
} = require("../controllers/bulkActionController");
const createAccountLimiter = require("../middleware/rateLimit");

const router = express.Router();

router.post("/", createAccountLimiter, createBulkAction);
router.get("/", getBulkActions);
router.get("/:actionId", getBulkActionStatus);
router.get("/:actionId/stats", getBulkActionStats);

module.exports = router;
