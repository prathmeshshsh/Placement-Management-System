import { useEffect, useState } from "react";
import api from "../services/api";
import StudentSidebar from "../components/StudentSidebar";

function StudentApplications() {
  const [applications, setApplications] = useState([]);
  const [loadError, setLoadError] = useState("");
  useEffect(() => { Promise.all([api.get("/applications/my"),api.get("/placements"),api.get("/companies")]).then(([a,j,c]) => setApplications(a.data.map(x=>{const job=j.data.find(y=>y.id===x.job_posting_id);const company=c.data.find(y=>y.id===job?.company_id);return {id:x.id,company:company?.display_name||company?.legal_name||"Company unavailable",role:job?.title||"Job unavailable",package:job?.package_lpa??"Not specified",status:x.current_status,appliedDate:x.applied_at?.slice(0,10)||""}}))).catch(e=>setLoadError(e.response?.data?.detail || "Unable to load applications.")); }, []);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const filteredApplications =
    applications.filter((app) => {
      const matchesSearch =
        app.company
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        app.role
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      const matchesStatus =
        statusFilter === "All"
          ? true
          : app.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  const appliedCount = applications.filter((app) => app.status === "APPLIED").length;

  const shortlistedCount =
    applications.filter(
      (app) =>
        app.status === "SHORTLISTED"
    ).length;

  const interviewCount =
    applications.filter(
      (app) => app.status === "UNDER_REVIEW"
    ).length;

  const selectedCount =
    applications.filter(
      (app) => app.status === "SELECTED"
    ).length;

  const rejectedCount =
    applications.filter(
      (app) => app.status === "REJECTED"
    ).length;

  return (
    <div className="dashboard-layout">
      <StudentSidebar />

      <main className="dashboard-content">
        <h1 className="page-title">
          My Applications
        </h1>

        {/* Statistics */}

        <div className="kpi-grid">
          <div className="kpi-card">
            <h4>Applied</h4>
            <span>{appliedCount}</span>
          </div>

          <div className="kpi-card">
            <h4>Shortlisted</h4>
            <span>
              {shortlistedCount}
            </span>
          </div>

          <div className="kpi-card">
            <h4>Interview</h4>
            <span>{interviewCount}</span>
          </div>

          <div className="kpi-card">
            <h4>Selected</h4>
            <span>{selectedCount}</span>
          </div>

          <div className="kpi-card">
            <h4>Rejected</h4>
            <span>{rejectedCount}</span>
          </div>
        </div>

        {/* Search + Filter */}

        <div
          className="glass-panel"
          style={{
            marginBottom: "24px",
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Search company or role..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
            style={{
              flex: 1,
              minWidth: "250px",
              height: "48px",
              padding: "0 16px",
              borderRadius: "12px",
              border:
                "1px solid #222222",
              background: "#000000",
              color: "#fff",
              boxSizing: "border-box",
            }}
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            style={{
              width: "170px",
              height: "48px",
              padding: "0 40px 0 16px",
              borderRadius: "12px",
              border:
                "1px solid #222222",
              background: "#000000",
              color: "#fff",
              fontSize: "15px",
              cursor: "pointer",
              boxSizing: "border-box",
              appearance: "none",
              WebkitAppearance:
                "none",
              MozAppearance:
                "none",

              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' viewBox='0 0 16 16'%3E%3Cpath d='M4 6l4 4 4-4' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E\")",

              backgroundRepeat:
                "no-repeat",

              backgroundPosition:
                "right 16px center",

              backgroundSize: "14px",
            }}
          >
            <option value="All">
              All Status
            </option>

            <option value="APPLIED">
              Applied
            </option>

            <option value="SHORTLISTED">
              Shortlisted
            </option>

            <option value="UNDER_REVIEW">
              Interview
            </option>

            <option value="SELECTED">
              Selected
            </option>

            <option value="REJECTED">
              Rejected
            </option>
          </select>
        </div>

        {/* Applications Table */}

        <div className="glass-panel">
          {filteredApplications.length >
          0 ? (
            <table className="student-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Package</th>
                  <th>Applied Date</th>
                  <th>Interview Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredApplications.map(
                  (
                    app,
                    index
                  ) => (
                    <tr
                      key={
                        app.id ||
                        index
                      }
                    >
                      <td>
                        {app.company}
                      </td>

                      <td>
                        {app.role}
                      </td>

                      <td>
                        {app.package}
                      </td>

                      <td>
                        {app.appliedDate ||
                          "-"}
                      </td>

                      <td>
                        {app.interviewDate ||
                          "-"}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${(
                            app.status ||
                            ""
                          ).toLowerCase()}`}
                        >
                          {
                            app.status
                          }
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          ) : (
            <div
              style={{
                padding: "60px",
                textAlign:
                  "center",
              }}
            >
              <h3>
                No Applications
                Found
              </h3>

              <p
                style={{
                  color:
                    "#808080",
                  marginTop:
                    "10px",
                }}
              >
                Try adjusting your
                search or apply for
                jobs first.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default StudentApplications;