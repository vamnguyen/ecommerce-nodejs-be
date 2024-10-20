"use strict";

const amqp = require("amqplib");

const queueName = "orderedQueueMessage";

async function producerOrderedMessage() {
  const connection = await amqp.connect("amqp://guest:12345@localhost");
  const channel = await connection.createChannel();

  await channel.assertQueue(queueName, { durable: true });

  for (let i = 0; i < 10; i++) {
    const message = `Message ${i}`;
    console.log("message:", message);

    await channel.sendToQueue(queueName, Buffer.from(message), {
      persistent: true,
    });
  }

  setTimeout(() => {
    connection.close();
  }, 1000);
}

producerOrderedMessage().catch((error) => console.error(error));
