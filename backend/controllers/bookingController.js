const Booking = require("../models/Booking");
const Device = require("../models/Device");

// Create booking
const createBooking = async (req, res) => {
  try {
    const { userId, deviceId, startTime, endTime, timezone } = req.body;

    if (!userId || !deviceId || !startTime || !endTime) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const startUTC = new Date(startTime);
    const endUTC = new Date(endTime);

    if (startUTC >= endUTC) {
      return res.status(400).json({ message: "End time must be after start time" });
    }

    const device = await Device.findById(deviceId);

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    if (device.status === "maintenance") {
      return res.status(400).json({ message: "Device is under maintenance" });
    }

    // Same device overlap check
    const conflict = await Booking.findOne({
      deviceId,
      status: "active",
      startTime: { $lt: endUTC },
      endTime: { $gt: startUTC },
    });

    if (conflict) {
      return res.status(400).json({
        message: "Device already booked for this time window",
      });
    }

    // User max 2 devices at same time
    const userActiveBookings = await Booking.countDocuments({
      userId,
      status: "active",
      startTime: { $lt: endUTC },
      endTime: { $gt: startUTC },
    });

    if (userActiveBookings >= 2) {
      return res.status(400).json({
        message: "User can book maximum 2 devices at the same time",
      });
    }

    const booking = await Booking.create({
      userId,
      deviceId,
      startTime: startUTC,
      endTime: endUTC,
      timezone: timezone || "UTC",
    });

    res.status(201).json({
      message: "Booking successful ✅",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId })
      .populate("deviceId")
      .sort({ startTime: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("deviceId")
      .sort({ startTime: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({
      message: "Booking cancelled successfully ✅",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking,
};