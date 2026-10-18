import { useState } from "react";
import Sidebar from "../components/Sidebar";

function Companies() {
  const [companies] = useState([
    {
      id: 1,
      name: "Google",
      role: "Software Engineer",
      package: "35 LPA",
      location: "Bangalore",
      openings: 25,
      status: "Active",
    },
    {
      id: 2,
      name: "Microsoft",
      role: "SDE",
      package: "28 LPA",
      location: "Hyderabad",
      openings: 20,
      status: "Active",
    },
    {
      id: 3,
      name: "Amazon",
      role: "Cloud Engineer",
      package: "24 LPA",
      location: "Chennai",
      openings: 18,
      status: "Active",
    },
    {
      id: 4,
      name: "TCS",
      role: "Graduate Trainee",
      package: "7 LPA",
      location: "Mumbai",
      openings: 100,
      status: "Closed",
    },
  ]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const filteredCompanies =
    companies.filter((company) => {
      const matchesSearch =
        company.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        company.location
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All"
          ? true
          : company.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  const activeCompanies =
    companies.filter(
      (c) => c.status === "Active"
    ).length;

  const totalOpenings =
    companies.reduce(
      (sum, c) => sum + c.openings,
      0
    );

  const highestPackage =
    Math.max(
      ...companies.map((c) =>
        parseInt(c.package)
      )
    ) + " LPA";

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">

        {/* Header */}

        <div className="dashboard-header">
          <div>
            <h1>Companies</h1>

            <p
              style={{
                color: "#808080",
              }}
            >
              Manage recruiting
              companies and placement
              drives.
            </p>
          </div>

          <button className="dashboard-action">
            Add Company
          </button>
        </div>

        {/* KPI Cards */}

        <div className="kpi-grid">
          <div className="kpi-card">
            <h4>Total Companies</h4>
            <span>
              {companies.length}
            </span>
          </div>

          <div className="kpi-card">
            <h4>Active Drives</h4>
            <span>
              {activeCompanies}
            </span>
          </div>

          <div className="kpi-card">
            <h4>Total Openings</h4>
            <span>
              {totalOpenings}
            </span>
          </div>

          <div className="kpi-card">
            <h4>Highest Package</h4>
            <span>
              {highestPackage}
            </span>
          </div>
        </div>

        {/* Top Recruiters */}

        <div className="glass-panel">
          <h3
            style={{
              marginBottom: "15px",
            }}
          >
            🏆 Top Recruiters
          </h3>

          {companies
            .slice(0, 4)
            .map((company) => (
              <div
                key={company.id}
                className="top-student"
              >
                <strong>
                  {company.name}
                </strong>

                <span>
                  {company.package}
                </span>
              </div>
            ))}
        </div>

        {/* Filters */}

        <div className="glass-panel">
          <div className="student-filters">

            <input
              type="text"
              placeholder="Search Company or Location"
              className="dashboard-search"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >
              <option value="All">
                All
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Closed">
                Closed
              </option>
            </select>
          </div>

          <p
            style={{
              marginBottom: "20px",
              color: "#808080",
            }}
          >
            Showing{" "}
            {filteredCompanies.length} Companies
          </p>

          <table className="student-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Package</th>
                <th>Location</th>
                <th>Openings</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCompanies.length ===
              0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign:
                        "center",
                      padding:
                        "30px",
                    }}
                  >
                    No Companies Found
                  </td>
                </tr>
              ) : (
                filteredCompanies.map(
                  (company) => (
                    <tr
                      key={company.id}
                    >
                      <td>
                        {company.name}
                      </td>

                      <td>
                        {company.role}
                      </td>

                      <td>
                        {
                          company.package
                        }
                      </td>

                      <td>
                        {
                          company.location
                        }
                      </td>

                      <td>
                        {
                          company.openings
                        }
                      </td>

                      <td>
                        <span
                          className={`status-badge ${company.status.toLowerCase()}`}
                        >
                          {
                            company.status
                          }
                        </span>
                      </td>

                      <td>
                        <button className="table-btn">
                          View
                        </button>

                        <button className="table-btn edit-btn">
                          Edit
                        </button>

                        <button className="table-btn delete-btn">
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}

export default Companies;