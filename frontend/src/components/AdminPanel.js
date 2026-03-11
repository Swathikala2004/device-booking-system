import React, { useState, useEffect } from "react";
import { Card, Button, Form, Table } from "react-bootstrap";
import { FaTools, FaPlus, FaList, FaTrash, FaClipboardList } from "react-icons/fa";
import axios from "axios";

function AdminPanel({ triggerRefresh }) {

  const [activeTab, setActiveTab] = useState("add"); 
  const [name, setName] = useState("");
  const [serial, setSerial] = useState("");
  const [ip, setIp] = useState("");

  const [devices, setDevices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch devices
  const fetchDevices = () => {
    axios.get("http://127.0.0.1:8000/devices")
      .then(res => setDevices(res.data))
      .catch(err => console.error(err));
  };

  // Fetch all bookings
  const fetchBookings = () => {
    axios.get("http://127.0.0.1:8000/bookings")
      .then(res => setBookings(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchDevices();
    fetchBookings();
  }, [triggerRefresh]);

  // Add Device
  const handleAdd = () => {
    if (!name || !serial || !ip) {
      setMessage("Please fill all fields!");
      return;
    }

    axios.post("http://127.0.0.1:8000/admin/add_device/", {
      name,
      serial_number: serial,
      ip_address: ip
    })
    .then(res => {
      setMessage("✅ " + res.data.message);
      setName(""); setSerial(""); setIp("");
      fetchDevices();
      triggerRefresh();
    })
    .catch(err => setMessage(err.response?.data?.detail || "Error"));
  };

  // Delete Device
  const handleDelete = (id) => {
    const confirmDel = window.confirm("Are you sure you want to delete this device?");
    if (!confirmDel) return;

    axios.post("http://127.0.0.1:8000/admin/delete_device/", { id })
      .then(res => {
        setMessage("✅ " + res.data.message);
        fetchDevices();
        triggerRefresh();
      })
      .catch(err => setMessage(err.response?.data?.detail || "Error"));
  };

  return (
    <Card className="admin-card card-hover" style={{ maxHeight: "600px", overflowY: "auto" }}>
      <Card.Body>
        <Card.Title>
          <FaTools style={{ marginRight: "8px" }} />
          Admin Panel
        </Card.Title>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <Button variant="success" size="sm" onClick={() => setActiveTab("add")}>
            <FaPlus style={{ marginRight: "5px" }} /> Add Device
          </Button>
          <Button variant="primary" size="sm" onClick={() => setActiveTab("manage")}>
            <FaList style={{ marginRight: "5px" }} /> Manage Devices
          </Button>
          <Button variant="info" size="sm" onClick={() => setActiveTab("bookings")}>
            <FaClipboardList style={{ marginRight: "5px" }} /> View Bookings
          </Button>
        </div>

        {message && <p>{message}</p>}

        {/* Add Device */}
        {activeTab === "add" && (
          <Form>
            <Form.Group className="mb-2">
              <Form.Control placeholder="Device Name" value={name} onChange={e => setName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control placeholder="Serial Number" value={serial} onChange={e => setSerial(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control placeholder="IP Address" value={ip} onChange={e => setIp(e.target.value)} />
            </Form.Group>
            <Button onClick={handleAdd}>Add Device</Button>
          </Form>
        )}

        {/* Manage Devices */}
        {activeTab === "manage" && (
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Serial</th>
                <th>IP</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {devices.map(d => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.name}</td>
                  <td>{d.serial_number}</td>
                  <td>{d.ip_address}</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(d.id)}>
                      <FaTrash /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {/* View Bookings */}
        {activeTab === "bookings" && (
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Device ID</th>
                <th>User Name</th>
                <th>Start Time</th>
                <th>End Time</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 && (
                <tr>
                  <td colSpan="4">No bookings found</td>
                </tr>
              )}
              {bookings.map((b, idx) => (
                <tr key={idx}>
                  <td>{b.device_id}</td>
                  <td>{b.user_name}</td>
                  <td>{new Date(b.start_time).toLocaleString()}</td>
                  <td>{new Date(b.end_time).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

      </Card.Body>
    </Card>
  );
}

export default AdminPanel;