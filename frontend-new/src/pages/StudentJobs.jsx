import { useEffect, useState } from "react";
import api from "../services/api";
import StudentSidebar from "../components/StudentSidebar";

function StudentJobs() {
  const [jobs, setJobs] = useState([]);
  const [loadError, setLoadError] = useState("");
  useEffect(() => { api.get("/placements").then(({data}) => api.get("/companies").then(({data:companies}) => setJobs(data.filter(j=>["OPEN","PUBLISHED"].includes(j.status)).map(j=>({id:j.id,company:companies.find(c=>c.id===j.company_id)?.display_name || "Company",role:j.title,package:j.package_lpa || 0,type:"Full-time",location:"See job details",deadline:j.application_deadline}))))).catch(e=>setLoadError(e.response?.data?.detail || "Unable to load jobs. Check that the backend and database are running.")); }, []);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [filterType, setFilterType] =
    useState("All");

  const handleApply = async (job) => {
    try {
      await api.post("/applications/apply", { job_posting_id: job.id });
      alert(`Successfully applied to ${job.company}`);
    } catch (error) {
      alert(error.response?.data?.detail || error.message || "Could not submit application");
    }
  };

  const filteredJobs = jobs.filter(
    (job) => {
      const matchesSearch =
        job.company
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        job.role
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      const matchesType =
        filterType === "All"
          ? true
          : job.type === filterType;

      return (
        matchesSearch && matchesType
      );
    }
  );

  return (
    <div className="dashboard-layout">
      <StudentSidebar />

      <main className="dashboard-content">
        {loadError && <p role="alert" style={{color:"#b91c1c",marginBottom:16}}>{loadError}</p>}
        <div
          style={{
            marginBottom: "30px",
          }}
        >
          <h1 className="page-title">
            Job Opportunities
          </h1>

          <p
            style={{
              color: "#808080",
              marginTop: "8px",
            }}
          >
            Explore available placement
            opportunities
          </p>
        </div>

        {/* Search + Filter */}

<div
  style={{
    display: "grid",
    gap: "16px",
    flex: 1,
  }}
>
  <input
    type="text"
    placeholder="Search company or role..."
    value={searchTerm}
    onChange={(e) =>
      setSearchTerm(e.target.value)
    }
    style={{
      flex: 1,
      minWidth: "250px",
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #dddddd",
      background: "#ffffff",
      color: "#111111",
    }}
  />

  <select
    value={filterType}
    onChange={(e) =>
      setFilterType(e.target.value)
    }
    style={{
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #dddddd",
      background: "#ffffff",
      color: "#111111",
      minWidth: "140px",
    }}
  >
    <option value="All">
      All
    </option>

    <option value="Full Time">
      Full Time
    </option>

    <option value="Internship">
      Internship
    </option>
  </select>
</div>

        {/* Jobs Grid */}

        <div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(340px,1fr))",
    gap: "24px",
    marginTop: "10px",
  }}
>
          {filteredJobs.map(
            (job, index) => (
              <div
  key={index}
  style={{
    background:
      "#ffffff",
    border:
      "1px solid #e5e5e5",
    borderRadius: "20px",
    padding: "28px",
    boxShadow:
      "0 8px 24px rgba(0,0,0,0.06)",

    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",

    minHeight: "360px",
  }}
>
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                    marginBottom:
                      "20px",
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      color: "#fff",
                      fontSize:
                        "1.5rem",
                    }}
                  >
                    {job.company}
                  </h2>

                  <span
                    style={{
                      background:
                        "#111111",
                      color: "#fff",
                      padding:
                        "6px 12px",
                      borderRadius:
                        "999px",
                      fontSize:
                        "0.8rem",
                      fontWeight:
                        "600",
                    }}
                  >
                    {job.type}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: "12px",
                    marginBottom:
                      "24px",
                  }}
                >
                  <div>
                    <small
                      style={{
                        color:
                          "#808080",
                      }}
                    >
                      Role
                    </small>

                    <p
                      style={{
                        margin: 0,
                        color:
                          "#fff",
                        fontWeight:
                          "600",
                      }}
                    >
                      {job.role}
                    </p>
                  </div>

                  <div>
                    <small
                      style={{
                        color:
                          "#808080",
                      }}
                    >
                      Package
                    </small>

                    <p
                      style={{
                        margin: 0,
                        color:
                          "#22c55e",
                        fontWeight:
                          "700",
                      }}
                    >
                      {job.package}
                    </p>
                  </div>

                  <div>
                    <small
                      style={{
                        color:
                          "#808080",
                      }}
                    >
                      Location
                    </small>

                    <p
                      style={{
                        margin: 0,
                        color:
                          "#fff",
                      }}
                    >
                      📍 {job.location}
                    </p>
                  </div>
                </div>

                <button
                  className="dashboard-action"
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius:
                      "12px",
                    fontWeight:
                      "600",
                  }}
                  onClick={() =>
                    handleApply(job)
                  }
                >
                  Apply Now
                </button>
              </div>
            )
          )}
        </div>

        {filteredJobs.length === 0 && (
          <div
            className="glass-panel"
            style={{
              marginTop: "30px",
              textAlign: "center",
            }}
          >
            <h3>No Jobs Found</h3>

            <p>
              Try changing your search
              term or filter.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default StudentJobs;