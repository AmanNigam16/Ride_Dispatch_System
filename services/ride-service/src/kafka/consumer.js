const { kafka } = require("../config/kafka");

const consumer = kafka.consumer({ groupId: "ride-group" });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "ride_created" });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());
      console.log("Kafka received:", data);
    }
  });
};

module.exports = run;