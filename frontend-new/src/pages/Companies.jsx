import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import CompanyModal from "../components/CompanyModal";
import ViewCompanyModal from "../components/ViewCompanyModal";
import { getCompanies, createCompany, updateCompany, deleteCompanyApi } from "../services/companyService";

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    const data = await getCompanies();
    setCompanies(data);
  };

  const saveCompany = async (company) => {
    try {
      const saved = editingCompany ? await updateCompany(editingCompany.id, company) : await createCompany(company);
      if (editingCompany) setCompanies((prev) => prev.map((c) => c.id === editingCompany.id ? saved : c));
      else setCompanies((prev) => [...prev, saved]);
      setEditingCompany(null);
    } catch (error) { alert(error.response?.data?.detail || error.message || "Could not save company"); throw error; }
  };

  const deleteCompany = (id) => {
    if (!window.confirm("Delete this company?"))
      return;

    deleteCompanyApi(id).then(() => setCompanies((prev) => prev.filter((company) => company.id !== id))).catch((error) => alert(error.response?.data?.detail || "Could not deactivate company"));

    if (
      selectedCompany &&
      selectedCompany.id === id
    ) {
      setSelectedCompany(null);
    }
  };

  const sectors = [
    "All",
    ...new Set(
      companies.map((company) => company.sector)
    ),
  ];

  const filteredCompanies = companies
    .filter((company) => {
      const matchesSearch =
        company.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesSector =
        sectorFilter === "All" ||
        company.sector === sectorFilter;

      return matchesSearch && matchesSector;
    })
    .sort((a, b) => {
      if (sortBy === "package") {
        return (
          Number(b.package) -
          Number(a.package)
        );
      }

      return a.name.localeCompare(b.name);
    });

  const totalCompanies = companies.length;

  const activeCompanies = companies.filter(
    (company) => company.status === "Active"
  ).length;

  const highestPackage =
    companies.length > 0
      ? Math.max(
          ...companies.map((company) =>
            Number(company.package)
          )
        )
      : 0;

  const averagePackage =
    companies.length > 0
      ? (
          companies.reduce(
            (sum, company) =>
              sum + Number(company.package),
            0
          ) / companies.length
        ).toFixed(1)
      : 0;

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>Companies</h1>
            <p>
              Manage recruiting companies and
              placement drives.
            </p>
          </div>

          <button
            className="dashboard-action"
            onClick={() => {
              setEditingCompany(null);
              setShowModal(true);
            }}
          >
            Add Company
          </button>
        </div>

        <div className="kpi-grid">
          <div className="kpi-card">
            <h4>Total Companies</h4>
            <span>{totalCompanies}</span>
          </div>

          <div className="kpi-card">
            <h4>Active Drives</h4>
            <span>{activeCompanies}</span>
          </div>

          <div className="kpi-card">
            <h4>Highest Package</h4>
            <span>{highestPackage} LPA</span>
          </div>

          <div className="kpi-card">
            <h4>Average Package</h4>
            <span>{averagePackage} LPA</span>
          </div>
        </div>

        <div className="glass-panel">
          <div className="student-filters">
            <input
              type="text"
              placeholder="Search Company"
              className="dashboard-search"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <select
              value={sectorFilter}
              onChange={(e) =>
                setSectorFilter(e.target.value)
              }
            >
              {sectors.map((sector) => (
                <option
                  key={sector}
                  value={sector}
                >
                  {sector}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
            >
              <option value="name">
                Sort By Name
              </option>

              <option value="package">
                Sort By Package
              </option>
            </select>
          </div>

          <p
            style={{
              marginBottom: "20px",
              color: "#808080",
            }}
          >
            Showing {filteredCompanies.length} Companies
          </p>

          <table className="student-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Sector</th>
                <th>Package</th>
                <th>Eligibility</th>
                <th>Positions</th>
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
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No Companies Found
                  </td>
                </tr>
              ) : (
                filteredCompanies.map(
                  (company) => (
                    <tr key={company.id}>
                      <td>{company.name}</td>
                      <td>{company.sector}</td>
                      <td>
                        {company.package} LPA
                      </td>
                      <td>
                        {company.eligibility}
                      </td>
                      <td>
                        {company.positions}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            company.status ===
                            "Active"
                              ? "placed"
                              : "not-eligible"
                          }`}
                        >
                          {company.status}
                        </span>
                      </td>

                      <td>
                        <button
                          className="table-btn"
                          onClick={() =>
                            setSelectedCompany(
                              company
                            )
                          }
                        >
                          View
                        </button>

                        <button
                          className="table-btn edit-btn"
                          onClick={() => {
                            setEditingCompany(
                              company
                            );
                            setShowModal(true);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="table-btn delete-btn"
                          onClick={() =>
                            deleteCompany(
                              company.id
                            )
                          }
                        >
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

        <CompanyModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingCompany(null);
          }}
          onSave={saveCompany}
          editingCompany={editingCompany}
        />

        <ViewCompanyModal
          company={selectedCompany}
          isOpen={!!selectedCompany}
          onClose={() =>
            setSelectedCompany(null)
          }
        />
      </main>
    </div>
  );
}

export default Companies;