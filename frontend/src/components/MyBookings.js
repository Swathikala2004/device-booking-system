import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import axios from "axios";

function MyBookings({ user, refreshFlag }) {

  const [bookings, setBookings] = useState([]);
  const [devices, setDevices] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {

    if (!user?.id) return;

    axios
      .get(`http://127.0.0.1:8000/my_bookings/?user_id=${user.id}`)
      .then((res) => setBookings(res.data || []))
      .catch((err) => {
        console.error("Failed to fetch bookings:", err);
        setBookings([]);
      });

    axios
      .get("http://127.0.0.1:8000/devices")
      .then((res) => setDevices(res.data || []))
      .catch((err) => console.error(err));

  }, [user?.id, refreshFlag]);

  // Current time
  const now = new Date();

  const upcoming = [];
  const past = [];

  bookings.forEach((b) => {

    const end = new Date(b.end_time);

    if (end >= now) {
      upcoming.push(b);
    } else {
      past.push(b);
    }

  });

  upcoming.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  past.sort((a, b) => new Date(b.start_time) - new Date(a.start_time));

  const getDeviceName = (id) => {
    const device = devices.find((d) => d.id === id);
    return device ? device.name : `Device ${id}`;
  };

  const formatTime = (timeStr) =>
    new Date(timeStr).toLocaleString();

  // Cancel booking
  const cancelBooking = (bookingId) => {

    axios
      .delete(`http://127.0.0.1:8000/cancel_booking/${bookingId}`)
      .then(() => {

        setBookings((prev) =>
          prev.filter((b) => b.id !== bookingId)
        );

      })
      .catch((err) => console.error("Cancel failed", err));

  };

  return (
    <Card className="bookings-card card-hover">

      <Card.Body>

        <Card.Title>My Bookings</Card.Title>

        {/* Tabs */}
        <Row className="mb-3">

          <Col>
            <Button
              variant={activeTab === "upcoming" ? "primary" : "outline-primary"}
              className="w-100"
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming
            </Button>
          </Col>

          <Col>
            <Button
              variant={activeTab === "past" ? "secondary" : "outline-secondary"}
              className="w-100"
              onClick={() => setActiveTab("past")}
            >
              Past
            </Button>
          </Col>

        </Row>

        <ul className="list-unstyled">

          {/* UPCOMING BOOKINGS */}
          {activeTab === "upcoming" &&
            (upcoming.length === 0 ? (

              <li>No upcoming bookings</li>

            ) : (

              upcoming.map((b) => {

                const start = new Date(b.start_time);
                const end = new Date(b.end_time);

                let status = "Upcoming";
                let variant = "primary";

                if (start <= now && end >= now) {
                  status = "Active";
                  variant = "danger";
                }

                return (

                  <li
                    key={b.id}
                    className="booking-item d-flex justify-content-between align-items-center mb-2"
                  >

                    <div>

                      <strong>{getDeviceName(b.device_id)}</strong>
                      <br />
                      {formatTime(b.start_time)} - {formatTime(b.end_time)}

                    </div>

                    <div>

                      <Button
                        size="sm"
                        variant={variant}
                        disabled
                        className="me-2"
                      >
                        {status}
                      </Button>

                      {/* Cancel allowed only if not active */}
                      {status !== "Active" && (

                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => cancelBooking(b.id)}
                        >
                          Cancel
                        </Button>

                      )}

                    </div>

                  </li>

                );

              })

            ))}

          {/* PAST BOOKINGS */}
          {activeTab === "past" &&
            (past.length === 0 ? (

              <li>No past bookings</li>

            ) : (

              past.map((b) => (

                <li
                  key={b.id}
                  className="booking-item d-flex justify-content-between align-items-center mb-2"
                >

                  <div>

                    <strong>{getDeviceName(b.device_id)}</strong>
                    <br />
                    {formatTime(b.start_time)} - {formatTime(b.end_time)}

                  </div>

                  <Button size="sm" variant="secondary" disabled>
                    Expired
                  </Button>

                </li>

              ))

            ))}

        </ul>

      </Card.Body>

    </Card>
  );
}

export default MyBookings;