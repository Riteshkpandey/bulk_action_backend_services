const BulkAction = require("../models/BulkAction");
const Queue = require("bull");
const schedule = require("node-schedule");
const appQueue = new Queue("bulk-action-queue", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});

exports.createBulkAction = async (req, res) => {
  try {
    const { actionType, entityType, updates, scheduleTime } = req.body;

    const bulkAction = new BulkAction({
      actionType,
      entityType,
      totalEntities: 0,
      successCount: 0,
      failureCount: 0,
      skippedCount: 0,
    });

    await bulkAction.save();

    const job = () => appQueue.add({ bulkActionId: bulkAction._id, updates });

    if (scheduleTime) {
      schedule.scheduleJob(new Date(scheduleTime), job);
    } else {
      job();
    }

    res.status(201).json(bulkAction);
  } catch (error) {
    res.status(500).json({ error: "Error creating bulk action" });
  }
};

exports.getBulkActions = async (req, res) => {
  try {
    const bulkActions = await BulkAction.find();
    res.status(200).json(bulkActions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching bulk actions" });
  }
};

exports.getBulkActionStatus = async (req, res) => {
  try {
    const { actionId } = req.params;
    const bulkAction = await BulkAction.findById(actionId);
    if (!bulkAction) {
      return res.status(404).json({ error: "Bulk action not found" });
    }
    res.status(200).json(bulkAction);
  } catch (error) {
    res.status(500).json({ error: "Error fetching bulk action status" });
  }
};

exports.getBulkActionStats = async (req, res) => {
  try {
    const { actionId } = req.params;
    const bulkAction = await BulkAction.findById(actionId);
    if (!bulkAction) {
      return res.status(404).json({ error: "Bulk action not found" });
    }
    const { successCount, failureCount, skippedCount } = bulkAction;
    res.status(200).json({ successCount, failureCount, skippedCount });
  } catch (error) {
    res.status(500).json({ error: "Error fetching bulk action stats" });
  }
};
