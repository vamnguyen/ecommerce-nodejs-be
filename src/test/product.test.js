const redisPubSubService = require("../services/redisPubSub.service");

class ProductServiceTest {
  purchaseProduct(productId, quantity) {
    const order = {
      productId,
      quantity,
    };

    // Publish the order to the "purchase_events" channel
    redisPubSubService.publish("purchase_events", JSON.stringify(order));
  }
}

module.exports = new ProductServiceTest();
