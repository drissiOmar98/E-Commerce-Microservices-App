# 🛒 E-Commerce Microservice Application
This project demonstrates a microservice-based e-commerce application built using **Spring Boot**, integrating various microservices to handle specific functionalities of an e-commerce platform. It features a scalable and resilient architecture with tools for service discovery, API gateway, distributed tracing, message-driven communication, and security.

## 📑 Table of Contents
- [🛠 Project Overview](#-project-overview)
- [🏗️ Microservices Architecture](#-microservices-architecture)
- [✨ Features](#-features)
- [🛠 Technologies](#-technologies)

## 🛠 Project Overview
The project consists of multiple microservices, each handling a distinct part of the e-commerce platform. The architecture is designed to be flexible and easily scalable using **Docker** and **Docker Compose**. The application is secured with **Keycloak**, and **Kafka** is used for asynchronous communication. The setup includes service discovery with **Eureka**, API gateway for routing, and distributed tracing with **Zipkin**.

## 🏗️ Microservices Architecture
Here is an overview of the main microservices in this project:

- **🔧 Config Server**: Centralized external configuration for other microservices.
- **🔍 Discovery Server (Eureka)**: Service registry for discovering services at runtime.
- **🚪 API Gateway**: A single entry point into the system, routing requests to the appropriate services.
- **👤 Customer Server**: Manages customer-related operations.
- **📩 Notification Server**: Sends notifications (e.g., email, SMS) to users based on actions like order creation.
- **📦 Order Server**: Handles order creation, management, and tracking.
- **💳 Payment Server**: Manages payment transactions for orders.
- **🛍️ Product Server**: Handles product catalog, search, and inventory management.
- **🛒 Cart Service**: Manages shopping cart operations, such as adding, updating, and removing items.
- **💬 Feedback Service**: Allows users to post reviews and ratings for purchased products.
- **❤️ Favorite Service**:  Enables users to mark products as favorites for future reference.




## ✨ Features
- **🧭 Service Discovery**: Using Eureka to register and discover microservices dynamically.
- **🚪 API Gateway**: Central routing of requests through Spring Cloud Gateway.
- **📡 Asynchronous Communication**: Implemented with Kafka for event-driven messaging between services.
- **🔗 Synchronous Communication**: Using OpenFeign and RestTemplate for inter-service communication.
- **🔍 Distributed Tracing**: Zipkin integration for monitoring and tracing requests across services.
- **🔐 Security**: Keycloak integration for authentication and authorization of microservices.
- **⚙️ Infrastructure Setup**: Using Docker and Docker Compose for easy setup and running of the application.




## 🛠 Technologies
This project uses the following technologies:

- **Spring Boot**
  - Spring Cloud Config
  - Spring Cloud Netflix Eureka
  - Spring Cloud Gateway
  - Spring Cloud OpenFeign
  - Spring Actuator
  - Spring Data JPA
  - Spring Kafka
- **Kafka**: For asynchronous communication between microservices.
- **Docker & Docker Compose**: For containerization and infrastructure setup.
- **Keycloak**: For securing the microservices with OAuth2 and OpenID Connect.
- **Zipkin**: For distributed tracing of requests across microservices.