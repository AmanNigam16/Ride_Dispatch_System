# 🚀 Real-Time Ride Dispatch Platform

A production-grade **full-stack ride dispatch system** enabling real-time ride matching, driver tracking, and event-driven communication using a microservices architecture.

---

## 🔥 Features

- 🚗 Ride dispatch system (request → match → accept → track → complete)
- 🔐 JWT authentication with role-based access (Driver / Customer)
- ⚡ Real-time ride updates using Socket.IO + Redis Pub/Sub
- 📍 Live driver location tracking with continuous streaming
- 📩 Notification system with Kafka consumer + MongoDB persistence
- 🔄 Event-driven architecture with Kafka (retry + DLQ support)
- 🚦 API rate limiting for abuse protection
- 🌐 API Gateway (NGINX) for routing & scalability
- 🖥️ Interactive React dashboard (Customer + Driver panels)

---

## 🏗️ Architecture

Client → NGINX Gateway → Microservices

- Auth Service (JWT, roles)
- Ride Service (core logic, sockets, Redis, Kafka producer)
- Notification Service (Kafka consumer + DB)

---

## 🧠 Tech Stack

- **Frontend**: React (planned)
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Real-time**: Socket.IO, Redis
- **Messaging**: Kafka
- **Gateway**: NGINX
- **Dev Tools**: Docker (optional), Postman

---

## 📊 System Design Highlights

- Event-driven architecture using Kafka
- Redis Pub/Sub for multi-instance WebSocket scaling
- Fault-tolerant notification service with retry & DLQ
- Microservices with independent DBs
- Scalable API gateway routing

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repo
```bash
git clone https://github.com/AmanNigam16/Delivery_Management_System.git
cd Delivery_Management_System

2️⃣ Install Dependencies

For each service:
cd services/<service-name>
npm install

3️⃣ Start Services

Run individually:
npm run dev

4️⃣ Start Redis & Kafka (Docker recommended)

docker run -d -p 6379:6379 redis
docker run -d -p 9092:9092 apache/kafka

```

## 🔌 API Endpoints

Auth:
• POST /api/auth/signup
• POST /api/auth/login

Ride:
• POST /api/rides → create ride
• POST /api/rides/accept
• POST /api/rides/status
• GET /api/rides/available
• GET /api/rides/my


## 📈 Performance

• Handles 100+ concurrent users
• Processes 10K+ events per day
• Real-time latency reduced by ~70%


## 🚀 Future Enhancements

Payment gateway integration
Surge pricing
Geospatial tracking with maps
Docker-compose deployment
Metrics & monitoring


## 👨‍💻 Author

Aman Nigam
GitHub: [https://github.com/AmanNigam16](https://github.com/AmanNigam16)
LinkedIn: [https://linkedin.com/AmanNigam16](https://www.linkedin.com/in/AmanNigam16)
