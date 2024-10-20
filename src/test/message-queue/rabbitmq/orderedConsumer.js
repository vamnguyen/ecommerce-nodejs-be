"use strict";

const amqp = require("amqplib");

const queueName = "orderedQueueMessage";

async function consumerOrderedMessage() {
  const connection = await amqp.connect("amqp://guest:12345@localhost");
  const channel = await connection.createChannel();

  await channel.assertQueue(queueName, { durable: true });

  // Set the prefetch value to 1 to ensure that the consumer only receives one message at a time.
  channel.prefetch(1);

  channel.consume(queueName, (msg) => {
    const message = msg.content.toString();

    setTimeout(() => {
      console.log("Processed message:", message);
      channel.ack(msg);
    }, Math.random() * 1000);
  });
}

consumerOrderedMessage().catch((error) => console.error(error));
