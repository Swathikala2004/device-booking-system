import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form, Toast, ToastContainer } from "react-bootstrap";
import axios from "axios";

function AvailableDevices({ user, devices, triggerRefresh }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const [myBookings, setMyBookings] = useState([]); // user's bookings
  const [deviceBookings, setDeviceBookings] = useState([]); // bookings of selected device

  // Fetch current user bookings
  const fetchMyBookings = () => {
    axios.get(`http://127.0.0.1:8000/my_bookings/?user_id=${user.id}`)
      .then(res => setMyBookings(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchMyBookings();
  }, [user, devices, triggerRefresh]);

  // Open booking modal
  const openModal = (device) => {
    setSelectedDevice(device);
    setShowModal(true);
    setStartTime("");
    setEndTime("");
    setToastMessage("");

    // Fetch all bookings for this device
    axios.get("http://127.0.0.1:8000/bookings")
      .then(res => {
        const filtered = res.data.filter(b => b.device_id === device.id);
        // sort by start time
        filtered.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
        setDeviceBookings(filtered);
      })
      .catch(err => console.error(err));
  };

  // Check if user has already booked this device
  const isBookedByMe = (deviceId) => {
    return myBookings.some(b => b.device_id === deviceId);
  };

  // Max 2 device rule per user
  const maxDevicesReached = myBookings.length >= 2;

  // Handle booking submission
  const handleBooking = () => {
    if (!startTime || !endTime) {
      setToastMessage("Please fill all fields!");
      setShowToast(true);
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      setToastMessage("End time must be after start time");
      setShowToast(true);
      return;
    }

    // Check for overlapping bookings on this device
    const conflict = deviceBookings.some(b => {
      const bStart = new Date(b.start_time);
      const bEnd = new Date(b.end_time);
      return !(end <= bStart || start >= bEnd); // overlap
    });

    if (conflict) {
      setToastMessage("❌ Device already booked for this time slot!");
      setShowToast(true);
      return;
    }

    // Submit booking
    axios.post("http://127.0.0.1:8000/book_device/", {
      device_id: selectedDevice.id,
      user_id: user.id,
      user_name: user.name,
      start_time: startTime,
      end_time: endTime,
      timezone: user.timezone
    })
    .then(res => {
      setToastMessage("✅ Booking Confirmed!");
      setShowToast(true);
      setShowModal(false);
      triggerRefresh();
      fetchMyBookings();
    })
    .catch(err => {
      setToastMessage(err.response?.data?.detail || "Error occurred");
      setShowToast(true);
    });
  };

  return (
    <>
      {/* Available Devices Card */}
      <Card className="available-card card-hover">
        <Card.Body>
          <Card.Title>Available Devices 📱</Card.Title>

          {devices.length === 0 && <p>No devices available</p>}

          <ul className="list-unstyled">
            {devices.map(d => {
              const booked = isBookedByMe(d.id);
              const canBook = !booked && !maxDevicesReached;

              return (
                <li key={d.id} className="device-item">
                  <div>
                    <span className={`status-dot ${booked ? "inactive" : "active"}`}></span>
                    {d.name} ({d.ip_address})
                  </div>
                  <Button
                    size="sm"
                    onClick={() => openModal(d)}
                    disabled={!canBook}
                    variant={booked ? "danger" : "success"}
                  >
                    {booked ? "Booked" : "Book"}
                  </Button>
                </li>
              );
            })}
          </ul>
        </Card.Body>
      </Card>

      {/* Booking Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Book {selectedDevice?.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Show already booked slots */}
          <h6>Booked Slots</h6>
          <ul style={{ fontSize: "13px" }}>
            {deviceBookings.length === 0 ? (
              <li>No bookings yet</li>
            ) : (
              deviceBookings.map((b, idx) => (
                <li key={idx}>
                  {b.user_name} : {new Date(b.start_time).toLocaleString()} - {new Date(b.end_time).toLocaleString()}
                </li>
              ))
            )}
          </ul>

          {/* Booking Form */}
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button onClick={handleBooking}>Confirm Booking</Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notification */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg={toastMessage.startsWith("✅") ? "success" : "danger"}
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default AvailableDevices;