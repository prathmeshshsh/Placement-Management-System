import { useEffect, useState } from "react";

function PlacementModal({
  isOpen,
  onClose,
  onSave,
  editingPlacement,
}) {
  const initialState = {
    companyName: "",
    role: "",
    package: "",
    eligibility: "",
    branches: "",
    positions: "",
    location: "",
    driveDate: "",
    deadline: "",
    status: "Active",
  };

  const [formData, setFormData] =
    useState(initialState);

  useEffect(() => {
    if (editingPlacement) {
      setFormData(editingPlacement);
    } else {
      setFormData(initialState);
    }
  }, [editingPlacement, isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = () => {
    if (
      !formData.companyName ||
      !formData.role ||
      !formData.package ||
      !formData.eligibility ||
      !formData.positions ||
      !formData.driveDate
    ) {
      alert(
        "Please fill all required fields."
      );
      return;
    }

    onSave({
      ...formData,
      id: editingPlacement
        ? editingPlacement.id
        : Date.now(),
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="student-modal">

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h2>
            {editingPlacement
              ? "Edit Placement Drive"
              : "Add Placement Drive"}
          </h2>

          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gap: "14px",
          }}
        >
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
          />

          <input
            type="text"
            name="role"
            placeholder="Job Role"
            value={formData.role}
            onChange={handleChange}
          />

          <input
            type="number"
            name="package"
            placeholder="Package (LPA)"
            value={formData.package}
            onChange={handleChange}
          />

          <input
            type="number"
            step="0.1"
            name="eligibility"
            placeholder="Minimum CGPA"
            value={formData.eligibility}
            onChange={handleChange}
          />

          <input
            type="text"
            name="branches"
            placeholder="Eligible Branches (CSE, IT, ECE)"
            value={formData.branches}
            onChange={handleChange}
          />

          <input
            type="number"
            name="positions"
            placeholder="Available Positions"
            value={formData.positions}
            onChange={handleChange}
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
          />

          <label
            style={{
              color: "#ffffff",
              fontSize: "14px",
            }}
          >
            Drive Date
          </label>

          <input
            type="date"
            name="driveDate"
            value={formData.driveDate}
            onChange={handleChange}
          />

          <label
            style={{
              color: "#ffffff",
              fontSize: "14px",
            }}
          >
            Application Deadline
          </label>

          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Upcoming">
              Upcoming
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Closed">
              Closed
            </option>
          </select>
        </div>

        <div
          className="modal-actions"
          style={{
            marginTop: "24px",
          }}
        >
          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="save-btn"
            onClick={handleSubmit}
          >
            {editingPlacement
              ? "Update Drive"
              : "Save Drive"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default PlacementModal;