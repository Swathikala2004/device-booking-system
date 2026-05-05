import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DeviceBooking from "./pages/DeviceBooking";
import UpcomingRelease from "./pages/UpcomingRelease";
import Agile from "./pages/Agile";
import ReleaseNotes from "./pages/ReleaseNotes";
import "./App.css";

function App() {
  const [page, setPage] = useState("login");

  if (page === "dashboard") return <Dashboard setPage={setPage} />;
  if (page === "booking") return <DeviceBooking setPage={setPage} />;
  if (page === "upcoming") return <UpcomingRelease setPage={setPage} />;
  if (page === "agile") return <Agile setPage={setPage} />;
  if (page === "release-notes") return <ReleaseNotes setPage={setPage} />;

  return <Login onLogin={() => setPage("dashboard")} />;
}

export default App;