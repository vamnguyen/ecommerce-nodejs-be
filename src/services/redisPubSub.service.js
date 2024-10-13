"use strict";

const Redis = require("redis");

class RedisPubSubService {
  constructor() {
    this.subscriber = Redis.createClient();
    this.publisher = Redis.createClient();

    // Connect clients (since Redis v4, connections are no longer automatic)
    this.subscriber.connect();
    this.publisher.connect();
  }

  publish(channel, message) {
    return new Promise((resolve, reject) => {
      this.publisher.publish(channel, message, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  subscribe(channel, callback) {
    this.subscriber.subscribe(channel);
    this.subscriber.on("message", (subscriberChannel, message) => {
      if (channel === subscriberChannel) {
        callback(channel, message);
      }
    });
  }
}

module.exports = new RedisPubSubService();

// "use strict";

// const Redis = require("redis");

// class RedisPubSubService {
//   constructor() {
//     // Use createClient for Redis connections and enable v4 API for promise support
//     this.subscriber = Redis.createClient();
//     this.publisher = Redis.createClient();

//     // // Connect clients (since Redis v4, connections are no longer automatic)
//     // this.subscriber.connect();
//     // this.publisher.connect();
//   }

//   // Publish a message to a Redis channel with async/await
//   async publish(channel, message) {
//     try {
//       const reply = await this.publisher.publish(channel, message);
//       return reply;
//     } catch (err) {
//       throw new Error(`Failed to publish message: ${err.message}`);
//     }
//   }

//   // Subscribe to a Redis channel and use a callback for messages
//   async subscribe(channel, callback) {
//     try {
//       await this.subscriber.subscribe(channel, (message) => {
//         callback(channel, message); // Call the callback with channel and message
//       });
//     } catch (err) {
//       throw new Error(`Failed to subscribe to channel: ${err.message}`);
//     }
//   }
// }

// module.exports = new RedisPubSubService();
