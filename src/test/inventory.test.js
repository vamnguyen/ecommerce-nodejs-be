const redisPubSubService = require("../services/redisPubSub.service");

class InventoryServiceTest {
  constructor() {
    redisPubSubService.subscribe("purchase_events", (channel, message) => {
      console.log(
        `Received message from channel: ${channel}, message: ${message}`
      );
      InventoryServiceTest.updateInventory(message);
    });
  }

  updateInventory(productId, quantity) {
    console.log(
      `Updating inventory for product: ${productId}, quantity: ${quantity}`
    );
  }
}

module.exports = new InventoryServiceTest();
