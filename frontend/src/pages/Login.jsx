import { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "swathi" && password === "swathi123") {
      onLogin();
    } else {
      alert("Invalid credentials! Use swathi / swathi123");
    }
  };

  return (
    <div className="login-wrapper">

      {/* 🔵 CENTERED BLUE HEADER */}
      <div className="dashboard-header center-header">
        <h1>Project Released Dashboard</h1>
        <p>
          One-screen view for commits across active releases, quick access to
          release pages, and real-time lab reservation tracking.
        </p>
        
      </div>

      <div className="login-page">

        {/* LEFT CARD */}
        <div className="blue-card">
          <h2>Multi-Release Dashboard Access</h2>

          <p>
            Sign in to open the release dashboard, review branch health,
            and jump to the linked release pages.
          </p>

          <div className="badge-row">
            <span>Secure entry</span>
            <span>Dashboard access</span>
          </div>
        </div>

        {/* RIGHT LOGIN CARD */}
        <div className="login-card">
          <h2>Login</h2>
          <p>Enter your username and password to continue.</p>

          <form onSubmit={handleLogin}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Open Dashboard</button>
          </form>

          <div className="demo-box">
            Demo login: <b>swathi</b> / <b>swathi123</b>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;