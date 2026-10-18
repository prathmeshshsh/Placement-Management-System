import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";

/* ADMIN */
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Companies from "./pages/Companies";
import Placements from "./pages/Placements";
import Analytics from "./pages/Analytics";

/* STUDENT */
import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";
import EditStudentProfile from "./pages/EditStudentProfile";
import StudentApplications from "./pages/StudentApplications";
import StudentResume from "./pages/StudentResume";
import StudentJobs from "./pages/StudentJobs";
import StudentInterviews from "./pages/StudentInterviews";
import StudentNotifications from "./pages/StudentNotifications";

/* COMPANY */
import CompanyDashboard from "./pages/CompanyDashboard";
import CompanyStudents from "./pages/CompanyStudents";
import CompanyDrives from "./pages/CompanyDrives";
import CompanyInterviews from "./pages/CompanyInterviews";
import CompanyMessages from "./pages/CompanyMessages";
import CompanyNotifications from "./pages/CompanyNotifications";
import CompanyProfile from "./pages/CompanyProfile";
import CompanyApplications from "./pages/CompanyApplications";
import CompanyStudentProfile from "./pages/CompanyStudentProfile";

import ProtectedRoute from "./components/ProtectedRoute";
import BrandLoader from "./components/BrandLoader";
import ScrollMotion from "./components/ScrollMotion";
import { Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <BrandLoader />
      <ScrollMotion />
      <Routes>

        {/* PUBLIC */}

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* ADMIN */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="Admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/students"
          element={
            <ProtectedRoute allowedRole="Admin">
              <Students />
            </ProtectedRoute>
          }
        />

        <Route
          path="/companies"
          element={
            <ProtectedRoute allowedRole="Admin">
              <Companies />
            </ProtectedRoute>
          }
        />

        <Route
          path="/placements"
          element={
            <ProtectedRoute allowedRole="Admin">
              <Placements />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute allowedRole="Admin">
              <Analytics />
            </ProtectedRoute>
          }
        />

        {/* STUDENT */}

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRole="Student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRole="Student">
              <StudentProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/edit-profile"
          element={
            <ProtectedRoute allowedRole="Student">
              <EditStudentProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/applications"
          element={
            <ProtectedRoute allowedRole="Student">
              <StudentApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/resume"
          element={
            <ProtectedRoute allowedRole="Student">
              <StudentResume />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/jobs"
          element={
            <ProtectedRoute allowedRole="Student">
              <StudentJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/interviews"
          element={
            <ProtectedRoute allowedRole="Student">
              <StudentInterviews />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/notifications"
          element={
            <ProtectedRoute allowedRole="Student">
              <StudentNotifications />
            </ProtectedRoute>
          }
        />

        {/* COMPANY */}

        <Route
          path="/company-dashboard"
          element={
            <ProtectedRoute allowedRole="Company">
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company-students"
          element={
            <ProtectedRoute allowedRole="Company">
              <CompanyStudents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company-student/:id"
          element={
            <ProtectedRoute allowedRole="Company">
              <CompanyStudentProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company/student/:id"
          element={
            <ProtectedRoute allowedRole="Company">
              <CompanyStudentProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company-drives"
          element={
            <ProtectedRoute allowedRole="Company">
              <CompanyDrives />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company-interviews"
          element={
            <ProtectedRoute allowedRole="Company">
              <CompanyInterviews />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company-applications"
          element={
            <ProtectedRoute allowedRole="Company">
              <CompanyApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company-messages"
          element={
            <ProtectedRoute allowedRole="Company">
              <CompanyMessages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company-notifications"
          element={
            <ProtectedRoute allowedRole="Company">
              <CompanyNotifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company-profile"
          element={
            <ProtectedRoute allowedRole="Company">
              <CompanyProfile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={
          <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, textAlign: "center", background: "#f5f5f5" }}>
            <div><p style={{ fontSize: 14, letterSpacing: 4 }}>ERROR 404</p><h1 style={{ fontSize: "clamp(48px, 9vw, 96px)", margin: "8px 0" }}>Page not found</h1><p style={{ color: "#666", marginBottom: 24 }}>This page does not exist or may have moved.</p><Link to="/" style={{ display: "inline-block", padding: "12px 20px", borderRadius: 10, background: "#111", color: "white", textDecoration: "none" }}>Back to home</Link></div>
          </main>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;