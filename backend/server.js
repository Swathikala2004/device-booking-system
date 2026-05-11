const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const deviceRoutes = require("./routes/deviceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

// Middleware
app.use(cors({
  origin: ["https://device-booking-system-7db1.vercel.app"],
  credentials: true
}));

app.use(express.json());

// DB connection
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("Booking System Backend Running 🚀");
});

// API routes
app.use("/api/devices", deviceRoutes);
app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});