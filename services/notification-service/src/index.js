require("dotenv").config();

const connectDB = require("./config/db");

const runConsumer = require("./kafka/consumer");
const logger = require("./config/logger");

const start = async () => {
  try {
    await connectDB();
    await runConsumer();
    logger.info("Notification service running");
  } 
  catch (err) {
    logger.error("Error starting service", { error: err.message });
  }
};

start();