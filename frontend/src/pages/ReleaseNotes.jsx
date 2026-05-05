function ReleaseNotes({ setPage }) {
  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <button className="back-btn" onClick={() => setPage("dashboard")}>
          ← Back to Dashboard
        </button>

        <div className="dashboard-header">
          <h1>Release Notes</h1>
          <p>Version-wise updates for the Device Booking System.</p>
          <span>Mode: Release Tracking</span>
        </div>

        <div className="panel release-plan">
          <div className="nav-link-card">
            <b>Version 1.0</b>
            <p>Login UI, dashboard UI, and basic navigation added.</p>
          </div>

          <div className="nav-link-card">
            <b>Version 1.1</b>
            <p>Backend setup with Node.js, Express.js, MongoDB, device APIs.</p>
          </div>

          <div className="nav-link-card">
            <b>Version 1.2</b>
            <p>Device booking API, conflict validation, and max 2 devices rule added.</p>
          </div>

          <div className="nav-link-card">
            <b>Version 1.3</b>
            <p>
              Agile page, release notes page, upcoming rebuild release page, and
              useful links added.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReleaseNotes;