import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getAnalytics } from "../services/analyticsService";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
];

function Analytics() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!analytics) {
    return (
      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-content">
          <h2>Loading Analytics...</h2>
        </main>
      </div>
    );
  }

  const branchStats = analytics.branchStats || [];
  const packageDistribution =
    analytics.packageDistribution || [];
  const placementTrend =
    analytics.placementTrend || [];
  const statusStats =
    analytics.statusStats || [];
  const topRecruiters =
    analytics.topRecruiters || [];

  const selectedCount =
    statusStats.find(
      (s) => s.name === "Selected"
    )?.value || 0;

  const interviewCount =
    statusStats.find(
      (s) => s.name === "Interview"
    )?.value || 0;

  const rejectedCount =
    statusStats.find(
      (s) => s.name === "Rejected"
    )?.value || 0;

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">

        <div className="dashboard-header">
          <div>
            <h1>Analytics Dashboard</h1>

            <p
              style={{
                color: "#808080",
                marginTop: "6px",
              }}
            >
              Placement insights, package trends,
              recruiter activity and student outcomes.
            </p>
          </div>
        </div>

        {/* KPI CARDS */}

        <div className="kpi-grid">

          <div className="kpi-card">
            <h4>Total Students</h4>
            <span>{analytics.totalStudents || 0}</span>
          </div>

          <div className="kpi-card">
            <h4>Placed Students</h4>
            <span>{analytics.placedStudents || 0}</span>
          </div>

          <div className="kpi-card">
            <h4>Placement Rate</h4>
            <span>{analytics.placementRate || 0}%</span>
          </div>

          <div className="kpi-card">
            <h4>Highest Package</h4>
            <span>{analytics.highestPackage || 0} LPA</span>
          </div>

          <div className="kpi-card">
            <h4>Average Package</h4>
            <span>{analytics.averagePackage || 0} LPA</span>
          </div>

          <div className="kpi-card">
            <h4>Selected</h4>
            <span>{selectedCount}</span>
          </div>

          <div className="kpi-card">
            <h4>Interview Stage</h4>
            <span>{interviewCount}</span>
          </div>

          <div className="kpi-card">
            <h4>Rejected</h4>
            <span>{rejectedCount}</span>
          </div>

        </div>

        {/* BRANCH WISE PLACEMENTS */}

        <div className="glass-panel">
          <h2 style={{ marginBottom: "20px" }}>
            Branch Wise Placements
          </h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <BarChart data={branchStats}>
              <XAxis dataKey="branch" />
              <YAxis />
              <Tooltip />

              <Bar
                dataKey="placed"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PACKAGE DISTRIBUTION */}

        <div
          className="glass-panel"
          style={{ marginTop: "24px" }}
        >
          <h2 style={{ marginBottom: "20px" }}>
            Package Distribution
          </h2>

          <ResponsiveContainer
            width="100%"
            height={450}
          >
            <PieChart>
              <Pie
                data={packageDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label
              >
                {packageDistribution.map(
                  (_, index) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                          COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* PLACEMENT TREND */}

        <div
          className="glass-panel"
          style={{ marginTop: "24px" }}
        >
          <h2 style={{ marginBottom: "20px" }}>
            Placement Trend
          </h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <LineChart
              data={placementTrend}
            >
              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Line
                type="monotone"
                dataKey="placements"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* TOP RECRUITERS */}

        <div
          className="glass-panel"
          style={{ marginTop: "24px" }}
        >
          <h2 style={{ marginBottom: "20px" }}>
            Top Recruiting Companies
          </h2>

          <table className="student-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Company</th>
                <th>Hires</th>
              </tr>
            </thead>

            <tbody>
              {topRecruiters.length > 0 ? (
                topRecruiters.map(
                  (
                    company,
                    index
                  ) => (
                    <tr
                      key={
                        company.company
                      }
                    >
                      <td>
                        #{index + 1}
                      </td>

                      <td>
                        {
                          company.company
                        }
                      </td>

                      <td>
                        {
                          company.hires
                        }
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    style={{
                      textAlign:
                        "center",
                    }}
                  >
                    No recruiter data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}

export default Analytics;