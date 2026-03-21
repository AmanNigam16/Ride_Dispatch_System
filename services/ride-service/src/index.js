require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const rideRoutes = require("./routes/rideRoutes");
const { producer } = require("./config/kafka");
const runConsumer = require("./kafka/consumer");

const app = express();
app.use(express.json());

// Rate limiter middleware
const limiter = require("./middleware/rateLimiter");
app.use("/api", limiter);

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: { origin: "*" }
});

// Make io accessible in controllers
app.set("io", io);

const { sub } = require("./config/redis");

sub.subscribe("ride_updates");

sub.on("message", (channel, message) => {
  const data = JSON.parse(message);

  const io = app.get("io");
  io.emit(data.event, data.payload);
});

// Socket connection (Live Driver Location Tracking)
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User must join the room BEFORE emitting to it
  socket.on("join", (userId) => {
    socket.join(userId);
  });

  // Then handle events
  socket.on("driver_location", (data) => {                              // data = { driverId, lat, lng }
    // io.emit("driver_location_update", data);
    io.to(data.driverId).emit("driver_location_update", data);          //  Instead of io.emit → we'll use Rooms (io.to())
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Routes
app.use("/api/rides", rideRoutes);

//Error handler middleware
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Ride Service Running");
});

// DB + Server start
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Ride DB Connected");

    // ✅ Connect Kafka Producer
    await producer.connect();
    console.log("Kafka Producer Connected");

    // ✅ START CONSUMER HERE
    await runConsumer();
    console.log("Kafka Consumer Started");

    // ✅ Start server in the end
    server.listen(process.env.PORT, () => {
      console.log(`Ride service running on ${process.env.PORT}`);
    });
  })
  .catch(err => console.log(err));