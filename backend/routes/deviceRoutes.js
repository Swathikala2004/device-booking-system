const express = require("express");
const router = express.Router();

const {
  seedDevices,
  getDevices,
  addDevice,
  updateDevice,
  deleteDevice,
} = require("../controllers/deviceController");

/**
 * @route   GET /api/devices/seed
 * @desc    Add default NFVIS devices (for testing)
 */
router.get("/seed", seedDevices);

/**
 * @route   POST /api/devices/seed
 * @desc    Add default devices (Postman alternative)
 */
router.post("/seed", seedDevices);

/**
 * @route   GET /api/devices
 * @desc    Get all devices
 */
router.get("/", getDevices);

/**
 * @route   POST /api/devices
 * @desc    Add new device (Admin)
 */
router.post("/", addDevice);

/**
 * @route   PUT /api/devices/:id
 * @desc    Update device (Admin)
 */
router.put("/:id", updateDevice);

/**
 * @route   DELETE /api/devices/:id
 * @desc    Delete device (Admin)
 */
router.delete("/:id", deleteDevice);

module.exports = router;