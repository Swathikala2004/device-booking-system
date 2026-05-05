const express = require("express");
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  cancelBooking,
} = require("../controllers/bookingController");

router.post("/", createBooking);
router.get("/", getAllBookings);
router.patch("/:id/cancel", cancelBooking);

module.exports = router;
