import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import StudentModal from "../components/StudentModal";
import ViewStudentModal from "../components/ViewStudentModal";
import { getStudents, createStudent, updateStudent, deleteStudentApi } from "../services/studentService";

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const data = await getStudents();
    setStudents(data);
  };

  const saveStudent = async (student) => {
    try {
      const saved = editingStudent ? await updateStudent(editingStudent.id, student) : await createStudent(student);
      if (editingStudent) setStudents((prev) => prev.map((s) => s.id === editingStudent.id ? saved : s));
      else setStudents((prev) => [...prev, saved]);
      setEditingStudent(null);
    } catch (error) { throw error; }
  };

  const deleteStudent = (id) => {
    const confirmed = window.confirm(
      "Delete this student?"
    );

    if (!confirmed) return;

    deleteStudentApi(id).then(() => setStudents((prev) => prev.filter((student) => student.id !== id))).catch((error) => alert(error.response?.data?.detail || "Could not deactivate student"));

    if (
      selectedStudent &&
      selectedStudent.id === id
    ) {
      setSelectedStudent(null);
    }
  };

  const exportStudents = () => {
    const headers = [
      "Name",
      "Roll No",
      "Email",
      "Phone",
      "Branch",
      "Year",
      "CGPA",
      "Status",
    ];

    const rows = students.map((s) => [
      s.name,
      s.rollNo,
      s.email,
      s.phone,
      s.branch,
      s.year,
      s.cgpa,
      s.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "students.csv";
    link.click();
  };

  const filteredStudents = students
    .filter((student) => {
      const matchesSearch =
        student.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        student.rollNo
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesBranch =
        branchFilter === "All" ||
        student.branch === branchFilter;

      const matchesStatus =
        statusFilter === "All" ||
        student.status === statusFilter;

      return (
        matchesSearch &&
        matchesBranch &&
        matchesStatus
      );
    })
    .sort((a, b) => {
      if (sortBy === "cgpa") {
        return Number(b.cgpa) - Number(a.cgpa);
      }

      if (sortBy === "year") {
        return Number(b.year) - Number(a.year);
      }

      return a.name.localeCompare(b.name);
    });

  const totalStudents = students.length;

  const placedStudents = students.filter(
    (s) => s.status === "Placed"
  ).length;

  const eligibleStudents = students.filter(
    (s) => s.status === "Eligible"
  ).length;

  const avgCgpa =
    students.length > 0
      ? (
          students.reduce(
            (sum, s) =>
              sum + Number(s.cgpa || 0),
            0
          ) / students.length
        ).toFixed(2)
      : 0;

  const topStudents = [...students]
    .sort(
      (a, b) =>
        Number(b.cgpa) - Number(a.cgpa)
    )
    .slice(0, 5);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>Students</h1>
            <p>
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <button
              className="dashboard-action"
              onClick={exportStudents}
            >
              Export CSV
            </button>

            <button
              className="dashboard-action"
              onClick={() => {
                setEditingStudent(null);
                setShowModal(true);
              }}
            >
              Add Student
            </button>
          </div>
        </div>

        <div className="kpi-grid">
          <div className="kpi-card">
            <h4>Total Students</h4>
            <span>{totalStudents}</span>
          </div>

          <div className="kpi-card">
            <h4>Eligible</h4>
            <span>{eligibleStudents}</span>
          </div>

          <div className="kpi-card">
            <h4>Placed</h4>
            <span>{placedStudents}</span>
          </div>

          <div className="kpi-card">
            <h4>Average CGPA</h4>
            <span>{avgCgpa}</span>
          </div>
        </div>

        <div className="analytics-grid">
          <div className="analytics-card">
            <h4>CSE</h4>
            <span>
              {
                students.filter(
                  (s) => s.branch === "CSE"
                ).length
              }
            </span>
          </div>

          <div className="analytics-card">
            <h4>IT</h4>
            <span>
              {
                students.filter(
                  (s) => s.branch === "IT"
                ).length
              }
            </span>
          </div>

          <div className="analytics-card">
            <h4>ECE</h4>
            <span>
              {
                students.filter(
                  (s) => s.branch === "ECE"
                ).length
              }
            </span>
          </div>

          <div className="analytics-card">
            <h4>EEE</h4>
            <span>
              {
                students.filter(
                  (s) => s.branch === "EEE"
                ).length
              }
            </span>
          </div>
        </div>

        <div className="glass-panel">
          <h3
            style={{
              marginBottom: "15px",
            }}
          >
            🏆 Top Performers
          </h3>

          {topStudents.map((student) => (
            <div
              key={student.id}
              className="top-student"
            >
              <strong>{student.name}</strong>
              <span>
                CGPA: {student.cgpa}
              </span>
            </div>
          ))}
        </div>

        <div className="glass-panel">
          <div className="student-filters">
            <input
              type="text"
              placeholder="Search by Name or Roll No"
              className="dashboard-search"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <select
              value={branchFilter}
              onChange={(e) =>
                setBranchFilter(e.target.value)
              }
            >
              <option>All</option>
              <option>CSE</option>
              <option>IT</option>
              <option>ECE</option>
              <option>EEE</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option>All</option>
              <option>Eligible</option>
              <option>Placed</option>
              <option>Not Eligible</option>
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

              <option value="cgpa">
                Sort By CGPA
              </option>

              <option value="year">
                Sort By Year
              </option>
            </select>
          </div>

          <p
            style={{
              marginBottom: "20px",
              color: "#808080",
            }}
          >
            Showing {filteredStudents.length} Students
          </p>

          <table className="student-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll No</th>
                <th>Branch</th>
                <th>Year</th>
                <th>CGPA</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No Students Found
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.rollNo}</td>
                    <td>{student.branch}</td>
                    <td>{student.year}</td>
                    <td>{student.cgpa}</td>

                    <td>
                      <span
                        className={`status-badge ${student.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {student.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="table-btn"
                        onClick={() =>
                          setSelectedStudent(student)
                        }
                      >
                        View
                      </button>

                      <button
                        className="table-btn edit-btn"
                        onClick={() => {
                          setEditingStudent(student);
                          setShowModal(true);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="table-btn delete-btn"
                        onClick={() =>
                          deleteStudent(student.id)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <StudentModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingStudent(null);
          }}
          onSave={saveStudent}
          editingStudent={editingStudent}
        />

        <ViewStudentModal
          student={selectedStudent}
          isOpen={!!selectedStudent}
          onClose={() =>
            setSelectedStudent(null)
          }
        />
      </main>
    </div>
  );
}

export default Students;