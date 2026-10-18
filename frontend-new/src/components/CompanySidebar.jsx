import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CalendarCheck,
  MessageSquare,
  Bell,
  Building2,
  FileText,
  LogOut,
} from "lucide-react";

function CompanySidebar() {
  const navigate = useNavigate();

  const logout = () => {
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

        <NavLink
          to="/company-dashboard"
          className={({ isActive }) => isActive ? "sidebar-link active-link" : "sidebar-link"}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/company-students"
          className={({ isActive }) => isActive ? "sidebar-link active-link" : "sidebar-link"}
        >
          <Users size={20} />
          <span>Students</span>
        </NavLink>

        <NavLink
          to="/company-applications"
          className={({ isActive }) => isActive ? "sidebar-link active-link" : "sidebar-link"}
        >
          <FileText size={20} />
          <span>Applications</span>
        </NavLink>

        <NavLink
          to="/company-drives"
          className={({ isActive }) => isActive ? "sidebar-link active-link" : "sidebar-link"}
        >
          <Briefcase size={20} />
          <span>Drives</span>
        </NavLink>

        <NavLink
          to="/company-interviews"
          className={({ isActive }) => isActive ? "sidebar-link active-link" : "sidebar-link"}
        >
          <CalendarCheck size={20} />
          <span>Interviews</span>
        </NavLink>

        <NavLink
          to="/company-messages"
          className={({ isActive }) => isActive ? "sidebar-link active-link" : "sidebar-link"}
        >
          <MessageSquare size={20} />
          <span>Messages</span>
        </NavLink>

        <NavLink
          to="/company-notifications"
          className={({ isActive }) => isActive ? "sidebar-link active-link" : "sidebar-link"}
        >
          <Bell size={20} />
          <span>Notifications</span>
        </NavLink>

        <NavLink
          to="/company-profile"
          className={({ isActive }) => isActive ? "sidebar-link active-link" : "sidebar-link"}
        >
          <Building2 size={20} />
          <span>Company Profile</span>
        </NavLink>

        <button
          onClick={logout}
          className="sidebar-link logout-btn"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>

      </nav>
    </aside>
  );
}

export default CompanySidebar;