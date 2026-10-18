import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./DashboardLayoutFix.css";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

import { getDashboardData } from "../services/dashboardService";

function Dashboard() {
  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await getDashboardData();
        setData(response);
      } catch (error) {
        console.error(error);
      }
    };

    loadDashboard();
  }, []);

  if (!data) {
    return (
      <div className="dashboard-layout dashboard-layout-fix">
        <Sidebar />

        <main className="dashboard-content">
          <h2>Loading Dashboard...</h2>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout dashboard-layout-fix">
      <Sidebar />

      <main className="dashboard-content">

        {/* HEADER */}

        <div className="dashboard-header">
          <div>
            <h1>Placement Dashboard</h1>

            <p
              style={{
                color: "#808080",
                marginTop: "8px",
              }}
            >
              Monitor placements, companies, students and hiring trends.
            </p>
          </div>

          <input
            type="text"
            className="dashboard-search"
            placeholder="Search students, companies, drives..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* HERO */}

        <div className="glass-panel">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <div>
              <h2
                style={{
                  marginBottom: "10px",
                }}
              >
                Welcome Back, Placement Officer
              </h2>

              <p
                style={{
                  color: "#808080",
                }}
              >
                Manage placement activities, student records and recruitment drives from one dashboard.
              </p>
            </div>

            <button
              className="dashboard-action"
              onClick={() =>
                navigate("/placements")
              }
            >
              Create Drive
            </button>
          </div>
        </div>

        {/* MAIN STATS */}

        <div className="dashboard-stats">

          <div className="dashboard-card">
            <h3>Total Students</h3>
            <span>
              {data.dashboardStats.students}
            </span>
          </div>

          <div className="dashboard-card">
            <h3>Companies</h3>
            <span>
              {data.dashboardStats.companies}
            </span>
          </div>

          <div className="dashboard-card">
            <h3>Placements</h3>
            <span>
              {data.dashboardStats.placements}
            </span>
          </div>

          <div className="dashboard-card">
            <h3>Applications</h3>
            <span>
              {data.dashboardStats.applications}
            </span>
          </div>

        </div>

        {/* KPI */}

        <div className="kpi-grid">

          <div className="kpi-card">
            <h4>Placement Rate</h4>
            <span>
              {data.dashboardKPIs.placementRate}%
            </span>

            <div
              style={{
                height: "8px",
                background: "#111111",
                borderRadius: "999px",
                marginTop: "12px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${data.dashboardKPIs.placementRate}%`,
                  height: "100%",
                  background:
                    "linear-gradient(90deg,#3b82f6,#60a5fa)",
                }}
              />
            </div>
          </div>

          <div className="kpi-card">
            <h4>Average Package</h4>
            <span>
              ₹{data.dashboardKPIs.avgPackage} LPA
            </span>
          </div>

          <div className="kpi-card">
            <h4>Highest Package</h4>
            <span>
              ₹{data.dashboardKPIs.highestPackage} LPA
            </span>
          </div>

          <div className="kpi-card">
            <h4>Recruiters</h4>
            <span>
              {data.dashboardKPIs.recruiters}
            </span>
          </div>

        </div>

        {/* QUICK ACTIONS */}

        <div className="glass-panel">
          <h2
            style={{
              marginBottom: "20px",
            }}
          >
            Quick Actions
          </h2>

          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <button
              className="dashboard-action"
              onClick={() =>
                navigate("/students")
              }
            >
              Manage Students
            </button>

            <button
              className="dashboard-action"
              onClick={() =>
                navigate("/companies")
              }
            >
              Manage Companies
            </button>

            <button
              className="dashboard-action"
              onClick={() =>
                navigate("/placements")
              }
            >
              Placement Drives
            </button>

            <button
              className="dashboard-action"
              onClick={() =>
                navigate("/analytics")
              }
            >
              View Analytics
            </button>
          </div>
        </div>

        {/* CHARTS */}

        <div className="dashboard-grid">

          <div className="glass-panel">
            <h2
              style={{
                marginBottom: "20px",
              }}
            >
              Placement Trends
            </h2>

            <ResponsiveContainer
              width="100%"
              height={320}
            >
              <LineChart
                data={data.placementTrendData}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="placements"
                  stroke="#38bdf8"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-panel">
            <h2
              style={{
                marginBottom: "20px",
              }}
            >
              Company Hiring
            </h2>

            <ResponsiveContainer
              width="100%"
              height={320}
            >
              <BarChart
                data={data.companyHiringData}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="company" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="hires"
                  fill="#8b5cf6"
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* RECENT ACTIVITY + EVENTS */}

        <div className="dashboard-bottom">

          <div className="glass-panel">
            <h2
              style={{
                marginBottom: "20px",
              }}
            >
              Recent Activity
            </h2>

            {data.recentActivities.map(
              (item, index) => (
                <div
                  key={index}
                  className="activity-item"
                >
                  <span className="activity-dot"></span>

                  <div>
                    <p>{item.title}</p>
                    <small>{item.time}</small>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="glass-panel">
            <h2
              style={{
                marginBottom: "20px",
              }}
            >
              Upcoming Events
            </h2>

            {data.upcomingEvents.map(
              (item, index) => (
                <div
                  key={index}
                  className="activity-item"
                >
                  <span className="activity-dot"></span>

                  <div>
                    <p>{item.title}</p>
                    <small>{item.time}</small>
                  </div>
                </div>
              )
            )}
          </div>

        </div>

        {/* SUMMARY */}

        <div
          className="glass-panel"
          style={{
            marginTop: "24px",
          }}
        >
          <h2
            style={{
              marginBottom: "20px",
            }}
          >
            Placement Summary
          </h2>

          <div className="profile-grid">

            <div className="info-box">
              <span>Total Recruiters</span>
              <h3>
                {data.dashboardKPIs.recruiters}
              </h3>
            </div>

            <div className="info-box">
              <span>Highest Package</span>
              <h3>
                ₹
                {
                  data.dashboardKPIs
                    .highestPackage
                }
                {" "}LPA
              </h3>
            </div>

            <div className="info-box">
              <span>Average Package</span>
              <h3>
                ₹
                {
                  data.dashboardKPIs
                    .avgPackage
                }
                {" "}LPA
              </h3>
            </div>

            <div className="info-box">
              <span>Placement Rate</span>
              <h3>
                {
                  data.dashboardKPIs
                    .placementRate
                }
                %
              </h3>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}

export default Dashboard;