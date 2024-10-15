const amqplib = require("amqplib");
const amqpUri = "amqp://guest:12345@localhost:5672";

const runProducer = async ({ msg, address }) => {
  try {
    // 1. create connection
    const connection = await amqplib.connect(amqpUri);

    // 2. create channel
    const channel = await connection.createChannel();

    // 3. create name queue
    const queueName = address;
    await channel.assertQueue(queueName, { durable: true }); // durable: true -> queue will survive broker restarts, otherwise false -> queue will be deleted after broker restarts

    // send message to consumer queue
    channel.sendToQueue(queueName, Buffer.from(msg));
    console.log(`Message sent: ${msg}`);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error(error);
  }
};

const msg = process.argv.slice(2).join(" ") || "Hello";
runProducer({ msg: msg, address: "send-otp-sms" });
