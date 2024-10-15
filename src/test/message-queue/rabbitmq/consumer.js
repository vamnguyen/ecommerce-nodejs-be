const amqplib = require("amqplib");
const amqpUri = "amqp://guest:12345@localhost:5672";

const runConsumer = async ({ address }) => {
  try {
    // 1. create connection
    const connection = await amqplib.connect(amqpUri);

    // 2. create channel
    const channel = await connection.createChannel();

    // 3. create name queue
    const queueName = address;
    await channel.assertQueue(queueName, { durable: true }); // durable: true -> queue will survive broker restarts, otherwise false -> queue will be deleted after broker restarts

    // channel listener to consume message from producer
    channel.consume(
      queueName,
      (msg) => {
        console.log(`Message received: ${msg.content.toString()}`);
      },
      {
        noAck: true,
      }
    );

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error(error);
  }
};

runConsumer({ address: "send-otp-sms" });
