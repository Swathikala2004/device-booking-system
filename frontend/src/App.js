import React, { useState, useEffect } from "react";
import AvailableDevices from "./components/AvailableDevices";
import MyBookings from "./components/MyBookings";
import AdminPanel from "./components/AdminPanel";
import Login from "./components/Login";
import { Container, Row, Col, Navbar, Button } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [devices, setDevices] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const triggerRefresh = () => setRefreshFlag(!refreshFlag);

  // Fetch devices
  useEffect(() => {
    if (user) {
      fetch("http://127.0.0.1:8000/devices")
        .then((res) => res.json())
        .then((data) => setDevices(data))
        .catch((err) => console.error(err));
    }
  }, [refreshFlag, user]);

  if (!user) return <Login setUser={setUser} />;

  const handleBack = () => {
    setUser(null);
  };

  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" className="mb-3">
        <Container>
          <Button variant="outline-light" className="me-3" onClick={handleBack}>
            <FaArrowLeft style={{ marginRight: "5px" }} /> Back
          </Button>

          <Navbar.Brand className="mx-auto">Device Booking System</Navbar.Brand>

          <div className="ms-auto">
            <span className="text-light me-2">{user.name} ({user.role})</span>
            <Button variant="outline-light" onClick={() => setUser(null)}>Logout</Button>
          </div>
        </Container>
      </Navbar>

      {/* Dashboard */}
      <Container>
        <Row className="dashboard-container">

          {/* USER VIEW */}
          {user.role.toLowerCase() === "user" && (
            <>
              <Col md={6} lg={4} className="card-col">
                <AvailableDevices user={user} devices={devices} triggerRefresh={triggerRefresh} />
              </Col>

              <Col md={6} lg={4} className="card-col">
                <MyBookings user={user} refreshFlag={refreshFlag} />
              </Col>
            </>
          )}

          {/* ADMIN VIEW */}
          {user.role.toLowerCase() === "admin" && (
            <Col md={6} lg={6} className="card-col">
              <AdminPanel triggerRefresh={triggerRefresh} />
            </Col>
          )}

        </Row>
      </Container>
    </>
  );
}

export default App;