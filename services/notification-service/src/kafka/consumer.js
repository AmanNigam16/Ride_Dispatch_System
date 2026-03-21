const { kafka, producer } = require("../config/kafka");
const logger = require("../config/logger");
const { sendNotification } = require("../services/notificationService");

const consumer = kafka.consumer({ groupId: "notification-group" });

const runConsumer = async () => {

  await consumer.connect();

  await consumer.subscribe({ topic: "ride_created" });
  await consumer.subscribe({ topic: "ride_accepted" });
  await consumer.subscribe({ topic: "ride_status_updated" });

  logger.info("Notification Consumer Started");

  await producer.connect();

  await consumer.run({
    eachMessage: async ({ topic, message }) => {

      // ✅ STEP 5 (updated parsing)
      const parsed = JSON.parse(message.value.toString());
      const { event, data } = parsed;

      // ✅ STEP 6 (better logging)
      logger.info("Event received", {
        topic,
        event,
        rideId: data._id
      });

      // ✅ STEP 7 (retry safety)
      const maxRetries = 3;
      let success = false;

      for (let i = 0; i < maxRetries; i++) {
        try {
          await sendNotification(event, data);
          success = true;
          break;
        } catch (err) {
          logger.warn(`Retry ${i + 1} failed`, { error: err.message });
        }
      }

      // DLQ CODE 
      if (!success) {
        logger.error("Sending to DLQ", {
          event,
          rideId: data._id
        });

        await producer.send({
          topic: "notification_dlq",
          messages: [
            { value: JSON.stringify({ event, data }) }
          ]
        });
      }

    }
  });
};

module.exports = runConsumer;