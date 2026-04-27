import React, { useState, useEffect, useCallback } from "react";
import { Card, Button, Modal, Form, Toast, ToastContainer } from "react-bootstrap";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

function AvailableDevices({ user, devices, triggerRefresh }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const [myBookings, setMyBookings] = useState([]);
  const [deviceBookings, setDeviceBookings] = useState([]);

  const fetchMyBookings = useCallback(() => {
    if (!user?.id) return;

    axios
      .get(`${API_URL}/my_bookings/?user_id=${user.id}`)
      .then((res) => setMyBookings(res.data))
      .catch((err) => console.error(err));
  }, [user?.id]);

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings, devices, triggerRefresh]);

  const openModal = (device) => {
    setSelectedDevice(device);
    setShowModal(true);
    setStartTime("");
    setEndTime("");
    setToastMessage("");

    axios
      .get(`${API_URL}/bookings`)
      .then((res) => {
        const filtered = res.data.filter((b) => b.device_id === device.id);
        filtered.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
        setDeviceBookings(filtered);
      })
      .catch((err) => console.error(err));
  };

  const isBookedByMe = (deviceId) => {
    return myBookings.some((b) => b.device_id === deviceId);
  };

  const maxDevicesReached = myBookings.length >= 2;

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

    const conflict = deviceBookings.some((b) => {
      const bStart = new Date(b.start_time);
      const bEnd = new Date(b.end_time);
      return !(end <= bStart || start >= bEnd);
    });

    if (conflict) {
      setToastMessage("❌ Device already booked for this time slot!");
      setShowToast(true);
      return;
    }

    axios
      .post(`${API_URL}/book_device/`, {
        device_id: selectedDevice.id,
        user_id: user.id,
        user_name: user.name,
        start_time: startTime,
        end_time: endTime,
        timezone: user.timezone,
      })
      .then(() => {
        setToastMessage("✅ Booking Confirmed!");
        setShowToast(true);
        setShowModal(false);
        triggerRefresh();
        fetchMyBookings();
      })
      .catch((err) => {
        setToastMessage(err.response?.data?.detail || "Error occurred");
        setShowToast(true);
      });
  };

  return (
    <>
      <Card className="available-card card-hover">
        <Card.Body>
          <Card.Title>Available Devices 📱</Card.Title>

          {devices.length === 0 && <p>No devices available</p>}

          <ul className="list-unstyled">
            {devices.map((d) => {
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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Book {selectedDevice?.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h6>Booked Slots</h6>
          <ul style={{ fontSize: "13px" }}>
            {deviceBookings.length === 0 ? (
              <li>No bookings yet</li>
            ) : (
              deviceBookings.map((b, idx) => (
                <li key={idx}>
                  {b.user_name} : {new Date(b.start_time).toLocaleString()} -{" "}
                  {new Date(b.end_time).toLocaleString()}
                </li>
              ))
            )}
          </ul>

          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleBooking}>Confirm Booking</Button>
        </Modal.Footer>
      </Modal>

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