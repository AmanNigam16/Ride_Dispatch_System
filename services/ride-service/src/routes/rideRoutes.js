const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { getAvailableRides, getMyRides } = require("../controllers/rideController");
const { createRide, acceptRide, updateRideStatus } = require("../controllers/rideController");

router.post("/", authMiddleware, roleMiddleware(["customer"]), createRide);
router.post("/accept", authMiddleware, roleMiddleware(["driver"]), acceptRide);
router.post("/status", updateRideStatus);
router.get("/available", authMiddleware, roleMiddleware(["driver"]), getAvailableRides);
router.get("/my", authMiddleware, getMyRides);

module.exports = router;