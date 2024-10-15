"use strict";

const Notification = require("../models/notification.model");

class NotificationService {
  static async pushNotificationToSystem({
    type = "SHOP-001",
    receiverId = 1,
    senderId = 1,
    options = {},
  }) {
    let notification_content;
    if (type === "SHOP-001") {
      notification_content = `Shop @@@ vừa moi them 1 san pham: @@@@`;
    } else if (type === "PROMOTION-001") {
      notification_content = `Shop @@@ vừa moi them 1 voucher: @@@@`;
    }
    const newNotification = await Notification.create({
      notification_type: type,
      notification_sender_id: senderId,
      notification_receiver_id: receiverId,
      notification_content,
      notification_options: options,
    });
    return newNotification;
  }

  static async listNotificationByUser({
    userId = 1,
    type = "ALL",
    isRead = 0,
  }) {
    const match = {
      notification_receiver_id: userId,
      notification_type: type,
    };

    return await Notification.aggregate([
      {
        $match: match,
      },
      {
        $project: {
          notification_type: 1,
          notification_sender_id: 1,
          notification_receiver_id: 1,
          notification_content: {
            $concat: [
              {
                $substr: ["$notification_options.shop_name", 0, -1],
              },
              " just add a new product: ",
              {
                $substr: ["$notification_options.product_name", 0, -1],
              },
            ],
          },
          notification_options: 1,
          createdAt: 1,
          isRead: 1,
        },
      },
    ]);
  }
}

module.exports = NotificationService;
