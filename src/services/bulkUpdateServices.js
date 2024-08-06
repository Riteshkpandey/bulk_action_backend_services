const Queue = require("bull");
const BulkAction = require("../models/BulkAction");
const Contact = require("../models/Contact");

const appQueue = new Queue("bulk-action-queue", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});

appQueue.process(async (job) => {
  const { bulkActionId, updates } = job.data;
  const bulkAction = await BulkAction.findById(bulkActionId);

  if (!bulkAction) {
    throw new Error("Bulk action not found");
  }

  bulkAction.status = "in-progress";
  await bulkAction.save();

  const contacts = await Contact.find();
  bulkAction.totalEntities = contacts.length;
  await bulkAction.save();

  const processedEmails = new Set();

  for (let i = 0; i < contacts.length; i++) {
    try {
      const contact = contacts[i];
      if (processedEmails.has(contact.email)) {
        bulkAction.skippedCount++;
        bulkAction.logs.push({
          entityId: contact._id,
          status: "skipped",
          message: "Duplicate email",
        });
        continue;
      }

      processedEmails.add(contact.email);

      for (let key in updates) {
        if (contact[key] !== undefined) {
          contact[key] = updates[key];
        }
      }
      await contact.save();
      bulkAction.successCount++;
    } catch (error) {
      bulkAction.failureCount++;
      bulkAction.logs.push({
        entityId: contacts[i]._id,
        status: "failed",
        message: error.message,
      });
    }
  }

  bulkAction.status = "completed";
  await bulkAction.save();
});
