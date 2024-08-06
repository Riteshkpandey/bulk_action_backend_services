const rateLimit = require("express-rate-limit");

const createAccountLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10000, // limit each account to 10000 requests per windowMs
  keyGenerator: (req) => req.body.accountId || req.ip, // use accountId if available, otherwise use IP
  handler: (req, res) => {
    res
      .status(429)
      .json({ error: "Too many requests, please try again later." });
  },
});

module.exports = createAccountLimiter;
