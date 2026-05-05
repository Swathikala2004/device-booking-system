import { useState, useEffect, useMemo } from "react";
import API from "../services/api";

function Dashboard({ setPage }) {
  const [devices, setDevices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  // Load devices and bookings
  const loadData = async () => {
    try {
      const [deviceRes, bookingRes] = await Promise.all([
        API.get("/devices"),
        API.get("/bookings"),
      ]);
      setDevices(deviceRes.data);
      setBookings(bookingRes.data);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 5 seconds
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    const timeInterval = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);

  // Calculate active bookings (currently within time window)
  const activeBookings = useMemo(
    () =>
      bookings.filter((b) => {
        if (b.status !== "active") return false;
        const start = new Date(b.startTime);
        const end = new Date(b.endTime);
        return start < now && end > now;
      }),
    [bookings, now]
  );

  // Calculate stats
  const stats = {
    total: devices.length,
    active: activeBookings.length,
    available: devices.length - activeBookings.length,
  };

  const activeBookingList = activeBookings.slice(0, 3);

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* HEADER */}
        <div className="dashboard-header">
          <h1>Project Released Dashboard</h1>
          <p>
            One-screen view for commits across active releases, quick access to
            release pages, and real-time lab reservation tracking.
          </p>
        </div>

        {/* STATS */}
        <div className="stats-card top-stats">
          <p>Total Devices</p>
          <h2>{loading ? "..." : stats.total}</h2>
          <small>
            {loading ? "Loading..." : `${stats.active} booked • ${stats.available} available`}
          </small>
        </div>

        {/* MAIN GRID */}
        <div className="dashboard-grid">
          {/* LEFT PANEL */}
          <div className="panel">

            {/* 🔥 NEW: Release Commit View (TOP) */}
            <h3>Release Commit View</h3>
            <p className="card-desc">Quick access to the most recent release commit reports and branch details.</p>
            <div className="release-buttons">
              <button onClick={() => window.open("https://github.com", "_blank")}>View Release Commit</button>
              <button onClick={() => window.open("https://github.com", "_blank")}>View Release Commit</button>
              <button onClick={() => window.open("https://github.com", "_blank")}>View Release Commit</button>
            </div>

            {/* PROJECT ISSUES */}
            <h3 style={{ marginTop: "16px" }}>Project Issues</h3>
            <div
              className="wide-link clickable compact-card"
              onClick={() => window.open("https://jira.atlassian.com", "_blank")}
            >
              <div>
                <b>Open Jira Issues</b>
                <p className="card-desc">Review current issue tickets, bug reports, and release blockers.</p>
              </div>
            </div>

            {/* LIVE BOOKING OVERVIEW */}
            <h3 style={{ marginTop: "16px" }}>Live Booking Overview</h3>
            <div className="wide-link compact-card">
              <div>
                <b>Total Devices</b>
                <p>{loading ? "Loading..." : stats.total}</p>
                <p className="card-desc">Count of all registered lab devices available for reservation.</p>
              </div>
            </div>
            <div className="wide-link compact-card">
              <div>
                <b>Active Reservations</b>
                <p>{loading ? "Loading..." : `${stats.active} device(s)`}</p>
                <p className="card-desc">Number of devices currently reserved in ongoing sessions.</p>
              </div>
            </div>
            <div className="wide-link compact-card">
              <div>
                <b>Available Now</b>
                <p>{loading ? "Loading..." : `${stats.available} device(s)`}</p>
                <p className="card-desc">Devices that are free now and ready for new bookings.</p>
              </div>
            </div>

            {activeBookingList.length > 0 ? (
              <div className="wide-link" style={{ marginTop: "12px" }}>
                <b>Active Reservations</b>
                {activeBookingList.map((booking) => {
                  const deviceName = booking.deviceId?.name || "Unknown";
                  const fromTime = new Date(booking.startTime).toLocaleString();
                  const toTime = new Date(booking.endTime).toLocaleString();
                  return (
                    <div key={booking._id} style={{ marginTop: "10px" }}>
                      <p style={{ margin: 0, fontWeight: 700 }}>{deviceName}</p>
                      <p style={{ margin: "2px 0" }}>{booking.userId}</p>
                      <small>{`${fromTime} → ${toTime}`}</small>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="wide-link compact-card" style={{ marginTop: "12px" }}>
                <b>{loading ? "Loading reservations..." : "No active reservations right now"}</b>
              </div>
            )}

            <h3 style={{ marginTop: "16px" }}>Device Registration</h3>
            <div
              className="wide-link clickable compact-card"
              onClick={() => setPage("booking")}
            >
              <div>
                <b>Go To Device Registration</b>
                <p className="card-desc">Open the device registration page to add new inventory.</p>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="panel">
            <h3>Release Navigation</h3>

            <div
              className="nav-link-card clickable compact-card"
              onClick={() => window.open("https://docs.google.com", "_blank")}
            >
              <div>
                <b>Documentation Link</b>
                <p className="card-desc">Open the release documentation and developer reference notes.</p>
              </div>
            </div>

            <div
              className="nav-link-card clickable compact-card"
              onClick={() => setPage("upcoming")}
            >
              <div>
                <b>Upcoming Rebuild Release</b>
                <p className="card-desc">View details about the next scheduled rebuild and release plan.</p>
              </div>
            </div>

            <div
              className="nav-link-card clickable compact-card"
              onClick={() =>
                window.open(
                  "https://github.com/Swathikala2004/device-booking-system/pulls",
                  "_blank"
                )
              }
            >
              <div>
                <b>Active PR Link</b>
                <p className="card-desc">Jump to the open pull requests for this project release.</p>
              </div>
            </div>

            <div
              className="nav-link-card clickable compact-card"
              onClick={() => setPage("agile")}
            >
              <div>
                <b>Agile Methodology</b>
                <p className="card-desc">Read the agile process guidance used for this release cycle.</p>
              </div>
            </div>

            <div
              className="nav-link-card clickable compact-card"
              onClick={() => setPage("release-notes")}
            >
              <div>
                <b>Release Notes</b>
                <p className="card-desc">Open the latest release notes and change-log summary.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;