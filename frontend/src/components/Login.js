import React, { useState } from "react";
import { Card, Button, Form, InputGroup } from "react-bootstrap";
import { FaUserAlt, FaSignInAlt } from "react-icons/fa"; // Icons
import "./Login.css"; // Custom CSS for colors & layout

function Login({ setUser }) {
  const [selectedUser, setSelectedUser] = useState("");

  const dummyUsers = [
    { id: 1, name: "Alice", role: "user", timezone: "Asia/Kolkata" },
    { id: 2, name: "Bob", role: "user", timezone: "America/New_York" },
    { id: 3, name: "Admin", role: "admin", timezone: "Asia/Kolkata" }
  ];

  const handleLogin = () => {
    if (!selectedUser) return;
    const user = dummyUsers.find(u => u.id === parseInt(selectedUser));
    setUser(user);
  };

  return (
    <div className="login-container">
      <Card className="login-card shadow-lg">
        <Card.Body>
          <Card.Title className="text-center mb-4">
            <FaUserAlt className="me-2" /> Device Booking
          </Card.Title>

          <InputGroup className="mb-3">
            <InputGroup.Text><FaUserAlt /></InputGroup.Text>
            <Form.Select
              value={selectedUser}
              onChange={e => setSelectedUser(e.target.value)}
            >
              <option value="">Select User</option>
              {dummyUsers.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </Form.Select>
          </InputGroup>

          <Button
            className="w-100 login-btn"
            onClick={handleLogin}
          >
            <FaSignInAlt className="me-2" /> Login
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;