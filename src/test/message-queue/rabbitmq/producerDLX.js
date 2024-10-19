const amqp = require("amqplib");

const log = console.log;
console.log = function () {
  log.apply(console, [new Date()].concat(arguments));
};

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:12345@localhost");
    const channel = await connection.createChannel();

    const notifyExchange = "notifyExchange"; // notification exchange direct
    const notifyQueue = "notifyQueueProcess"; // assert queue
    const notifyExchangeDLX = "notifyExchangeDLX"; // notification exchange direct
    const notifyRoutingKeyDLX = "notifyRoutingKeyDLX"; // assert

    // 1. Create Exchange
    await channel.assertExchange(notifyExchange, "direct", { durable: true });

    // 2. Create Queue
    const queueResult = await channel.assertQueue(notifyQueue, {
      exclusive: false, // allow multiple connections to the same queue
      deadLetterExchange: notifyExchangeDLX,
      deadLetterRoutingKey: notifyRoutingKeyDLX,
    });

    // 3. Bind Queue to Exchange
    await channel.bindQueue(queueResult.queue, notifyExchange);

    // 4. Send message
    const msg = "a new product has been added";
    console.log(`Producer send message: ${msg}`);
    await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: "10000", // 10s
    });

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error("Error in runProducer", error);
  }
};

runProducer();
