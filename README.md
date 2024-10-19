# E-Commerce Backend Node.js

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Kafka](https://img.shields.io/badge/Apache%20Kafka-231F20?style=for-the-badge&logo=apachekafka&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![CI/CD](https://img.shields.io/badge/CI%2FCD-007ACC?style=for-the-badge&logo=azurepipelines&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white)
![Microservices](https://img.shields.io/badge/Microservices-FF5733?style=for-the-badge&logo=microservices&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

## Introduction

This is the backend project for an e-commerce application, built with Node.js and Express.js. The project provides APIs for managing users, products, carts, orders, notifications, and many other features.

## Project Structure

## Installation

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd e-commerce-be-nodejs
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file from `.env.example` and configure the necessary environment variables.

4. Start the server:
   ```sh
   npm run dev
   ```

## Features

### Authentication & Authorization

- 🔐 User registration and login
- 🔐 Token-based authentication
- 🔐 Role-based access control

### Product Management

- 🛒 Create, update, and delete products
- 🛒 Product search and filtering
- 🛒 Product categorization and tagging

### Cart Management

- 🛍️ Add and remove items from the cart
- 🛍️ View and manage cart contents
- 🛍️ Apply discounts and promotions

### Order Management

- 📦 Create and manage orders
- 📦 Order tracking and status updates
- 📦 Payment processing integration

### Notification System

- 🔔 Real-time notifications for users
- 🔔 Email and SMS notifications
- 🔔 Notification management and preferences

### Comment Management

- 💬 Add, edit, and delete comments on products
- 💬 Comment moderation and reporting
- 💬 User ratings and reviews
- 💬 Nested comment model support decrease query time

### Discount Management

- 💸 Create and manage discount codes
- 💸 Apply discounts to orders
- 💸 Track discount usage and effectiveness

### Inventory Management

- 📦 Track product inventory levels
- 📦 Automated stock updates
- 📦 Inventory alerts and notifications

### Security & Performance

- 🔒 Secure API endpoints with JWT
- ⚡ Optimized database queries
- 📈 Performance monitoring and logging

## Configuration

Configure MongoDB in the file [src/configs/config.mongodb.js](src/configs/config.mongodb.js).

## Contribution

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a Pull Request.

## License

This project is licensed under the MIT License.
