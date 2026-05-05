import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

function DeviceBooking({ setPage }) {
  const [devices, setDevices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [name, setName] = useState("");
  const [gmailId, setGmailId] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");
  const [purpose, setPurpose] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const [deviceRes, bookingRes] = await Promise.all([
        API.get("/devices"),
        API.get("/bookings"),
      ]);
      setDevices(deviceRes.data);
      setBookings(bookingRes.data);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load devices or bookings. Check backend status.");
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const now = useMemo(() => new Date(), [bookings]);

  const activeBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        if (booking.status !== "active") return false;
        const start = new Date(booking.startTime);
        const end = new Date(booking.endTime);
        return start < now && end > now;
      }),
    [bookings, now]
  );

  const getDeviceBooking = (device) =>
    bookings.find((booking) => {
      if (booking.status !== "active") return false;
      if (!booking.deviceId) return false;
      const deviceId = booking.deviceId._id || booking.deviceId;
      if (deviceId !== device._id) return false;
      const start = new Date(booking.startTime);
      const end = new Date(booking.endTime);
      return start < now && end > now;
    });

  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      const booking = getDeviceBooking(device);
      const statusText = booking ? "In Use" : "Available";
      const text = `${device.name || ""} ${device.serialNumber || ""} ${
        device.ipAddress || ""
      } ${statusText} ${booking?.userId || ""}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || statusText.toLowerCase() === statusFilter;
      const matchesUser =
        userFilter === "all" || (booking?.userId || "").toLowerCase() === userFilter;
      return matchesSearch && matchesStatus && matchesUser;
    });
  }, [devices, search, statusFilter, userFilter, bookings, now]);

  const stats = useMemo(() => {
    const total = devices.length;
    const active = activeBookings.length;
    const available = total - active;
    return { total, available, active };
  }, [devices, activeBookings.length]);

  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const bookDevice = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!gmailId || !selectedDevice || !startTime || !endTime) {
      setMessage("Please fill all required booking fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await API.post("/bookings", {
        userId: gmailId,
        deviceId: selectedDevice,
        purpose,
        startTime,
        endTime,
        timezone: "Asia/Kolkata",
      });

      setMessage(response.data.message || "Booking successful");
      setName("");
      setGmailId("");
      setSelectedDevice("");
      setPurpose("");
      setStartTime("");
      setEndTime("");
      await loadData();
    } catch (error) {
      setMessage(
        error.response?.data?.message || error.message || "Unable to book device"
      );
    } finally {
      setLoading(false);
    }
  };

  const releaseBooking = async (bookingId) => {
    try {
      setLoading(true);
      const response = await API.patch(`/bookings/${bookingId}/cancel`);
      setMessage(response.data.message || "Booking released");
      await loadData();
    } catch (error) {
      setMessage(
        error.response?.data?.message || error.message || "Unable to release booking"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page booking-page">
      <div className="dashboard-container booking-container">
        <button className="back-btn" onClick={() => setPage("dashboard")}>
          ← Back to dashboard
        </button>

        <div className="booking-header">
          <h1>Device Registration</h1>
          <p>
            Track usage, reserve devices, and manage active bookings from a single page.
          </p>
        </div>

        <div className="booking-summary-grid">
          <div className="summary-card">
            <span>Total Devices</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="summary-card">
            <span>Available Now</span>
            <strong>{stats.available}</strong>
          </div>
          <div className="summary-card">
            <span>Active Reservations</span>
            <strong>{stats.active}</strong>
          </div>
        </div>

        {message && <div className="booking-message">{message}</div>}

        <div className="booking-controls">
          <div className="filter-group">
            <label>Search</label>
            <input
              type="search"
              placeholder="Search device, user, or purpose"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="in use">In Use</option>
              <option value="available">Available</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Used By</label>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
            >
              <option value="all">All users</option>
              {Array.from(
                new Set(
                  activeBookings.map((booking) => booking.userId).filter(Boolean)
                )
              ).map((user) => (
                <option key={user} value={user.toLowerCase()}>
                  {user}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="device-table-wrap">
          <table className="device-table">
            <thead>
              <tr>
                <th>Device</th>
                <th>CIMC IP</th>
                <th>Mgmt IP</th>
                <th>Status</th>
                <th>Used By</th>
                <th>Purpose</th>
                <th>From Time</th>
                <th>To Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.map((device) => {
                const booking = getDeviceBooking(device);
                const status = booking ? "In Use" : "Available";
                return (
                  <tr key={device._id}>
                    <td>{device.name || device.serialNumber || "Device"}</td>
                    <td>{device.ipAddress || "-"}</td>
                    <td>{device.ipAddress || "-"}</td>
                    <td className={booking ? "status-in-use" : "status-empty"}>
                      {status}
                    </td>
                    <td>{booking?.userId || "-"}</td>
                    <td>{booking?.purpose || "-"}</td>
                    <td>{formatDate(booking?.startTime)}</td>
                    <td>{formatDate(booking?.endTime)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          onClick={() => setSelectedDevice(device._id)}
                        >
                          Reserve
                        </button>
                        {booking && (
                          <button
                            type="button"
                            className="secondary"
                            onClick={() => releaseBooking(booking._id)}
                          >
                            Release Early
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="reserve-device-panel panel">
          <h2>Reserve Device</h2>
          <form className="reserve-form" onSubmit={bookDevice}>
            <div className="form-row">
              <label>Name:</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <label>Gmail ID:</label>
              <input
                type="email"
                placeholder="Enter your Gmail address"
                value={gmailId}
                onChange={(e) => setGmailId(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <label>Device:</label>
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                required
              >
                <option value="">Select a device</option>
                {devices.map((device) => (
                  <option key={device._id} value={device._id}>
                    {device.name} ({device.ipAddress})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label>Purpose:</label>
              <input
                type="text"
                placeholder="Enter purpose (e.g. Testing / Development)"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Start Time:</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <label>End Time:</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>

            <button className="reserve-submit" type="submit" disabled={loading}>
              {loading ? "Booking…" : "Reserve Device"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DeviceBooking;