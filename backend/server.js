const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const deviceRoutes = require("./routes/deviceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

// CORS Middleware
app.use(cors({
  origin: [
    "https://device-booking-system-7db1.vercel.app",
    "https://device-booking-system-7db1-eebi7wv2s.vercel.app",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

// Middleware
app.use(express.json());

// Database Connection
connectDB();

// Test Route
app.get("/", (req, res) => {
  res.send("Booking System Backend Running 🚀");
});

// API Routes
app.use("/api/devices", deviceRoutes);
app.use("/api/bookings", bookingRoutes);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});