const Device = require("../models/Device");

// Seed Devices (RESET + ADD NEW)
const seedDevices = async (req, res) => {
  try {
    // 1. Delete ALL old devices
    await Device.deleteMany({});

    // 2. Add new Swathi devices
    const devices = [
      {
        name: "Swathi Device 1",
        serialNumber: "laptop-001",
        ipAddress: "192.168.1.101",
        status: "active",
      },
      {
        name: "Swathi Device 2",
        serialNumber: "laptop-002",
        ipAddress: "192.168.1.102",
        status: "active",
      },
      {
        name: "Swathi Device 3",
        serialNumber: "laptop-003",
        ipAddress: "192.168.1.103",
        status: "active",
      },
      {
        name: "Swathi Device 4",
        serialNumber: "laptop-004",
        ipAddress: "192.168.1.104",
        status: "active",
      },
      {
        name: "Swathi Device 5",
        serialNumber: "laptop-005",
        ipAddress: "192.168.1.105",
        status: "active",
      },
    ];

    // 3. Insert new data
    await Device.insertMany(devices);

    res.json({
      message: "Old devices removed & Swathi devices added successfully ✅",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all devices
const getDevices = async (req, res) => {
  try {
    const devices = await Device.find().sort({ serialNumber: 1 });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add device
const addDevice = async (req, res) => {
  try {
    const { name, serialNumber, ipAddress, status } = req.body;

    const device = await Device.create({
      name,
      serialNumber,
      ipAddress,
      status,
    });

    res.status(201).json({
      message: "Device added successfully ✅",
      device,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update device
const updateDevice = async (req, res) => {
  try {
    const device = await Device.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    res.json({
      message: "Device updated successfully ✅",
      device,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete device
const deleteDevice = async (req, res) => {
  try {
    const device = await Device.findByIdAndDelete(req.params.id);

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    res.json({ message: "Device deleted successfully ✅" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  seedDevices,
  getDevices,
  addDevice,
  updateDevice,
  deleteDevice,
};