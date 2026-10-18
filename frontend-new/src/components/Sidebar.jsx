import { NavLink, useNavigate } from "react-router-dom";
import {
  House,
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  BarChart3,
  LogOut,
} from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");

    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        PMS
      </div>

      <nav>
        {/* ADMIN SIDEBAR */}

        {role === "Admin" && (
          <>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => isActive ? "sidebar-link active-link" : "sidebar-link"}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/students"
              className={({ isActive }) => isActive ? "sidebar-link active-link" : "sidebar-link"}
            >
              <Users size={20} />
              <span>Students</span>
            </NavLink>

            <NavLink
              to="/companies"
              className={({ isActive }) => isActive ? "sidebar-link active-link" : "sidebar-link"}
            >
              <Building2 size={20} />
              <span>Companies</span>
            </NavLink>

            <NavLink
              to="/placements"
              className={({ isActive }) => isActive ? "sidebar-link active-link" : "sidebar-link"}
            >
              <Briefcase size={20} />
              <span>Placements</span>
            </NavLink>

            <NavLink
              to="/analytics"
              className={({ isActive }) => isActive ? "sidebar-link active-link" : "sidebar-link"}
            >
              <BarChart3 size={20} />
              <span>Analytics</span>
            </NavLink>
          </>
        )}

        {/* STUDENT SIDEBAR */}

        {role === "Student" && (
          <>
            <NavLink
              to="/student-dashboard"
              className={({ isActive }) => isActive ? "sidebar-link active-link" : "sidebar-link"}
            >
              <House size={20} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/student/profile"
              className={({ isActive }) => isActive ? "sidebar-link active-link" : "sidebar-link"}
            >
              <Users size={20} />
              <span>Profile</span>
            </NavLink>

            <NavLink
              to="/student/jobs"
              className={({ isActive }) => isActive ? "sidebar-link active-link" : "sidebar-link"}
            >
              <Building2 size={20} />
              <span>Jobs</span>
            </NavLink>

            <NavLink
              to="/student/applications"
              className={({ isActive }) => isActive ? "sidebar-link active-link" : "sidebar-link"}
            >
              <Briefcase size={20} />
              <span>Applications</span>
            </NavLink>

            <NavLink
              to="/student/interviews"
              className={({ isActive }) => isActive ? "sidebar-link active-link" : "sidebar-link"}
            >
              <LayoutDashboard size={20} />
              <span>Interviews</span>
            </NavLink>

            <NavLink
              to="/student/resume"
              className={({ isActive }) => isActive ? "sidebar-link active-link" : "sidebar-link"}
            >
              <BarChart3 size={20} />
              <span>Resume</span>
            </NavLink>

            <NavLink
              to="/student/notifications"
              className={({ isActive }) => isActive ? "sidebar-link active-link" : "sidebar-link"}
            >
              <House size={20} />
              <span>Notifications</span>
            </NavLink>
          </>
        )}

        <button
          className="sidebar-link logout-btn"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;