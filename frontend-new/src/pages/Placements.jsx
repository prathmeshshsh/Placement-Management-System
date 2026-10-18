import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import PlacementModal from "../components/PlacementModal";
import ViewPlacementModal from "../components/ViewPlacementModal";
import { getPlacements, createPlacement, updatePlacement, deletePlacementApi } from "../services/placementService";

function Placements() {
  const [placements, setPlacements] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("package");

  const [showModal, setShowModal] = useState(false);
  const [editingPlacement, setEditingPlacement] =
    useState(null);
  const [selectedPlacement, setSelectedPlacement] =
    useState(null);

  useEffect(() => {
    loadPlacements();
  }, []);

  const loadPlacements = async () => {
    const data = await getPlacements();
    setPlacements(data);
  };

  const savePlacement = async (placement) => {
    try {
      const saved = editingPlacement ? await updatePlacement(editingPlacement.id, placement) : await createPlacement(placement);
      if (editingPlacement) setPlacements((prev) => prev.map((p) => p.id === editingPlacement.id ? saved : p));
      else setPlacements((prev) => [...prev, saved]);
      setEditingPlacement(null);
    } catch (error) { alert(error.response?.data?.detail || error.message || "Could not save placement"); }
  };

  const deletePlacement = (id) => {
    if (
      !window.confirm(
        "Delete this placement drive?"
      )
    )
      return;

    deletePlacementApi(id).then(() => setPlacements((prev) => prev.filter((p) => p.id !== id))).catch((error) => alert(error.response?.data?.detail || "Could not close placement"));

    if (
      selectedPlacement &&
      selectedPlacement.id === id
    ) {
      setSelectedPlacement(null);
    }
  };

  const filteredPlacements =
    placements
      .filter((placement) => {
        const matchesSearch =
          placement.companyName
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          placement.jobRole
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesStatus =
          statusFilter === "All" ||
          placement.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      })
      .sort((a, b) => {
        if (sortBy === "package") {
          return (
            Number(b.package) -
            Number(a.package)
          );
        }

        return a.companyName.localeCompare(
          b.companyName
        );
      });

  const totalDrives =
    placements.length;

  const activeDrives =
    placements.filter(
      (p) => p.status === "Open"
    ).length;

  const highestPackage =
    placements.length > 0
      ? Math.max(
          ...placements.map((p) =>
            Number(p.package)
          )
        )
      : 0;

  const averagePackage =
    placements.length > 0
      ? (
          placements.reduce(
            (sum, p) =>
              sum +
              Number(
                p.package || 0
              ),
            0
          ) / placements.length
        ).toFixed(1)
      : 0;

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">

        <div className="dashboard-header">
          <div>
            <h1>Placement Drives</h1>

            <p
              style={{
                color: "#808080",
              }}
            >
              Manage campus recruitment drives.
            </p>
          </div>

          <button
            className="dashboard-action"
            onClick={() => {
              setEditingPlacement(
                null
              );
              setShowModal(true);
            }}
          >
            Add Drive
          </button>
        </div>

        <div className="kpi-grid">

          <div className="kpi-card">
            <h4>Total Drives</h4>
            <span>{totalDrives}</span>
          </div>

          <div className="kpi-card">
            <h4>Active Drives</h4>
            <span>{activeDrives}</span>
          </div>

          <div className="kpi-card">
            <h4>Highest Package</h4>
            <span>
              {highestPackage} LPA
            </span>
          </div>

          <div className="kpi-card">
            <h4>Average Package</h4>
            <span>
              {averagePackage} LPA
            </span>
          </div>

        </div>

        <div className="glass-panel">

          <div className="student-filters">

            <input
              type="text"
              placeholder="Search Company or Role"
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
              <option>All</option>
              <option>Open</option>
              <option>Closed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value
                )
              }
            >
              <option value="package">
                Sort By Package
              </option>

              <option value="name">
                Sort By Company
              </option>
            </select>

          </div>

          <p
            style={{
              marginBottom:
                "20px",
              color: "#808080",
            }}
          >
            Showing{" "}
            {
              filteredPlacements.length
            }{" "}
            Drives
          </p>

          <table className="student-table">

            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Package</th>
                <th>CGPA</th>
                <th>Positions</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredPlacements.length ===
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
                    No Placement Drives Found
                  </td>
                </tr>
              ) : (
                filteredPlacements.map(
                  (
                    placement
                  ) => (
                    <tr
                      key={
                        placement.id
                      }
                    >
                      <td>
                        {
                          placement.companyName
                        }
                      </td>

                      <td>
                        {
                          placement.jobRole
                        }
                      </td>

                      <td>
                        {
                          placement.package
                        }{" "}
                        LPA
                      </td>

                      <td>
                        {
                          placement.eligibility
                        }
                      </td>

                      <td>
                        {
                          placement.positions
                        }
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            placement.status ===
                            "Open"
                              ? "eligible"
                              : "not-eligible"
                          }`}
                        >
                          {
                            placement.status
                          }
                        </span>
                      </td>

                      <td>

                        <button
                          className="table-btn"
                          onClick={() =>
                            setSelectedPlacement(
                              placement
                            )
                          }
                        >
                          View
                        </button>

                        <button
                          className="table-btn edit-btn"
                          onClick={() => {
                            setEditingPlacement(
                              placement
                            );
                            setShowModal(
                              true
                            );
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="table-btn delete-btn"
                          onClick={() =>
                            deletePlacement(
                              placement.id
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

        <PlacementModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingPlacement(
              null
            );
          }}
          onSave={savePlacement}
          editingPlacement={
            editingPlacement
          }
        />

        <ViewPlacementModal
          placement={
            selectedPlacement
          }
          isOpen={
            !!selectedPlacement
          }
          onClose={() =>
            setSelectedPlacement(
              null
            )
          }
        />

      </main>
    </div>
  );
}

export default Placements;