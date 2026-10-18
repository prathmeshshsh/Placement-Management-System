import { useEffect, useState } from "react";

function StudentModal({
  isOpen,
  onClose,
  onSave,
  editingStudent,
}) {
  const initialState = {
    name: "",
    rollNo: "",
    email: "",
    initialPassword: "",
    phone: "",
    branch: "CSE",
    cgpa: "",
    year: "4",
    status: "Eligible",
  };

  const [formData, setFormData] = useState(initialState);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingStudent) {
      setFormData(editingStudent);
    } else {
      setFormData(initialState);
    }
  }, [editingStudent, isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (
      !formData.name.trim() ||
      !formData.rollNo.trim() ||
      !formData.email.trim() ||
      (!editingStudent && (formData.initialPassword || "").length < 8)
    ) {
      alert(
        "Name, Roll Number and Email are required. New students also need a password of at least 8 characters."
      );
      return;
    }

    try {
      setSaving(true);
      await onSave({
        ...formData,
        id: editingStudent ? editingStudent.id : Date.now(),
      });
      onClose();
    } catch (error) {
      // Keep the form open so the user can correct the issue and retry.
      alert(error?.response?.data?.detail || error?.message || "Could not save student");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="student-modal">
        <h2>
          {editingStudent
            ? "Edit Student"
            : "Add Student"}
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="rollNo"
          placeholder="Roll Number"
          value={formData.rollNo}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        {!editingStudent && <input
          type="password"
          name="initialPassword"
          placeholder="Initial login password (min. 8 characters)"
          value={formData.initialPassword || ""}
          onChange={handleChange}
          autoComplete="new-password"
        />}

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          type="number"
          step="0.01"
          name="cgpa"
          placeholder="CGPA"
          value={formData.cgpa}
          onChange={handleChange}
        />

        <input
          type="number"
          name="year"
          placeholder="Year"
          value={formData.year}
          onChange={handleChange}
        />

        <select
          name="branch"
          value={formData.branch}
          onChange={handleChange}
        >
          <option value="CSE">
            CSE
          </option>
          <option value="IT">
            IT
          </option>
          <option value="ECE">
            ECE
          </option>
          <option value="EEE">
            EEE
          </option>
        </select>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Eligible">
            Eligible
          </option>
          <option value="Placed">
            Placed
          </option>
          <option value="Not Eligible">
            Not Eligible
          </option>
        </select>

        <div className="modal-actions">
          <button
            className="cancel-btn"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            className="save-btn"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Saving..." : editingStudent
              ? "Update Student"
              : "Save Student"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentModal;