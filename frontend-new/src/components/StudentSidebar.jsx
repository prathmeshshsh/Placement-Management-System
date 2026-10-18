import {
  LayoutDashboard,
  User,
  Briefcase,
  FileText,
  Bell,
  CalendarDays,
  Award,
  LogOut,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

function StudentSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");

    navigate("/login");
  };

  const menuItems = [
    {
      path: "/student-dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
    },
    {
      path: "/student/profile",
      icon: <User size={20} />,
      label: "Profile",
    },
    {
      path: "/student/applications",
      icon: <Briefcase size={20} />,
      label: "Applications",
    },
    {
      path: "/student/resume",
      icon: <FileText size={20} />,
      label: "Resume",
    },
    {
      path: "/student/jobs",
      icon: <Award size={20} />,
      label: "Job Opportunities",
    },
    {
      path: "/student/interviews",
      icon: <CalendarDays size={20} />,
      label: "Interviews",
    },
    {
      path: "/student/notifications",
      icon: <Bell size={20} />,
      label: "Notifications",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        🎓 Student Portal
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active-link"
                : "sidebar-link"
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}

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

export default StudentSidebar;