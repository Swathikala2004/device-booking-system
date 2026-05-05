import { useState } from "react";

function Agile({ setPage }) {
  const [modal, setModal] = useState({
    show: false,
    title: "",
    content: "",
  });

  const openModal = (title, content) => {
    setModal({ show: true, title, content });
  };

  const closeModal = () => {
    setModal({ show: false, title: "", content: "" });
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        
        {/* BACK BUTTON */}
        <button className="back-btn" onClick={() => setPage("dashboard")}>
          ← Back to Dashboard
        </button>

        {/* HEADER */}
        <div className="dashboard-header">
          <h1>Agile Methodology</h1>
          <p>
            This project follows Agile methodology to develop features in
            structured sprints.
          </p>
          <span>Mode: Agile Process</span>
        </div>

        <div className="dashboard-grid">
          
          {/* LEFT PANEL */}
          <div className="panel">
            <h3>Sprint Planning</h3>

            <div
              className="nav-link-card clickable"
              onClick={() =>
                openModal(
                  "Sprint 1",
                  "Implemented Login Page and Dashboard UI."
                )
              }
            >
              <b>Sprint 1</b>
              <p>Login page and dashboard UI implementation.</p>
            </div>

            <div
              className="nav-link-card clickable"
              onClick={() =>
                openModal(
                  "Sprint 2",
                  "Developed Backend APIs and connected MongoDB database."
                )
              }
            >
              <b>Sprint 2</b>
              <p>Backend APIs for devices and MongoDB connection.</p>
            </div>

            <div
              className="nav-link-card clickable"
              onClick={() =>
                openModal(
                  "Sprint 3",
                  "Implemented device booking logic with conflict checking and max 2 devices rule."
                )
              }
            >
              <b>Sprint 3</b>
              <p>
                Device booking logic, conflict checking, and max 2 devices rule.
              </p>
            </div>

            <div
              className="nav-link-card clickable"
              onClick={() =>
                openModal(
                  "Sprint 4",
                  "Added timezone handling, testing strategy, and release notes."
                )
              }
            >
              <b>Sprint 4</b>
              <p>Timezone handling, testing, and release notes.</p>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="panel">
            <h3>Testing Strategy</h3>

            <div
              className="nav-link-card clickable"
              onClick={() =>
                openModal(
                  "Sanity Testing",
                  "Quick verification of login, dashboard, and booking flow."
                )
              }
            >
              <b>Sanity Testing</b>
              <p>
                Verify login, dashboard loading, device list, and booking flow.
              </p>
            </div>

            <div
              className="nav-link-card clickable"
              onClick={() =>
                openModal(
                  "Regression Testing",
                  "Ensure old features work correctly after updates."
                )
              }
            >
              <b>Regression Testing</b>
              <p>
                Ensure existing features work after adding new features or fixes.
              </p>
            </div>

            <div
              className="nav-link-card clickable"
              onClick={() =>
                openModal(
                  "Night Runs",
                  "Automated testing during night to validate system stability."
                )
              }
            >
              <b>Nightly Runs</b>
              <p>
                Automated test execution during night to validate APIs and booking.
              </p>
            </div>

            <div
              className="nav-link-card clickable"
              onClick={() =>
                openModal(
                  "Daily Standup",
                  "Daily team meeting to track progress and blockers."
                )
              }
            >
              <b>Daily Standup</b>
              <p>
                Track completed tasks, progress, blockers, and next actions.
              </p>
            </div>

            <div
              className="nav-link-card clickable"
              onClick={() =>
                openModal(
                  "Sprint Review",
                  "Demo completed features and collect feedback."
                )
              }
            >
              <b>Sprint Review</b>
              <p>
                At the end of each sprint, features are demonstrated and feedback is collected.
              </p>
            </div>

            <div
              className="nav-link-card clickable"
              onClick={() =>
                openModal(
                  "Sprint Retrospective",
                  "Team discusses improvements for next sprint."
                )
              }
            >
              <b>Sprint Retrospective</b>
              <p>
                Discuss what went well and improvements for next sprint.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {modal.show && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>{modal.title}</h2>
            <p>{modal.content}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Agile;