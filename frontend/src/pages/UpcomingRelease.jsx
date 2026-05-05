function UpcomingRelease({ setPage }) {
  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <button className="back-btn" onClick={() => setPage("dashboard")}>
          ← Back to Dashboard
        </button>

        <div className="dashboard-header">
          <h1>Upcoming Rebuild Release</h1>
          <p>Track upcoming release rebuilds and planning windows.</p>
          <span>Mode: Release Planning</span>
        </div>

        <div className="panel release-plan">
          <h3>Upcoming Release Details</h3>

          <div className="nav-link-card">
            <b>Release Version</b>
            <p>26.2.0 Rebuild Release</p>
          </div>

          <div className="nav-link-card">
            <b>Expected Date</b>
            <p>May 2026</p>
          </div>

          <div className="nav-link-card">
            <b>Status</b>
            <p>Planning in progress</p>
          </div>

          <div className="nav-link-card">
            <b>Testing Required</b>
            <p>Sanity testing, regression testing, and nightly runs.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpcomingRelease;